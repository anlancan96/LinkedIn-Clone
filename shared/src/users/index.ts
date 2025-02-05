export enum Role {
  user = "user",
  admin = "admin"
}
export interface IUserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  photo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateUserInput {
  name: string;
  email: string;
  password: string;
  role?: Role.user | Role.admin;
  photo?: string;
}

export interface IUpdateUserInput {
  name?: string;
  email?: string;
  photo?: string;
  role?: Role.user | Role.admin;
}

export interface IUpdatePasswordInput {
  currentPassword: string;
  password: string;
  passwordConfirm: string;
}
