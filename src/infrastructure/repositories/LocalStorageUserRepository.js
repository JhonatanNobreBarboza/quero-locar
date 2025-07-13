import { UserRepository } from './UserRepository';

/**
 * LocalStorage implementation of the UserRepository
 */
export class LocalStorageUserRepository extends UserRepository {
  constructor(storageKey = 'quero-locar-users') {
    super();
    this.storageKey = storageKey;
  }

  /**
   * Get all user data from localStorage
   * @returns {Array} User records
   * @private
   */
  _getAll() {
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Save all user data to localStorage
   * @param {Array} data - User records to save
   * @private
   */
  _saveAll(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  /**
   * Find all users
   * @returns {Promise<Array>} User records
   */
  async findAll() {
    return this._getAll();
  }

  /**
   * Find user by ID
   * @param {string|number} id - User ID
   * @returns {Promise<Object|null>} User record or null if not found
   */
  async findById(id) {
    const users = this._getAll();
    return users.find(u => u.id === id || u.id === Number(id)) || null;
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} User record or null if not found
   */
  async findByEmail(email) {
    const users = this._getAll();
    return users.find(u => u.email === email) || null;
  }

  /**
   * Find users by role
   * @param {string} role - User role
   * @returns {Promise<Array>} User records with the specified role
   */
  async findByRole(role) {
    const users = this._getAll();
    return users.filter(u => u.role === role);
  }

  /**
   * Create a new user record
   * @param {Object} data - User data
   * @returns {Promise<Object>} Created user record
   */
  async create(data) {
    const users = this._getAll();
    
    // Check for existing user with the same email
    const existingUser = users.find(u => u.email === data.email);
    if (existingUser) {
      throw new Error(`User with email ${data.email} already exists`);
    }
    
    // Generate a new ID if one wasn't provided
    const newUser = {
      ...data,
      id: data.id || (Date.now() + Math.floor(Math.random() * 1000))
    };
    
    users.push(newUser);
    this._saveAll(users);
    
    return newUser;
  }

  /**
   * Update an existing user record
   * @param {string|number} id - User ID
   * @param {Object} data - Updated user data
   * @returns {Promise<Object>} Updated user record
   */
  async update(id, data) {
    const users = this._getAll();
    const index = users.findIndex(u => u.id === id || u.id === Number(id));
    
    if (index === -1) {
      throw new Error(`User with ID ${id} not found`);
    }
    
    // Check if email is being changed and it already exists
    if (data.email && data.email !== users[index].email) {
      const emailExists = users.some(u => u.email === data.email && u.id !== id);
      if (emailExists) {
        throw new Error(`User with email ${data.email} already exists`);
      }
    }
    
    // Preserve the ID
    const updatedUser = {
      ...data,
      id: users[index].id
    };
    
    users[index] = updatedUser;
    this._saveAll(users);
    
    return updatedUser;
  }

  /**
   * Delete a user record
   * @param {string|number} id - User ID
   * @returns {Promise<boolean>} True if deletion was successful
   */
  async delete(id) {
    const users = this._getAll();
    const index = users.findIndex(u => u.id === id || u.id === Number(id));
    
    if (index === -1) {
      return false;
    }
    
    users.splice(index, 1);
    this._saveAll(users);
    
    return true;
  }
}