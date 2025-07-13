/**
 * Repository interface for User entities
 */
// eslint-disable-next-line no-unused-vars
export class UserRepository {
  /**
   * Find all users
   * @returns {Promise<Array>} User records
   */
  async findAll() {
    throw new Error('Method not implemented');
  }

  /**
   * Find user by ID
   * @param {string|number} userId - User ID
   * @returns {Promise<Object|null>} User record or null if not found
   */
  // eslint-disable-next-line no-unused-vars
  async findById(userId) {
    throw new Error('Method not implemented');
  }

  /**
   * Find user by email
   * @param {string} userEmail - User email
   * @returns {Promise<Object|null>} User record or null if not found
   */
  // eslint-disable-next-line no-unused-vars
  async findByEmail(userEmail) {
    throw new Error('Method not implemented');
  }

  /**
   * Find users by role
   * @param {string} userRole - User role
   * @returns {Promise<Array>} User records with the specified role
   */
  // eslint-disable-next-line no-unused-vars
  async findByRole(userRole) {
    throw new Error('Method not implemented');
  }

  /**
   * Create a new user record
   * @param {Object} userData - User data
   * @returns {Promise<Object>} Created user record
   */
  // eslint-disable-next-line no-unused-vars
  async create(userData) {
    throw new Error('Method not implemented');
  }

  /**
   * Update an existing user record
   * @param {string|number} userId - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<Object>} Updated user record
   */
  // eslint-disable-next-line no-unused-vars
  async update(userId, userData) {
    throw new Error('Method not implemented');
  }

  /**
   * Delete a user record
   * @param {string|number} userId - User ID
   * @returns {Promise<boolean>} True if deletion was successful
   */
  // eslint-disable-next-line no-unused-vars
  async delete(userId) {
    throw new Error('Method not implemented');
  }
}