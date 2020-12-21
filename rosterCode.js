require('dotenv').config()

const express = require('express');
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require('console.table');

const app = express();
const PORT = process.env.PORT || 3000;

// cute little thing we learned in one of Pat's mini clinics
const log = (message) => console.log(message)

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
                "View all employees by department",
                "View all employees by role",
                "Add employee",
                "Add department",
                "Add role",
                "Update employee role",
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
    var query = `SELECT employee.first_name, employee.last_name, role_.title, role_.salary, department.name
    FROM companyRoster_db.employee
    INNER JOIN role_ ON employee.role_id=role_.role_id
    INNER JOIN department ON role_.department_id=department.department_id;
    `;
    connection.query(query, function (err, result) {
        if (err) log(err);
        console.log(console.table(result));
        runSearch();
    });
}

function viewDepartment() {
    var query = "SELECT * FROM department";
    connection.query(query, function (err, result) {
        if (err) log(err);
        console.log(console.table(result));
        runSearch();
    });
}

function viewRole() {
    var query = "SELECT * FROM role_";
    connection.query(query, function (err, result) {
        if (err) log(err);
        console.log(console.table(result));
        runSearch();
    });
}

function getRole() {
    var query = "SELECT title FROM role_";
    connection.query(query, function (err, result) {
        if (err) log(err);
        console.log(console.table(result));
        var roleArray = [];
        for (var i = 0; i < result.length; i++) {
            roleArray.push(result[i].item_name);
        }
        return roleArray;
    });
}

// created a new promise to execute!! thank you to askBCS for teaching me about the helpfulness of promises!
function getRole() {
    var query = 'SELECT title FROM role_';
    return new Promise(function (resolve, reject) {
        connection.query(query, function (err, result) {
            if (err) reject(err);
            console.log(console.table(result));
            var roleArray = [];
            for (var i = 0; i < result.length; i++) {
                roleArray.push(result[i].title);
            }
            resolve(roleArray);
        });
    });
}

function addEmployee() {
    getRole().then(function (roleArray) {
        console.log(roleArray)
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
                {
                    name: "employeeRole",
                    type: "rawlist",
                    // iterate through entire role table and generate a list of choices based on what's in there
                    choices: roleArray,
                    message: "What is the new employee's role?"
                },
            ])
            .then(function (answer) {
                // when finished prompting, insert a new item into the db with that info
                connection.query(
                    "INSERT INTO employee SET ?", {
                        first_name: answer.firstName,
                        last_name: answer.lastName,
                        role_id: answer.role_
                    },
                    function (err, result) {
                        if (err) throw err;
                        console.log("Your employee was created successfully!");
                        viewEmployees()
                        console.log(console.table(result));
                        runSearch();
                    }
                );
            });
    })
}
// build department, then role
function addDepartment() {
    inquirer
        .prompt([{
                name: "departmentName",
                type: "input",
                message: "What is the new department's name?"
            },
            {
                name: "departmentID",
                type: "input",
                message: "What is the new department's ID number?"
            }
        ])
        .then(function (answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO department SET ?", {
                    name: answer.departmentName,
                    department_id: answer.departmentID
                },
                function (err, result) {
                    if (err) throw err;
                    console.log("Your department was created successfully!");
                    viewDepartment();
                    console.log(console.table(result));
                    runSearch();
                }
            );
        });
}

// created a new promise to execute!! thank you to askBCS for teaching me about the helpfulness of promises!
function getDepartment() {
    var query = 'SELECT name FROM department';
    return new Promise(function (resolve, reject) {
        connection.query(query, function (err, result) {
            if (err) reject(err);
            console.log(console.table(result));
            var deptArray = [];
            for (var i = 0; i < result.length; i++) {
                deptArray.push(result[i].name);
            }
            resolve(deptArray);
        });
    });
}

function addRole() {
    getDepartment().then(function (deptArray) {
        console.log(deptArray)
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
                {
                    name: "roleDepartment",
                    type: "rawlist",
                    // iterate through entire role table and generate a list of choices based on what's in there
                    choices: deptArray,
                    message: "What is the new role's department?"
                },
            ])
            .then(function (answer) {
                // when finished prompting, insert a new item into the db with that info
                connection.query(
                    "INSERT INTO role_ SET ?", {
                        title: answer.roleTitle,
                        salary: answer.roleSalary
                    },
                    function (err, result) {
                        if (err) throw err;
                        console.log("Your role was created successfully!");
                        viewRole();
                        console.log(console.table(result));
                        runSearch();
                    }
                );
            });
    });
}

function getEmployees() {
    var query = 'SELECT first_name FROM employee';
    return new Promise(function (resolve, reject) {
        connection.query(query, function (err, result) {
            if (err) reject(err);
            console.log(console.table(result));
            var empArray = [];
            for (var i = 0; i < result.length; i++) {
                empArray.push(result[i].first_name);
            }
            resolve(empArray);
        });
    });
}

function updateEmployeeRole() {
    getEmployees().then(function (empArray) {
                console.log(empArray)
                connection.query("SELECT * FROM employee", function (err, results) {
                    if (err) throw err;
                    inquirer
                        .prompt([{
                                name: "updateEmployeeRole",
                                type: "rawlist",
                                // iterate through entire employee table and generate a list of choices based on what's in there
                                // use add employee as reference
                                // i could create another function to create that array
                                // ex var roles=getRoleTitle()
                                choices: empArray,
                                message: "Which employee's role would you like to update?"
                            },
                            {
                                name: "newRole",
                                type: "input",
                                message: "What would you like their new role to be?"
                            },
                        ])
                        .then(function (answer) {
                                connection.query(
                                    "UPDATE role_ SET ?", [{
                                        title: answer.newRole
                                    }],
                                    function (err) {
                                        if (err) throw err;
                                        console.log("Employee updated successfully!");
                                        runSearch();
                                    })
                                })
                        })
                })
            }