SELECT 
    u.user_name,
    u.first_name,
    u.last_name,
    u.profile_pic,
    u.bio,
    (SELECT COUNT(*) FROM litter_followers WHERE user_id = u.id) as followers,
    (SELECT COUNT(*) FROM litter_followers WHERE follower_id = u.id) as following,
    (SELECT COUNT(*) FROM litter_post WHERE user_id = u.id) as post_count
FROM litter_user u
WHERE u.id = ${id};