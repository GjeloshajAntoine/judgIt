CREATE OR REPLACE FUNCTION CreateOrUpVoteLinkId(_user_id integer,_link_id integer, _vote_text text,_vote_color text) RETURNS boolean AS $$ 
DECLARE 
_text_id integer;
_always_true boolean;
BEGIN

INSERT INTO votetexts(text) VALUES(_vote_text)
	ON CONFLICT DO NOTHING;
SELECT id INTO _text_id FROM votetexts WHERE text = _vote_text;
INSERT INTO votes(user_id,link_id,text_id) VALUES(_user_id,_link_id,_text_id)
	ON CONFLICT(user_id,link_id) DO UPDATE  SET text_id = _text_id WHERE votes.user_id = _user_id AND votes.link_id = _link_id;
_always_true := true;
RETURN _always_true;
END;
$$ LANGUAGE plpgsql; -- language specification 

CREATE OR REPLACE FUNCTION CreateOrUpVoteLinkUrl(_user_id integer,_link_url text, _vote_text text,_vote_color text) RETURNS boolean AS $$ 
DECLARE 
_link_id integer;
BEGIN
INSERT INTO links(url) VALUES(_link_url)
	ON CONFLICT DO NOTHING;
SELECT id INTO _link_id FROM links WHERE url = _link_url;
SELECT CreateOrUpVoteLinkId(_user_id,_link_url,_vote_text,_vote_text)
RETURN true;
END;
$$ LANGUAGE plpgsql; -- language specification 
