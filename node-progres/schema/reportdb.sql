--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: userinfo; Type: TABLE; Schema: public; Owner: pradosh; Tablespace: 
--

CREATE TABLE userinfo (
    id integer NOT NULL,
    user_data jsonb NOT NULL,
    CONSTRAINT adult_age CHECK (((user_data ->> 'age'::text) >= '18'::text)),
    CONSTRAINT email_not_null CHECK ((char_length((user_data ->> 'email'::text)) > 0)),
    CONSTRAINT name_not_null CHECK ((char_length((user_data ->> 'name'::text)) > 0))
);


ALTER TABLE userinfo OWNER TO pradosh;

--
-- Name: userinfo_id_seq; Type: SEQUENCE; Schema: public; Owner: pradosh
--

CREATE SEQUENCE userinfo_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE userinfo_id_seq OWNER TO pradosh;

--
-- Name: userinfo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: pradosh
--

ALTER SEQUENCE userinfo_id_seq OWNED BY userinfo.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: pradosh
--

ALTER TABLE ONLY userinfo ALTER COLUMN id SET DEFAULT nextval('userinfo_id_seq'::regclass);


--
-- Data for Name: userinfo; Type: TABLE DATA; Schema: public; Owner: pradosh
--

COPY userinfo (id, user_data) FROM stdin;
35	{"age": 40, "name": "Pradosh", "email": "pradosh@xyz.com"}
36	{"age": 30, "name": "Dhruv", "email": "dhruv@xyz.com"}
38	{"age": 30, "name": "Dhruv", "email": "dhruv1@xyz.com"}
\.


--
-- Name: userinfo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: pradosh
--

SELECT pg_catalog.setval('userinfo_id_seq', 40, true);


--
-- Name: userinfo_pkey; Type: CONSTRAINT; Schema: public; Owner: pradosh; Tablespace: 
--

ALTER TABLE ONLY userinfo
    ADD CONSTRAINT userinfo_pkey PRIMARY KEY (id);


--
-- Name: userinfo_email; Type: INDEX; Schema: public; Owner: pradosh; Tablespace: 
--

CREATE UNIQUE INDEX userinfo_email ON userinfo USING btree (((user_data ->> 'email'::text)));


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

