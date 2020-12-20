DROP DATABASE IF EXISTS companyRoster_db;
CREATE DATABASE companyRoster_db;

USE companyRoster_db;

CREATE TABLE department (
  department_id INTEGER NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (department_id)
);

CREATE TABLE role_ (
  role_id INTEGER NOT NULL AUTO_INCREMENT,
  title VARCHAR(30),
  salary DECIMAL(10, 2),
  department_id integer,
  FOREIGN KEY (department_id) REFERENCES department(department_id),
  PRIMARY KEY (role_id)
);

CREATE TABLE employee (
  employee_id INTEGER NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id integer,
  department_id integer,
  FOREIGN KEY (role_id) REFERENCES role_(role_id),
  FOREIGN KEY (department_id) REFERENCES department(department_id),
  PRIMARY KEY (employee_id)
);

INSERT INTO department (name)
VALUES ("Sales"), ("Engineering");
INSERT INTO role_ (title, salary)
VALUES ("Sales Lead", 1000000.0), ("Lead Engineer", 1000000.0);
INSERT INTO employee (first_name, last_name)
VALUES ("Caroline", "Manson"), ("Cameron", "Pyle");


SELECT * FROM department;
SELECT * FROM role_;
SELECT * FROM employee;