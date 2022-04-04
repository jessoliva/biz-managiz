USE management_db;

INSERT INTO
    cities (name, state)
VALUES
    ('Mcallen', 'Texas'),
    ('Austin', 'Texas'),
    ('Berkeley', 'California'),
    ('San Diego', 'California'),
    ('Miami', 'Florida'),
    ('Denver', 'Colorado'),
    ('Boulder', 'Colorado');

INSERT INTO
    shelters (name, donations, cities_id)
VALUES
    ('Chihuahua Rescue', 250000.00, 1),
    ('Austin Pets Alive!', 200000.00, 2),
    ('Kitty City', 200000.00, 3),
    ('Austin Animal Center', 300000.00, 2),
    ('Lizard Love', 85000.00, 5),
    ('Furry Friends', 85000.00, 4),
    ('Find Your Friend', 75000.00, 7),
    ('Birds Birds Birds', 80000, 6);
 
INSERT INTO
    animals (name, breed, buddy_id, shelters_id)
VALUES
    ('Peke', 'Chihuahua', NULL, 1),
    ('Mini', 'Chihuahua', 1, 1),
    ('Pico', 'Cat', NULL, 3),
    ('Flash', 'Chihuahua', 1, 1),
    ('Jedi', 'Chihuahua', 1, 1),
    ('Peter', 'Lizard', 1, 6),
    ('Pinky', 'Cat', 5, 7),
    ('Pica', 'Bird', NULL, 8);
