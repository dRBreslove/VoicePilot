export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface HouseRepresentative {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio: string;
  avatar?: string;
  isAvailable: boolean;
  assignedUsers: string[]; // Array of user IDs
}
