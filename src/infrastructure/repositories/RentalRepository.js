/**
 * Repository interface for Rental entities
 */
// eslint-disable-next-line no-unused-vars
export class RentalRepository {
  /**
   * Find all rentals
   * @returns {Promise<Array>} Rental records
   */
  async findAll() {
    throw new Error('Method not implemented');
  }

  /**
   * Find rental by ID
   * @param {string|number} rentalId - Rental ID
   * @returns {Promise<Object|null>} Rental record or null if not found
   */
  // eslint-disable-next-line no-unused-vars
  async findById(rentalId) {
    throw new Error('Method not implemented');
  }

  /**
   * Find rentals by user (either as owner or renter)
   * @param {string|number} user - User ID
   * @returns {Promise<Array>} Rental records for the specified user
   */
  // eslint-disable-next-line no-unused-vars
  async findByUser(user) {
    throw new Error('Method not implemented');
  }

  /**
   * Find rentals by equipment
   * @param {string|number} equipment - Equipment ID
   * @returns {Promise<Array>} Rental records for the specified equipment
   */
  // eslint-disable-next-line no-unused-vars
  async findByEquipment(equipment) {
    throw new Error('Method not implemented');
  }

  /**
   * Find rentals by status
   * @param {string} rentalStatus - Rental status
   * @returns {Promise<Array>} Rental records with the specified status
   */
  // eslint-disable-next-line no-unused-vars
  async findByStatus(rentalStatus) {
    throw new Error('Method not implemented');
  }

  /**
   * Create a new rental record
   * @param {Object} rentalData - Rental data
   * @returns {Promise<Object>} Created rental record
   */
  // eslint-disable-next-line no-unused-vars
  async create(rentalData) {
    throw new Error('Method not implemented');
  }

  /**
   * Update an existing rental record
   * @param {string|number} rentalId - Rental ID
   * @param {Object} rentalData - Updated rental data
   * @returns {Promise<Object>} Updated rental record
   */
  // eslint-disable-next-line no-unused-vars
  async update(rentalId, rentalData) {
    throw new Error('Method not implemented');
  }

  /**
   * Delete a rental record
   * @param {string|number} rentalId - Rental ID
   * @returns {Promise<boolean>} True if deletion was successful
   */
  // eslint-disable-next-line no-unused-vars
  async delete(rentalId) {
    throw new Error('Method not implemented');
  }
}