SELECT DISTINCT 
    p.id, 
    p.date,
    (SELECT COUNT(DISTINCT p.id) FROM litter_post p) as posts
FROM litter_post p
JOIN litter_user u ON u.id = p.user_id
ORDER BY p.date DESC
LIMIT ${limit} OFFSET ${offset};