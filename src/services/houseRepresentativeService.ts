import { HouseRepresentative, User } from '../models/HouseRepresentative';

// Mock data for demonstration purposes
const mockRepresentatives: HouseRepresentative[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Experienced representative with 5 years of service.',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    isAvailable: true,
    assignedUsers: [],
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    phone: '+1 (555) 234-5678',
    bio: 'Specialized in customer support and problem resolution.',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    isAvailable: true,
    assignedUsers: [],
  },
  {
    id: '3',
    name: 'Michael Brown',
    email: 'michael.brown@example.com',
    phone: '+1 (555) 345-6789',
    bio: 'Expert in technical support and troubleshooting.',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    isAvailable: false,
    assignedUsers: [],
  },
];

const mockUsers: User[] = [
  {
    id: 'u1',
    name: 'Alice Cooper',
    email: 'alice.cooper@example.com',
    phone: '+1 (555) 987-6543',
  },
  {
    id: 'u2',
    name: 'Bob Wilson',
    email: 'bob.wilson@example.com',
    phone: '+1 (555) 876-5432',
  },
  {
    id: 'u3',
    name: 'Carol Davis',
    email: 'carol.davis@example.com',
    phone: '+1 (555) 765-4321',
  },
];

class HouseRepresentativeService {
  private representatives: HouseRepresentative[] = mockRepresentatives;

  private users: User[] = mockUsers;

  getRepresentatives(): HouseRepresentative[] {
    return [...this.representatives];
  }

  getUsers(): User[] {
    return [...this.users];
  }

  assignUserToRepresentative(userId: string, representativeId: string): boolean {
    const representative = this.representatives.find((rep) => rep.id === representativeId);
    const user = this.users.find((u) => u.id === userId);

    if (!representative || !user || !representative.isAvailable) {
      return false;
    }

    // Check if user is already assigned to another representative
    const currentAssignment = this.representatives.find((rep) =>
      rep.assignedUsers.includes(userId),
    );

    if (currentAssignment) {
      return false;
    }

    representative.assignedUsers.push(userId);
    return true;
  }

  removeUserFromRepresentative(userId: string): boolean {
    const representative = this.representatives.find((rep) =>
      rep.assignedUsers.includes(userId),
    );

    if (!representative) {
      return false;
    }

    representative.assignedUsers = representative.assignedUsers.filter((id) => id !== userId);
    return true;
  }

  toggleRepresentativeAvailability(representativeId: string): boolean {
    const representative = this.representatives.find((rep) => rep.id === representativeId);

    if (!representative) {
      return false;
    }

    representative.isAvailable = !representative.isAvailable;
    return true;
  }
}

export const houseRepresentativeService = new HouseRepresentativeService();
