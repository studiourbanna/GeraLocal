export interface User {
  password: string;
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
}