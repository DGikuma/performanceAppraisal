import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../config/db';

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