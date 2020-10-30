CREATE TABLE litter_user(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    user_name VARCHAR(30),
    profile_pic TEXT,
    authenticated BOOLEAN,
    password TEXT,
    email VARCHAR(100),
    bio VARCHAR(250)
);

CREATE TABLE litter_followers(
    user_id INTEGER REFERENCES litter_user(id) ON DELETE CASCADE,
    follower_id INTEGER REFERENCES litter_user(id) ON DELETE CASCADE
);

CREATE TABLE litter_post(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES litter_user(id) ON DELETE CASCADE,
    type VARCHAR(10),
    content TEXT,
    date TIMESTAMP
);

CREATE TABLE litter_like(
    post_id INTEGER REFERENCES litter_post(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES litter_user(id) ON DELETE CASCADE
);

CREATE TABLE litter_comment(
    id SERIAL PRIMARY KEY,
    post_id INTEGER REFERENCES litter_post(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES litter_user(id) ON DELETE CASCADE,
    comment VARCHAR(250)
);