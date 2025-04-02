// ES6 version of the circle service

/**
 * Service for managing circles and circles of circles for representatives
 */
class CircleService {
  constructor() {
    this.circles = new Map(); // Map of circleId -> circle data
    this.representativeCircles = new Map(); // Map of representativeId -> array of circleIds
    this.nextCircleId = 1;
  }

  /**
   * Create a new circle
   * @param {string} representativeId - The ID of the representative creating the circle
   * @param {string} name - The name of the circle
   * @param {string} description - The description of the circle
   * @param {Array} members - Array of member IDs (users or representatives)
   * @returns {Object} - The created circle
   */
  createCircle(representativeId, name, description, members = []) {
    const circleId = `circle-${this.nextCircleId++}`;

    const circle = {
      id: circleId,
      name,
      description,
      createdBy: representativeId,
      createdAt: new Date(),
      members: [...members, representativeId], // Always include the creator
      subCircles: [], // Circles created within this circle
      parentCircleId: null,
    };

    // Store the circle
    this.circles.set(circleId, circle);

    // Add to representative's circles
    if (!this.representativeCircles.has(representativeId)) {
      this.representativeCircles.set(representativeId, []);
    }
    this.representativeCircles.get(representativeId).push(circleId);

    return circle;
  }

  /**
   * Create a sub-circle within an existing circle
   * @param {string} parentCircleId - The ID of the parent circle
   * @param {string} representativeId - The ID of the representative creating the sub-circle
   * @param {string} name - The name of the sub-circle
   * @param {string} description - The description of the sub-circle
   * @param {Array} members - Array of member IDs (users or representatives)
   * @returns {Object} - The created sub-circle
   */
  createSubCircle(parentCircleId, representativeId, name, description, members = []) {
    // Check if parent circle exists
    const parentCircle = this.circles.get(parentCircleId);
    if (!parentCircle) {
      throw new Error(`Parent circle with ID ${parentCircleId} not found`);
    }

    // Check if representative is a member of the parent circle
    if (!parentCircle.members.includes(representativeId)) {
      throw new Error(`Representative ${representativeId} is not a member of circle ${parentCircleId}`);
    }

    // Create the sub-circle
    const subCircle = this.createCircle(representativeId, name, description, members);

    // Set the parent circle
    subCircle.parentCircleId = parentCircleId;

    // Add to parent's sub-circles
    parentCircle.subCircles.push(subCircle.id);

    return subCircle;
  }

  /**
   * Get a circle by ID
   * @param {string} circleId - The ID of the circle
   * @returns {Object|null} - The circle or null if not found
   */
  getCircle(circleId) {
    return this.circles.get(circleId) || null;
  }

  /**
   * Get all circles created by a representative
   * @param {string} representativeId - The ID of the representative
   * @returns {Array} - Array of circles
   */
  getRepresentativeCircles(representativeId) {
    const circleIds = this.representativeCircles.get(representativeId) || [];
    return circleIds.map((id) => this.circles.get(id)).filter(Boolean);
  }

  /**
   * Get all sub-circles of a circle
   * @param {string} circleId - The ID of the circle
   * @returns {Array} - Array of sub-circles
   */
  getSubCircles(circleId) {
    const circle = this.circles.get(circleId);
    if (!circle) return [];

    return circle.subCircles.map((id) => this.circles.get(id)).filter(Boolean);
  }

  /**
   * Add a member to a circle
   * @param {string} circleId - The ID of the circle
   * @param {string} memberId - The ID of the member to add
   * @returns {boolean} - Whether the member was added successfully
   */
  addMember(circleId, memberId) {
    const circle = this.circles.get(circleId);
    if (!circle) return false;

    if (!circle.members.includes(memberId)) {
      circle.members.push(memberId);
      return true;
    }

    return false;
  }

  /**
   * Remove a member from a circle
   * @param {string} circleId - The ID of the circle
   * @param {string} memberId - The ID of the member to remove
   * @returns {boolean} - Whether the member was removed successfully
   */
  removeMember(circleId, memberId) {
    const circle = this.circles.get(circleId);
    if (!circle) return false;

    // Cannot remove the creator
    if (memberId === circle.createdBy) return false;

    const index = circle.members.indexOf(memberId);
    if (index !== -1) {
      circle.members.splice(index, 1);
      return true;
    }

    return false;
  }

  /**
   * Get all circles a user is a member of
   * @param {string} userId - The ID of the user
   * @returns {Array} - Array of circles
   */
  getUserCircles(userId) {
    return Array.from(this.circles.values())
      .filter((circle) => circle.members.includes(userId));
  }

  /**
   * Get the circle hierarchy for a representative
   * @param {string} representativeId - The ID of the representative
   * @returns {Object} - The circle hierarchy
   */
  getCircleHierarchy(representativeId) {
    const rootCircles = this.getRepresentativeCircles(representativeId);

    const buildHierarchy = (circle) => {
      const subCircles = this.getSubCircles(circle.id);
      return {
        ...circle,
        subCircles: subCircles.map(buildHierarchy),
      };
    };

    return rootCircles.map(buildHierarchy);
  }
}

// Export a singleton instance
export const circleService = new CircleService();
