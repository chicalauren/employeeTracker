// Desc: Main entry point for the application
import inquirer from "inquirer";
import { pool, connectDB } from "./connection";
import "./connection";

// 
(async () => {
    // TO Connect to the database
    try {
        await connectDB();
        console.log("Connected to the database");
    } catch (err:any) {
        console.error('Error connecting to the database:', err.message);
    }

    //  makeASelection async function
    const makeASelection = async () => {
        try {
            // Prompt the user to select an action
            const answers = await inquirer.prompt([
              {
                type: 'list',
                name: 'action',
                message: 'What would you like to do?',
                choices: [
                  'View All Employees',
                  'Add Employee',
                  'Update Employee Role',
                  'View All Roles',
                  'Add Role',
                  'View All Departments',
                  'Add Department',
                  'Quit'
                ]
              }
            ]);
    
            // Switch statement to handle the user's selection
            switch (answers.action) {
              case 'View All Employees':
                await viewAllEmployees();
                break;
              case 'Add Employee':
                await addEmployee();
                break;
              case 'Update Employee Role':
                await updateEmployee();
                break;
              case 'View All Roles':
                await viewAllRoles();
                break;
              case 'Add Role':
                await addRole();
                break;
              case 'View All Departments':
                await viewAllDepartments();
                break;
              case 'Add Department':
                await addDepartment();
                break;
              case 'Quit':
                await pool.end(); 
                console.log("Database connection closed.");
                process.exit(0);
            }
          } catch (err: any) {
            console.error('Error processing selection:', err.message);
            makeASelection(); 
          }
    };

    //function to view all employees
        const viewAllEmployees = async () => {

        try {
            
            // Query the database
            const sql = `
          
            SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, 
                 CONCAT(m.first_name, ' ', m.last_name) as manager
          FROM employee e
          JOIN role r ON e.role_id = r.id
          JOIN department d ON r.department_id = d.id
          LEFT JOIN employee m ON e.manager_id = m.id;
          `;
        
          const result = await pool.query(sql);
          console.log(result);
          console.table(result.rows);
          makeASelection();
        } catch (err:any) {
          console.error('Error retrieving employees:', err.message);
          makeASelection();
        }
      };

    //function to add employee
    const addEmployee = async () => {
        try {
            // Query the database for roles
            const roles = await pool.query('SELECT * FROM role;');
            const roleChoice = roles.rows.map((row: { title: string; id: number }) => ({
                name: row.title, value: row.id 
            }));

            // Query the database for employees
            const employees = await pool.query('SELECT * FROM employee;');
            const manager = employees.rows.map(emp => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
            }));

            // Add a None option to the manager list
            manager.unshift({ name: 'None', value: null });


        // Prompt the user for the new employee's information
        const answers = await inquirer.prompt([
            {
              type: 'input',
              name: 'employeeFirstName',
              message: "What is the employee's first name?",
            },
            {
              type: 'input',
              name: 'employeeLastName',
              message: "What is the employee's last name?",
            },
            {
              type: 'list',
              name: 'employeeRole',
              message: "What is the employee's role?",
              choices: roleChoice
            },
            {
              type: 'list',
              name: 'employeeManager',
              message: "Who is the employee's manager?",
              choices: manager
            }
          ]);
          
          // Insert the new employee into the database
          const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`;
            await pool.query(sql, [answers.employeeFirstName, answers.employeeLastName, answers.employeeRole, answers.employeeManager]);
            console.log(`${answers.employeeFirstName} ${answers.employeeLastName} added to the database.`);
                makeASelection();
            } catch (err: any) {
            console.error('Error adding employee:', err.message);
            makeASelection();
        }
    };


    //function to update employee role
    // Update an employee's role
    const updateEmployee = async () => {
        try {
          const employees = await pool.query('SELECT * FROM employee;');
          const employeeChoices = employees.rows.map(emp => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
          }));

          // Query the database for roles
          const roles = await pool.query('SELECT * FROM role;');
          const roleChoices = roles.rows.map(row => ({ name: row.title, value: row.id }));

          // Prompt the user for the employee and role to update
          const answers = await inquirer.prompt([
            {
              type: 'list',
              name: 'employeeSelect',
              message: "Which employee's role do you want to update?",
              choices: employeeChoices
            },
            {
              type: 'list',
              name: 'employeeRole',
              message: "Which role do you want to assign to the selected employee?",
              choices: roleChoices
            }
          ]);

        // Update the employee's role
          const sql = 'UPDATE employee SET role_id = $1 WHERE id = $2';
          await pool.query(sql, [answers.employeeRole, answers.employeeSelect]);
          console.log(`Updated employee's role.`);
          makeASelection();
        } catch (err:any) {
          console.error('Error updating employee role:', err.message);
          makeASelection();
        }
      };


     //function to view all roles
     const viewAllRoles = async () => {
        try {
          const sql = 'SELECT r.id, r.title, d.name AS department, r.salary FROM role r JOIN department d ON d.id = r.department_id;';
          const result = await pool.query(sql);
          console.table(result.rows);
          makeASelection();

          // Catch any errors
        } catch (err:any) {
          console.error('Error retrieving roles:', err.message);
          makeASelection();
        }
      };


    //function to add role
    const addRole = async () => {
        try {
          const departments = await pool.query('SELECT * FROM department;');
          const departmentChoices = departments.rows.map(row => ({ name: row.name, value: row.id }));
  
          // Prompt the user for the new role's information
          const answers = await inquirer.prompt([
            {
              type: 'input',
              name: 'roleTitle',
              message: 'What is the name of the role?',
            },
            {
              type: 'input',
              name: 'roleSalary',
              message: 'What is the salary for the role?',
              validate: (value: number) => !isNaN(value) ? true : 'Please enter a valid number'
            },
            {
              type: 'list',
              name: 'roleDepartment',
              message: 'Which department does this role belong to?',
              choices: departmentChoices
            }
          ]);
          
        // Insert the new role into the database
          const sql = 'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)';
          await pool.query(sql, [answers.roleTitle, answers.roleSalary, answers.roleDepartment]);
          console.log(`Added role ${answers.roleTitle} to the database.`);
          makeASelection();
          // Catch any errors
        } catch (err:any) {
          console.error('Error adding role:', err.message);
          makeASelection();
        }
      };

     //function to view all departments
     const viewAllDepartments = async () => {
        // Query the database
        try {
          const sql = 'SELECT * FROM department;';
          const result = await pool.query(sql);
          console.table(result.rows);
          makeASelection();
          // Catch any errors
        } catch (err:any) {
          console.error('Error retrieving departments:', err.message);
          makeASelection();
        }
      };

    //function to add department
    const addDepartment = async () => {
        try {
          const answers = await inquirer.prompt([
            {
              type: 'input',
              name: 'departmentName',
              message: 'What is the name of the department?',
            }
          ]);

          // Insert the new department into the database
          const sql = 'INSERT INTO department (name) VALUES ($1)';
          await pool.query(sql, [answers.departmentName]);
          console.log(`Added department ${answers.departmentName} to the database.`);
          makeASelection();
        } catch (err:any) {
          console.error('Error adding department:', err.message);
          makeASelection();
        }
      };  


     //start the application
    try {
        makeASelection();

    } catch (err:any) {
        console.error('Error connecting to the database:', err.message);
    }   
})();

