DROP DATABASE IF EXISTS companyRoster_db;
CREATE DATABASE companyRoster_db;

USE companyRoster_db;

CREATE TABLE department (
  id INTEGER NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role_ (
  id INTEGER NOT NULL AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL(10, 2),
  department_id INTEGER, -- not sure how to do INT to hold reference to department role belongs to --
  PRIMARY KEY (id)
);

CREATE TABLE employee (
  id INTEGER NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER, -- not sure how to do INT to hold reference to role the employeee has --
  manager_id INTEGER, -- not sure how to do INT to hold reference to manager employee has --
  PRIMARY KEY (id)
);

INSERT INTO employees (id, first_name, last_name)
VALUES (1, "Caroline", "Manson"), (2, "Cameron", "Pyle");
INSERT INTO role_ (id, title, salary)
VALUES (1, "Systems Architect", 1000000.0), (2, "Senior Developer", 1000000.0);

SELECT * FROM department;
SELECT * FROM role_;
SELECT * FROM employee;