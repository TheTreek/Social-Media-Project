SELECT DISTINCT 
    p.id, 
    p.date,
    (SELECT COUNT(DISTINCT p.id) FROM litter_post p 
    JOIN litter_user u on u.id = p.user_id
    JOIN litter_comment c ON c.post_id = p.id
    WHERE 
        to_tsvector(p.content) || to_tsvector(u.user_name) || to_tsvector(c.comment) @@ to_tsquery(${query})
    ) as posts
FROM litter_post p
JOIN litter_user u ON u.id = p.user_id
JOIN litter_comment c ON c.post_id = p.id
WHERE 
    to_tsvector(p.content) || to_tsvector(u.user_name) || to_tsvector(c.comment) @@ to_tsquery(${query})
ORDER BY p.date DESC
LIMIT ${limit} OFFSET ${offset};

