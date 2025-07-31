import { db } from "../config/db";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  department: string;
  role: string;
}

export enum ROLES {
  ADMIN = 'admin',
  SUPERVISOR = 'supervisor',
  EMPLOYEE = 'employee',
}

export const findByEmail = async (email: string): Promise<User | undefined> => {
  const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0];
};
export const findById = async (id: number): Promise<User | undefined> => {
  const result = await db.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
};

interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  department: string;
  role?: ROLES;
}

export const createUser = async ({ name, email, password, department, role = ROLES.EMPLOYEE }: CreateUserPayload): Promise<number> => {
  const result = await db.query(
    "INSERT INTO users (name, email, password, department, role) VALUES ($1, $2, $3, $4, $5) RETURNING id",
    [name, email, password, department, role]
  );
  return result.rows[0].id;
};
