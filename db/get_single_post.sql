SELECT p.id, p.type, p.content, p.date, u.id, u.user_name, u.profile_pic
FROM litter_post p
JOIN litter_user u ON p.user_id = u.id
WHERE p.id = ${id};