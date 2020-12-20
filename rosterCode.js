require('dotenv').config()

const express = require('express');
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

const app = express();
// needs to be different port than the port that MySQL is running on, right?
const PORT = process.env.PORT || 3000;

// cute little thing we learned in one of Pat's mini clinics
const log = (message) => console.log(message)

// app.get('/', (req, res) => res.send('Hello UNCC Bootcamp'))

app.listen(PORT, () => {
    log('This server is up and running!')
})

const connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    // I tried to change it. make sure that worked
    //   password: process.env.PASSWORD,
    password: 'root',
    database: "companyRoster_db"
});

connection.connect(function (err) {
    if (err) throw err;
    log(`Connection thread is ${connection.threadId}`)
    runSearch();
});

function runSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "View all employees",
                "View all employees by departments",
                "View all employees by role",
                // BONUS "View all employees by manager",
                "Add employee",
                "Add department",
                "Add role",
                // BONUS "Remove employee",
                // BONUS "Remove department",
                // BONUS "Remove role",
                "Update employee role",
                //  BONUS "Update employee manager",
                // BONUS "View total utilized budget of a department"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "View all employees":
                    viewEmployees();
                    break;

                case "View all employees by department":
                    viewDepartment();
                    break;

                case "View all employees by role":
                    viewRole();
                    break;

                    // BONUS case "View all employees by manager":
                    //   rangeSearch();
                    //   break;

                case "Add employee":
                    addEmployee();
                    break;

                case "Add department":
                    addDepartment();
                    break;

                case "Add role":
                    addRole();
                    break;

                case "Update employee role":
                    updateEmployeeRole();
                    break;
            }
        });
}

function viewEmployees() {
    var query = "SELECT * FROM employee";
    // what does { employee: answer.employee } do?
    connection.query(query, function (err, result) {
        if (err) log(err);
        console.log(console.table(result));
        runSearch();
    });
}

// might need to do an outer join for all tables
// WAIT refer to activity 8 to view employees for each department
// hmm but do they want us to do an inner join for the department and role tables? the only column they have in common is 
// department id

function viewDepartment() {
    var query = "SELECT * FROM department";
    connection.query(query, function (err, result) {
        if (err) log(err);
        console.log(console.table(result));
        runSearch();
    });
}

// same stuff as viewDepartment

function viewRole() {
    var query = "SELECT * FROM role_";
    connection.query(query, function (err, result) {
        if (err) log(err);
        console.log(console.table(result));
        runSearch();
    });
}

// this is not actually how I would need to code it for the assignment. Ill need inquirer prompts asking the employee's
// first name, last name, and maybe role? then figure out how to insert that into my query
function addEmployee() {
    inquirer
        .prompt([{
                name: "firstName",
                type: "input",
                message: "What is the new employee's first name?"
            },
            {
                name: "lastName",
                type: "input",
                message: "What is the new employee's last name?"
            },
            // do I need to ask their role? probably
            {
                name: "employeeRole",
                type: "rawlist",
                message: "What is the new employee's role?",
                choices: [
                    "Sales Lead",
                    "Salesperson",
                    "Lead Engineer",
                    "Software Engineer",
                    "Accountant",
                    "Legal Team Lead",
                    "Lawyer"
                ]
            },
        ])
        .then(function (answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO employees SET ?", {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    // do I need to create some reference to unique role ids here after the new employee has been assigned
                    // a role from the rawlist? OR, do I execute some sort of inner JOIN of tables based on the answer?
                    role_id: answer.employeeRole
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your employee was created successfully!");
                    runSearch();
                }
            );
        });
}

function addDepartment() {
    inquirer
        .prompt([{
                name: "departmentName",
                type: "input",
                message: "What is the new department's name?"
            },
        ])
        .then(function (answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO department SET ?", {
                    name: answer.departmentName,
                    // then I THINK it just assigns the department a unique id automatically
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your department was created successfully!");
                    runSearch();
                }
            );
        });
}

function addRole() {
    inquirer
        .prompt([{
                name: "roleTitle",
                type: "input",
                message: "What is the new role's title?"
            },
            {
                name: "roleSalary",
                type: "number",
                message: "What is the new role's salary?"
            },
            // do I need to ask their role? probably
            {
                name: "roleDepartment",
                type: "rawlist",
                message: "What is the new role's department?",
                choices: [
                    "Sales",
                    "Legal",
                    "Engineering",
                    "Finance"
                ]
            },
        ])
        .then(function (answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO role_ SET ?", {
                    title: answer.roleTitle,
                    salary: answer.roleSalary,
                    // do I need to create some reference to unique role ids here after the new employee has been assigned
                    // a role from the rawlist? OR, do I execute some sort of inner JOIN of tables based on the answer?
                    department_id: answer.roleDepartment
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your role was created successfully!");
                    runSearch();
                }
            );
        });
}

function updateEmployeeRole(answer) {
  connection.query("SELECT * FROM employees", function(err, results) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "updateEmployeeRole",
          type: "rawlist",
          // iterate through entire employee table and generate a list of choices based on what's in there
          choices: function() {
            var employeeArray = [];
            for (var i = 0; i < results.length; i++) {
              employeeArray.push(results[i].item_name);
            }
            return employeeArray;
            },
            message: "Which employee's role would you like to update?"
        },
        // do I need to run a delete/update query here (or after the inquirer prompts)?
        {
            name: "newRole",
            type: "rawlist",
            choices: function() {
            // iterate through entire role table and generate a list of choices based on what's in there
            // should I name this choiceArray something different?
                var roleArray = [];
                for (var i = 0; i < results.length; i++) {
                  roleArray.push(results[i].item_name);
                }
                return roleArray;
            },
            message: "What would you like their new role to be?"
        },
    ])
    .then (function(answer) {
        var chosenItem;
        for (var i = 0; i < results.length; i++) {
          if (results[i].item_name === answer.choice) {
            chosenItem = results[i];
          }
        }

    }
})
}