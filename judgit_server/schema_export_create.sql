--
-- PostgreSQL database dump
--

-- Dumped from database version 11.4
-- Dumped by pg_dump version 11.4

-- Started on 2019-09-25 19:17:46

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
-- TOC entry 2870 (class 1262 OID 18907)
-- Name: judgeit; Type: DATABASE; Schema: -; Owner: -
--

CREATE DATABASE judgeit WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'French_France.1250' LC_CTYPE = 'French_France.1250';


\connect judgeit

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
-- TOC entry 622 (class 1247 OID 18971)
-- Name: colors; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.colors AS ENUM (
    'yellow',
    'green',
    'red'
);



--
-- TOC entry 221 (class 1255 OID 18979)
-- Name: createorupvotelinkid(integer, integer, text, public.colors); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.createorupvotelinkid(_user_id integer, _link_id integer, _vote_text text, _vote_color public.colors) RETURNS boolean
    LANGUAGE plpgsql
    AS $$ 
DECLARE 
_text_id integer;
_always_true boolean;
BEGIN

INSERT INTO votetexts(text) VALUES(_vote_text)
	ON CONFLICT DO NOTHING;
SELECT id INTO _text_id FROM votetexts WHERE text = _vote_text;
INSERT INTO votes(user_id,link_id,text_id,color) VALUES(_user_id,_link_id,_text_id,_vote_color)
	ON CONFLICT(user_id,link_id,text_id,color) DO UPDATE  SET text_id = _text_id ,color = _vote_color WHERE votes.user_id = _user_id AND votes.link_id = _link_id;
_always_true := true;
RETURN _always_true;
END;
$$;


--
-- TOC entry 222 (class 1255 OID 18994)
-- Name: createorupvotelinkurl(integer, text, text, public.colors); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.createorupvotelinkurl(_user_id integer, _link_url text, _vote_text text, _vote_color public.colors) RETURNS boolean
    LANGUAGE plpgsql
    AS $$ 
DECLARE 
_link_id integer;
BEGIN
INSERT INTO links(url) VALUES(_link_url)
	ON CONFLICT(url) DO NOTHING;
SELECT id INTO _link_id FROM links WHERE url = _link_url;
PERFORM CreateOrUpVoteLinkId(_user_id,_link_id,_vote_text,_vote_color);
RETURN true;
END;
$$;


--
-- TOC entry 220 (class 1255 OID 18983)
-- Name: update_color_total_func(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_color_total_func() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN

	UPDATE links SET green=q.green,yellow=q.yellow,red=q.red
	FROM (SELECT 
			SUM(case when color = 'red'::colors then 1 ELSE 0 end) as red ,
			SUM(case when color = 'yellow'::colors then 1 ELSE 0 end) as yellow,
			SUM(case when color = 'green'::colors then 1 ELSE 0 end) as green 
			FROM votes WHERE link_id = NEW.link_id AND COLOR IS NOT NULL 
		 ) AS q
	WHERE id = NEW.link_id;
   RETURN NEW;

END;
$$;


SET default_tablespace = '';

SET default_with_oids = false;

--
-- TOC entry 200 (class 1259 OID 18919)
-- Name: links; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.links (
    id integer NOT NULL,
    url text,
    green integer,
    yellow integer,
    red integer
);


--
-- TOC entry 199 (class 1259 OID 18917)
-- Name: links_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.links ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.links_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 205 (class 1259 OID 18985)
-- Name: total_vote_textid_per_color_per_link; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.total_vote_textid_per_color_per_link (
    id integer NOT NULL,
    votetext_id integer,
    color public.colors,
    total integer,
    link_id integer
);


--
-- TOC entry 198 (class 1259 OID 18910)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name text,
    extension_token text
);


--
-- TOC entry 197 (class 1259 OID 18908)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- TOC entry 2871 (class 0 OID 0)
-- Dependencies: 197
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 201 (class 1259 OID 18925)
-- Name: votes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.votes (
    id integer NOT NULL,
    user_id integer NOT NULL,
    link_id integer NOT NULL,
    text_id integer NOT NULL,
    color public.colors
);


--
-- TOC entry 202 (class 1259 OID 18928)
-- Name: votes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.votes ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.votes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 203 (class 1259 OID 18949)
-- Name: votetexts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.votetexts (
    id integer NOT NULL,
    text text NOT NULL
);


--
-- TOC entry 204 (class 1259 OID 18959)
-- Name: votetexts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.votetexts ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.votetexts_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 2722 (class 2604 OID 18913)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 2739 (class 2606 OID 18989)
-- Name: total_vote_textid_per_color_per_link id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.total_vote_textid_per_color_per_link
    ADD CONSTRAINT id PRIMARY KEY (id);


--
-- TOC entry 2733 (class 2606 OID 19008)
-- Name: votes one_user_per_link; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT one_user_per_link UNIQUE (user_id, link_id, text_id, color);


--
-- TOC entry 2872 (class 0 OID 0)
-- Dependencies: 2733
-- Name: CONSTRAINT one_user_per_link ON votes; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON CONSTRAINT one_user_per_link ON public.votes IS 'unique combinaison of link and user as such that a user can only vote for one link';


--
-- TOC entry 2724 (class 2606 OID 18934)
-- Name: users unique_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_id UNIQUE (id);


--
-- TOC entry 2726 (class 2606 OID 18942)
-- Name: links unique_link_id; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.links
    ADD CONSTRAINT unique_link_id UNIQUE (id);


--
-- TOC entry 2728 (class 2606 OID 27188)
-- Name: links unique_url; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.links
    ADD CONSTRAINT unique_url UNIQUE (url);


--
-- TOC entry 2735 (class 2606 OID 18956)
-- Name: votetexts votetexts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.votetexts
    ADD CONSTRAINT votetexts_pkey PRIMARY KEY (id);


--
-- TOC entry 2737 (class 2606 OID 18964)
-- Name: votetexts votetexts_unique_text; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.votetexts
    ADD CONSTRAINT votetexts_unique_text UNIQUE (text);


--
-- TOC entry 2729 (class 1259 OID 18948)
-- Name: fki_vote_link_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX fki_vote_link_id ON public.votes USING btree (link_id);


--
-- TOC entry 2730 (class 1259 OID 19006)
-- Name: fki_vote_text_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX fki_vote_text_id ON public.votes USING btree (text_id);


--
-- TOC entry 2731 (class 1259 OID 18940)
-- Name: fki_vote_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX fki_vote_user_id ON public.votes USING btree (user_id);


--
-- TOC entry 2743 (class 2620 OID 18984)
-- Name: votes update_color_total_on_votes_changes; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_color_total_on_votes_changes AFTER INSERT OR DELETE OR UPDATE ON public.votes FOR EACH ROW EXECUTE PROCEDURE public.update_color_total_func();


--
-- TOC entry 2741 (class 2606 OID 18943)
-- Name: votes vote_link_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT vote_link_id FOREIGN KEY (link_id) REFERENCES public.links(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- TOC entry 2742 (class 2606 OID 19001)
-- Name: votes vote_text_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.votes
    ADD CONSTRAINT vote_text_id FOREIGN KEY (text_id) REFERENCES public.votetexts(id);




-- Completed on 2019-09-25 19:17:47

--
-- PostgreSQL database dump complete
--

