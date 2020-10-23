SELECT
    c.comment,
    u.id as user_id,
    u.user_name,
    u.profile_pic
FROM 
    litter_comment c
JOIN 
    litter_user u ON c.user_id = u.id
WHERE
    c.post_id = ${post_id};