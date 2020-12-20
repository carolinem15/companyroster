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

// for all of the view functions, why does it return the table and then "undefined"?

function viewEmployees() {
    var query = "SELECT * FROM employee";
    connection.query(query, function (err, result) {
        if (err) log(err);
        console.log(console.table(result));
        runSearch();
    });
}

// might need to do an outer join for all tables
// hmm but do they want us to do an inner join for the department and role tables?

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
                // iterate through entire role table and generate a list of choices based on what's in there
                choices: function () {
                    var roleArray = [];
                    for (var i = 0; i < results.length; i++) {
                        roleArray.push(results[i].item_name);
                    }
                    return roleArray;
                },
                message: "What is the new employee's role?"
            },
        ])
        .then(function (answer) {
            // when finished prompting, insert a new item into the db with that info
            connection.query(
                "INSERT INTO employee SET ?", {
                    first_name: answer.firstName,
                    last_name: answer.lastName,
                    // do I need to create some reference to unique role ids here after the new employee has been assigned
                    // a role from the rawlist? OR, do I execute some sort of inner JOIN of tables based on the answer?
                    // role_: answer.employeeRole
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
}
// build department, then role
function addDepartment() {
    inquirer
        .prompt([{
            name: "departmentName",
            type: "input",
            message: "What is the new department's name?"
        }, ])
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
                    viewDepartment();
                    console.log(console.table(result));
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
            // do a query before, get all the departments, and build choices as an array (where every object has a key (department) and a value(id))
            {
                name: "roleDepartment",
                type: "rawlist",
                // iterate through entire role table and generate a list of choices based on what's in there
                choices: function () {
                    var deptArray = [];
                    for (var i = 0; i < results.length; i++) {
                        deptArray.push(results[i].item_name);
                    }
                    return deptArray;
                },
                message: "What is the new role's department?"
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
                    viewRole();
                    console.log(console.table(result));
                    runSearch();
                }
            );
        });
}

// function updateEmployeeRole(answer) {
//   connection.query("SELECT * FROM employees", function(err, results) {
//     if (err) throw err;
//     inquirer
//       .prompt([
//         {
//           name: "updateEmployeeRole",
//           type: "rawlist",
//           // iterate through entire employee table and generate a list of choices based on what's in there
//           choices: function() {
//             var employeeArray = [];
//             for (var i = 0; i < results.length; i++) {
//               employeeArray.push(results[i].item_name);
//             }
//             return employeeArray;
//             },
//             message: "Which employee's role would you like to update?"
//         },
//         // do I need to run a delete/update query here (or after the inquirer prompts)?
//         {
//             name: "newRole",
//             type: "rawlist",
//             choices: function() {
//             // iterate through entire role table and generate a list of choices based on what's in there
//             // should I name this choiceArray something different?
//                 var roleArray = [];
//                 for (var i = 0; i < results.length; i++) {
//                   roleArray.push(results[i].item_name);
//                 }
//                 return roleArray;
//             },
//             message: "What would you like their new role to be?"
//         },
//     ])
//     .then (function(answer) {
//         // this gets the information of the chosen items (???)
//         var chosenItem;
//         for (var i = 0; i < results.length; i++) {
//           if (results[i].item_name === answer.choice) {
//             chosenItem = results[i];
//           }
//         connection.query(
//             "UPDATE auctions SET ? WHERE ?", [
//                 {
//                     id: chosenItem.id
//                 }
//             ],
//             function(error) {
//               if (error) throw err;
//               console.log("Employee updated successfully!");
//               runSearch();
//             }
//         }

//     }
// })
// }