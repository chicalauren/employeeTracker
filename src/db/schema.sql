
\c postgres;

-- drop the database if exists
DROP DATABASE IF EXISTS employee_tracker;

-- create the database
CREATE DATABASE employee_tracker;

-- connect to the database
\c employee_tracker;

-- create the tables

-- department table
-- id is a serial that auto-increments
CREATE TABLE departments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

-- role table has a foreign key that references the department table
-- department_id references the id of a department
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(id)
);  

-- employee table has a self-referencing foreign key
-- manager_id references the id of another employee
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES roles(id),
    FOREIGN KEY (manager_id) REFERENCES employees(id)
);

-- End of file