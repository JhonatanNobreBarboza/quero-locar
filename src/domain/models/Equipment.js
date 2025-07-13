/**
 * Equipment class represents equipment items that can be rented through the platform.
 * This is a core domain entity.
 */
export class Equipment {
  constructor({
    id,
    model,
    type,
    subtype = null,
    year,
    status = 'DISPONÍVEL',
    price,
    priceUnit,
    description,
    location,
    owner,
    images = []
  }) {
    this.id = id;
    this.model = model;
    this.type = type; 
    this.subtype = subtype;
    this.year = year;
    this.status = status;
    this.price = price;
    this.priceUnit = priceUnit;
    this.description = description;
    this.location = location;
    this.owner = owner;
    this.images = images;
  }

  /**
   * Check if the equipment is available for rental
   */
  isAvailable() {
    return this.status === 'DISPONÍVEL';
  }

  /**
   * Update the equipment status
   * @param {string} newStatus - The new equipment status
   */
  updateStatus(newStatus) {
    const validStatuses = ['DISPONÍVEL', 'EM USO', 'MANUTENÇÃO', 'RESERVADO'];
    
    if (!validStatuses.includes(newStatus)) {
      throw new Error(`Status inválido: ${newStatus}`);
    }
    
    this.status = newStatus;
    return this;
  }

  /**
   * Create equipment object from raw data
   * @param {Object} data - Raw equipment data 
   * @returns {Equipment} Created equipment instance
   */
  static fromJSON(data) {
    return new Equipment(data);
  }

  /**
   * Convert the equipment to a plain object for serialization
   * @returns {Object} Plain object representation of the equipment
   */
  toJSON() {
    return {
      id: this.id,
      model: this.model,
      type: this.type,
      subtype: this.subtype,
      year: this.year,
      status: this.status,
      price: this.price,
      priceUnit: this.priceUnit,
      description: this.description,
      location: this.location,
      owner: this.owner,
      images: this.images
    };
  }
}