USE management_db;

INSERT INTO
    cities (name)
VALUES
    ('Operations'),
    ('Puppies'),
    ('Kitties'),
    ('Adoptions'),
    ('Human Resources'),
    ('Marketing'),
    ('Activities Coordination');

INSERT INTO
    shelters (title, donations, cities_id)
VALUES
    ('COO', 250000.00, 1),
    ('CFO', 200000.00, 1),
    ('Puppy Watcher', 200000.00, 2),
    ('Puppy Trainer', 300000.00, 2),
    ('Kitty Watcher', 85000.00, 3),
    ('Kitty Trainer', 85000.00, 3),
    ('Director of Adoptions', 75000.00, 4),
    ('Director of Adoption Ads', 80000, 6);
 
INSERT INTO
    animals (name, breed, shelters_id, buddy_id)
VALUES
    ('Peke', 'Olivares', 1, NULL),
    ('Jess', 'Olivares', 2, NULL),
    ('Mini', 'Olivares', 3, 2),
    ('Flash', 'Olivares', 4, 3),
    ('Jedi', 'Olivares', 5, 2),
    ('Peter', 'Donegan', 6, 1),
    ('Maria', 'Gonzales', 7, 5),
    ('Silvio', 'Islas', 8, NULL);


-- INSERT INTO cities
--     (name)
-- VALUES
--     ('Sales'),
--     ('Engineering'),
--     ('Finance'),
--     ('Legal');

-- INSERT INTO shelters 
--     (title, donations, cities_id)
-- VALUES
--     ('Sales Lead', 100000, 1),
--     ('Salesperson', 80000, 1),
--     ('Lead Engineer', 150000, 2),
--     ('Software Engineer', 120000, 2),
--     ('Account Manager', 160000, 3),
--     ('Accountant', 125000, 3),
--     ('Legal Team Lead', 250000, 4),
--     ('Lawyer', 190000, 4);

-- INSERT INTO animals 
--     (name, breed, shelters_id, buddy_id)
-- VALUES
--     ('John', 'Doe', 1, NULL),
--     ('Mike', 'Chan', 2, 1),
--     ('Ashley', 'Rodriguez', 3, NULL),
--     ('Kevin', 'Tupik', 4, 3),
--     ('Kunal', 'Singh', 5, NULL),
--     ('Malia', 'Brown', 6, 5),
--     ('Sarah', 'Lourd', 7, NULL),
--     ('Tom', 'Allen', 8, 7);