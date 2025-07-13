/**
 * Repository interface for Equipment entities
 */
// eslint-disable-next-line no-unused-vars
export class EquipmentRepository {
  /**
   * Find all equipment
   * @returns {Promise<Array>} Equipment records
   */
  async findAll() {
    throw new Error('Method not implemented');
  }

  /**
   * Find equipment by ID
   * @param {string|number} equipmentId - Equipment ID
   * @returns {Promise<Object|null>} Equipment record or null if not found
   */
  // eslint-disable-next-line no-unused-vars
  async findById(equipmentId) {
    throw new Error('Method not implemented');
  }

  /**
   * Find equipment by status
   * @param {string} equipmentStatus - Equipment status
   * @returns {Promise<Array>} Equipment records with the specified status
   */
  // eslint-disable-next-line no-unused-vars
  async findByStatus(equipmentStatus) {
    throw new Error('Method not implemented');
  }

  /**
   * Find equipment by owner
   * @param {string|number} owner - Owner ID
   * @returns {Promise<Array>} Equipment records owned by the specified owner
   */
  // eslint-disable-next-line no-unused-vars
  async findByOwner(owner) {
    throw new Error('Method not implemented');
  }

  /**
   * Find equipment by type
   * @param {string} equipmentType - Equipment type
   * @returns {Promise<Array>} Equipment records of the specified type
   */
  // eslint-disable-next-line no-unused-vars
  async findByType(equipmentType) {
    throw new Error('Method not implemented');
  }

  /**
   * Search for equipment based on multiple criteria
   * @param {Object} searchCriteria - Search criteria
   * @returns {Promise<Array>} Equipment records matching the criteria
   */
  // eslint-disable-next-line no-unused-vars
  async search(searchCriteria) {
    throw new Error('Method not implemented');
  }

  /**
   * Create a new equipment record
   * @param {Object} equipmentData - Equipment data
   * @returns {Promise<Object>} Created equipment record
   */
  // eslint-disable-next-line no-unused-vars
  async create(equipmentData) {
    throw new Error('Method not implemented');
  }

  /**
   * Update an existing equipment record
   * @param {string|number} equipmentId - Equipment ID
   * @param {Object} equipmentData - Updated equipment data
   * @returns {Promise<Object>} Updated equipment record
   */
  // eslint-disable-next-line no-unused-vars
  async update(equipmentId, equipmentData) {
    throw new Error('Method not implemented');
  }

  /**
   * Delete an equipment record
   * @param {string|number} equipmentId - Equipment ID
   * @returns {Promise<boolean>} True if deletion was successful
   */
  // eslint-disable-next-line no-unused-vars
  async delete(equipmentId) {
    throw new Error('Method not implemented');
  }
}