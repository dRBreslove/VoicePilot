// ES6 version of the house representative service

// Representative types with their descriptions
export const REPRESENTATIVE_TYPES = {
  GENERAL: {
    id: 'general',
    name: 'General Representative',
    description: 'Handles general inquiries and basic support',
    icon: '👥',
  },
  TECHNICAL: {
    id: 'technical',
    name: 'Technical Representative',
    description: 'Specializes in technical issues and troubleshooting',
    icon: '🔧',
  },
  SALES: {
    id: 'sales',
    name: 'Sales Representative',
    description: 'Focuses on sales inquiries and product information',
    icon: '💰',
  },
  SUPPORT: {
    id: 'support',
    name: 'Customer Support Representative',
    description: 'Provides dedicated customer support and assistance',
    icon: '💬',
  },
  SPECIALIST: {
    id: 'specialist',
    name: 'Specialist Representative',
    description: 'Expert in specific areas or products',
    icon: '🎯',
  },
};

// Mock data for demonstration purposes
const mockHouses = [
  {
    id: 'h1',
    name: 'Main House',
    address: '123 Main St, City, State',
    representatives: ['1', '2'],
  },
  {
    id: 'h2',
    name: 'Branch House',
    address: '456 Branch Ave, City, State',
    representatives: ['3'],
  },
];

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
    houseId: 'h1',
    type: REPRESENTATIVE_TYPES.GENERAL.id,
    expertise: ['General Support', 'Basic Inquiries'],
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
    houseId: 'h1',
    type: REPRESENTATIVE_TYPES.SUPPORT.id,
    expertise: ['Customer Support', 'Problem Resolution'],
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
    houseId: 'h2',
    type: REPRESENTATIVE_TYPES.TECHNICAL.id,
    expertise: ['Technical Support', 'Troubleshooting'],
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
 * Service for managing houses, representatives, and users
 */
class HouseRepresentativeService {
  constructor() {
    this.houses = [...mockHouses];
    this.representatives = [...mockRepresentatives];
    this.users = [...mockUsers];
  }

  /**
   * Get all houses
   * @returns {Array} - Array of houses
   */
  getHouses() {
    return [...this.houses];
  }

  /**
   * Get all representatives
   * @param {string} [houseId] - Optional house ID to filter representatives
   * @returns {Array} - Array of representatives
   */
  getRepresentatives(houseId) {
    if (houseId) {
      return this.representatives.filter((rep) => rep.houseId === houseId);
    }
    return this.representatives;
  }

  /**
   * Get all users
   * @returns {Array} - Array of users
   */
  getUsers() {
    return this.users;
  }

  /**
   * Add a new house
   * @param {Object} house - House object with name and address
   * @returns {Object} - The created house
   */
  addHouse(house) {
    const newHouse = {
      id: `house-${Date.now()}`,
      ...house,
      representatives: [],
    };
    this.houses.push(newHouse);
    return newHouse;
  }

  editHouse(houseId, updatedHouse) {
    const index = this.houses.findIndex((h) => h.id === houseId);
    if (index !== -1) {
      this.houses[index] = {
        ...this.houses[index],
        ...updatedHouse,
      };
      return this.houses[index];
    }
    return null;
  }

  deleteHouse(houseId) {
    const index = this.houses.findIndex((h) => h.id === houseId);
    if (index !== -1) {
      // Remove all representatives associated with this house
      this.representatives = this.representatives.filter((rep) => rep.houseId !== houseId);
      this.houses.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Add a new representative
   * @param {Object} representative - Representative object
   * @param {string} houseId - ID of the house to add the representative to
   * @returns {Object} - The created representative
   */
  addRepresentative(representative, houseId) {
    const newRepresentative = {
      id: `rep-${Date.now()}`,
      houseId,
      assignedUsers: [],
      isAvailable: true,
      expertise: [],
      ...representative,
    };
    this.representatives.push(newRepresentative);
    return newRepresentative;
  }

  editRepresentative(representativeId, updatedRepresentative) {
    const index = this.representatives.findIndex((r) => r.id === representativeId);
    if (index !== -1) {
      this.representatives[index] = {
        ...this.representatives[index],
        ...updatedRepresentative,
      };
      return this.representatives[index];
    }
    return null;
  }

  deleteRepresentative(representativeId) {
    const index = this.representatives.findIndex((r) => r.id === representativeId);
    if (index !== -1) {
      this.representatives.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Assign a user to a representative
   * @param {string} userId - The ID of the user to assign
   * @param {string} representativeId - The ID of the representative to assign to
   * @returns {boolean} - Whether the assignment was successful
   */
  assignUserToRepresentative(userId, representativeId) {
    const user = this.users.find((u) => u.id === userId);
    const representative = this.representatives.find((r) => r.id === representativeId);

    if (user && representative) {
      user.assignedTo = representativeId;
      return true;
    }
    return false;
  }

  /**
   * Remove a user from a representative
   * @param {string} userId - The ID of the user to remove
   * @returns {boolean} - Whether the removal was successful
   */
  removeUserFromRepresentative(userId) {
    const user = this.users.find((u) => u.id === userId);
    if (user) {
      user.assignedTo = null;
      return true;
    }
    return false;
  }

  /**
   * Toggle a representative's availability
   * @param {string} representativeId - The ID of the representative
   * @returns {boolean} - Whether the toggle was successful
   */
  toggleRepresentativeAvailability(representativeId) {
    const representative = this.representatives.find((r) => r.id === representativeId);
    if (representative) {
      representative.isAvailable = !representative.isAvailable;
      return true;
    }
    return false;
  }

  /**
   * Get representatives for a specific house
   * @param {string} houseId - The ID of the house
   * @returns {Array} - Array of representatives in the house
   */
  getHouseRepresentatives(houseId) {
    return this.representatives.filter((rep) => rep.houseId === houseId);
  }
}

// Export a singleton instance
export const houseRepresentativeService = new HouseRepresentativeService();
