import { Rental } from '../models/Rental';

/**
 * Service responsible for rental-related operations
 */
export class RentalService {
  constructor(rentalRepository, equipmentService) {
    this.rentalRepository = rentalRepository;
    this.equipmentService = equipmentService;
  }

  /**
   * Get all rentals
   * @returns {Promise<Rental[]>} List of all rentals
   */
  async getAllRentals() {
    const rawData = await this.rentalRepository.findAll();
    return rawData.map(data => Rental.fromJSON(data));
  }

  /**
   * Get rental by ID
   * @param {string|number} id - Rental ID
   * @returns {Promise<Rental|null>} Rental object or null if not found
   */
  async getRentalById(id) {
    const data = await this.rentalRepository.findById(id);
    return data ? Rental.fromJSON(data) : null;
  }

  /**
   * Get rentals by user (either as owner or renter)
   * @param {string|number} userId - User ID
   * @returns {Promise<Rental[]>} List of rentals for the specified user
   */
  async getRentalsByUser(userId) {
    const rawData = await this.rentalRepository.findByUser(userId);
    return rawData.map(data => Rental.fromJSON(data));
  }

  /**
   * Get rentals by equipment
   * @param {string|number} equipmentId - Equipment ID
   * @returns {Promise<Rental[]>} List of rentals for the specified equipment
   */
  async getRentalsByEquipment(equipmentId) {
    const rawData = await this.rentalRepository.findByEquipment(equipmentId);
    return rawData.map(data => Rental.fromJSON(data));
  }

  /**
   * Get rentals by status
   * @param {string} status - Rental status
   * @returns {Promise<Rental[]>} List of rentals with the specified status
   */
  async getRentalsByStatus(status) {
    const rawData = await this.rentalRepository.findByStatus(status);
    return rawData.map(data => Rental.fromJSON(data));
  }

  /**
   * Create a new rental request
   * @param {Object} rentalData - Rental data
   * @returns {Promise<Rental>} Created rental
   */
  async createRental(rentalData) {
    // Get the equipment to ensure it exists and is available
    const equipment = await this.equipmentService.getEquipmentById(rentalData.equipmentId);
    if (!equipment) {
      throw new Error(`Equipment with ID ${rentalData.equipmentId} not found`);
    }

    if (!equipment.isAvailable()) {
      throw new Error(`Equipment with ID ${rentalData.equipmentId} is not available for rental`);
    }

    // Create the rental with calculated price
    const rental = new Rental({
      ...rentalData,
      equipment,
      ownerId: equipment.owner.id,
      status: 'PENDING'
    });
    
    rental.calculatePrice(equipment);
    
    // Save the rental
    const savedData = await this.rentalRepository.create(rental.toJSON());
    
    // Update equipment status to RESERVADO
    await this.equipmentService.updateEquipmentStatus(equipment.id, 'RESERVADO');
    
    return Rental.fromJSON(savedData);
  }

  /**
   * Update an existing rental
   * @param {string|number} id - Rental ID
   * @param {Object} rentalData - Updated rental data
   * @returns {Promise<Rental>} Updated rental
   */
  async updateRental(id, rentalData) {
    const existingData = await this.rentalRepository.findById(id);
    if (!existingData) {
      throw new Error(`Rental with ID ${id} not found`);
    }

    const updated = { ...existingData, ...rentalData };
    const rental = Rental.fromJSON(updated);
    
    if (rental.equipment) {
      rental.calculatePrice();
    }
    
    const savedData = await this.rentalRepository.update(id, rental.toJSON());
    
    return Rental.fromJSON(savedData);
  }

  /**
   * Update rental status
   * @param {string|number} id - Rental ID
   * @param {string} status - New rental status
   * @param {string} [notes] - Additional notes for the status change
   * @returns {Promise<Rental>} Updated rental
   */
  async updateRentalStatus(id, status, notes = '') {
    const existingData = await this.rentalRepository.findById(id);
    if (!existingData) {
      throw new Error(`Rental with ID ${id} not found`);
    }

    const rental = Rental.fromJSON(existingData);
    
    // Update the status based on the requested new status
    switch(status) {
      case 'CONFIRMED':
        rental.confirm();
        break;
      case 'ACTIVE':
        rental.activate();
        // Update equipment status to EM USO
        await this.equipmentService.updateEquipmentStatus(rental.equipmentId, 'EM USO');
        break;
      case 'COMPLETED':
        rental.complete();
        // Update equipment status to DISPONÍVEL
        await this.equipmentService.updateEquipmentStatus(rental.equipmentId, 'DISPONÍVEL');
        break;
      case 'CANCELED':
        rental.cancel(notes);
        // Update equipment status to DISPONÍVEL
        await this.equipmentService.updateEquipmentStatus(rental.equipmentId, 'DISPONÍVEL');
        break;
      default:
        throw new Error(`Invalid rental status: ${status}`);
    }
    
    if (notes) {
      rental.notes += `\n${notes}`;
    }
    
    const savedData = await this.rentalRepository.update(id, rental.toJSON());
    
    return Rental.fromJSON(savedData);
  }

  /**
   * Delete a rental
   * @param {string|number} id - Rental ID
   * @returns {Promise<boolean>} True if deletion was successful
   */
  async deleteRental(id) {
    const rental = await this.getRentalById(id);
    if (rental && ['PENDING', 'CONFIRMED'].includes(rental.status)) {
      // If the rental is still pending or confirmed, make the equipment available again
      await this.equipmentService.updateEquipmentStatus(rental.equipmentId, 'DISPONÍVEL');
    }
    
    return this.rentalRepository.delete(id);
  }
}