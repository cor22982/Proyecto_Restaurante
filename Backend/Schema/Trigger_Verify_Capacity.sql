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