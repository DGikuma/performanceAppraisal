export interface Appraisal {
  id?: number;
  employee_id: number;
  goals: string;
  performance_rating: number;
  comments: string;
  created_at?: Date;
}