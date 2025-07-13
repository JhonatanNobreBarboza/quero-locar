import { Rental } from '../../domain/models/Rental.js';

export class LocalStorageRentalRepository {
  constructor() {
    this.storageKey = 'quero_locar_rentals';
    this.initializeData();
  }

  initializeData() {
    if (!localStorage.getItem(this.storageKey)) {
      // Inicializar com algumas reservas de exemplo
      const sampleRentals = [
        {
          id: 'rent001',
          equipmentId: 'eq001',
          equipmentName: 'Escavadeira Hidráulica CAT 320D',
          customerId: 'customer001',
          customerName: 'João Silva',
          customerEmail: 'joao.silva@email.com',
          customerPhone: '(11) 99999-0001',
          startDate: '2025-07-10',
          endDate: '2025-07-15',
          totalDays: 5,
          dailyPrice: 850.00,
          totalPrice: 4250.00,
          status: 'confirmed',
          deliveryAddress: 'R. das Obras, 123 - Vila Industrial, São Paulo - SP',
          notes: 'Obra de fundação de edifício residencial',
          createdAt: '2025-07-09T10:30:00.000Z',
          confirmedAt: '2025-07-09T10:35:00.000Z'
        },
        {
          id: 'rent002',
          equipmentId: 'eq003',
          equipmentName: 'Betoneira 400L Profissional',
          customerId: 'customer002',
          customerName: 'Maria Santos',
          customerEmail: 'maria.santos@email.com',
          customerPhone: '(11) 99999-0002',
          startDate: '2025-07-08',
          endDate: '2025-07-12',
          totalDays: 4,
          dailyPrice: 120.00,
          totalPrice: 480.00,
          status: 'active',
          deliveryAddress: 'Av. Construção, 456 - Centro, São Paulo - SP',
          notes: 'Reforma de casa térrea',
          createdAt: '2025-07-07T14:20:00.000Z',
          confirmedAt: '2025-07-07T14:25:00.000Z',
          startedAt: '2025-07-08T08:00:00.000Z'
        }
      ];
      
      localStorage.setItem(this.storageKey, JSON.stringify(sampleRentals));
      console.log('✅ Dados de reservas inicializados no localStorage');
    }
  }

  async findAll() {
    const data = localStorage.getItem(this.storageKey);
    const rentals = data ? JSON.parse(data) : [];
    return rentals.map(rental => this.mapToRental(rental));
  }

  async findById(id) {
    const data = localStorage.getItem(this.storageKey);
    const rentals = data ? JSON.parse(data) : [];
    const rental = rentals.find(r => r.id === id);
    
    return rental ? this.mapToRental(rental) : null;
  }

  async findByCustomerId(customerId) {
    const data = localStorage.getItem(this.storageKey);
    const rentals = data ? JSON.parse(data) : [];
    const filtered = rentals.filter(r => r.customerId === customerId);
    
    return filtered.map(rental => this.mapToRental(rental));
  }

  async findByEquipmentId(equipmentId) {
    const data = localStorage.getItem(this.storageKey);
    const rentals = data ? JSON.parse(data) : [];
    const filtered = rentals.filter(r => r.equipmentId === equipmentId);
    
    return filtered.map(rental => this.mapToRental(rental));
  }

  async findByStatus(status) {
    const data = localStorage.getItem(this.storageKey);
    const rentals = data ? JSON.parse(data) : [];
    const filtered = rentals.filter(r => r.status === status);
    
    return filtered.map(rental => this.mapToRental(rental));
  }

  async findByDateRange(startDate, endDate) {
    const data = localStorage.getItem(this.storageKey);
    const rentals = data ? JSON.parse(data) : [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const filtered = rentals.filter(r => {
      const rentalStart = new Date(r.startDate);
      const rentalEnd = new Date(r.endDate);
      return rentalStart <= end && rentalEnd >= start;
    });
    
    return filtered.map(rental => this.mapToRental(rental));
  }

  async save(rental) {
    const data = localStorage.getItem(this.storageKey);
    const rentals = data ? JSON.parse(data) : [];
    
    const rentalData = {
      id: rental.id || 'rent' + Date.now(),
      equipmentId: rental.equipmentId,
      equipmentName: rental.equipmentName,
      customerId: rental.customerId,
      customerName: rental.customerName,
      customerEmail: rental.customerEmail,
      customerPhone: rental.customerPhone,
      startDate: rental.startDate,
      endDate: rental.endDate,
      totalDays: rental.totalDays,
      dailyPrice: parseFloat(rental.dailyPrice),
      totalPrice: parseFloat(rental.totalPrice),
      status: rental.status || 'pending',
      deliveryAddress: rental.deliveryAddress,
      notes: rental.notes || '',
      createdAt: rental.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      confirmedAt: rental.confirmedAt,
      startedAt: rental.startedAt,
      completedAt: rental.completedAt,
      cancelledAt: rental.cancelledAt
    };
    
    const index = rentals.findIndex(r => r.id === rentalData.id);
    
    if (index >= 0) {
      rentals[index] = { ...rentals[index], ...rentalData };
      console.log('✅ Reserva atualizada:', rentalData.id);
    } else {
      rentals.push(rentalData);
      console.log('✅ Nova reserva criada:', rentalData.id);
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(rentals));
    
    return this.mapToRental(rentalData);
  }

  async delete(id) {
    const data = localStorage.getItem(this.storageKey);
    const rentals = data ? JSON.parse(data) : [];
    const filtered = rentals.filter(r => r.id !== id);
    
    if (filtered.length === rentals.length) {
      console.log('❌ Reserva não encontrada para exclusão:', id);
      return false;
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
    console.log('✅ Reserva excluída:', id);
    return true;
  }

  async updateStatus(id, status, timestamp = null) {
    const data = localStorage.getItem(this.storageKey);
    const rentals = data ? JSON.parse(data) : [];
    const index = rentals.findIndex(r => r.id === id);
    
    if (index === -1) {
      console.log('❌ Reserva não encontrada para atualização:', id);
      return null;
    }
    
    rentals[index].status = status;
    rentals[index].updatedAt = new Date().toISOString();
    
    // Adicionar timestamps específicos baseados no status
    if (timestamp) {
      switch (status) {
        case 'confirmed':
          rentals[index].confirmedAt = timestamp;
          break;
        case 'active':
          rentals[index].startedAt = timestamp;
          break;
        case 'completed':
          rentals[index].completedAt = timestamp;
          break;
        case 'cancelled':
          rentals[index].cancelledAt = timestamp;
          break;
      }
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(rentals));
    console.log('✅ Status da reserva atualizado:', id, 'para', status);
    
    return this.mapToRental(rentals[index]);
  }

  async getStatistics() {
    const data = localStorage.getItem(this.storageKey);
    const rentals = data ? JSON.parse(data) : [];
    
    const stats = {
      total: rentals.length,
      pending: rentals.filter(r => r.status === 'pending').length,
      confirmed: rentals.filter(r => r.status === 'confirmed').length,
      active: rentals.filter(r => r.status === 'active').length,
      completed: rentals.filter(r => r.status === 'completed').length,
      cancelled: rentals.filter(r => r.status === 'cancelled').length,
      totalRevenue: rentals
        .filter(r => r.status === 'completed')
        .reduce((sum, r) => sum + r.totalPrice, 0),
      pendingRevenue: rentals
        .filter(r => ['pending', 'confirmed', 'active'].includes(r.status))
        .reduce((sum, r) => sum + r.totalPrice, 0),
      avgRentalValue: rentals.length > 0 ? 
        rentals.reduce((sum, r) => sum + r.totalPrice, 0) / rentals.length : 0,
      avgRentalDays: rentals.length > 0 ? 
        rentals.reduce((sum, r) => sum + r.totalDays, 0) / rentals.length : 0
    };
    
    return stats;
  }

  async checkEquipmentAvailability(equipmentId, startDate, endDate, excludeRentalId = null) {
    const data = localStorage.getItem(this.storageKey);
    const rentals = data ? JSON.parse(data) : [];
    
    const conflicts = rentals.filter(r => {
      if (r.equipmentId !== equipmentId) return false;
      if (excludeRentalId && r.id === excludeRentalId) return false;
      if (!['confirmed', 'active'].includes(r.status)) return false;
      
      const reqStart = new Date(startDate);
      const reqEnd = new Date(endDate);
      const rentalStart = new Date(r.startDate);
      const rentalEnd = new Date(r.endDate);
      
      return reqStart <= rentalEnd && reqEnd >= rentalStart;
    });
    
    return conflicts.length === 0;
  }

  mapToRental(data) {
    return new Rental(
      data.id,
      data.equipmentId,
      data.customerId,
      data.startDate,
      data.endDate,
      data.totalPrice,
      data.status
    );
  }
}