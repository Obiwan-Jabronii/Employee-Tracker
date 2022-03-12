INSERT INTO departments (name)
VALUES
('development'), 
('design'), 
('customer_service'); 

INSERT INTO roles (title, salary, department_id)
VALUES
('manager', 100000, NULL), 
('junior_developer', 60000, 1), 
('senior_developer', 90000, 1), 
('team_lead', 100000, 2), 
('customer_service_rep', 60000, 3), 

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
('Mitch', 'Lough', 1, NULL), 
('Sana', 'Kae', 3, 1), 
('Rowan', 'Lough', 2, 1), 
('Abbey', 'Mashue', 4, 1),
('Devon', 'James', 5, 1),
