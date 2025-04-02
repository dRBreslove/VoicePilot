// ES6 version of the house representative service

// Mock data for demonstration purposes
const mockRepresentatives = [
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

const mockUsers = [
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

/**
 * Service for managing house representatives and users
 */
class HouseRepresentativeService {
  constructor() {
    this.representatives = [...mockRepresentatives];
    this.users = [...mockUsers];
  }

  /**
   * Get all representatives
   * @returns {Array} - Array of representatives
   */
  getRepresentatives() {
    return [...this.representatives];
  }

  /**
   * Get all users
   * @returns {Array} - Array of users
   */
  getUsers() {
    return [...this.users];
  }

  /**
   * Assign a user to a representative
   * @param {string} userId - The ID of the user to assign
   * @param {string} representativeId - The ID of the representative to assign to
   * @returns {boolean} - Whether the assignment was successful
   */
  assignUserToRepresentative(userId, representativeId) {
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

  /**
   * Remove a user from a representative
   * @param {string} userId - The ID of the user to remove
   * @returns {boolean} - Whether the removal was successful
   */
  removeUserFromRepresentative(userId) {
    const representative = this.representatives.find((rep) =>
      rep.assignedUsers.includes(userId),
    );

    if (!representative) {
      return false;
    }

    representative.assignedUsers = representative.assignedUsers.filter((id) => id !== userId);
    return true;
  }

  /**
   * Toggle a representative's availability
   * @param {string} representativeId - The ID of the representative
   * @returns {boolean} - Whether the toggle was successful
   */
  toggleRepresentativeAvailability(representativeId) {
    const representative = this.representatives.find((rep) => rep.id === representativeId);

    if (!representative) {
      return false;
    }

    representative.isAvailable = !representative.isAvailable;
    return true;
  }
}

// Export a singleton instance
export const houseRepresentativeService = new HouseRepresentativeService();
