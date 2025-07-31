// Fixed and schema-aligned controller for the Employee Performance Appraisal System
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/db';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role = 'employee', department = 'None' } = req.body;

  try {
    const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO users (name, email, password, role, department) VALUES ($1, $2, $3, $4, $5)',
      [name, email, hashedPassword, role, department]
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error: any) {
    console.error('Registration Error:', error.message);
    res.status(500).json({ error: 'Registration failed' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (error: any) {
    console.error('Login Error:', error.message);
    res.status(500).json({ error: 'Login failed' });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const result = await db.query('SELECT id, name, email, role, department FROM users WHERE id = $1', [user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ user: result.rows[0] });
  } catch (error: any) {
    console.error('Get Profile Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const updateAppraisal = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, overall_rating } = req.body;

  try {
    const result = await db.query(
      `UPDATE appraisals 
       SET status = COALESCE($1, status), 
           overall_rating = COALESCE($2, overall_rating), 
           updated_at = NOW() 
       WHERE id = $3 
       RETURNING *`,
      [status, overall_rating, id]
    );

    if (result.rowCount === 0) return res.status(404).json({ message: 'Appraisal not found' });

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error updating appraisal:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAppraisal = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `SELECT a.*, 
              u1.name AS employee_name, 
              u2.name AS supervisor_name,
              p.name AS period_name
       FROM appraisals a
       LEFT JOIN users u1 ON u1.id = a.employee_id
       LEFT JOIN users u2 ON u2.id = a.supervisor_id
       LEFT JOIN appraisal_periods p ON p.id = a.period_id
       WHERE a.id = $1`,
      [id]
    );

    if (result.rowCount === 0) return res.status(404).json({ message: 'Appraisal not found' });

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching appraisal:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteAppraisal = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM appraisals WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Appraisal not found' });

    res.status(200).json({ message: 'Appraisal deleted' });
  } catch (error) {
    console.error('Error deleting appraisal:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const result = await db.query('SELECT id, name, email, role, department FROM users ORDER BY name ASC');
    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error('Get All Users Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, email, role, department } = req.body;

  try {
    const result = await db.query(
      'UPDATE users SET name = $1, email = $2, role = $3, department = $4 WHERE id = $5 RETURNING *',
      [name, email, role, department, id]
    );

    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ message: 'User updated successfully', user: result.rows[0] });
  } catch (error: any) {
    console.error('Update User Error:', error.message);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const result = await db.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'User not found' });

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error: any) {
    console.error('Delete User Error:', error.message);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const { currentPassword, newPassword } = req.body;
  const user = (req as any).user;

  try {
    const result = await db.query('SELECT password FROM users WHERE id = $1', [user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, result.rows[0].password);
    if (!isMatch) return res.status(401).json({ error: 'Current password is incorrect' });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedNewPassword, user.id]);

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error: any) {
    console.error('Change Password Error:', error.message);
    res.status(500).json({ error: 'Failed to change password' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const result = await db.query('SELECT id FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    // Generate token and send email (logic to be implemented)
    res.status(200).json({ message: 'Password reset link sent to your email' });
  } catch (error: any) {
    console.error('Forgot Password Error:', error.message);
    res.status(500).json({ error: 'Failed to process forgot password request' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { userId, newPassword } = req.body; // Replace token logic with userId directly for now
  try {
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashedNewPassword, userId]);
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error: any) {
    console.error('Reset Password Error:', error.message);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};

export const getUserByEmail = async (req: Request, res: Response) => {
  const { email } = req.params;
  try {
    const result = await db.query('SELECT id, name, email, role, department FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(result.rows[0]);
  } catch (error: any) {
    console.error('Get User By Email Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export const getUserByRole = async (req: Request, res: Response) => {
  const { role } = req.params;
  try {
    const result = await db.query('SELECT id, name, email FROM users WHERE role = $1', [role]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'No users found with this role' });
    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error('Get User By Role Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch users by role' });
  }
};

export const getUserByDepartment = async (req: Request, res: Response) => {
  const { department } = req.params;
  try {
    const result = await db.query('SELECT id, name, email FROM users WHERE department = $1', [department]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'No users found in this department' });
    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error('Get User By Department Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch users by department' });
  }
};

export const getUserByIdWithAppraisals = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const userResult = await db.query('SELECT id, name, email, role FROM users WHERE id = $1', [id]);
    if (userResult.rows.length === 0) return res.status(404).json({ error: 'User not found' });

    const appraisalsResult = await db.query(
      `SELECT a.*, p.name AS period_name, u2.name AS supervisor_name 
       FROM appraisals a
       LEFT JOIN appraisal_periods p ON p.id = a.period_id
       LEFT JOIN users u2 ON u2.id = a.supervisor_id
       WHERE a.employee_id = $1`,
      [id]
    );

    res.status(200).json({ user: userResult.rows[0], appraisals: appraisalsResult.rows });
  } catch (error: any) {
    console.error('Get User By ID With Appraisals Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch user with appraisals' });
  }
};

function getQuarterDates(name: string): { startDate: string, endDate: string } {
  const cleaned = name.replace(/[_-]/g, " ").toUpperCase().trim(); // converts q2_2025 → Q2 2025
  const [quarter, yearStr] = cleaned.split(" ");
  const year = parseInt(yearStr);

  switch (quarter) {
    case "Q1": return { startDate: `${year}-01-01`, endDate: `${year}-03-31` };
    case "Q2": return { startDate: `${year}-04-01`, endDate: `${year}-06-30` };
    case "Q3": return { startDate: `${year}-07-01`, endDate: `${year}-09-30` };
    case "Q4": return { startDate: `${year}-10-01`, endDate: `${year}-12-31` };
    default:
      throw new Error("Invalid period name format. Use e.g. 'Q2 2025'");
  }
}

export const createAppraisal = async (req: Request, res: Response) => {
  const {
    employee_id,
    supervisor_id,
    period_name = "Q2 2025", // 🔁 new: expect this instead of period_id
    status = 'not_started',
    job_knowledge,
    work_quality,
    productivity,
    communication,
    teamwork,
    problem_solving,
    initiative,
    adaptability,
    strengths,
    areas_for_improvement,
    overall_rating,
    comments,
    goals = [],
    development_plan,
    employee_comments,
    manager_comments,
  } = req.body;

  console.log("📥 Received appraisal data:", req.body);

  if (!employee_id || !supervisor_id || !period_name) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    // 🔁 Auto-create or fetch appraisal_period
    const existingPeriod = await client.query(
      `SELECT id FROM appraisal_periods WHERE name = $1 LIMIT 1`,
      [period_name]
    );

    let period_id: number;

    if (existingPeriod.rows.length > 0) {
      period_id = existingPeriod.rows[0].id;
    } else {
      // Optional: infer dates based on name
      const { startDate, endDate } = getQuarterDates(period_name);
      const periodInsert = await client.query(
        `INSERT INTO appraisal_periods (name, start_date, end_date, status)
         VALUES ($1, $2, $3, 'active') RETURNING id`,
        [period_name, startDate, endDate]
      );
      period_id = periodInsert.rows[0].id;
    }

    // 1. Insert into appraisals
    const appraisalResult = await client.query(
      `INSERT INTO appraisals (
        employee_id, supervisor_id, period_id, status, overall_rating, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      RETURNING id`,
      [employee_id, supervisor_id, period_id, status, overall_rating]
    );

    const appraisal_id = appraisalResult.rows[0].id;

    // 2. Insert performance ratings
    const performanceMap = [
      { criteria_id: 1, rating: job_knowledge },
      { criteria_id: 2, rating: work_quality },
      { criteria_id: 3, rating: productivity },
      { criteria_id: 4, rating: communication },
      { criteria_id: 5, rating: teamwork },
      { criteria_id: 6, rating: problem_solving },
      { criteria_id: 7, rating: initiative },
      { criteria_id: 8, rating: adaptability },
    ];

    for (const { criteria_id, rating } of performanceMap) {
      await client.query(
        `INSERT INTO performance_ratings (appraisal_id, criteria_id, rating, created_at, updated_at)
         VALUES ($1, $2, $3, NOW(), NOW())`,
        [appraisal_id, criteria_id, rating]
      );
    }

    // 3. Insert goals
    for (const goal of goals) {
      const { description, targetDate, measures } = goal;
      await client.query(
        `INSERT INTO goals (employee_id, appraisal_id, description, target_date, measures)
         VALUES ($1, $2, $3, $4, $5)`,
        [employee_id, appraisal_id, description, targetDate, measures]
      );
    }

    // 4. Insert comments
    if (employee_comments) {
      await client.query(
        `INSERT INTO comments (appraisal_id, user_id, comment_type, content)
         VALUES ($1, $2, 'employee', $3)`,
        [appraisal_id, employee_id, employee_comments]
      );
    }

    if (manager_comments) {
      await client.query(
        `INSERT INTO comments (appraisal_id, user_id, comment_type, content)
         VALUES ($1, $2, 'supervisor', $3)`,
        [appraisal_id, supervisor_id, manager_comments]
      );
    }

    if (development_plan) {
      await client.query(
        `INSERT INTO comments (appraisal_id, user_id, comment_type, content)
         VALUES ($1, $2, 'development_plan', $3)`,
        [appraisal_id, supervisor_id, development_plan]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({ message: 'Appraisal created with full details', appraisal_id });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('❌ Create Appraisal Error:', error);
    res.status(500).json({ error: 'Failed to create appraisal' });
  } finally {
    client.release();
  }
};


export const getAllAppraisals = async (_req: Request, res: Response) => {
  try {
    const result = await db.query(`
      SELECT a.*, 
             u1.name AS employee_name, 
             u2.name AS supervisor_name, 
             p.name AS period_name
      FROM appraisals a
      LEFT JOIN users u1 ON u1.id = a.employee_id
      LEFT JOIN users u2 ON u2.id = a.supervisor_id
      LEFT JOIN appraisal_periods p ON p.id = a.period_id
      ORDER BY a.created_at DESC
    `);
    res.status(200).json(result.rows);
  } catch (error: any) {
    console.error('Get All Appraisals Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch appraisals' });
  }
};

export const getRecentAppraisals = async (req: Request, res: Response) => {
  const userId = req.user?.id || req.query.user_id; // assuming you're using auth middleware or fallback

  try {
    const result = await db.query(
      `
      SELECT 
        a.id,
        p.name AS period,
        a.status,
        a.created_at,
        ROUND(AVG(r.rating), 1) AS performance_rating
      FROM appraisals a
      INNER JOIN appraisal_periods p ON a.period_id = p.id
      LEFT JOIN performance_ratings r ON r.appraisal_id = a.id
      WHERE a.employee_id = $1
      GROUP BY a.id, p.name
      ORDER BY a.created_at DESC
      LIMIT 5
      `,
      [userId]
    );

    res.json({ recentAppraisals: result.rows });
  } catch (error: any) {
    console.error("Failed to fetch recent appraisals:", error);
    res.status(500).json({ error: "Unable to load recent appraisals" });
  }
};

export const getUserGoals = async (req: Request, res: Response) => {
  const userId = req.user?.id || req.query.user_id;

  try {
    const result = await db.query(
      `
      SELECT 
        g.id,
        g.description,
        g.target_date AS due_date,
        COALESCE(g.progress, 0) AS progress
      FROM goals g
      WHERE g.employee_id = $1
      ORDER BY g.target_date ASC
      `,
      [userId]
    );

    res.json({ goals: result.rows });
  } catch (error: any) {
    console.error("❌ Failed to fetch goals:", error);
    res.status(500).json({ error: "Unable to load goals" });
  }
};
  


