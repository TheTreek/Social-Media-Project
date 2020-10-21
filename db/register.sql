INSERT INTO litter_user(
    first_name,
    last_name,
    user_name,
    profile_pic,
    authenticated,
    password,
    email,
    bio
)VALUES(
    ${first_name},
    ${last_name},
    $(user_name),
    ${profile_pic},
    FALSE,
    ${password},
    ${email},
    ''
);

SELECT * FROM litter_user
WHERE user_name = ${user_name};