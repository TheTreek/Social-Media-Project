SELECT DISTINCT 
    p.id,
    p.date
FROM litter_post p
JOIN litter_like l ON l.post_id = p.id
WHERE
    l.user_id = ${id}
ORDER BY p.date DESC