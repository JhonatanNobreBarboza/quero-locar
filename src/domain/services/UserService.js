import { User } from '../models/User';

/**
 * Service responsible for user-related operations
 */
export class UserService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  /**
   * Get all users
   * @returns {Promise<User[]>} List of all users
   */
  async getAllUsers() {
    const rawData = await this.userRepository.findAll();
    return rawData.map(data => User.fromJSON(data));
  }

  /**
   * Get user by ID
   * @param {string|number} id - User ID
   * @returns {Promise<User|null>} User object or null if not found
   */
  async getUserById(id) {
    const data = await this.userRepository.findById(id);
    return data ? User.fromJSON(data) : null;
  }

  /**
   * Get user by email
   * @param {string} email - User email
   * @returns {Promise<User|null>} User object or null if not found
   */
  async getUserByEmail(email) {
    const data = await this.userRepository.findByEmail(email);
    return data ? User.fromJSON(data) : null;
  }

  /**
   * Get users by role
   * @param {string} role - User role
   * @returns {Promise<User[]>} List of users with the specified role
   */
  async getUsersByRole(role) {
    const rawData = await this.userRepository.findByRole(role);
    return rawData.map(data => User.fromJSON(data));
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<User>} Created user
   */
  async createUser(userData) {
    // Check if user with this email already exists
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error(`User with email ${userData.email} already exists`);
    }

    const user = new User(userData);
    const savedData = await this.userRepository.create(user.toJSON());
    return User.fromJSON(savedData);
  }

  /**
   * Update an existing user
   * @param {string|number} id - User ID
   * @param {Object} userData - Updated user data
   * @returns {Promise<User>} Updated user
   */
  async updateUser(id, userData) {
    const existingData = await this.userRepository.findById(id);
    if (!existingData) {
      throw new Error(`User with ID ${id} not found`);
    }

    // If email is being changed, ensure it's not already in use
    if (userData.email && userData.email !== existingData.email) {
      const existingEmail = await this.userRepository.findByEmail(userData.email);
      if (existingEmail && existingEmail.id !== id) {
        throw new Error(`Email ${userData.email} is already in use`);
      }
    }

    const updated = { ...existingData, ...userData };
    const user = User.fromJSON(updated);
    const savedData = await this.userRepository.update(id, user.toJSON());
    
    return User.fromJSON(savedData);
  }

  /**
   * Delete a user
   * @param {string|number} id - User ID
   * @returns {Promise<boolean>} True if deletion was successful
   */
  async deleteUser(id) {
    return this.userRepository.delete(id);
  }

  /**
   * Authenticate a user
   * @param {string} email - User email
   * @returns {Promise<User|null>} Authenticated user or null if authentication failed
   */
  async authenticate(email) {
    // In a real application, this would validate the password
    // For this demo, we'll just return the user if found
    const userData = await this.userRepository.findByEmail(email);
    return userData ? User.fromJSON(userData) : null;
  }
}