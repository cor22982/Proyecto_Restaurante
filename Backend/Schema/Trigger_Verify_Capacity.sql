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