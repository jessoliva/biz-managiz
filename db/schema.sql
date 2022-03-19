-- drop, create, and use db
DROP DATABASE IF EXISTS management_db;
CREATE DATABASE management_db;
USE management_db;

CREATE TABLE cities (
   id INTEGER AUTO_INCREMENT PRIMARY KEY,
   name VARCHAR(30) UNIQUE NOT NULL
);

CREATE TABLE shelters (
   id INTEGER AUTO_INCREMENT PRIMARY KEY,
   title VARCHAR(30) NOT NULL,
   donations DECIMAL(10,2) NOT NULL,
   cities_id INTEGER,
   CONSTRAINT fk_cities
   FOREIGN KEY (cities_id) REFERENCES cities(id) ON DELETE CASCADE
);
-- constraint: if the city that shelter is apart of is deleted, delete the shelter

CREATE TABLE animals (
   id INTEGER AUTO_INCREMENT PRIMARY KEY,
   name VARCHAR(30) NOT NULL,
   breed VARCHAR(30) NOT NULL,
   shelters_id INTEGER,
   CONSTRAINT fk_shelters
   FOREIGN KEY (shelters_id) REFERENCES shelters(id) ON DELETE CASCADE,
   buddy_id INTEGER,
   CONSTRAINT fk_buddy
   FOREIGN KEY (buddy_id) REFERENCES animals(id) ON DELETE SET NULL
);
-- constraint: if the role that the employee has is deleted, do not delete employee but set role as null
