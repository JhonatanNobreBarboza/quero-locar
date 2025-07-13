/**
 * Rental class represents a rental agreement between a renter and an equipment owner.
 * This is a core domain entity.
 */
export class Rental {
  constructor({
    id,
    equipmentId,
    equipment = null,
    renterId,
    renter = null,
    ownerId,
    owner = null,
    startDate,
    endDate,
    deliveryAddress,
    status = 'PENDING',
    notes = '',
    totalPrice = 0,
    createdAt = new Date()
  }) {
    this.id = id;
    this.equipmentId = equipmentId;
    this.equipment = equipment;
    this.renterId = renterId;
    this.renter = renter;
    this.ownerId = ownerId;
    this.owner = owner;
    this.startDate = startDate instanceof Date ? startDate : new Date(startDate);
    this.endDate = endDate instanceof Date ? endDate : new Date(endDate);
    this.deliveryAddress = deliveryAddress;
    this.status = status; // PENDING, CONFIRMED, ACTIVE, COMPLETED, CANCELED
    this.notes = notes;
    this.totalPrice = totalPrice;
    this.createdAt = createdAt instanceof Date ? createdAt : new Date(createdAt);
  }

  /**
   * Calculate rental duration in days
   * @returns {number} Duration in days
   */
  get durationDays() {
    const diffTime = Math.abs(this.endDate - this.startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 1; // Minimum of 1 day
  }

  /**
   * Calculate the rental price based on equipment price and duration
   * @param {Equipment} equipment - The equipment being rented
   * @returns {number} Total rental price
   */
  calculatePrice(equipment) {
    if (!equipment) {
      if (!this.equipment) {
        throw new Error('Equipment is required to calculate price');
      }
      equipment = this.equipment;
    }

    const days = this.durationDays;
    
    // Calculate based on equipment price unit
    switch (equipment.priceUnit.toLowerCase()) {
      case 'dia':
        this.totalPrice = equipment.price * days;
        break;
      case 'semana':
        this.totalPrice = equipment.price * Math.ceil(days / 7);
        break;
      case 'mês':
        this.totalPrice = equipment.price * Math.ceil(days / 30);
        break;
      case 'hora':
        // Default to 8 hours per day
        this.totalPrice = equipment.price * days * 8;
        break;
      default:
        this.totalPrice = equipment.price * days;
    }
    
    return this.totalPrice;
  }
  
  /**
   * Confirm the rental agreement
   * @returns {Rental} Updated rental instance
   */
  confirm() {
    if (this.status !== 'PENDING') {
      throw new Error('Only pending rentals can be confirmed');
    }
    this.status = 'CONFIRMED';
    return this;
  }
  
  /**
   * Activate the rental (equipment has been delivered)
   * @returns {Rental} Updated rental instance
   */
  activate() {
    if (this.status !== 'CONFIRMED') {
      throw new Error('Only confirmed rentals can be activated');
    }
    this.status = 'ACTIVE';
    return this;
  }
  
  /**
   * Complete the rental (equipment has been returned)
   * @returns {Rental} Updated rental instance
   */
  complete() {
    if (this.status !== 'ACTIVE') {
      throw new Error('Only active rentals can be completed');
    }
    this.status = 'COMPLETED';
    return this;
  }
  
  /**
   * Cancel the rental
   * @param {string} reason - Reason for cancellation
   * @returns {Rental} Updated rental instance
   */
  cancel(reason = '') {
    if (['COMPLETED', 'CANCELED'].includes(this.status)) {
      throw new Error('Completed or canceled rentals cannot be cancelled');
    }
    this.status = 'CANCELED';
    this.notes += reason ? `\nCanceled: ${reason}` : '\nCanceled';
    return this;
  }

  /**
   * Create rental object from raw data
   * @param {Object} data - Raw rental data
   * @returns {Rental} Created rental instance
   */
  static fromJSON(data) {
    return new Rental(data);
  }

  /**
   * Convert the rental to a plain object for serialization
   * @returns {Object} Plain object representation of the rental
   */
  toJSON() {
    return {
      id: this.id,
      equipmentId: this.equipmentId,
      renterId: this.renterId,
      ownerId: this.ownerId,
      startDate: this.startDate.toISOString(),
      endDate: this.endDate.toISOString(),
      deliveryAddress: this.deliveryAddress,
      status: this.status,
      notes: this.notes,
      totalPrice: this.totalPrice,
      createdAt: this.createdAt.toISOString(),
      // Include related objects if available
      equipment: this.equipment ? 
        (typeof this.equipment.toJSON === 'function' ? this.equipment.toJSON() : this.equipment) : 
        null,
      renter: this.renter ? 
        (typeof this.renter.toJSON === 'function' ? this.renter.toJSON() : this.renter) : 
        null,
      owner: this.owner ? 
        (typeof this.owner.toJSON === 'function' ? this.owner.toJSON() : this.owner) : 
        null
    };
  }
}