SELECT DISTINCT 
    p.id,
    p.date
FROM litter_post p
WHERE
    p.user_id = ${id}
ORDER BY p.date DESC;