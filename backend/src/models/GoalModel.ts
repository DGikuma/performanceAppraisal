export interface Goal {
  id?: number;
  employee_id: number;
  title: string;
  description: string;
  due_date: Date;
  status: 'not_started' | 'in_progress' | 'completed';
  created_at?: Date;
}