import { User } from "firebase/auth";

export type AuthType = {
  token: string;
  user: User;
};

export type HomeType = {
  id: string;
  name: string;
  hourlyRate: number;
  description: string;
};

export type DataType = {
  id: string;
  clockIn: string;
  clockOut: string;
  home: string;
};
