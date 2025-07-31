import { Request, Response } from 'express';
import { db } from '../config/db';
import { ROLES } from '../models/UserModel';

// Create Goal
export const createGoal = async (req: Request, res: Response): Promise<void> => {
  const { title, description, due_date } = req.body;
  const employee_id = req.user?.id;

  if (!employee_id) {
    res.status(401).json({ message: 'Unauthorized user' });
    return;
  }

  try {
    const result = await db.query(
      `INSERT INTO goals (employee_id, title, description, due_date)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [employee_id, title, description, due_date]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating goal:', error);
    res.status(500).json({ message: 'Server error while creating goal' });
  }
};

// Get Goals
export const getGoals = async (req: Request, res: Response): Promise<void> => {
  const user = req.user;

  if (!user) {
    res.status(401).json({ message: 'Not authorized' });
    return;
  }

  try {
    let query = `
      SELECT g.*, u.name AS employee_name, u.department
      FROM goals g
      JOIN users u ON g.employee_id = u.id
    `;
    const queryParams: any[] = [];

    if (user.role === ROLES.EMPLOYEE) {
      query += ' WHERE g.employee_id = $1';
      queryParams.push(user.id);
    } else if (user.role === ROLES.SUPERVISOR) {
      query += ' WHERE u.department = $1';
      queryParams.push(user.department);
    }

    const result = await db.query(query, queryParams);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ message: 'Server error while fetching goals' });
  }
};
