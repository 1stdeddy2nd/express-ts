import { User } from "./user";

interface Location {
  id: number;
  name: string;
  timezone: string;
  users: User[];
}

export type { Location };
