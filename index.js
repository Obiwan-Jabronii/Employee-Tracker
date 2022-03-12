const inquirer = require('inquirer');
const db = require('./db/connection');

const Department = require('./lib/Department');
const Role = require('./lib/Role');
const Employee = require('./lib/Employee');

let department = new Department(db);
let role = new Role(db);
let employee = new Employee(db);

const mainMenu = () => {
  inquirer.prompt(
    {
      type: 'list',
      name: 'menuChoice',
      message: 'What would you like to do?',
      choices: [
        'VIEW Department budgets',
        'VIEW all Departments',
        'VIEW all Roles',
        'VIEW all Employees',
        'CREATE Department',
        'CREATE Role',
        'CREATE Employee',
        'DELETE Department',
        'DELETE Role',
        'DELETE Employee']
    }
  )
  .then(({ menuChoice }) => {
    switch (menuChoice) {
      case 'VIEW all Departments':
        department.showAllDepts();
        mainMenu();
        break;
      case 'VIEW Department budgets':
        department.showBudgets();
        mainMenu();
        break;
      case 'VIEW all Roles':
        role.showAllRoles();
        mainMenu();
        break;
      case 'VIEW all Employees':
        employee.showAllEmployees();
        mainMenu();
        break;
      case 'CREATE Department':
        newDept();
        break;
      case 'CREATE Role':
        newRole();
        break;
      case 'CREATE Employee':
        newEmployee();
        break;
      case 'DELETE Department':
        removeDept();
        break;
      case 'DELETE Role':
        removeRole();
        break;
      case 'DELETE Employee':
        removeEmployee();
        break;
    };
  });
};

const newEmployee = () => {
  let roles = [];
  let managers = [];
  let roleTitles = [];
  let managerNames = [];


  db.promise().query(`SELECT * FROM roles`)
  .then(([roleRes]) => {
    if (!roleRes) {
      console.log('There are no roles yet! Please add roles before adding an employee.');
      mainMenu();
    };
    for (let i = 0; i < roleRes.length; i++) {
      roles.push(roleRes[i]);
      roleTitles.push(roleRes[i].title);
    };
  });

  db.promise().query(`SELECT * FROM employees WHERE role_id = 1`)
  .then(([manRes]) => {
    if (!manRes) {
      console.log(`There are no managers yet! If you want to assign a manager to this employee, you'll have to create some managers first, then update this employee's manager.`);
    };
    for (let i = 0; i < manRes.length; i++) {
      if (manRes[i].first_name) {
        managers.push(manRes[i]);
        managerNames.push(manRes[i].first_name + ' ' + manRes[i].last_name);
      };
    };
  })
  .then(() => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'firstName',
        message: `What is this Employee's first name?`,
        validate: firstNameInput => {
          if (firstNameInput) {
            return true;
          } else {
            console.log(`First name is required!`);
            return false;
          }
        }
      },
      {
        type: 'input',
        name: 'lastName',
        message: `What is this Employee's last name?`,
        validate: last_nameInput => {
          if (last_nameInput) {
            return true;
          } else {
            console.log(`Last name is required!`);
            return false;
          }
        }
      },
      {
        type: 'list',
        name: 'employeeRole',
        message: `What is this Employee's role?`,
        choices: roleTitles
      },
      {
        type: 'list',
        name: 'employeeManager',
        message: "Who is this Employee's manager?",
        choices: managerNames
      }
    ])
    .then(({firstName, lastName, employeeRole, employeeManager}) => {
      
      let role_id;
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].title === employeeRole) {
          role_id = roles[i].id;
        };
      };
      let manager_id;
      for (let i = 0; i < managers.length; i++) {
        if (managers[i].first_name + ' ' + managers[i].last_name === employeeManager) {
          manager_id = managers[i].id;
        };
      };
      employee.createEmployee(firstName, lastName, role_id, manager_id);
      mainMenu();
    });
  });
};

const newRole = () => {
  let departmentIds = [];
  let departmentNames = [];

  db.promise().query(`SELECT * FROM departments`)
  .then(([deptRes]) => {
    if (!deptRes) {
      console.log(`There are no departments in the database yet!`);
      return;
    }
    for (let i = 0; i < deptRes.length; i++) {
      departmentIds.push(deptRes[i].id);
      departmentNames.push(deptRes[i].name);
    };
  })
  .then(() => {
    inquirer.prompt([
      {
        type: 'input',
        name: 'title',
        message: `What is this Role's title?`,
        validate: titleInput => {
          if (titleInput) {
            return true;
          } else {
            console.log(`The Role's title is required!`);
            return false;
          }
        }
      },
      {
        type: 'list',
        name: 'roleDept',
        message: `What department is this Role in?`,
        choices: departmentNames
      },
      {
        type: 'number',
        name: 'salary',
        message: 'What is the annual salary for this Role?',
        validate: salaryInput => {
          if (salaryInput) {
            return true;
          } else {
            console.log('You must give every role a salary and commas are not accepted');
            return false;
          }
        }
      }
    ])
    .then(({title, roleDept, salary}) => {

      let department_id;
      for (let i = 0; i < departmentNames.length; i++) {
        if (departmentNames[i] === roleDept) {
          department_id = departmentIds[i];
        };
      };
      role.createRole(title, salary, department_id);
      mainMenu();
    });
  });
};

const newDept = () => {
  inquirer.prompt({
    type: 'input',
    name: 'deptName',
    message: 'What is the name of this Department?',
    validate: deptNameInput => {
      if (deptNameInput) {
        return true;
      } else {
        console.log(`The Department's name is required!`);
        return false;
      }
    }
  })
  .then(({deptName}) => {
    department.createDept(deptName);
    mainMenu();
  });
};

const removeEmployee = () => {
  let employees = [];
  let employeeNames = [];

  db.promise().query('SELECT * FROM employees')
  .then(([rows]) => {
    if (!rows) {
      console.log(`There are no employees in the database yet!`);
      mainMenu();
    }
    for (let i = 0; i < rows.length; i++) {
      employees.push(rows[i]);
      employeeNames.push(rows[i].first_name + ' ' + rows[i].last_name);
    }
  })
  .then(() => {
    inquirer.prompt([
      {
        type: 'list',
        name: 'employeeName',
        message: 'Which Employee would you like to DELETE?',
        choices: employeeNames
      }
    ])
    .then(({employeeName}) => {
      for (let i = 0; i < employees.length; i++) {
        if (employeeNames[i] === employeeName) {
          employee.deleteEmployee(employeeName, employees[i].id);
        };
      };
      mainMenu();
    });
  });
};

const removeRole = () => {
  let roles = [];
  let roleTitles = [];

  db.promise().query(`SELECT * FROM roles`)
  .then(([rows]) => {
    if (!rows) {
      console.log(`There are no roles in the database!`);
      return mainMenu();
    };
    for (let i = 0; i < rows.length; i++) {
      roles.push(rows[i]);
      roleTitles.push(rows[i].title);
    };
  })
  .then(() => {
    inquirer.prompt([
      {
        type: 'list',
        name: 'roleTitle',
        message: 'Which Role would you like to DELETE?',
        choices: roleTitles
      }
    ])
    .then(({roleTitle}) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].title === roleTitle) {
          let role_id;
          role_id = roles[i].id;
          role.deleteRole(roleTitle, role_id);
        };
      };
      mainMenu();
    });
  })
};

const removeDept = () => {
  let departments = [];

  db.promise().query('SELECT * FROM departments')
  .then(([rows]) => {
    if (!rows) {
      console.log(`There are no departments in the database yet!`);
    }
    for (let i = 0; i < rows.length; i++) {
      if (rows[i].name) {
        departments.push(rows[i]);
      }
    }
  })
  .then(() => {
    inquirer.prompt([
      {
        type: 'list',
        name: 'deptName',
        message: 'Which Department would you like to DELETE?',
        choices: departments
      }
    ])
    .then(({deptName}) => {
      for (let i = 0; i < departments.length; i++) {
        if (departments[i].name === deptName) {
          department.deleteDept(deptName, departments[i].id);
        };
      };
      mainMenu();
    });
  });
};

mainMenu();