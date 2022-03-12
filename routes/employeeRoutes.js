const express = require('express');
const router = express.Router();
const db = require('../db/connection');

router.get('/employees', (req, res) => {
  const sql = `SELECT * FROM employees`;
  
  db.query(sql, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: rows
    });
  });
});

router.post('/employees', ({ body }, res) => {

  const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id)
              VALUES (?, ?, ?, ?)`;
  const params = [body.first_name, body.last_name, body.role_id, body.manager_id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'Employee CREATED successfully',
      data: body
    });
  });
});

router.delete('/employees/:id', (req, res) => {

  const sql = `DELETE FROM employees WHERE id = ?`;
  const params = [req.params.id];

  db.query(sql, params, (err, result) => {
    if (err) {
      res.statusMessage(400).json({ error: res.message });
    } else if (!result.affectedRows) {
      res.json({
        message: 'Employee not found'
      });
    } else {
      res.json({
        message: 'Employee DELETED successfully',
        changes: result.affectedRows,
        id: req.params.id
      });
    }
  });
});

module.exports = router;