-- Drops the companyRoster_db if it exists currently --
DROP DATABASE IF EXISTS companyRoster_db;
-- Creates the "companyRoster_db" database --
CREATE DATABASE companyRoster_db;

-- Makes it so all of the following code will affect companyRoster_db --
USE companyRoster_db;

-- Creates the table "department" within companyRoster_db --
CREATE TABLE department (
  id INTEGER NOT NULL AUTO_INCREMENT,
  -- Makes a string column called "food" which cannot contain null --
  name VARCHAR(30) NOT NULL,
  -- Sets primary key to id --
  PRIMARY KEY (id)
);

CREATE TABLE role (
  id INTEGER NOT NULL AUTO_INCREMENT,
  title VARCHAR(30),
  -- how do i use decimal --
  salary DECIMAL(10),
  department_id -- not sure how to do INT to hold reference to department role belongs to --
  PRIMARY KEY (id)
);

CREATE TABLE favorite_movies (
  id INTEGER NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  -- Creates a boolean column called "five_times" that sets the default value to false if nothing is entered --
  role_id -- not sure how to do INT to hold reference to role the employeee has --
  manager_id -- not sure how to do INT to hold reference to manager employee has --
  PRIMARY KEY (id)
);
