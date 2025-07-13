import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useServicesStore = defineStore('services', () => {
  // State
  const equipments = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  
  // Coordinates for Ivinhema, MS region
  const defaultLocation = {
    latitude: -22.3047,
    longitude: -53.8185
  }
  
  // Get equipments from localStorage or initialize with default data
  const initializeEquipments = () => {
    const stored = localStorage.getItem('quero-locar-equipments')
    if (stored) {
      equipments.value = JSON.parse(stored)
    } else {
      // Demo data
      equipments.value = [
        {
          id: 1,
          type: 'Escavadeira',
          subtype: 'Hidráulica',
          model: 'CAT 320',
          status: 'DISPONÍVEL',
          price: 2500,
          priceUnit: 'dia',
          location: {
            latitude: -22.3047 + (Math.random() * 0.1 - 0.05),
            longitude: -53.8185 + (Math.random() * 0.1 - 0.05),
            address: 'Rodovia MS-141, Km 25, Ivinhema - MS'
          },
          owner: {
            id: 101,
            name: 'Construtora Silva Ltda',
            rating: 4.7
          },
          images: [
            '/assets/images/escavadeira1.jpg'
          ],
          specifications: {
            weight: '20000kg',
            power: '138kW',
            capacity: '1.0m³',
            year: 2021
          }
        },
        {
          id: 2,
          type: 'Retroescavadeira',
          subtype: 'Articulada',
          model: 'JCB 3CX',
          status: 'EM USO',
          price: 1800,
          priceUnit: 'dia',
          location: {
            latitude: -22.3047 + (Math.random() * 0.1 - 0.05),
            longitude: -53.8185 + (Math.random() * 0.1 - 0.05),
            address: 'Av. Brasil, 1250, Nova Andradina - MS'
          },
          owner: {
            id: 102,
            name: 'Terra Plana Equipamentos',
            rating: 4.2
          },
          images: [
            '/assets/images/retroescavadeira1.jpg'
          ],
          specifications: {
            weight: '8500kg',
            power: '74kW',
            capacity: '0.3m³',
            year: 2020
          }
        },
        {
          id: 3,
          type: 'Caminhão',
          subtype: 'Basculante',
          model: 'Mercedes-Benz Atego 2426',
          status: 'DISPONÍVEL',
          price: 1200,
          priceUnit: 'dia',
          location: {
            latitude: -22.3047 + (Math.random() * 0.1 - 0.05),
            longitude: -53.8185 + (Math.random() * 0.1 - 0.05),
            address: 'Rua Paraná, 780, Ivinhema - MS'
          },
          owner: {
            id: 103,
            name: 'Transportadora Rápida',
            rating: 4.9
          },
          images: [
            '/assets/images/caminhao1.jpg'
          ],
          specifications: {
            weight: '23000kg',
            power: '256kW',
            capacity: '10m³',
            year: 2022
          }
        },
        {
          id: 4,
          type: 'Compactador',
          subtype: 'Rolo Vibratório',
          model: 'Caterpillar CS54B',
          status: 'MANUTENÇÃO',
          price: 950,
          priceUnit: 'dia',
          location: {
            latitude: -22.3047 + (Math.random() * 0.1 - 0.05),
            longitude: -53.8185 + (Math.random() * 0.1 - 0.05),
            address: 'Estrada Rural, Km 8, Ivinhema - MS'
          },
          owner: {
            id: 104,
            name: 'Compacta Equipamentos',
            rating: 4.0
          },
          images: [
            '/assets/images/compactador1.jpg'
          ],
          specifications: {
            weight: '10400kg',
            power: '98kW',
            width: '2.1m',
            year: 2019
          }
        },
        {
          id: 5,
          type: 'Trator',
          subtype: 'Agrícola',
          model: 'John Deere 6110J',
          status: 'DISPONÍVEL',
          price: 800,
          priceUnit: 'dia',
          location: {
            latitude: -22.3047 + (Math.random() * 0.1 - 0.05),
            longitude: -53.8185 + (Math.random() * 0.1 - 0.05),
            address: 'Fazenda Boa Vista, Ivinhema - MS'
          },
          owner: {
            id: 105,
            name: 'Agropecuária Verde',
            rating: 4.5
          },
          images: [
            '/assets/images/trator1.jpg'
          ],
          specifications: {
            weight: '4500kg',
            power: '82kW',
            traction: '4x4',
            year: 2021
          }
        },
        {
          id: 6,
          type: 'Escavadeira',
          subtype: 'Mini',
          model: 'Bobcat E35',
          status: 'EM USO',
          price: 750,
          priceUnit: 'dia',
          location: {
            latitude: -22.3047 + (Math.random() * 0.1 - 0.05),
            longitude: -53.8185 + (Math.random() * 0.1 - 0.05),
            address: 'Rua das Américas, 550, Ivinhema - MS'
          },
          owner: {
            id: 106,
            name: 'MiniMáquinas Ltda',
            rating: 4.3
          },
          images: [
            '/assets/images/miniescavadeira1.jpg'
          ],
          specifications: {
            weight: '3500kg',
            power: '24kW',
            capacity: '0.11m³',
            year: 2022
          }
        },
        {
          id: 7,
          type: 'Caminhão',
          subtype: 'Betoneira',
          model: 'Volkswagen 31.330',
          status: 'DISPONÍVEL',
          price: 1500,
          priceUnit: 'dia',
          location: {
            latitude: -22.3047 + (Math.random() * 0.1 - 0.05),
            longitude: -53.8185 + (Math.random() * 0.1 - 0.05),
            address: 'Av. Presidente Vargas, 200, Dourados - MS'
          },
          owner: {
            id: 107,
            name: 'Construtora Concreto Forte',
            rating: 4.6
          },
          images: [
            '/assets/images/betoneira1.jpg'
          ],
          specifications: {
            weight: '26000kg',
            power: '300kW',
            capacity: '8m³',
            year: 2020
          }
        },
        {
          id: 8,
          type: 'Trator',
          subtype: 'Esteira',
          model: 'Caterpillar D6K2',
          status: 'EM USO',
          price: 2200,
          priceUnit: 'dia',
          location: {
            latitude: -22.3047 + (Math.random() * 0.1 - 0.05),
            longitude: -53.8185 + (Math.random() * 0.1 - 0.05),
            address: 'Rodovia BR-376, Km 180, Ivinhema - MS'
          },
          owner: {
            id: 108,
            name: 'Terraplanagem MS',
            rating: 4.8
          },
          images: [
            '/assets/images/tratoresteira1.jpg'
          ],
          specifications: {
            weight: '13500kg',
            power: '125kW',
            tracks: 'SystemOne™',
            year: 2021
          }
        }
      ]
      // Save to localStorage
      localStorage.setItem('quero-locar-equipments', JSON.stringify(equipments.value))
    }
  }
  
  // Getters
  const availableEquipments = computed(() => {
    return equipments.value.filter(equipment => equipment.status === 'DISPONÍVEL')
  })
  
  const inUseEquipments = computed(() => {
    return equipments.value.filter(equipment => equipment.status === 'EM USO')
  })
  
  const maintenanceEquipments = computed(() => {
    return equipments.value.filter(equipment => equipment.status === 'MANUTENÇÃO')
  })
  
  // Actions
  function fetchEquipments() {
    isLoading.value = true
    error.value = null
    
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          initializeEquipments()
          isLoading.value = false
          resolve(equipments.value)
        } catch (e) {
          error.value = 'Erro ao carregar equipamentos: ' + e.message
          isLoading.value = false
        }
      }, 800) // Simulate network delay
    })
  }
  
  function getEquipmentById(id) {
    return equipments.value.find(equipment => equipment.id === id) || null
  }
  
  function updateEquipmentStatus(id, newStatus) {
    const index = equipments.value.findIndex(equipment => equipment.id === id)
    if (index !== -1) {
      equipments.value[index].status = newStatus
      // Persist to localStorage
      localStorage.setItem('quero-locar-equipments', JSON.stringify(equipments.value))
      return true
    }
    return false
  }
  
  function updateEquipmentLocation(id, latitude, longitude, address) {
    const index = equipments.value.findIndex(equipment => equipment.id === id)
    if (index !== -1) {
      equipments.value[index].location = {
        latitude,
        longitude,
        address: address || equipments.value[index].location.address
      }
      // Persist to localStorage
      localStorage.setItem('quero-locar-equipments', JSON.stringify(equipments.value))
      return true
    }
    return false
  }
  
  return {
    equipments,
    isLoading,
    error,
    defaultLocation,
    availableEquipments,
    inUseEquipments,
    maintenanceEquipments,
    fetchEquipments,
    getEquipmentById,
    updateEquipmentStatus,
    updateEquipmentLocation
  }
})