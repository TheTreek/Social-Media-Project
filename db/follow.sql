DO
$do$
BEGIN
    DELETE FROM litter_followers 
        WHERE user_id = ${user_id} 
        AND follower_id = ${follower_id};
    IF NOT FOUND THEN
        INSERT INTO litter_followers(user_id,follower_id)
            VALUES(${user_id},${follower_id});
    END IF;
END
$do$;

SELECT COUNT(*) FROM litter_followers 
    WHERE user_id=${user_id} 
    AND follower_id = ${follower_id};