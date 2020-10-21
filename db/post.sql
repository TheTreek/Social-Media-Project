INSERT INTO litter_post(
    user_id,
    type,
    content,
    date
)VALUES(
    ${user_id},
    ${type},
    ${content},
    NOW()
) RETURNING id;