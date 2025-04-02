// ES6 version of the HouseRepresentative model
// Note: In ES6, we don't have interfaces, so we're using JSDoc comments for type documentation

/**
 * @typedef {Object} User
 * @property {string} id - User's unique identifier
 * @property {string} name - User's full name
 * @property {string} email - User's email address
 * @property {string} [phone] - User's phone number (optional)
 */

/**
 * @typedef {Object} HouseRepresentative
 * @property {string} id - Representative's unique identifier
 * @property {string} name - Representative's full name
 * @property {string} email - Representative's email address
 * @property {string} [phone] - Representative's phone number (optional)
 * @property {string} bio - Representative's biography
 * @property {string} [avatar] - URL to representative's avatar image (optional)
 * @property {boolean} isAvailable - Whether the representative is currently available
 * @property {string[]} assignedUsers - Array of user IDs assigned to this representative
 */

// Export empty object as we're using JSDoc for type definitions
export {};
