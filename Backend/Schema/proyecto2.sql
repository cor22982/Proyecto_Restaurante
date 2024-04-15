--
-- PostgreSQL database dump
--

-- Dumped from database version 14.11 (Ubuntu 14.11-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 14.11 (Ubuntu 14.11-0ubuntu0.22.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: delete_comida(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.delete_comida() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    UPDATE cuenta SET fecha_inicio = now() WHERE id = OLD.cuenta_id;
    RETURN OLD;
END;
$$;


ALTER FUNCTION public.delete_comida() OWNER TO postgres;

--
-- Name: insert_comida(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.insert_comida() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.insert_comida() OWNER TO postgres;

--
-- Name: insertar_comidas_en_orden(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.insertar_comidas_en_orden(cuenta_id integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.insertar_comidas_en_orden(cuenta_id integer) OWNER TO postgres;

--
-- Name: terminar_sesion(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.terminar_sesion(sesion_id integer) RETURNS void
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.terminar_sesion(sesion_id integer) OWNER TO postgres;

--
-- Name: verified_capacity(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.verified_capacity() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.verified_capacity() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: actual_capacidad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.actual_capacidad (
    capacidad integer
);


ALTER TABLE public.actual_capacidad OWNER TO postgres;

--
-- Name: areas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.areas (
    id integer NOT NULL,
    nombre character varying(20),
    fumadores boolean
);


ALTER TABLE public.areas OWNER TO postgres;

--
-- Name: areas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.areas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.areas_id_seq OWNER TO postgres;

--
-- Name: areas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.areas_id_seq OWNED BY public.areas.id;


--
-- Name: cliente; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cliente (
    direccion character varying(30),
    nombre character varying(30),
    nit character varying(25) NOT NULL
);


ALTER TABLE public.cliente OWNER TO postgres;

--
-- Name: comidas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comidas (
    id integer NOT NULL,
    nombre character varying(100),
    tipo character varying(50),
    precio double precision,
    descripcion text,
    CONSTRAINT comidas_tipo_check CHECK (((tipo)::text = ANY ((ARRAY['comida'::character varying, 'bebida'::character varying])::text[])))
);


ALTER TABLE public.comidas OWNER TO postgres;

--
-- Name: comidas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comidas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comidas_id_seq OWNER TO postgres;

--
-- Name: comidas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comidas_id_seq OWNED BY public.comidas.id;


--
-- Name: cuenta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cuenta (
    id integer NOT NULL,
    total double precision,
    esta_abierta boolean,
    sesion integer,
    cliente character varying(25),
    fecha_inicio timestamp without time zone,
    fecha_fin timestamp without time zone
);


ALTER TABLE public.cuenta OWNER TO postgres;

--
-- Name: cuenta_comida; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cuenta_comida (
    cuenta integer,
    comida integer,
    cantidad integer,
    fecha timestamp without time zone DEFAULT now()
);


ALTER TABLE public.cuenta_comida OWNER TO postgres;

--
-- Name: cuenta_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cuenta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cuenta_id_seq OWNER TO postgres;

--
-- Name: cuenta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cuenta_id_seq OWNED BY public.cuenta.id;


--
-- Name: encuesta; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.encuesta (
    id integer NOT NULL,
    cliente character varying(30),
    personal integer,
    amabilidad integer,
    exactitud integer,
    fecha timestamp without time zone DEFAULT now()
);


ALTER TABLE public.encuesta OWNER TO postgres;

--
-- Name: encuesta_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.encuesta_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.encuesta_id_seq OWNER TO postgres;

--
-- Name: encuesta_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.encuesta_id_seq OWNED BY public.encuesta.id;


--
-- Name: forma_de_pago; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.forma_de_pago (
    id integer NOT NULL,
    monto double precision,
    forma character varying(30),
    cliente character varying(25),
    cuenta integer
);


ALTER TABLE public.forma_de_pago OWNER TO postgres;

--
-- Name: forma_de_pago_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.forma_de_pago_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.forma_de_pago_id_seq OWNER TO postgres;

--
-- Name: forma_de_pago_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.forma_de_pago_id_seq OWNED BY public.forma_de_pago.id;


--
-- Name: mesas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mesas (
    id integer NOT NULL,
    capacidad integer,
    se_puede_mover boolean,
    id_area integer
);


ALTER TABLE public.mesas OWNER TO postgres;

--
-- Name: mesas_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mesas_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mesas_id_seq OWNER TO postgres;

--
-- Name: mesas_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mesas_id_seq OWNED BY public.mesas.id;


--
-- Name: mesas_sesion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mesas_sesion (
    mesa integer,
    sesion integer
);


ALTER TABLE public.mesas_sesion OWNER TO postgres;

--
-- Name: orden_bar; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orden_bar (
    id integer NOT NULL,
    fecha timestamp without time zone DEFAULT now(),
    bebida integer,
    cuenta_id integer
);


ALTER TABLE public.orden_bar OWNER TO postgres;

--
-- Name: orden_bar_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orden_bar_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orden_bar_id_seq OWNER TO postgres;

--
-- Name: orden_bar_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orden_bar_id_seq OWNED BY public.orden_bar.id;


--
-- Name: orden_cocina; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orden_cocina (
    id integer NOT NULL,
    fecha timestamp without time zone DEFAULT now(),
    plato integer,
    cuenta_id integer
);


ALTER TABLE public.orden_cocina OWNER TO postgres;

--
-- Name: orden_cocina_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orden_cocina_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orden_cocina_id_seq OWNER TO postgres;

--
-- Name: orden_cocina_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orden_cocina_id_seq OWNED BY public.orden_cocina.id;


--
-- Name: personal; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.personal (
    id integer NOT NULL,
    nombre character varying(30),
    password character varying(50),
    rol character varying(30),
    area integer
);


ALTER TABLE public.personal OWNER TO postgres;

--
-- Name: personal_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.personal_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.personal_id_seq OWNER TO postgres;

--
-- Name: personal_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.personal_id_seq OWNED BY public.personal.id;


--
-- Name: propina_per_count; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.propina_per_count (
    "?column?" double precision
);


ALTER TABLE public.propina_per_count OWNER TO postgres;

--
-- Name: queja; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.queja (
    id integer NOT NULL,
    fecha_hora timestamp without time zone DEFAULT now(),
    nit_cliente character varying(30),
    motivo text,
    personal_id integer,
    comida integer,
    calificacion integer
);


ALTER TABLE public.queja OWNER TO postgres;

--
-- Name: queja_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.queja_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.queja_id_seq OWNER TO postgres;

--
-- Name: queja_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.queja_id_seq OWNED BY public.queja.id;


--
-- Name: sesion; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sesion (
    id integer NOT NULL,
    mesero_asociado integer,
    monto_total double precision,
    fecha date,
    propina double precision DEFAULT 0,
    fecha_inicio timestamp without time zone NOT NULL,
    fecha_fin timestamp without time zone
);


ALTER TABLE public.sesion OWNER TO postgres;

--
-- Name: sesion_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sesion_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.sesion_id_seq OWNER TO postgres;

--
-- Name: sesion_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sesion_id_seq OWNED BY public.sesion.id;


--
-- Name: areas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.areas ALTER COLUMN id SET DEFAULT nextval('public.areas_id_seq'::regclass);


--
-- Name: comidas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comidas ALTER COLUMN id SET DEFAULT nextval('public.comidas_id_seq'::regclass);


--
-- Name: cuenta id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta ALTER COLUMN id SET DEFAULT nextval('public.cuenta_id_seq'::regclass);


--
-- Name: encuesta id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encuesta ALTER COLUMN id SET DEFAULT nextval('public.encuesta_id_seq'::regclass);


--
-- Name: forma_de_pago id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forma_de_pago ALTER COLUMN id SET DEFAULT nextval('public.forma_de_pago_id_seq'::regclass);


--
-- Name: mesas id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mesas ALTER COLUMN id SET DEFAULT nextval('public.mesas_id_seq'::regclass);


--
-- Name: orden_bar id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orden_bar ALTER COLUMN id SET DEFAULT nextval('public.orden_bar_id_seq'::regclass);


--
-- Name: orden_cocina id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orden_cocina ALTER COLUMN id SET DEFAULT nextval('public.orden_cocina_id_seq'::regclass);


--
-- Name: personal id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal ALTER COLUMN id SET DEFAULT nextval('public.personal_id_seq'::regclass);


--
-- Name: queja id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.queja ALTER COLUMN id SET DEFAULT nextval('public.queja_id_seq'::regclass);


--
-- Name: sesion id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sesion ALTER COLUMN id SET DEFAULT nextval('public.sesion_id_seq'::regclass);


--
-- Data for Name: actual_capacidad; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.actual_capacidad (capacidad) FROM stdin;
6
\.


--
-- Data for Name: areas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.areas (id, nombre, fumadores) FROM stdin;
1	Pergola	t
2	Patio 1	f
3	Salon 1	f
4	Salon 2	f
5	Jardin	t
6	Patio 2	f
\.


--
-- Data for Name: cliente; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cliente (direccion, nombre, nit) FROM stdin;
5tacalleC	Aleja Cosmoso	10605650
5ta calle A 50-30 zona 18	Jose Chavez	5050520
50 ross STREE baltimu	Marco Felipe Alejos	202020500
5ta Calle F 60-25 Paraiso	Maria Iturbide	5050500501
4ta avenida 3-99 zona 2	Selia Gomez	6241605
fsadfassafsad	Matat	440545
5ta Calle A avenida 18 zona 1	Jose Mendez	98098022
5ta Calle A 60-65 zona 22	Marco Diaz	555500060
sdfasdf	dsfasfasf	42342423
baticueva	HolaAdios	23445453
jdsjdwjd	batman	4837462
5ta Calle B	Nery Rodas	20201110
\.


--
-- Data for Name: comidas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.comidas (id, nombre, tipo, precio, descripcion) FROM stdin;
1	Hamburguesa	comida	8.99	Deliciosa hamburguesa con queso y vegetales
2	Refresco	bebida	1.99	Refresco de cola en lata
3	Pizza	comida	10.5	Pizza de pepperoni y queso
4	Agua mineral	bebida	0.99	Agua mineral natural en botella
5	Ensalada César	comida	7.5	Ensalada fresca con aderezo César y crutones
6	Jugo de naranja	bebida	2.25	Jugo de naranja recién exprimido
7	Pasta Alfredo	comida	9.75	Pasta con salsa Alfredo cremosa y pollo
8	Café espresso	bebida	2.5	Café espresso corto y fuerte
9	Pollo a la parrilla	comida	12.99	Pechuga de pollo jugosa asada a la parrilla
10	Sopa de tomate	comida	5.25	Sopa de tomate casera con hierbas frescas
11	Sushi	comida	15.5	Rollos de sushi frescos con salmón y aguacate
12	Tacos al pastor	comida	9.75	Tacos mexicanos con carne de cerdo marinada y piña
13	Ensalada de quinoa	comida	8.25	Ensalada saludable de quinoa con verduras mixtas
14	Batido de frutas	bebida	4.99	Batido refrescante de frutas tropicales
15	Té helado	bebida	1.75	Té helado casero con limón y menta
16	Burrito de carne	comida	10.99	Burrito grande con carne asada, arroz y frijoles
17	Tarta de manzana	comida	6.5	Tarta dulce de manzana con canela y crema batida
18	Ceviche de camarón	comida	13.25	Ceviche fresco de camarón con jugo de limón y cilantro
19	Smoothie de espinacas	bebida	3.99	Smoothie verde energizante con espinacas y plátano
20	Paella	comida	17.75	Paella española con mariscos y chorizo
21	Cóctel de camarones	comida	14.5	Cóctel de camarones frescos con salsa de cóctel
22	Margarita	bebida	6.99	Margarita clásica con tequila, triple sec y lima
23	Wrap de vegetales	comida	7.25	Wrap ligero de vegetales frescos y hummus
24	Sándwich de pavo	comida	8.5	Sándwich clásico de pavo con lechuga y tomate
25	Café con leche	bebida	3.25	Café negro con leche caliente
26	Empanadas	comida	11.25	Empanadas rellenas de carne y verduras
27	Granola con yogur	comida	6.75	Granola crujiente con yogur natural y frutas
28	Zumo de piña	bebida	2.25	Zumo fresco de piña recién exprimido
29	Lasagna	comida	12.75	Lasagna casera con capas de pasta, carne y queso
30	Mojito	bebida	7.5	Mojito refrescante con ron, menta y lima
31	Enchiladas	comida	9.99	Enchiladas picantes de pollo con salsa roja
32	Sopa miso	comida	4.25	Sopa japonesa miso con tofu y cebollín
33	Cerveza artesanal	bebida	5.75	Cerveza artesanal local, estilo IPA
34	Tortilla española	comida	8.25	Tortilla española clásica con papas y cebolla
35	Limonada	bebida	2.5	Limonada fresca con rodajas de limón
36	Pollo teriyaki	comida	11.5	Pollo teriyaki jugoso con arroz y vegetales
37	Mousse de chocolate	comida	5.99	Postre de mousse de chocolate cremoso
38	Café americano	bebida	2.75	Café americano negro y fuerte
39	Tacos de pescado	comida	13.5	Tacos de pescado fresco con salsa de cilantro
40	Sopa de fideos	comida	6.25	Sopa de fideos con caldo de pollo y verduras
41	Cóctel de frutas	bebida	3.75	Cóctel de frutas frescas en vaso
\.


--
-- Data for Name: cuenta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cuenta (id, total, esta_abierta, sesion, cliente, fecha_inicio, fecha_fin) FROM stdin;
14	41.354	t	11	\N	\N	\N
22	2.24775	t	18	\N	\N	\N
23	0	t	18	\N	\N	\N
8	61.30675	f	10	\N	\N	2024-04-14 06:22:50.482766
11	29.82675	t	10	5050520	2024-04-14 11:13:36.860502	\N
9	32.82675	t	10	5050500501	2024-04-14 11:31:55.36505	\N
16	81.052	f	13	440545	2024-04-14 11:34:22.672645	2024-04-14 06:54:33.114116
17	19.87386875	f	15	555500060	2024-04-14 11:34:49.849542	2024-04-14 06:31:46.656545
24	14.22	t	18	\N	2024-04-14 16:49:00.349062	\N
25	21.48	t	18	\N	2024-04-14 16:50:53.851956	\N
19	50.19	t	16	\N	2024-04-14 16:51:26.404155	\N
18	26.48	t	15	\N	2024-04-14 16:52:08.089315	\N
21	32.21775	f	18	42342423	2024-04-14 16:52:48.375477	2024-04-14 22:18:13.189301
20	33.96	t	17	\N	2024-04-14 16:53:58.751997	\N
26	6.94	t	19	\N	2024-04-14 18:14:50.312006	\N
13	26.32675	t	10	\N	\N	\N
10	15.32675	f	10	23445453	2024-04-14 11:02:12.289191	2024-04-15 01:35:34.911766
12	34.33675	t	10	202020500	\N	\N
27	375.981	f	20	4837462	\N	2024-04-15 01:38:06.436841
15	44.2405	f	12	20201110	\N	2024-04-15 15:16:38.844547
28	0	t	21	\N	\N	\N
\.


--
-- Data for Name: cuenta_comida; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cuenta_comida (cuenta, comida, cantidad, fecha) FROM stdin;
14	1	2	2024-04-13 10:29:05.9659
15	1	2	2024-04-13 10:29:05.9659
15	5	1	2024-04-13 10:29:05.9659
15	7	1	2024-04-13 10:29:05.9659
15	4	1	2024-04-13 10:29:05.9659
15	6	1	2024-04-13 10:29:05.9659
14	1	1	2024-04-13 10:29:05.9659
8	1	4	2024-04-13 10:46:34.988
8	3	2	2024-04-13 10:46:40.740867
13	1	1	2024-04-13 11:00:15.643071
13	9	1	2024-04-13 11:00:20.816219
10	1	1	2024-04-13 22:22:13.536672
10	2	1	2024-04-13 22:22:19.808099
11	1	1	2024-04-14 00:06:19.957018
11	1	2	2024-04-14 00:17:31.342434
11	5	1	2024-04-14 00:17:41.512536
12	1	1	2024-04-14 00:40:40.403709
12	3	2	2024-04-14 00:40:48.520772
9	1	2	2024-04-14 01:44:00.234532
9	10	2	2024-04-14 01:44:04.94827
16	1	2	2024-04-14 03:10:12.656017
16	3	5	2024-04-14 03:10:20.792767
17	10	1	2024-04-14 05:59:48.931332
17	1	1	2024-04-14 06:30:38.351791
19	1	2	2024-04-14 11:36:37.479577
19	2	2	2024-04-14 11:36:40.703529
19	6	1	2024-04-14 20:19:27.041815
19	9	2	2024-04-14 20:19:33.288613
18	2	1	2024-04-14 20:20:51.644704
18	4	1	2024-04-14 20:20:54.788076
18	8	1	2024-04-14 20:20:58.767238
18	10	4	2024-04-14 20:21:03.366979
20	1	1	2024-04-14 22:13:17.55348
20	2	1	2024-04-14 22:13:20.731024
20	3	1	2024-04-14 22:13:23.751996
20	4	2	2024-04-14 22:14:32.162515
20	3	2	2024-04-14 22:14:35.318944
21	1	1	2024-04-14 22:15:23.952248
21	2	1	2024-04-14 22:15:25.609163
21	3	1	2024-04-14 22:15:27.264353
21	4	1	2024-04-14 22:15:28.948812
21	5	1	2024-04-14 22:15:30.589805
24	4	1	2024-04-14 16:34:32.47009
24	2	1	2024-04-14 16:34:35.490496
24	6	1	2024-04-14 16:34:38.764393
24	1	1	2024-04-14 16:34:58.098492
25	1	1	2024-04-14 16:35:09.133407
25	2	1	2024-04-14 16:35:10.929046
25	3	1	2024-04-14 16:35:12.951197
26	2	1	2024-04-14 16:54:39.773705
26	4	5	2024-04-14 16:54:53.297187
27	3	15	2024-04-15 01:36:47.491343
27	3	15	2024-04-15 01:36:49.529482
27	2	6	2024-04-15 01:37:05.30053
\.


--
-- Data for Name: encuesta; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.encuesta (id, cliente, personal, amabilidad, exactitud, fecha) FROM stdin;
1	10605650	4	5	5	2024-04-14 22:21:32.324065
2	98098022	4	3	4	2024-04-14 22:21:32.324065
3	440545	4	3	4	2024-04-14 22:21:32.324065
4	10605650	8	3	5	2024-04-14 22:21:32.324065
5	440545	8	5	3	2024-04-14 22:22:00.00229
6	555500060	8	5	3	2024-04-14 22:24:12.621095
7	98098022	8	5	3	2024-04-14 22:27:05.245883
8	42342423	8	5	3	2024-04-14 16:29:46.298376
\.


--
-- Data for Name: forma_de_pago; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.forma_de_pago (id, monto, forma, cliente, cuenta) FROM stdin;
1	20.5	efectivo	10605650	10
2	20	tarjeta	5050520	11
3	20.5	efectivo	10605650	10
4	20	tarjeta	5050520	11
5	5.48	efectivo	5050520	11
6	29.99	efectivo	202020500	12
7	28.48	tarjeta	5050500501	9
8	70.48	tarjeta	6241605	16
9	50	tarjeta	440545	16
10	32	efectivo	440545	16
11	5	efectivo	98098022	17
12	1.5	efectivo	98098022	17
13	17.281625	efectivo	555500060	17
14	29.97	efectivo	42342423	21
15	NaN	\N	23445453	10
16	300	tarjeta	4837462	27
17	26.939999999999998	efectivo	4837462	27
18	44.2405	tarjeta	20201110	15
\.


--
-- Data for Name: mesas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mesas (id, capacidad, se_puede_mover, id_area) FROM stdin;
1	4	t	2
2	6	t	6
3	10	f	3
4	8	t	4
5	12	f	1
6	14	t	5
7	4	t	2
8	6	t	2
9	8	f	6
10	10	t	6
11	4	t	3
12	6	t	3
13	8	f	4
14	10	t	4
15	12	t	1
16	14	t	1
17	4	t	5
18	6	t	5
\.


--
-- Data for Name: mesas_sesion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mesas_sesion (mesa, sesion) FROM stdin;
2	11
2	10
2	12
1	12
1	10
1	12
1	11
1	11
7	10
1	13
10	15
1	16
2	17
4	18
1	20
2	20
\.


--
-- Data for Name: orden_bar; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orden_bar (id, fecha, bebida, cuenta_id) FROM stdin;
3	2024-04-13 22:25:19.791656	2	10
20	2024-04-14 16:54:56.369822	4	26
\.


--
-- Data for Name: orden_cocina; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orden_cocina (id, fecha, plato, cuenta_id) FROM stdin;
\.


--
-- Data for Name: personal; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.personal (id, nombre, password, rol, area) FROM stdin;
2	admin	21232f297a57a5a743894a0e4a801fc3	admin	\N
3	dani	ee26aefb409f7050f75f079078b34ff1	cheff	\N
4	mathew	2a4686bbe2e473a7c603f70eac181657	mesero	\N
5	pedro	81dc9bdb52d04dc20036dbd8313ed055	barista	\N
6	random	81dc9bdb52d04dc20036dbd8313ed055	mesero	\N
7	Mathew Cordero	2a4686bbe2e473a7c603f70eac181657	mesero	\N
8	jorge	2a4686bbe2e473a7c603f70eac181657	cheff	\N
9	Marco	2a4686bbe2e473a7c603f70eac181657	cheff	\N
10	luis	2a4686bbe2e473a7c603f70eac181657	barista	\N
11	hola	827ccb0eea8a706c4c34a16891f84e7b	mesero	\N
12	adios	6e6e2ddb6346ce143d19d79b3358c16a	mesero	\N
13	como	ba5c7624c65e30bb05fa2450eb717b77	cheff	\N
\.


--
-- Data for Name: propina_per_count; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.propina_per_count ("?column?") FROM stdin;
6.636074999999999
\.


--
-- Data for Name: queja; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.queja (id, fecha_hora, nit_cliente, motivo, personal_id, comida, calificacion) FROM stdin;
1	2024-04-14 23:21:43.874037	10605650	Estaba mal	\N	1	4
3	2024-04-14 23:34:36.574163	5050520	Fue muy pesado	10	\N	4
4	2024-04-14 23:34:59.256784	5050520	Fue muy pesado	9	\N	4
5	2024-04-14 23:57:59.609051	10605650	Estaba mal	\N	2	4
6	2024-04-14 23:58:29.169193	555500060	Estaba mal	\N	2	4
7	2024-04-15 04:09:13.311772	5050520	Esta horrible	\N	1	5
8	2024-04-15 04:10:35.985438	5050520	Esta horrible	5	\N	5
9	2024-04-15 04:16:53.695936	5050520	Esta horrible	5	1	5
10	2024-04-15 04:22:43.81791	23445453	Me golpeo bien duro	8	1	5
\.


--
-- Data for Name: sesion; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sesion (id, mesero_asociado, monto_total, fecha, propina, fecha_inicio, fecha_fin) FROM stdin;
10	4	173.87	2024-04-10	26.0805	2024-04-10 07:38:18.481165	2024-04-14 03:05:16.831346
13	4	70.48	2024-04-14	10.572	2024-04-14 03:09:20.508532	2024-04-14 03:14:58.766418
11	4	35.96	2024-04-10	5.394	2024-04-10 08:54:48.17262	2024-04-14 05:13:41.716433
12	4	38.47	2024-04-10	5.7705	2024-04-10 09:09:06.015703	2024-04-14 05:18:51.023209
15	4	17.281625	2024-04-14	2.59224375	2024-04-14 05:44:47.074578	2024-04-14 06:39:24.800905
16	4	0	2024-04-14	0	2024-04-14 11:36:25.236855	\N
17	4	0	2024-04-14	0	2024-04-14 22:13:04.748906	\N
18	8	29.97	2024-04-14	4.4955	2024-04-14 22:15:14.916697	2024-04-14 22:18:40.663537
19	4	0	2024-04-14	0	2024-04-14 16:54:31.585581	\N
20	11	326.94	2024-04-15	49.041	2024-04-15 01:35:53.235632	2024-04-15 01:38:15.966123
21	4	0	2024-04-15	0	2024-04-15 17:23:39.863951	\N
\.


--
-- Name: areas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.areas_id_seq', 6, true);


--
-- Name: comidas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.comidas_id_seq', 41, true);


--
-- Name: cuenta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cuenta_id_seq', 28, true);


--
-- Name: encuesta_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.encuesta_id_seq', 8, true);


--
-- Name: forma_de_pago_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.forma_de_pago_id_seq', 18, true);


--
-- Name: mesas_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mesas_id_seq', 1, false);


--
-- Name: orden_bar_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orden_bar_id_seq', 20, true);


--
-- Name: orden_cocina_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orden_cocina_id_seq', 35, true);


--
-- Name: personal_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.personal_id_seq', 13, true);


--
-- Name: queja_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.queja_id_seq', 10, true);


--
-- Name: sesion_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sesion_id_seq', 21, true);


--
-- Name: areas areas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.areas
    ADD CONSTRAINT areas_pkey PRIMARY KEY (id);


--
-- Name: comidas comidas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comidas
    ADD CONSTRAINT comidas_pkey PRIMARY KEY (id);


--
-- Name: cuenta cuenta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta
    ADD CONSTRAINT cuenta_pkey PRIMARY KEY (id);


--
-- Name: encuesta encuesta_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encuesta
    ADD CONSTRAINT encuesta_pkey PRIMARY KEY (id);


--
-- Name: forma_de_pago forma_de_pago_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forma_de_pago
    ADD CONSTRAINT forma_de_pago_pkey PRIMARY KEY (id);


--
-- Name: mesas mesas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mesas
    ADD CONSTRAINT mesas_pkey PRIMARY KEY (id);


--
-- Name: cliente nit_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cliente
    ADD CONSTRAINT nit_pkey PRIMARY KEY (nit);


--
-- Name: orden_bar orden_bar_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orden_bar
    ADD CONSTRAINT orden_bar_pkey PRIMARY KEY (id);


--
-- Name: orden_cocina orden_cocina_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orden_cocina
    ADD CONSTRAINT orden_cocina_pkey PRIMARY KEY (id);


--
-- Name: personal personal_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal
    ADD CONSTRAINT personal_pkey PRIMARY KEY (id);


--
-- Name: queja queja_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.queja
    ADD CONSTRAINT queja_pkey PRIMARY KEY (id);


--
-- Name: sesion sesion_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sesion
    ADD CONSTRAINT sesion_pkey PRIMARY KEY (id);


--
-- Name: comida; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX comida ON public.cuenta_comida USING btree (comida);


--
-- Name: comida_cuenta; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX comida_cuenta ON public.cuenta_comida USING btree (cuenta);


--
-- Name: orden_bar delete_comida_for_orden; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER delete_comida_for_orden AFTER DELETE ON public.orden_bar FOR EACH ROW EXECUTE FUNCTION public.delete_comida();


--
-- Name: orden_cocina delete_comida_for_orden; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER delete_comida_for_orden AFTER DELETE ON public.orden_cocina FOR EACH ROW EXECUTE FUNCTION public.delete_comida();


--
-- Name: cuenta_comida insert_comida_cantidad; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER insert_comida_cantidad AFTER INSERT ON public.cuenta_comida FOR EACH ROW EXECUTE FUNCTION public.insert_comida();


--
-- Name: mesas_sesion verify_capacity_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER verify_capacity_trigger AFTER INSERT ON public.mesas_sesion FOR EACH ROW EXECUTE FUNCTION public.verified_capacity();


--
-- Name: cuenta cuenta_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta
    ADD CONSTRAINT cuenta_cliente_fkey FOREIGN KEY (cliente) REFERENCES public.cliente(nit);


--
-- Name: cuenta_comida cuenta_comida_comida_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_comida
    ADD CONSTRAINT cuenta_comida_comida_fkey FOREIGN KEY (comida) REFERENCES public.comidas(id);


--
-- Name: cuenta_comida cuenta_comida_cuenta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta_comida
    ADD CONSTRAINT cuenta_comida_cuenta_fkey FOREIGN KEY (cuenta) REFERENCES public.cuenta(id);


--
-- Name: cuenta cuenta_sesion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cuenta
    ADD CONSTRAINT cuenta_sesion_fkey FOREIGN KEY (sesion) REFERENCES public.sesion(id);


--
-- Name: encuesta encuesta_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encuesta
    ADD CONSTRAINT encuesta_cliente_fkey FOREIGN KEY (cliente) REFERENCES public.cliente(nit);


--
-- Name: encuesta encuesta_personal_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.encuesta
    ADD CONSTRAINT encuesta_personal_fkey FOREIGN KEY (personal) REFERENCES public.personal(id);


--
-- Name: orden_bar fk_cuenta; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orden_bar
    ADD CONSTRAINT fk_cuenta FOREIGN KEY (cuenta_id) REFERENCES public.cuenta(id);


--
-- Name: orden_cocina fk_cuenta; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orden_cocina
    ADD CONSTRAINT fk_cuenta FOREIGN KEY (cuenta_id) REFERENCES public.cuenta(id);


--
-- Name: forma_de_pago forma_de_pago_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forma_de_pago
    ADD CONSTRAINT forma_de_pago_cliente_fkey FOREIGN KEY (cliente) REFERENCES public.cliente(nit);


--
-- Name: forma_de_pago forma_de_pago_cuenta_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.forma_de_pago
    ADD CONSTRAINT forma_de_pago_cuenta_fkey FOREIGN KEY (cuenta) REFERENCES public.cuenta(id);


--
-- Name: mesas mesas_id_area_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mesas
    ADD CONSTRAINT mesas_id_area_fkey FOREIGN KEY (id_area) REFERENCES public.areas(id);


--
-- Name: mesas_sesion mesas_sesion_mesa_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mesas_sesion
    ADD CONSTRAINT mesas_sesion_mesa_fkey FOREIGN KEY (mesa) REFERENCES public.mesas(id);


--
-- Name: mesas_sesion mesas_sesion_sesion_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mesas_sesion
    ADD CONSTRAINT mesas_sesion_sesion_fkey FOREIGN KEY (sesion) REFERENCES public.sesion(id);


--
-- Name: orden_bar orden_bar_bebida_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orden_bar
    ADD CONSTRAINT orden_bar_bebida_fkey FOREIGN KEY (bebida) REFERENCES public.comidas(id);


--
-- Name: orden_cocina orden_cocina_plato_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orden_cocina
    ADD CONSTRAINT orden_cocina_plato_fkey FOREIGN KEY (plato) REFERENCES public.comidas(id);


--
-- Name: personal personal_area_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal
    ADD CONSTRAINT personal_area_fkey FOREIGN KEY (area) REFERENCES public.areas(id);


--
-- Name: queja queja_comida_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.queja
    ADD CONSTRAINT queja_comida_fkey FOREIGN KEY (comida) REFERENCES public.comidas(id);


--
-- Name: queja queja_nit_cliente_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.queja
    ADD CONSTRAINT queja_nit_cliente_fkey FOREIGN KEY (nit_cliente) REFERENCES public.cliente(nit);


--
-- Name: queja queja_personal_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.queja
    ADD CONSTRAINT queja_personal_id_fkey FOREIGN KEY (personal_id) REFERENCES public.personal(id);


--
-- Name: sesion sesion_mesero_asociado_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sesion
    ADD CONSTRAINT sesion_mesero_asociado_fkey FOREIGN KEY (mesero_asociado) REFERENCES public.personal(id);


--
-- Name: TABLE actual_capacidad; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.actual_capacidad TO owner;


--
-- Name: TABLE areas; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.areas TO owner;


--
-- Name: SEQUENCE areas_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.areas_id_seq TO owner;


--
-- Name: TABLE cliente; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cliente TO owner;


--
-- Name: TABLE comidas; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.comidas TO owner;


--
-- Name: SEQUENCE comidas_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.comidas_id_seq TO owner;


--
-- Name: TABLE cuenta; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cuenta TO owner;


--
-- Name: TABLE cuenta_comida; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.cuenta_comida TO owner;


--
-- Name: SEQUENCE cuenta_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.cuenta_id_seq TO owner;


--
-- Name: TABLE encuesta; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.encuesta TO owner;


--
-- Name: SEQUENCE encuesta_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.encuesta_id_seq TO owner;


--
-- Name: TABLE forma_de_pago; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.forma_de_pago TO owner;


--
-- Name: SEQUENCE forma_de_pago_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.forma_de_pago_id_seq TO owner;


--
-- Name: TABLE mesas; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.mesas TO owner;


--
-- Name: SEQUENCE mesas_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.mesas_id_seq TO owner;


--
-- Name: TABLE mesas_sesion; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.mesas_sesion TO owner;


--
-- Name: TABLE orden_bar; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.orden_bar TO owner;


--
-- Name: SEQUENCE orden_bar_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.orden_bar_id_seq TO owner;


--
-- Name: TABLE orden_cocina; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.orden_cocina TO owner;


--
-- Name: SEQUENCE orden_cocina_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.orden_cocina_id_seq TO owner;


--
-- Name: TABLE personal; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.personal TO owner;


--
-- Name: SEQUENCE personal_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.personal_id_seq TO owner;


--
-- Name: TABLE propina_per_count; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.propina_per_count TO owner;


--
-- Name: TABLE queja; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.queja TO owner;


--
-- Name: SEQUENCE queja_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.queja_id_seq TO owner;


--
-- Name: TABLE sesion; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.sesion TO owner;


--
-- Name: SEQUENCE sesion_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.sesion_id_seq TO owner;


--
-- PostgreSQL database dump complete
--

