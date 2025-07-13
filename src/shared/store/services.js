import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import apiClient from '../../config/api'

export const useServicesStore = defineStore('services', () => {
  // State
  const equipments = ref([])
  const categories = ref([])
  const isLoading = ref(false)
  const error = ref(null)
  const pagination = reactive({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })

  // Actions
  async function fetchEquipments(filters = {}) {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await apiClient.get('/equipment', {
        auth: false, // Public endpoint
        ...filters
      })
      
      if (response.success) {
        equipments.value = response.data.equipment || []
        
        // Update pagination if provided
        if (response.data.pagination) {
          Object.assign(pagination, response.data.pagination)
        }
        
        return equipments.value
      }
    } catch (err) {
      error.value = err.message || 'Erro ao carregar equipamentos'
      console.error('Fetch equipments error:', err)
      return []
    } finally {
      isLoading.value = false
    }
  }

  async function fetchEquipmentById(id) {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await apiClient.get(`/equipment/${id}`, { auth: false })
      
      if (response.success) {
        return response.data
      }
    } catch (err) {
      error.value = err.message || 'Erro ao carregar equipamento'
      console.error('Fetch equipment by ID error:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function createEquipment(equipmentData) {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await apiClient.post('/equipment', equipmentData)
      
      if (response.success) {
        equipments.value.unshift(response.data)
        return response.data
      }
    } catch (err) {
      error.value = err.message || 'Erro ao criar equipamento'
      console.error('Create equipment error:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function updateEquipment(id, equipmentData) {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await apiClient.put(`/equipment/${id}`, equipmentData)
      
      if (response.success) {
        const index = equipments.value.findIndex(eq => eq.id === id)
        if (index !== -1) {
          equipments.value[index] = response.data
        }
        return response.data
      }
    } catch (err) {
      error.value = err.message || 'Erro ao atualizar equipamento'
      console.error('Update equipment error:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function deleteEquipment(id) {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await apiClient.delete(`/equipment/${id}`)
      
      if (response.success) {
        const index = equipments.value.findIndex(eq => eq.id === id)
        if (index !== -1) {
          equipments.value.splice(index, 1)
        }
        return true
      }
    } catch (err) {
      error.value = err.message || 'Erro ao deletar equipamento'
      console.error('Delete equipment error:', err)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function fetchCategories() {
    try {
      const response = await apiClient.get('/equipment/categories', { auth: false })
      
      if (response.success) {
        categories.value = response.data || []
        return categories.value
      }
    } catch (err) {
      console.error('Fetch categories error:', err)
      return []
    }
  }

  // Generate mock data for demonstration (fallback)
  function generateMockData() {
    const mockEquipments = [
      {
        id: 1,
        name: 'Escavadeira Hidráulica CAT 320D',
        category: 'Escavadeiras',
        subcategory: 'Hidráulica',
        brand: 'Caterpillar',
        model: '320D',
        year: 2020,
        status: 'available',
        condition: 'excellent',
        dailyRate: 850.00,
        weeklyRate: 5500.00,
        monthlyRate: 20000.00,
        description: 'Escavadeira hidráulica de grande porte, ideal para obras de terraplanagem e construção.',
        location: {
          address: 'São Paulo, SP',
          latitude: -23.5505,
          longitude: -46.6333
        },
        images: ['/assets/images/escavadeira-cat.jpg'],
        owner: {
          id: 2,
          name: 'João Silva',
          company: 'Equipamentos Silva Ltda',
          phone: '(11) 98765-4321'
        }
      },
      {
        id: 2,
        name: 'Betoneira 400L Vonder',
        category: 'Betoneiras',
        subcategory: 'Portátil',
        brand: 'Vonder',
        model: 'BMC400',
        year: 2021,
        status: 'available',
        condition: 'good',
        dailyRate: 120.00,
        weeklyRate: 750.00,
        monthlyRate: 2800.00,
        description: 'Betoneira portátil de 400 litros, ideal para pequenas obras.',
        location: {
          address: 'Rio de Janeiro, RJ',
          latitude: -22.9068,
          longitude: -43.1729
        },
        images: ['/assets/images/betoneira-vonder.jpg'],
        owner: {
          id: 3,
          name: 'Maria Santos',
          company: 'Locações Santos',
          phone: '(21) 91234-5678'
        }
      }
    ]

    equipments.value = mockEquipments
    categories.value = ['Escavadeiras', 'Betoneiras', 'Guindastes', 'Tratores', 'Compactadores']
    
    return mockEquipments
  }

  return {
    equipments,
    categories,
    isLoading,
    error,
    pagination,
    fetchEquipments,
    fetchEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    fetchCategories,
    generateMockData
  }
});