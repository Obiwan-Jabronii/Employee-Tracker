class Department {
    constructor(db, id = 0, name = '') {
        this.db = db;
        this.id = id;
        this.name = name;
    }

    showDepts() {
        this.db.promise().query(``)
        .then(([rows]) => {
            if(!rows) {
                console.log(`There are no departments available in the database.`);
                return;
            };
            console.table(rows)
        })
    }

    showBudgets() {
        const sql = `SELECT departments.name AS "department",
                    SUM(salary) AS "budget"
                    FROM departments
                    LEFT JOIN roles
                    ON departments.id = roles.department_id
                    GROUP BY department_id`;
        
        this.db.promise().query(sql)
        .then(([rows]) => {
          if (!rows) {
            console.log(`There are no departments in the database yet!`);
            return;
          }
          console.log('\n');
          console.table(rows);
        });
      };
    
      createDept(deptName) {
        this.db.promise().query(`INSERT INTO departments (name) VALUES (?)`, deptName)
        .then((err) => {
          if (err) {
            console.log(err.message);
            return;
          }
          console.log(`${deptName} department CREATED successfully`);
        });
      };
      
      deleteDept(deptName, id) {
        this.db.promise().query(`DELETE FROM departments WHERE id = ?`, id)
        .then((err) => {
          if (err) {
            console.log(err.message);
            return;
          }
          console.log(`${deptName} department DELETED from database`);
        });
      };
}

module.exports = Department;