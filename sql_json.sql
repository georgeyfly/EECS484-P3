Select u.user_id, u.first_name, u.last_name, u.gender, u.year_of_birth AS YOB, 
       u.month_of_birth AS MOB, u.day_of_birth AS DOB, f.user2_id AS friend_id,
       c1.city_name AS current_city, c1.state_name AS current_state,
       c1.country_name AS current_country,
       c2.city_name AS hometown_city, c2.state_name AS hometown_state,
       c2.country_name AS hometown_country
FROM project3.public_users u 
JOIN project3.public_user_current_cities cu ON cu.user_id = u.user_id
JOIN project3.public_cities c1 ON c1.city_id = cu.current_city_id
JOIN project3.public_user_hometown_cities ht ON ht.user_id = u.user_id 
JOIN project3.public_cities c2 ON c2.city_id = ht.hometown_city_id
JOIN project3.public_friends f ON f.user1_id = u.user_id;