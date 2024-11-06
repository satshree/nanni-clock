import { User } from "firebase/auth";

export type AuthType = {
  token: string;
  user: User;
};

export type AutoClockType = {
  id?: string;
  autoClockEnd: string;
  autoClockStart: string;
  autoDailyClock: string[];
  home: string;
  timezone?: {
    value: string;
    offset: number;
  };
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
  created?: number;
};

export type DataType = {
  id?: string;
  clockIn: Date;
  clockOut: Date;
  home: string;
  notes: string;
};

export type GlobalState = {
  activeHome: HomeType;
};
