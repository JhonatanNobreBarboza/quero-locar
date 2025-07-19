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
    fetchCategories
  }
});
