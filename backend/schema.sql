-- PostgreSQL Schema for Employee Performance Appraisal System

-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'employee',
  department VARCHAR(100),
  position VARCHAR(100),
  avatar Text,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Appraisal periods table
CREATE TABLE appraisal_periods (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20) CHECK (status IN ('upcoming', 'active', 'completed')) NOT NULL DEFAULT 'upcoming',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Appraisals table
CREATE TABLE appraisals (
  id SERIAL PRIMARY KEY,
  employee_id INT NOT NULL,
  supervisor_id INT,
  period_id INT NOT NULL,
  status VARCHAR(30) CHECK (status IN ('not_started', 'self_assessment', 'supervisor_review', 'completed')) NOT NULL DEFAULT 'not_started',
  overall_rating DECIMAL(3,2),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (supervisor_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (period_id) REFERENCES appraisal_periods(id) ON DELETE CASCADE
);

-- Performance criteria table
CREATE TABLE performance_criteria (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Performance ratings table
CREATE TABLE performance_ratings (
  id SERIAL PRIMARY KEY,
  appraisal_id INT NOT NULL,
  criteria_id INT NOT NULL,
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comments TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (appraisal_id) REFERENCES appraisals(id) ON DELETE CASCADE,
  FOREIGN KEY (criteria_id) REFERENCES performance_criteria(id) ON DELETE CASCADE,
  UNIQUE (appraisal_id, criteria_id)
);

-- Goals table
CREATE TABLE goals (
  id SERIAL PRIMARY KEY,
  employee_id INT NOT NULL,
  appraisal_id INT,
  description TEXT NOT NULL,
  target_date DATE,
  measures TEXT,
  status VARCHAR(20) CHECK (status IN ('not_started', 'in_progress', 'completed')) NOT NULL DEFAULT 'not_started',
  progress INT DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (appraisal_id) REFERENCES appraisals(id) ON DELETE SET NULL
);

-- Comments table
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  appraisal_id INT NOT NULL,
  user_id INT NOT NULL,
  comment_type VARCHAR(20) CHECK (comment_type IN ('employee', 'supervisor', 'development_plan')) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (appraisal_id) REFERENCES appraisals(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Departments table
CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT
);

-- Insert default performance criteria
INSERT INTO performance_criteria (name, description) VALUES
('Job Knowledge', 'Understanding of job-related skills, procedures, and information'),
('Work Quality', 'Accuracy, thoroughness, and effectiveness of work'),
('Productivity', 'Volume of work, efficiency, and meeting deadlines'),
('Communication', 'Clarity, effectiveness, and appropriateness of communication'),
('Teamwork', 'Cooperation, collaboration, and relationship building'),
('Problem Solving', 'Identifying issues and implementing effective solutions'),
('Initiative', 'Self-motivation, proactivity, and willingness to take on responsibilities'),
('Adaptability', 'Flexibility and ability to adjust to changing conditions');

-- Insert default departments
INSERT INTO departments (name, description) VALUES 
('None', 'No specific department assigned'),
('Management', 'Leadership and strategic oversight'),
('Claims', 'Insurance claims handling and processing'),
('Underwriting', 'Risk assessment and policy issuance'),
('ICT', 'Information and communication technology'),
('Finance & Administration', 'Financial operations and administrative services'),
('HR', 'Human resources and personnel support'),
('Marketing', 'Marketing strategy and brand development'),
('Business Development', 'Partnerships and growth initiatives'),
('Legal', 'Corporate legal services and compliance'),
('Customer Service', 'Client support and satisfaction'),
('Procurement', 'Sourcing and purchasing of goods and services'),
('Product Management', 'Overseeing product lifecycle and roadmap'),
('Project Management', 'Planning and executing business projects'),
('Data Analysis', 'Data collection, interpretation, and reporting');

-- Insert admin user
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@example.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');
