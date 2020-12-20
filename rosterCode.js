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

app.listen(PORT, () =>{
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
  password: "root",
  database: "companyRoster_db"
});

connection.connect(function(err) {
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
      .then(function(answer) {
        switch (answer.action) {
        case "View all employees":
          viewEmployees();
          break;
  
        case "View all employees by department":
          viewEmployeeDept();
          break;

        case "View all employees by role":
            viewEmployeeRole();
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
    connection.query(query, function(err, result) {
        if (err) log(err);
        console.log(console.table(result));
        runSearch();
        });
  }

//   function viewEmployeeDept() {
//     inquirer
//     .prompt({
//       name: "employeeDept",
//       type: "input",
//       message: "What department would you like to search for?"
//     })
//     .then(function(answer) {
//       var query = "SELECT id, name FROM department WHERE ?";
//       connection.query(query, { employeeDept: answer.employeeDept }, function(err, res) {
//         for (var i = 0; i < res.length; i++) {
//         // how do i include code for role id and manager id? see README
//           console.log("id: " + res[i].id + " || name: " + res[i].name);
//         }
//         runSearch();
//       });
//     });
//   }

//   function viewEmployeeRole() {
//     inquirer
//     .prompt({
//       name: "employeeRole",
//       type: "input",
//       message: "What roles would you like to search for?"
//     })
//     .then(function(answer) {
//       var query = "SELECT id, title, salary FROM role_ WHERE ?";
//       connection.query(query, { employeeRole: answer.employeeRole }, function(err, res) {
//         for (var i = 0; i < res.length; i++) {
//             // how do i include code for department id? see README
//           console.log("id: " + res[i].id + " || title: " + res[i].title + " || salary: " + res[i].salary);
//         }
//         runSearch();
//       });
//     });
//   }
  
// //  THIS FUNCTION NEEDS TO BE AN ADD 
function addEmployee() {
    inquirer
      .prompt({
        name: "firstName",
        type: "input",
        message: "What is the employee's first name?"
      },
      {
        name: "lastName",
        type: "input",
        message: "What is the employee's last name?"
      },
      {
        name: "role",
        type: "input",
        message: "What is the employee's role?"
      },
      )
      .then(function(answer) {
        console.log(answer.song);
        connection.query("SELECT * FROM WHERE ", function(err, res) {
          console.log(console.table());
          runSearch();
        });
      });
  }

//   //  THIS FUNCTION NEEDS TO BE AN ADD 
// function addDepartment() {
//     inquirer
//       .prompt({
//         name: "song",
//         type: "input",
//         message: "What song would you like to look for?"
//       })
//       .then(function(answer) {
//         console.log(answer.song);
//         connection.query("SELECT * FROM top5000 WHERE ?", { song: answer.song }, function(err, res) {
//           console.log(
//             "Position: " +
//               res[0].position +
//               " || Song: " +
//               res[0].song +
//               " || Artist: " +
//               res[0].artist +
//               " || Year: " +
//               res[0].year
//           );
//           runSearch();
//         });
//       });
//   }

//   //  THIS FUNCTION NEEDS TO BE AN ADD 
// function addRole() {
//     inquirer
//       .prompt({
//         name: "song",
//         type: "input",
//         message: "What song would you like to look for?"
//       })
//       .then(function(answer) {
//         console.log(answer.song);
//         connection.query("SELECT * FROM top5000 WHERE ?", { song: answer.song }, function(err, res) {
//           console.log(
//             "Position: " +
//               res[0].position +
//               " || Song: " +
//               res[0].song +
//               " || Artist: " +
//               res[0].artist +
//               " || Year: " +
//               res[0].year
//           );
//           runSearch();
//         });
//       });
//   }
  
//   function updateEmployeeRole() {
//     inquirer
//       .prompt({
//         name: "artist",
//         type: "input",
//         message: "What artist would you like to search for?"
//       })
//       .then(function(answer) {
//         var query = "SELECT top_albums.year, top_albums.album, top_albums.position, top5000.song, top5000.artist ";
//         query += "FROM top_albums INNER JOIN top5000 ON (top_albums.artist = top5000.artist AND top_albums.year ";
//         query += "= top5000.year) WHERE (top_albums.artist = ? AND top5000.artist = ?) ORDER BY top_albums.year, top_albums.position";
  
//         connection.query(query, [answer.artist, answer.artist], function(err, res) {
//           console.log(res.length + " matches found!");
//           for (var i = 0; i < res.length; i++) {
//             console.log(
//               i+1 + ".) " +
//                 "Year: " +
//                 res[i].year +
//                 " Album Position: " +
//                 res[i].position +
//                 " || Artist: " +
//                 res[i].artist +
//                 " || Song: " +
//                 res[i].song +
//                 " || Album: " +
//                 res[i].album
//             );
//           }
  
//           runSearch();
//         });
//       });
//   }

// //   function rangeSearch() {
// //     inquirer
// //       .prompt([
// //         {
// //           name: "start",
// //           type: "input",
// //           message: "Enter starting position: ",
// //           validate: function(value) {
// //             if (isNaN(value) === false) {
// //               return true;
// //             }
// //             return false;
// //           }
// //         },
// //         {
// //           name: "end",
// //           type: "input",
// //           message: "Enter ending position: ",
// //           validate: function(value) {
// //             if (isNaN(value) === false) {
// //               return true;
// //             }
// //             return false;
// //           }
// //         }
// //       ])
// //       .then(function(answer) {
// //         var query = "SELECT position,song,artist,year FROM top5000 WHERE position BETWEEN ? AND ?";
// //         connection.query(query, [answer.start, answer.end], function(err, res) {
// //           for (var i = 0; i < res.length; i++) {
// //             console.log(
// //               "Position: " +
// //                 res[i].position +
// //                 " || Song: " +
// //                 res[i].song +
// //                 " || Artist: " +
// //                 res[i].artist +
// //                 " || Year: " +
// //                 res[i].year
// //             );
// //           }
// //           runSearch();
// //         });
// //       });
// //   }
  


// // var query = "SELECT artist FROM top5000 GROUP BY artist HAVING count(*) > 1";
// //     connection.query(query, function(err, res) {
// //       for (var i = 0; i < res.length; i++) {
// //         console.log(res[i].artist);
// //       }
// //       runSearch();
// //     });