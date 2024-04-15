CREATE OR REPLACE FUNCTION verified_capacity() 
RETURNS TRIGGER AS 
$BODY$
DECLARE 
    capacidad_sesion numeric; 
BEGIN
    SELECT SUM(mesas.capacidad) INTO capacidad_sesion
    FROM mesas_sesion
    JOIN mesas ON mesas_sesion.mesa = mesas.id
    WHERE mesas_sesion.sesion = NEW.sesion;

     IF capacidad_sesion >= 15 THEN
      RAISE EXCEPTION 'ERR_CAPACITY_EXCEEDED. No se le puede asignar esta mesa porque excede el límite de la sesión. Capacidad total: %', capacidad_sesion
        USING ERRCODE = '20808';

     END IF;
    RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql;



CREATE or REPLACE TRIGGER verify_capacity_trigger
AFTER INSERT ON mesas_sesion
FOR EACH ROW
EXECUTE FUNCTION verified_capacity();


CREATE OR REPLACE FUNCTION insert_comida() 
RETURNS TRIGGER AS 
$BODY$
DECLARE 
    cantidad numeric;
    actual numeric; 
BEGIN

    
    select cuenta_comida.cantidad*comidas.precio into cantidad
    from cuenta_comida join comidas on
    comidas.id = cuenta_comida.comida 
    where cuenta_comida.cuenta = new.cuenta and cuenta_comida.comida = new.comida;

    select total into actual from cuenta where cuenta.id = new.cuenta;

    UPDATE cuenta SET total = cantidad + actual WHERE id = new.cuenta;

    RETURN NEW;
END;
$BODY$
LANGUAGE plpgsql;


CREATE or REPLACE TRIGGER insert_comida_cantidad
AFTER INSERT ON cuenta_comida
FOR EACH ROW
EXECUTE FUNCTION insert_comida();


CREATE OR REPLACE FUNCTION insertar_comidas_en_orden(cuenta_id INT) RETURNS VOID AS $$
DECLARE
    comida_id INT;
    tipo_comida TEXT;
BEGIN

    FOR comida_id IN SELECT comida FROM cuenta_comida WHERE cuenta = cuenta_id LOOP
        
        select tipo into tipo_comida from comidas where id = comida_id;

        if tipo_comida = 'comida' then
            INSERT INTO orden_cocina (plato,cuenta_id) VALUES (comida_id,cuenta_id);
        elsif tipo_comida = 'bebida' then
            INSERT INTO orden_bar (bebida,cuenta_id) VALUES (comida_id,cuenta_id);
        end if;
        
    END LOOP;

END;
$$ LANGUAGE plpgsql;

select insertar_comidas_en_orden(14);
    
CREATE OR REPLACE FUNCTION terminar_sesion(sesion_id INT) RETURNS VOID AS $$
DECLARE
    propinaa numeric;
    total numeric;
    propina_per_count numeric;
    total_cuenta numeric;
    cuenta_id INT; -- Variable para almacenar el id de la cuenta
BEGIN
    -- Calcular el total de la cuenta
    SELECT SUM(c.total) INTO total FROM cuenta c WHERE c.sesion = sesion_id;

    -- Calcular la propina por cuenta
    SELECT SUM(c.total) * 0.15 / COUNT(*) INTO propina_per_count FROM cuenta c WHERE c.sesion = sesion_id;
    propinaa := 0.15 * total;

    -- Actualizar la sesión con la fecha de fin, monto total y propina
    UPDATE sesion SET fecha_fin = now(), monto_total = total, propina = propinaa WHERE id = sesion_id;

    -- Obtener los ids de las cuentas asociadas a la sesión
    FOR cuenta_id IN SELECT c.id FROM cuenta c WHERE c.sesion = sesion_id LOOP
        -- Obtener el total de la cuenta
        SELECT c.total INTO total_cuenta FROM cuenta c WHERE c.id = cuenta_id;
        -- Actualizar el total de la cuenta sumando la propina por cuenta
        UPDATE cuenta SET total = total_cuenta + propina_per_count WHERE id = cuenta_id;
    END LOOP;

END;
$$ LANGUAGE plpgsql;




select terminar_sesion(14);

CREATE OR REPLACE FUNCTION delete_comida() 
RETURNS TRIGGER AS 
$BODY$
BEGIN
    UPDATE cuenta SET fecha_inicio = now() WHERE id = OLD.cuenta_id;
    RETURN OLD;
END;
$BODY$
LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER delete_comida_for_orden
AFTER DELETE ON orden_bar
FOR EACH ROW
EXECUTE FUNCTION delete_comida();
