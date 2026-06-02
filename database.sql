-- Gunakan database
USE rbac_db;

-- Tabel roles
CREATE TABLE IF NOT EXISTS roles (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel permissions
CREATE TABLE IF NOT EXISTS permissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) UNIQUE NOT NULL,
  resource VARCHAR(50),
  action VARCHAR(20)
);

-- Tabel users
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role_id INT,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
);

-- Tabel role_permissions
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id INT,
  permission_id INT,
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
);

-- Seed data roles
INSERT IGNORE INTO roles (name) VALUES ('admin'), ('editor'), ('viewer');

-- Seed data permissions
INSERT IGNORE INTO permissions (name, resource, action) VALUES
('user:view',   'users', 'view'),
('user:create', 'users', 'create'),
('user:edit',   'users', 'edit'),
('user:delete', 'users', 'delete'),
('role:view',   'roles', 'view'),
('perm:view',   'permissions', 'view');

-- Assign permissions ke roles
-- admin: semua akses
INSERT IGNORE INTO role_permissions VALUES (1,1),(1,2),(1,3),(1,4),(1,5),(1,6);
-- editor: view & create user
INSERT IGNORE INTO role_permissions VALUES (2,1),(2,2),(2,5),(2,6);
-- viewer: hanya view
INSERT IGNORE INTO role_permissions VALUES (3,1),(3,5),(3,6);

-- Buat user admin awal (password: admin123)
INSERT IGNORE INTO users (username, password, role_id)
VALUES ('admin', '$2b$10$YourHashedPasswordHere', 1);
