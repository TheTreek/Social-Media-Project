UPDATE litter_user
SET first_name = ${first_name},
    last_name = ${last_name},
    bio = ${bio}
WHERE id = ${id};