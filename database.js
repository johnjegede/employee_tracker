var mysql = require("mysql");
var inquirer = require("inquirer");

var choices= ["Add Department","Add Role","Add Employess","View departments","View roles","View employess", "Update Employee Role"];

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password:"Ifeoluwa2.",
    database:"employeeDB"
});

connection.connect(function(err){
    if(err) throw err;
    console.log("connection id is " + connection.threadId);
    makeChoice();
    //connection.end();
});

function makeChoice(){
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do",
            choices: choices,
            default: choices[0],
            name:"userChoice"

        }
    ]).then(function(response){

        if(response.userChoice === choices[0])
        {
            addDepartment();
        }else if(response.userChoice === choices[1])
        {
            addRole();
        }else if(response.userChoice === choices[2])
        {
            addEmployee();
        }else if(response.userChoice === choices[3])
        {
            viewDepartment();
        }else if(response.userChoice === choices[4])
        {
            viewRole();
        }else if(response.userChoice === choices[5])
        {
            viewEmployee();
        }else if(response.userChoice === choices[6])
        {
            updateEmployee();
        }

    });
}

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the department",
            name:"name"
        }
    ]).then(function(response){
        var query = connection.query(
            "INSERT INTO department SET ?",
            {
              name: response.name,
            },
          function(err, res) {
            if (err) throw err;
            //console.log(res);
            makeChoice()
          });
          //console.log(query.sql);

    });
}

function addRole() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the title of the role",
            name:"title"
        },
        {
            type: "input",
            message: "What is the salary earn",
            name:"salary"
        },
        {
            type: "input",
            message: "What is the name of the department",
            name:"department"
        }
    ]).then(function(response){
        connection.query("INSERT INTO role SET ?",
         {
             title:response.title,
             salary:response.salary,
             department_id:response.department
         },
          function(err, res) {
            if (err) throw err;
            makeChoice()
            //connection.end();
          });

    });
}

function addEmployee() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the employee's first name",
            name:"firstName"
        },
        {
            type: "input",
            message: "What is the employee's last name ",
            name:"lastName"
        },
        {
            type: "input",
            message: "What is the employee's role ",
            name:"role"
        },
        {
            type: "input",
            message: "What is the employee's manager ",
            name:"manager"
        }
    ]).then(function(response){
        connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ?",
         {
            first_name:response.firstName,
            last_name:response.lastName,
            role_id:response.role,
            manager_id:response.manager
        },
         function(err, res) {
            if (err) throw err;
            makeChoice()
            //connection.end();
          });

    });
}

function viewDepartment() {
    connection.query("SELECT * FROM department", function(err, res) {
      if (err) throw err;
      console.table(res);
      makeChoice()
    });
}

function viewRole() {
    connection.query("SELECT * FROM role ", function(err, res) {
      if (err) throw err;
      console.table(res);
      makeChoice()
      //connection.end();
    });
}

function viewEmployee() {
    connection.query("SELECT * FROM employee", function(err, res) {
      if (err) throw err;
      console.table(res);
      makeChoice()
      //connection.end();
    });
}

function updateEmployee() {
    inquirer.prompt([
        {
            type: "input",
            message: "Which employee's role do you want to update",
            name:"name"
        },
        {
            type: "input",
            message: "What is the employee's new role",
            name:"role"
        }
    ]).then(function(res){
        connection.query("UPDATE employee SET ? WHERE ?",
        [
            {role_id:res.role},
            {first_name:res.name}
        ],
         function(err, res) {
          if (err) throw err;
          makeChoice()
          //connection.end();
        });

    });
   
}