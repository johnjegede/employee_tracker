var mysql = require("mysql");
var inquirer = require("inquirer");

var choices = [
  "Add Department",
  "Add Role",
  "Add Employees",
  "View departments",
  "View roles",
  "View employees",
  "Update Employee Role",
];

var deptData = [];
var deptRes;
var roleData = [];
var roleRes;
var managerData = ["none"];
var managerRes;

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Ifeoluwa2.",
  database: "employeeDB",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("connection id is " + connection.threadId);
  makeChoice();
  //connection.end();
});

function makeChoice() {
  inquirer
    .prompt([
      {
        type: "list",
        message: "What would you like to do?",
        choices: choices,
        default: choices[0],
        name: "userChoice",
      },
    ])
    .then(function (response) {
      if (response.userChoice === choices[0]) {
        addDepartment();
      } else if (response.userChoice === choices[1]) {
        addRole();
      } else if (response.userChoice === choices[2]) {
        addEmployee();
      } else if (response.userChoice === choices[3]) {
        viewDepartment();
      } else if (response.userChoice === choices[4]) {
        viewRole();
      } else if (response.userChoice === choices[5]) {
        viewEmployee();
      } else if (response.userChoice === choices[6]) {
        updateEmployee();
      }
    });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the name of the department?",
        name: "name",
      },
    ])
    .then(function (response) {
      var query = connection.query(
        "INSERT INTO department SET ?",
        {
          name: response.name,
        },
        function (err, res) {
          if (err) throw err;
          //console.log(res);
          makeChoice();
        }
      );
      //console.log(query.sql);
    });
}

function getDepartment() {
  deptData = [];
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;

    for (i = 0; i < res.length; i++) {
      deptData.push(res[i].name);
    }
    deptRes = res;
  });
}

function getRole() {
  roleData = [];
  connection.query("SELECT * FROM role", function (err, res) {
    if (err) throw err;

    for (i = 0; i < res.length; i++) {
      roleData.push(res[i].title);
    }
    //console.log(roleData);
    roleRes = res;
  });
}

function getManager() {
  managerData = ["none"];
  connection.query("SELECT id,first_name FROM employee", function (err, res) {
    if (err) throw err;

    for (i = 0; i < res.length; i++) {
      managerData.push(res[i].first_name);
    }
    //console.log(managerData);
    managerRes = res;
  });
}

function addRole() {
  getDepartment();

  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the title of the role?",
        name: "title",
      },
      {
        type: "input",
        message: "What is the salary earn?",
        name: "salary",
      },
      {
        type: "list",
        message: "What is the name of the department?",
        choices: deptData,
        name: "department",
      },
    ])
    .then(function (response) {
      var deptId = deptRes.find(function (resp) {
        return resp.name === response.department;
      });

      connection.query(
        "INSERT INTO role SET ?",
        {
          title: response.title,
          salary: response.salary,
          department_id: deptId.id,
        },
        function (err, res) {
          if (err) throw err;
          makeChoice();
          //connection.end();
        }
      );
    });
}

function addEmployee() {
  getRole();
  getManager();

  inquirer
    .prompt([
      {
        type: "input",
        message: "What is the employee's first name?",
        name: "firstName",
      },
      {
        type: "input",
        message: "What is the employee's last name?",
        name: "lastName",
      },
      {
        type: "list",
        message: "What is the employee's role? ",
        choices: roleData,
        name: "role",
      },
      {
        type: "list",
        message: "What is the employee's manager? ",
        choices: managerData,
        name: "manager",
      },
    ])
    .then(function (response) {
      var roleId = roleRes.find(function (resp) {
        return resp.title === response.role;
      });

      var managerId;
      if (response.manager === "none") {
        managerId = null;
      } else {
        var managerVal = managerRes.find(function (resp) {
          return resp.first_name === response.manager;
        });
        managerId = managerVal.id;
      }

      connection.query(
        "INSERT INTO employee SET ? ",
        {
          first_name: response.firstName,
          last_name: response.lastName,
          role_id: roleId.id,
          manager_id: managerId,
        },
        function (err, res) {
          if (err) throw err;
          makeChoice();
          //connection.end();
        }
      );
    });
}

function viewDepartment() {
  connection.query("SELECT * FROM department", function (err, res) {
    if (err) throw err;
    console.table(res);
    makeChoice();
  });
}

function viewRole() {
  connection.query("SELECT * FROM role ", function (err, res) {
    if (err) throw err;
    console.table(res);
    makeChoice();
    //connection.end();
  });
}

function viewEmployee() {
  connection.query("SELECT * FROM employee", function (err, res) {
    if (err) throw err;
    console.table(res);
    makeChoice();
    //connection.end();
  });
}

function updateEmployee() {
  getRole();
  getManager();
  inquirer
    .prompt([
      {
        type: "list",
        message: "Which employee's role do you want to update?",
        choices: managerData.shift(),
        name: "name"
      },
      {
        type: "list",
        message: "What is the employee's new role?",
        choices:roleData,
        name: "role"
      },
    ])
    .then(function (response) {
      var roleId = roleRes.find(function (resp) {
        return resp.title === response.role;
      });

      connection.query(
        "UPDATE employee SET ? WHERE ?",
        [{ role_id: roleId.id }, { first_name: response.name }],
        function (err, res) {
          if (err) throw err;
          makeChoice();
          //connection.end();
        }
      );
    });
}
