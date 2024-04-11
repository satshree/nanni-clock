import { User } from "firebase/auth";

export type AuthType = {
  token: string;
  user: User;
};

export type FamilyType = {
  id?: string;
  home: string;
  user: string;
};

export type HomeType = {
  id?: string;
  name: string;
  hourlyRate: number;
  description: string;
  uniqueCode?: string;
};

export type DataType = {
  id?: string;
  clockIn: Date;
  clockOut: Date;
  home: string;
  notes: string;
};
