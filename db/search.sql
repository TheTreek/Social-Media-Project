SELECT DISTINCT 
    p.id, 
    p.date,
    (SELECT COUNT(*) FROM litter_post p 
    JOIN litter_user u on u.id = p.user_id
    WHERE 
        p.content ILIKE CONCAT('%',${query},'%') 
        OR u.user_name ILIKE CONCAT('%',${query},'%')) as posts
FROM litter_post p
JOIN litter_user u ON u.id = p.user_id
WHERE p.content ILIKE CONCAT('%',${query},'%') OR u.user_name ILIKE CONCAT('%',${query},'%')
ORDER BY p.date DESC
LIMIT ${limit} OFFSET ${offset};

