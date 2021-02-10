var mysql = require("mysql");
var inquirer = require("inquirer");

var choices= ["Add Department","Add Role","Add Employess","View departments","View roles","View employess", "Update Employee Role"];

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password:"Ifeoluwa2.",
    database:"employeeDB"
})

connection.connect(function(err){
    if(err) throw err;
    console.log("connection id is " + connection.threadId);
    makeChoice();
    //connection.end();
});

function makeChoice(){
    inquirer.prompt([
        {
            input: "list",
            message: "What would you like to do",
            choices: choices,
            default: choices[0],
            name:"userChoice"

        }
    ]).then(function(res){

        if(res.userChoice === choices[0])
        {
            addDepartment();
        }else if(res.userChoice === choices[1])
        {
            addRole();
        }else if(res.userChoice === choices[2])
        {
            addEmployee();
        }else if(res.userChoice === choices[3])
        {
            viewDepartment();
        }else if(res.userChoice === choices[4])
        {
            viewRole();
        }else if(res.userChoice === choices[5])
        {
            viewEmployee();
        }else if(res.userChoice === choices[6])
        {
            updateEmployee();
        }

    });
}

// function addDepartment() {
//     connection.query("SELECT * FROM products", function(err, res) {
//       if (err) throw err;
//       console.log(res);
//       connection.end();
//     });
//   }