-- Add projectName column to projects table
-- Run this migration in your database

ALTER TABLE projects ADD COLUMN project_name VARCHAR(255);

-- Optional: Update existing projects with default names
UPDATE projects 
SET project_name = CONCAT('Project ', SUBSTRING(project_id, 1, 8))
WHERE project_name IS NULL;
