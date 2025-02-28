-- Connect to database
\c employee_tracker

-- Insert data into department table
INSERT INTO department (name)

VALUES ('Engineering'),
       ('Sales'),
       ('Finance'),
       ('Legal');

-- Insert data into role table
Insert INTO role
(title, salary, department_id)
    VALUES ('Mechanical Engineer', 105000, 1),
           ('Electrical Engineer', 145000, 1),
           ('Structural Engineer', 100000, 2),
           ('Project Manager', 80000, 2),
           ('Accountant', 80000, 3),
           ('Executive', 120000, 3),
           ('Warehouse', 30000, 4);

-- Insert data into employee table
INSERT INTO employee
(first_name, last_name, role_id, manager_id)
    VALUES ('Josh', 'Doe', 1, NULL),
           ('Jane', 'Doe', 2, 1),
           ('Jim', 'Doe', 3, 2),
           ('Jill', 'Doe', 4, 3),
           ('Jack', 'Doe', 5, 4),
           ('Jenny', 'Doe', 6, 5),
           ('Jared', 'Doe', 7, 6);

-- End of file