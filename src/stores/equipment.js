import { defineStore } from 'pinia'

export const useEquipmentStore = defineStore('equipment', {
  state: () => ({
    equipment: [
      // Escavadeiras
      {
        id: 'ESC001',
        name: 'Escavadeira Hidráulica CAT 320D',
        type: 'Escavadeira',
        category: 'Terraplanagem',
        brand: 'Caterpillar',
        model: '320D',
        year: 2020,
        status: 'available',
        location: 'São Paulo - SP',
        coordinates: [-23.5505, -46.6333],
        pricePerDay: 850.00,
        pricePerWeek: 5100.00,
        pricePerMonth: 18000.00,
        description: 'Escavadeira hidráulica de 20 toneladas, ideal para obras de grande porte.',
        specifications: {
          weight: '20.5t',
          engine: '122HP',
          bucket_capacity: '1.2m³',
          max_digging_depth: '6.7m'
        },
        images: ['/api/placeholder/400/300'],
        availability: {
          start_date: '2025-07-15',
          end_date: '2025-12-31'
        },
        maintenance_date: '2025-06-15',
        owner_id: 'owner_001'
      },
      {
        id: 'ESC002',
        name: 'Escavadeira Komatsu PC200-8',
        type: 'Escavadeira',
        category: 'Terraplanagem',
        brand: 'Komatsu',
        model: 'PC200-8',
        year: 2019,
        status: 'rented',
        location: 'Rio de Janeiro - RJ',
        coordinates: [-22.9068, -43.1729],
        pricePerDay: 780.00,
        pricePerWeek: 4680.00,
        pricePerMonth: 16500.00,
        description: 'Escavadeira robusta e econômica para diversos tipos de obra.',
        specifications: {
          weight: '19.8t',
          engine: '110HP',
          bucket_capacity: '1.0m³',
          max_digging_depth: '6.5m'
        },
        images: ['/api/placeholder/400/300'],
        availability: {
          start_date: '2025-08-20',
          end_date: '2025-12-31'
        },
        maintenance_date: '2025-05-10',
        owner_id: 'owner_002',
        current_rental: {
          renter_name: 'Construtora ABC',
          start_date: '2025-07-01',
          end_date: '2025-08-15'
        }
      },

      // Retroescavadeiras
      {
        id: 'RET001',
        name: 'Retroescavadeira JCB 3CX',
        type: 'Retroescavadeira',
        category: 'Terraplanagem',
        brand: 'JCB',
        model: '3CX',
        year: 2021,
        status: 'available',
        location: 'Belo Horizonte - MG',
        coordinates: [-19.9167, -43.9345],
        pricePerDay: 650.00,
        pricePerWeek: 3900.00,
        pricePerMonth: 13500.00,
        description: 'Retroescavadeira versátil com carregadeira frontal e escavadeira traseira.',
        specifications: {
          weight: '8.5t',
          engine: '109HP',
          bucket_capacity: '0.28m³',
          max_digging_depth: '5.5m'
        },
        images: ['/api/placeholder/400/300'],
        availability: {
          start_date: '2025-07-12',
          end_date: '2025-12-31'
        },
        maintenance_date: '2025-07-05',
        owner_id: 'owner_003'
      },

      // Guindastes
      {
        id: 'GUI001',
        name: 'Guindaste Móvel Liebherr LTM 1030',
        type: 'Guindaste',
        category: 'Elevação',
        brand: 'Liebherr',
        model: 'LTM 1030',
        year: 2018,
        status: 'available',
        location: 'Porto Alegre - RS',
        coordinates: [-30.0346, -51.2177],
        pricePerDay: 1200.00,
        pricePerWeek: 7200.00,
        pricePerMonth: 25000.00,
        description: 'Guindaste móvel com capacidade de 30 toneladas, ideal para construção civil.',
        specifications: {
          weight: '24t',
          max_capacity: '30t',
          boom_length: '30m',
          max_height: '41m'
        },
        images: ['/api/placeholder/400/300'],
        availability: {
          start_date: '2025-07-20',
          end_date: '2025-11-30'
        },
        maintenance_date: '2025-06-20',
        owner_id: 'owner_004'
      },

      // Compactadores
      {
        id: 'COM001',
        name: 'Rolo Compactador BOMAG BW 120',
        type: 'Compactador',
        category: 'Pavimentação',
        brand: 'BOMAG',
        model: 'BW 120',
        year: 2020,
        status: 'maintenance',
        location: 'Curitiba - PR',
        coordinates: [-25.4284, -49.2733],
        pricePerDay: 450.00,
        pricePerWeek: 2700.00,
        pricePerMonth: 9500.00,
        description: 'Rolo compactador vibratório para pavimentação asfáltica.',
        specifications: {
          weight: '2.5t',
          engine: '36HP',
          drum_width: '1200mm',
          vibration_frequency: '67Hz'
        },
        images: ['/api/placeholder/400/300'],
        availability: {
          start_date: '2025-07-25',
          end_date: '2025-12-31'
        },
        maintenance_date: '2025-07-10',
        owner_id: 'owner_005',
        maintenance_info: {
          issue: 'Revisão preventiva do sistema hidráulico',
          expected_completion: '2025-07-25'
        }
      },

      // Tratores
      {
        id: 'TRA001',
        name: 'Trator de Esteira CAT D6T',
        type: 'Trator',
        category: 'Terraplanagem',
        brand: 'Caterpillar',
        model: 'D6T',
        year: 2019,
        status: 'available',
        location: 'Salvador - BA',
        coordinates: [-12.9714, -38.5014],
        pricePerDay: 920.00,
        pricePerWeek: 5520.00,
        pricePerMonth: 19500.00,
        description: 'Trator de esteira robusto para terraplanagem e movimentação de terra.',
        specifications: {
          weight: '18.5t',
          engine: '185HP',
          blade_capacity: '3.4m³',
          ground_pressure: '0.63kg/cm²'
        },
        images: ['/api/placeholder/400/300'],
        availability: {
          start_date: '2025-07-11',
          end_date: '2025-12-31'
        },
        maintenance_date: '2025-05-15',
        owner_id: 'owner_006'
      },

      // Caminhões
      {
        id: 'CAM001',
        name: 'Caminhão Basculante Volvo FMX',
        type: 'Caminhão',
        category: 'Transporte',
        brand: 'Volvo',
        model: 'FMX 8x4',
        year: 2021,
        status: 'rented',
        location: 'Fortaleza - CE',
        coordinates: [-3.7327, -38.5267],
        pricePerDay: 380.00,
        pricePerWeek: 2280.00,
        pricePerMonth: 8000.00,
        description: 'Caminhão basculante para transporte de materiais de construção.',
        specifications: {
          weight: '16t',
          engine: '280HP',
          cargo_capacity: '20m³',
          max_load: '25t'
        },
        images: ['/api/placeholder/400/300'],
        availability: {
          start_date: '2025-08-10',
          end_date: '2025-12-31'
        },
        maintenance_date: '2025-06-01',
        owner_id: 'owner_007',
        current_rental: {
          renter_name: 'Transportes XYZ',
          start_date: '2025-07-05',
          end_date: '2025-08-05'
        }
      },

      // Betoneiras
      {
        id: 'BET001',
        name: 'Caminhão Betoneira Mercedes-Benz',
        type: 'Betoneira',
        category: 'Concreto',
        brand: 'Mercedes-Benz',
        model: 'Atego 2426',
        year: 2020,
        status: 'available',
        location: 'Brasília - DF',
        coordinates: [-15.7942, -47.8822],
        pricePerDay: 550.00,
        pricePerWeek: 3300.00,
        pricePerMonth: 11500.00,
        description: 'Caminhão betoneira para transporte e aplicação de concreto.',
        specifications: {
          weight: '14t',
          engine: '260HP',
          mixer_capacity: '8m³',
          discharge_height: '4.2m'
        },
        images: ['/api/placeholder/400/300'],
        availability: {
          start_date: '2025-07-15',
          end_date: '2025-12-31'
        },
        maintenance_date: '2025-06-10',
        owner_id: 'owner_008'
      },

      // Geradores
      {
        id: 'GER001',
        name: 'Gerador Caterpillar C15 400kVA',
        type: 'Gerador',
        category: 'Energia',
        brand: 'Caterpillar',
        model: 'C15',
        year: 2019,
        status: 'available',
        location: 'Recife - PE',
        coordinates: [-8.0476, -34.8770],
        pricePerDay: 280.00,
        pricePerWeek: 1680.00,
        pricePerMonth: 5800.00,
        description: 'Gerador diesel silenciado para fornecimento de energia em obras.',
        specifications: {
          power: '400kVA',
          fuel_type: 'Diesel',
          fuel_consumption: '75L/h',
          noise_level: '75dB'
        },
        images: ['/api/placeholder/400/300'],
        availability: {
          start_date: '2025-07-12',
          end_date: '2025-12-31'
        },
        maintenance_date: '2025-06-25',
        owner_id: 'owner_009'
      },

      // Compressores
      {
        id: 'COMP001',
        name: 'Compressor Atlas Copco XAMS 850',
        type: 'Compressor',
        category: 'Ar Comprimido',
        brand: 'Atlas Copco',
        model: 'XAMS 850',
        year: 2021,
        status: 'available',
        location: 'Manaus - AM',
        coordinates: [-3.1190, -60.0217],
        pricePerDay: 320.00,
        pricePerWeek: 1920.00,
        pricePerMonth: 6800.00,
        description: 'Compressor de ar portátil para ferramentas pneumáticas.',
        specifications: {
          air_flow: '24m³/min',
          pressure: '7bar',
          engine: '173HP',
          portability: 'Rebocável'
        },
        images: ['/api/placeholder/400/300'],
        availability: {
          start_date: '2025-07-18',
          end_date: '2025-12-31'
        },
        maintenance_date: '2025-07-01',
        owner_id: 'owner_010'
      }
    ],
    filters: {
      type: '',
      category: '',
      location: '',
      status: '',
      priceRange: [0, 2000]
    },
    searchQuery: '',
    selectedEquipment: null
  }),

  getters: {
    filteredEquipment: (state) => {
      let filtered = state.equipment

      // Filtro por busca
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase()
        filtered = filtered.filter(item => 
          item.name.toLowerCase().includes(query) ||
          item.type.toLowerCase().includes(query) ||
          item.brand.toLowerCase().includes(query) ||
          item.location.toLowerCase().includes(query)
        )
      }

      // Filtro por tipo
      if (state.filters.type) {
        filtered = filtered.filter(item => item.type === state.filters.type)
      }

      // Filtro por categoria
      if (state.filters.category) {
        filtered = filtered.filter(item => item.category === state.filters.category)
      }

      // Filtro por localização
      if (state.filters.location) {
        filtered = filtered.filter(item => 
          item.location.toLowerCase().includes(state.filters.location.toLowerCase())
        )
      }

      // Filtro por status
      if (state.filters.status) {
        filtered = filtered.filter(item => item.status === state.filters.status)
      }

      // Filtro por faixa de preço
      filtered = filtered.filter(item => 
        item.pricePerDay >= state.filters.priceRange[0] && 
        item.pricePerDay <= state.filters.priceRange[1]
      )

      return filtered
    },

    availableEquipment: (state) => {
      return state.equipment.filter(item => item.status === 'available')
    },

    rentedEquipment: (state) => {
      return state.equipment.filter(item => item.status === 'rented')
    },

    maintenanceEquipment: (state) => {
      return state.equipment.filter(item => item.status === 'maintenance')
    },

    equipmentByType: (state) => {
      const types = {}
      state.equipment.forEach(item => {
        if (!types[item.type]) {
          types[item.type] = []
        }
        types[item.type].push(item)
      })
      return types
    },

    equipmentStats: (state) => {
      return {
        total: state.equipment.length,
        available: state.equipment.filter(item => item.status === 'available').length,
        rented: state.equipment.filter(item => item.status === 'rented').length,
        maintenance: state.equipment.filter(item => item.status === 'maintenance').length,
        totalValue: state.equipment.reduce((sum, item) => sum + item.pricePerDay, 0),
        avgPrice: state.equipment.reduce((sum, item) => sum + item.pricePerDay, 0) / state.equipment.length
      }
    },

    uniqueTypes: (state) => {
      return [...new Set(state.equipment.map(item => item.type))]
    },

    uniqueCategories: (state) => {
      return [...new Set(state.equipment.map(item => item.category))]
    },

    uniqueLocations: (state) => {
      return [...new Set(state.equipment.map(item => item.location.split(' - ')[1]))]
    }
  },

  actions: {
    setSearchQuery(query) {
      this.searchQuery = query
    },

    setFilter(filterType, value) {
      this.filters[filterType] = value
    },

    clearFilters() {
      this.filters = {
        type: '',
        category: '',
        location: '',
        status: '',
        priceRange: [0, 2000]
      }
      this.searchQuery = ''
    },

    selectEquipment(equipment) {
      this.selectedEquipment = equipment
    },

    updateEquipmentStatus(equipmentId, newStatus) {
      const equipment = this.equipment.find(item => item.id === equipmentId)
      if (equipment) {
        equipment.status = newStatus
      }
    },

    addEquipment(equipment) {
      this.equipment.push({
        ...equipment,
        id: `EQ${Date.now()}`
      })
    },

    updateEquipment(equipmentId, updates) {
      const index = this.equipment.findIndex(item => item.id === equipmentId)
      if (index !== -1) {
        this.equipment[index] = { ...this.equipment[index], ...updates }
      }
    },

    removeEquipment(equipmentId) {
      const index = this.equipment.findIndex(item => item.id === equipmentId)
      if (index !== -1) {
        this.equipment.splice(index, 1)
      }
    },

    getEquipmentById(id) {
      return this.equipment.find(item => item.id === id)
    }
  }
})