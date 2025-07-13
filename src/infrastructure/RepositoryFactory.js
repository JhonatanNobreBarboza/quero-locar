import { LocalStorageEquipmentRepository } from './repositories/LocalStorageEquipmentRepository';
import { LocalStorageUserRepository } from './repositories/LocalStorageUserRepository';
import { LocalStorageRentalRepository } from './repositories/LocalStorageRentalRepository';

/**
 * Factory for creating repository instances
 */
export class RepositoryFactory {
  /**
   * Get a repository instance for the specified type
   * @param {string} repositoryType - Type of repository (equipment, user, rental)
   * @returns {Object} Repository instance
   */
  static getRepository(repositoryType) {
    switch(repositoryType.toLowerCase()) {
      case 'equipment':
        return new LocalStorageEquipmentRepository();
      case 'user':
        return new LocalStorageUserRepository();
      case 'rental':
        return new LocalStorageRentalRepository();
      default:
        throw new Error(`Unknown repository type: ${repositoryType}`);
    }
  }
}