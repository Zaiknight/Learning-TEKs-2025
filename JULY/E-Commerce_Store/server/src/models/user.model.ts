/*  server/src/models/user.model.ts   */
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateUserDTO {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface UpdateUserDTO {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
}
