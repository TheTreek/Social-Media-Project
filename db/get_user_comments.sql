SELECT DISTINCT 
    c.id,
    c.post_id
FROM litter_comment c
WHERE
    c.user_id = ${id}
ORDER BY c.id DESC