import { Equipment } from '../../domain/models/Equipment.js';

export class LocalStorageEquipmentRepository {
  constructor() {
    this.storageKey = 'quero_locar_equipments';
    this.initializeData();
  }

  initializeData() {
    if (!localStorage.getItem(this.storageKey)) {
      const realEquipments = [
        {
          id: 'eq001',
          name: 'Escavadeira Hidráulica CAT 320D',
          description: 'Escavadeira de 20 toneladas para obras de grande porte. Ideal para fundações, terraplanagem e demolições.',
          category: 'Máquinas Pesadas',
          dailyPrice: 850.00,
          location: { 
            lat: -23.5505, 
            lng: -46.6333, 
            address: 'Av. Paulista, 1000 - Bela Vista, São Paulo - SP'
          },
          availability: true,
          images: ['/assets/images/escavadeira-cat.jpg', '/assets/images/escavadeira-cat-2.jpg'],
          specifications: { 
            weight: '20 tons', 
            power: '158 HP',
            bucket: '1.0 m³',
            reach: '9.8 m',
            operator: 'Incluso'
          },
          ownerId: 'owner001',
          condition: 'Excelente',
          yearModel: 2020,
          brand: 'Caterpillar',
          createdAt: new Date().toISOString(),
          totalRentals: 24
        },
        {
          id: 'eq002',
          name: 'Retroescavadeira JCB 3CX',
          description: 'Retroescavadeira versátil para obras pequenas e médias. Perfeita para abertura de valas e carregamento.',
          category: 'Máquinas Pesadas',
          dailyPrice: 450.00,
          location: { 
            lat: -23.5675, 
            lng: -46.6654, 
            address: 'R. Augusta, 2500 - Jardins, São Paulo - SP'
          },
          availability: true,
          images: ['/assets/images/retroescavadeira-jcb.jpg'],
          specifications: { 
            weight: '8.5 tons', 
            power: '110 HP',
            bucket: '0.6 m³',
            reach: '6.2 m',
            operator: 'Opcional'
          },
          ownerId: 'owner002',
          condition: 'Muito Bom',
          yearModel: 2019,
          brand: 'JCB',
          createdAt: new Date().toISOString(),
          totalRentals: 18
        },
        {
          id: 'eq003',
          name: 'Betoneira 400L Profissional',
          description: 'Betoneira de alta capacidade para preparo de concreto em obras. Motor elétrico 2HP.',
          category: 'Equipamentos de Construção',
          dailyPrice: 120.00,
          location: { 
            lat: -23.5329, 
            lng: -46.6395, 
            address: 'R. Consolação, 3000 - Consolação, São Paulo - SP'
          },
          availability: true,
          images: ['/assets/images/betoneira-400l.jpg'],
          specifications: { 
            capacity: '400 litros', 
            power: '2 HP',
            voltage: '220V',
            weight: '180 kg',
            type: 'Elétrica'
          },
          ownerId: 'owner003',
          condition: 'Bom',
          yearModel: 2021,
          brand: 'Menegotti',
          createdAt: new Date().toISOString(),
          totalRentals: 45
        },
        {
          id: 'eq004',
          name: 'Andaime Tubular 100m²',
          description: 'Kit completo de andaime tubular para fachadas. Inclui plataformas, guarda-corpos e rodízios.',
          category: 'Equipamentos de Construção',
          dailyPrice: 35.00,
          location: { 
            lat: -23.5489, 
            lng: -46.6388, 
            address: 'Av. 23 de Maio, 1500 - Vila Mariana, São Paulo - SP'
          },
          availability: true,
          images: ['/assets/images/andaime-tubular.jpg'],
          specifications: { 
            area: '100 m²', 
            height: 'Até 20m',
            load: '200 kg/m²',
            pieces: '150 peças',
            assembly: 'Incluso'
          },
          ownerId: 'owner001',
          condition: 'Muito Bom',
          yearModel: 2022,
          brand: 'Mills',
          createdAt: new Date().toISOString(),
          totalRentals: 32
        },
        {
          id: 'eq005',
          name: 'Gerador Diesel 15 KVA',
          description: 'Gerador silencioso para eventos e obras. Combustível diesel, partida elétrica.',
          category: 'Geradores',
          dailyPrice: 180.00,
          location: { 
            lat: -23.5421, 
            lng: -46.6525, 
            address: 'R. da Liberdade, 800 - Liberdade, São Paulo - SP'
          },
          availability: true,
          images: ['/assets/images/gerador-15kva.jpg'],
          specifications: { 
            power: '15 KVA', 
            fuel: 'Diesel',
            consumption: '3.2 L/h',
            noise: '< 65 dB',
            voltage: '220/380V'
          },
          ownerId: 'owner002',
          condition: 'Excelente',
          yearModel: 2021,
          brand: 'Toyama',
          createdAt: new Date().toISOString(),
          totalRentals: 28
        },
        {
          id: 'eq006',
          name: 'Compressor de Ar 10HP',
          description: 'Compressor parafuso para ferramentas pneumáticas. Ideal para jato de areia e pintura.',
          category: 'Compressores',
          dailyPrice: 150.00,
          location: { 
            lat: -23.5558, 
            lng: -46.6396, 
            address: 'Av. Brigadeiro Luís Antônio, 2000 - Bela Vista, São Paulo - SP'
          },
          availability: false,
          images: ['/assets/images/compressor-10hp.jpg'],
          specifications: { 
            power: '10 HP', 
            pressure: '8 bar',
            flow: '1200 L/min',
            tank: '500 L',
            type: 'Parafuso'
          },
          ownerId: 'owner003',
          condition: 'Bom',
          yearModel: 2020,
          brand: 'Schulz',
          createdAt: new Date().toISOString(),
          totalRentals: 41,
          unavailableUntil: '2025-07-15'
        }
      ];
      
      localStorage.setItem(this.storageKey, JSON.stringify(realEquipments));
      console.log('✅ Dados reais de equipamentos inicializados no localStorage');
    }
  }

  async findAll() {
    const data = localStorage.getItem(this.storageKey);
    const equipments = data ? JSON.parse(data) : [];
    return equipments.map(eq => new Equipment(
      eq.id, eq.name, eq.description, eq.category,
      eq.dailyPrice, eq.location, eq.availability,
      eq.images, eq.specifications, eq.ownerId
    ));
  }

  async findById(id) {
    const data = localStorage.getItem(this.storageKey);
    const equipments = data ? JSON.parse(data) : [];
    const equipment = equipments.find(eq => eq.id === id);
    
    if (!equipment) return null;
    
    return new Equipment(
      equipment.id, equipment.name, equipment.description, equipment.category,
      equipment.dailyPrice, equipment.location, equipment.availability,
      equipment.images, equipment.specifications, equipment.ownerId
    );
  }

  async save(equipment) {
    const data = localStorage.getItem(this.storageKey);
    const equipments = data ? JSON.parse(data) : [];
    
    const equipmentData = {
      id: equipment.id || 'eq' + Date.now(),
      name: equipment.name,
      description: equipment.description,
      category: equipment.category,
      dailyPrice: parseFloat(equipment.dailyPrice),
      location: equipment.location,
      availability: equipment.availability !== false,
      images: equipment.images || [],
      specifications: equipment.specifications || {},
      ownerId: equipment.ownerId,
      condition: equipment.condition || 'Bom',
      yearModel: equipment.yearModel || new Date().getFullYear(),
      brand: equipment.brand || '',
      createdAt: equipment.createdAt || new Date().toISOString(),
      totalRentals: equipment.totalRentals || 0,
      updatedAt: new Date().toISOString()
    };
    
    const index = equipments.findIndex(eq => eq.id === equipmentData.id);
    
    if (index >= 0) {
      equipments[index] = { ...equipments[index], ...equipmentData };
      console.log('✅ Equipamento atualizado:', equipmentData.name);
    } else {
      equipments.push(equipmentData);
      console.log('✅ Novo equipamento adicionado:', equipmentData.name);
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(equipments));
    
    return new Equipment(
      equipmentData.id, equipmentData.name, equipmentData.description, equipmentData.category,
      equipmentData.dailyPrice, equipmentData.location, equipmentData.availability,
      equipmentData.images, equipmentData.specifications, equipmentData.ownerId
    );
  }

  async delete(id) {
    const data = localStorage.getItem(this.storageKey);
    const equipments = data ? JSON.parse(data) : [];
    const filtered = equipments.filter(eq => eq.id !== id);
    
    if (filtered.length === equipments.length) {
      console.log('❌ Equipamento não encontrado para exclusão:', id);
      return false;
    }
    
    localStorage.setItem(this.storageKey, JSON.stringify(filtered));
    console.log('✅ Equipamento excluído:', id);
    return true;
  }

  async search(query) {
    const data = localStorage.getItem(this.storageKey);
    const equipments = data ? JSON.parse(data) : [];
    const searchTerm = query.toLowerCase();
    
    const filtered = equipments.filter(eq => 
      eq.name.toLowerCase().includes(searchTerm) ||
      eq.description.toLowerCase().includes(searchTerm) ||
      eq.category.toLowerCase().includes(searchTerm) ||
      eq.brand.toLowerCase().includes(searchTerm)
    );
    
    return filtered.map(eq => new Equipment(
      eq.id, eq.name, eq.description, eq.category,
      eq.dailyPrice, eq.location, eq.availability,
      eq.images, eq.specifications, eq.ownerId
    ));
  }

  async getCategories() {
    const data = localStorage.getItem(this.storageKey);
    const equipments = data ? JSON.parse(data) : [];
    const categories = [...new Set(equipments.map(eq => eq.category))];
    return categories.sort();
  }

  async getStatistics() {
    const data = localStorage.getItem(this.storageKey);
    const equipments = data ? JSON.parse(data) : [];
    
    return {
      total: equipments.length,
      available: equipments.filter(eq => eq.availability).length,
      unavailable: equipments.filter(eq => !eq.availability).length,
      totalValue: equipments.reduce((sum, eq) => sum + eq.dailyPrice, 0),
      avgPrice: equipments.length > 0 ? 
        equipments.reduce((sum, eq) => sum + eq.dailyPrice, 0) / equipments.length : 0,
      totalRentals: equipments.reduce((sum, eq) => sum + (eq.totalRentals || 0), 0)
    };
  }
}