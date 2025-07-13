import { RepositoryFactory } from '../infrastructure/RepositoryFactory';
import { EquipmentService } from './services/EquipmentService';
import { UserService } from './services/UserService';
import { RentalService } from './services/RentalService';

/**
 * Service provider for managing application services
 */
export class ServiceProvider {
  constructor() {
    this._services = new Map();
    this._initialized = false;
  }

  /**
   * Initialize all services
   * @returns {ServiceProvider} This service provider instance
   */
  initialize() {
    if (this._initialized) {
      return this;
    }

    // Create repositories
    const equipmentRepository = RepositoryFactory.getRepository('equipment');
    const userRepository = RepositoryFactory.getRepository('user');
    const rentalRepository = RepositoryFactory.getRepository('rental');

    // Create services
    const equipmentService = new EquipmentService(equipmentRepository);
    const userService = new UserService(userRepository);
    const rentalService = new RentalService(rentalRepository, equipmentService);

    // Register services
    this.registerService('equipment', equipmentService);
    this.registerService('user', userService);
    this.registerService('rental', rentalService);

    this._initialized = true;
    return this;
  }

  /**
   * Register a service
   * @param {string} name - Service name
   * @param {Object} service - Service instance
   * @returns {ServiceProvider} This service provider instance
   */
  registerService(name, service) {
    this._services.set(name, service);
    return this;
  }

  /**
   * Get a service by name
   * @param {string} name - Service name
   * @returns {Object} Service instance
   */
  getService(name) {
    if (!this._services.has(name)) {
      throw new Error(`Service not found: ${name}`);
    }
    return this._services.get(name);
  }

  /**
   * Get the equipment service
   * @returns {EquipmentService} Equipment service instance
   */
  get equipmentService() {
    return this.getService('equipment');
  }

  /**
   * Get the user service
   * @returns {UserService} User service instance
   */
  get userService() {
    return this.getService('user');
  }

  /**
   * Get the rental service
   * @returns {RentalService} Rental service instance
   */
  get rentalService() {
    return this.getService('rental');
  }

  /**
   * Check if a service exists
   * @param {string} name - Service name
   * @returns {boolean} True if the service exists
   */
  hasService(name) {
    return this._services.has(name);
  }

  /**
   * Singleton instance
   * @returns {ServiceProvider} Singleton service provider instance
   */
  static getInstance() {
    if (!ServiceProvider._instance) {
      ServiceProvider._instance = new ServiceProvider();
    }
    return ServiceProvider._instance;
  }
}

// Create a singleton instance
ServiceProvider._instance = null;

// Export the singleton instance by default
export default ServiceProvider.getInstance().initialize();