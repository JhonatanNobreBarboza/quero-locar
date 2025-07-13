/**
 * User class represents users of the Quero Locar platform.
 * This is a core domain entity.
 */
export class User {
  constructor({
    id,
    name,
    email,
    role,
    company,
    permissions = []
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.company = company;
    this.permissions = permissions;
  }

  /**
   * Check if user has a specific permission
   * @param {string} permission - Permission to check
   * @returns {boolean} True if user has the permission
   */
  hasPermission(permission) {
    return this.permissions.includes(permission);
  }

  /**
   * Check if user is in a specific role
   * @param {string} roleToCheck - Role to check
   * @returns {boolean} True if user has the role
   */
  hasRole(roleToCheck) {
    return this.role === roleToCheck;
  }

  /**
   * Create user object from raw data
   * @param {Object} data - Raw user data
   * @returns {User} Created user instance
   */
  static fromJSON(data) {
    return new User(data);
  }

  /**
   * Convert the user to a plain object for serialization
   * @returns {Object} Plain object representation of the user
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      company: this.company,
      permissions: this.permissions
    };
  }
}