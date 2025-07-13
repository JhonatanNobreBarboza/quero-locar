import { Equipment } from '../models/Equipment';

/**
 * Service responsible for equipment-related operations
 */
export class EquipmentService {
  constructor(equipmentRepository) {
    this.equipmentRepository = equipmentRepository;
  }

  /**
   * Get all equipment items
   * @returns {Promise<Equipment[]>} List of all equipment
   */
  async getAllEquipment() {
    const rawData = await this.equipmentRepository.findAll();
    return rawData.map(data => Equipment.fromJSON(data));
  }

  /**
   * Get equipment by ID
   * @param {string|number} id - Equipment ID
   * @returns {Promise<Equipment|null>} Equipment object or null if not found
   */
  async getEquipmentById(id) {
    const data = await this.equipmentRepository.findById(id);
    return data ? Equipment.fromJSON(data) : null;
  }

  /**
   * Get equipment items by status
   * @param {string} status - Equipment status
   * @returns {Promise<Equipment[]>} List of equipment with the specified status
   */
  async getEquipmentByStatus(status) {
    const rawData = await this.equipmentRepository.findByStatus(status);
    return rawData.map(data => Equipment.fromJSON(data));
  }

  /**
   * Get equipment items by owner
   * @param {string|number} ownerId - Owner ID
   * @returns {Promise<Equipment[]>} List of equipment owned by the specified owner
   */
  async getEquipmentByOwner(ownerId) {
    const rawData = await this.equipmentRepository.findByOwner(ownerId);
    return rawData.map(data => Equipment.fromJSON(data));
  }

  /**
   * Get equipment items by type
   * @param {string} type - Equipment type
   * @returns {Promise<Equipment[]>} List of equipment of the specified type
   */
  async getEquipmentByType(type) {
    const rawData = await this.equipmentRepository.findByType(type);
    return rawData.map(data => Equipment.fromJSON(data));
  }

  /**
   * Search for equipment based on multiple criteria
   * @param {Object} criteria - Search criteria
   * @returns {Promise<Equipment[]>} List of equipment matching the criteria
   */
  async searchEquipment(criteria = {}) {
    const rawData = await this.equipmentRepository.search(criteria);
    return rawData.map(data => Equipment.fromJSON(data));
  }

  /**
   * Create a new equipment item
   * @param {Object} equipmentData - Equipment data
   * @returns {Promise<Equipment>} Created equipment
   */
  async createEquipment(equipmentData) {
    const equipment = new Equipment(equipmentData);
    const savedData = await this.equipmentRepository.create(equipment.toJSON());
    return Equipment.fromJSON(savedData);
  }

  /**
   * Update an existing equipment item
   * @param {string|number} id - Equipment ID
   * @param {Object} equipmentData - Updated equipment data
   * @returns {Promise<Equipment>} Updated equipment
   */
  async updateEquipment(id, equipmentData) {
    const existingData = await this.equipmentRepository.findById(id);
    if (!existingData) {
      throw new Error(`Equipment with ID ${id} not found`);
    }

    const updated = { ...existingData, ...equipmentData };
    const equipment = Equipment.fromJSON(updated);
    const savedData = await this.equipmentRepository.update(id, equipment.toJSON());
    
    return Equipment.fromJSON(savedData);
  }

  /**
   * Delete an equipment item
   * @param {string|number} id - Equipment ID
   * @returns {Promise<boolean>} True if deletion was successful
   */
  async deleteEquipment(id) {
    return this.equipmentRepository.delete(id);
  }

  /**
   * Update equipment status
   * @param {string|number} id - Equipment ID
   * @param {string} status - New equipment status
   * @returns {Promise<Equipment>} Updated equipment
   */
  async updateEquipmentStatus(id, status) {
    const existingData = await this.equipmentRepository.findById(id);
    if (!existingData) {
      throw new Error(`Equipment with ID ${id} not found`);
    }

    const equipment = Equipment.fromJSON(existingData);
    equipment.updateStatus(status);

    const savedData = await this.equipmentRepository.update(id, equipment.toJSON());
    return Equipment.fromJSON(savedData);
  }
}