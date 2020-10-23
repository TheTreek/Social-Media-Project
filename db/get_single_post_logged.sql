SELECT 
    p.id as post_id, 
    p.type, p.content, 
    p.date, u.id, 
    u.user_name, 
    u.profile_pic, 
    (SELECT COUNT(*) 
        FROM litter_comment
        WHERE post_id = p.id
    ) as comments, 
    (SELECT COUNT(*) 
        FROM litter_like
        WHERE post_id = p.id
    ) as likes,
    (SELECT COUNT(*) 
        FROM litter_like
        WHERE post_id = p.id AND user_id = ${user_id}
    ) as liked
FROM litter_post p
JOIN litter_user u ON p.user_id = u.id
WHERE p.id = ${id}
group by p.id, u.id;