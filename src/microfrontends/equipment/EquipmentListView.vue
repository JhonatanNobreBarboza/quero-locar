<template>
  <div class="equipment-list-container">
    <div class="equipment-header">
      <h1 class="equipment-title">
        Equipamentos Disponíveis
      </h1>
      <div class="equipment-filters">
        <div class="search-bar">
          <input 
            v-model="searchTerm" 
            type="text" 
            placeholder="Buscar por tipo, modelo, etc."
            class="search-input"
          >
          <button class="search-button">
            <i class="fas fa-search" />
          </button>
        </div>
        
        <div class="filter-group">
          <select
            v-model="statusFilter"
            class="filter-select"
          >
            <option value="all">
              Status
            </option>
            <option value="DISPONÍVEL">
              Disponível
            </option>
            <option value="EM USO">
              Em Uso
            </option>
            <option value="MANUTENÇÃO">
              Manutenção
            </option>
          </select>
          
          <select
            v-model="typeFilter"
            class="filter-select"
          >
            <option value="all">
              Tipo
            </option>
            <option value="Escavadeira">
              Escavadeira
            </option>
            <option value="Caminhão">
              Caminhão
            </option>
            <option value="Retroescavadeira">
              Retroescavadeira
            </option>
            <option value="Compactador">
              Compactador
            </option>
            <option value="Trator">
              Trator
            </option>
          </select>
          
          <button
            class="view-mode-btn"
            :class="{ active: viewType === 'grid' }"
            @click="viewType = 'grid'"
          >
            <i class="fas fa-th-large" />
          </button>
          <button
            class="view-mode-btn"
            :class="{ active: viewType === 'list' }"
            @click="viewType = 'list'"
          >
            <i class="fas fa-list" />
          </button>
          <button
            class="view-mode-btn"
            @click="viewType = 'map'"
          >
            <i class="fas fa-map-marked-alt" />
          </button>
        </div>
      </div>
    </div>
    
    <div
      v-if="isLoading"
      class="loading-spinner"
    >
      <i class="fas fa-circle-notch fa-spin fa-3x" />
      <p>Carregando equipamentos...</p>
    </div>
    
    <div
      v-else-if="error"
      class="error-message"
    >
      <i class="fas fa-exclamation-triangle" />
      <p>{{ error }}</p>
      <button
        class="retry-button"
        @click="loadEquipments"
      >
        Tentar novamente
      </button>
    </div>
    
    <div
      v-else-if="filteredEquipments.length === 0"
      class="no-results"
    >
      <i class="fas fa-search fa-3x" />
      <p>Nenhum equipamento encontrado com os filtros selecionados.</p>
      <button
        class="clear-filters-button"
        @click="clearFilters"
      >
        Limpar Filtros
      </button>
    </div>
    
    <div
      v-else
      :class="['equipment-items', `view-${viewType}`]"
    >
      <div 
        v-for="equipment in filteredEquipments" 
        :key="equipment.id" 
        class="equipment-card"
        :class="`status-${equipment.status.toLowerCase().replace(' ', '-')}`"
      >
        <div class="equipment-image">
          <img
            :src="equipment.images[0] || '/assets/equipment/placeholder.jpg'"
            :alt="equipment.model"
          >
          <span class="equipment-status">{{ equipment.status }}</span>
        </div>
        
        <div class="equipment-details">
          <h3 class="equipment-model">
            {{ equipment.model }}
          </h3>
          <p class="equipment-type">
            {{ equipment.type }} {{ equipment.subtype ? `- ${equipment.subtype}` : '' }}
          </p>
          
          <div class="equipment-specs">
            <span class="spec-item"><i class="fas fa-calendar-alt" /> {{ equipment.year }}</span>
            <span class="spec-item"><i class="fas fa-map-marker-alt" /> {{ getShortAddress(equipment.location.address) }}</span>
          </div>
          
          <div class="equipment-owner">
            <span class="owner-name">{{ equipment.owner.name }}</span>
            <span class="owner-rating">
              <i class="fas fa-star" />
              {{ equipment.owner.rating.toFixed(1) }}
            </span>
          </div>
          
          <div class="equipment-price">
            <span class="price-value">R$ {{ equipment.price.toLocaleString('pt-BR') }}</span>
            <span class="price-unit">/{{ equipment.priceUnit }}</span>
          </div>
          
          <div class="equipment-actions">
            <button class="action-btn details-btn">
              <i class="fas fa-info-circle" /> Detalhes
            </button>
            <button
              v-if="equipment.status === 'DISPONÍVEL'"
              class="action-btn contact-btn"
            >
              <i class="fas fa-phone" /> Contatar
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="pagination">
      <button
        class="pagination-btn"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        <i class="fas fa-chevron-left" />
      </button>
      <span class="pagination-info">Página {{ currentPage }} de {{ totalPages }}</span>
      <button
        class="pagination-btn"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        <i class="fas fa-chevron-right" />
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useServicesStore } from '../../shared/store/services'

export default {
  name: 'EquipmentListView',
  setup() {
    const router = useRouter()
    const servicesStore = useServicesStore()
    
    // Data
    const viewType = ref('grid')
    const searchTerm = ref('')
    const statusFilter = ref('all')
    const typeFilter = ref('all')
    const currentPage = ref(1)
    const itemsPerPage = ref(8)
    
    // Get equipments from store
    const { equipments, isLoading, error } = servicesStore
    
    // Load equipments when component mounts
    onMounted(async () => {
      await loadEquipments()
    })
    
    // Methods
    async function loadEquipments() {
      try {
        await servicesStore.fetchEquipments()
      } catch (err) {
        console.error('Failed to load equipments:', err)
      }
    }
    
    function clearFilters() {
      searchTerm.value = ''
      statusFilter.value = 'all'
      typeFilter.value = 'all'
    }
    
    function getShortAddress(address) {
      if (!address) return 'Localização não disponível'
      
      // Get the city from the address
      const parts = address.split(' - ')
      if (parts.length > 1) {
        return parts[1]
      }
      return address
    }
    
    // Switch to map view
    watch(viewType, (newValue) => {
      if (newValue === 'map') {
        router.push('/equipment/map')
      }
    })
    
    // Computed properties
    const filteredEquipments = computed(() => {
      let result = equipments.value
      
      // Apply search term filter
      if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase()
        result = result.filter(eq => 
          eq.model.toLowerCase().includes(term) ||
          eq.type.toLowerCase().includes(term) ||
          (eq.subtype && eq.subtype.toLowerCase().includes(term)) ||
          eq.description.toLowerCase().includes(term)
        )
      }
      
      // Apply status filter
      if (statusFilter.value !== 'all') {
        result = result.filter(eq => eq.status === statusFilter.value)
      }
      
      // Apply type filter
      if (typeFilter.value !== 'all') {
        result = result.filter(eq => eq.type === typeFilter.value)
      }
      
      return result
    })
    
    // Paginate results
    const paginatedEquipments = computed(() => {
      const startIndex = (currentPage.value - 1) * itemsPerPage.value
      const endIndex = startIndex + itemsPerPage.value
      return filteredEquipments.value.slice(startIndex, endIndex)
    })
    
    // Calculate total pages
    const totalPages = computed(() => {
      return Math.ceil(filteredEquipments.value.length / itemsPerPage.value) || 1
    })
    
    return {
      equipments,
      filteredEquipments: paginatedEquipments,
      isLoading,
      error,
      viewType,
      searchTerm,
      statusFilter,
      typeFilter,
      currentPage,
      totalPages,
      loadEquipments,
      clearFilters,
      getShortAddress
    }
  }
}
</script>

<style scoped>
.equipment-list-container {
  padding: 20px;
}

.equipment-header {
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
}

.equipment-title {
  font-size: 28px;
  margin-bottom: 16px;
  color: var(--color-primary-dark);
}

.equipment-filters {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;
}

.search-bar {
  display: flex;
  flex: 1;
  max-width: 500px;
}

.search-input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid var(--color-border);
  border-right: none;
  border-radius: 4px 0 0 4px;
  font-size: 16px;
}

.search-button {
  padding: 10px 16px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
}

.filter-group {
  display: flex;
  gap: 8px;
}

.filter-select {
  padding: 10px 16px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  min-width: 120px;
}

.view-mode-btn {
  padding: 10px 12px;
  background-color: white;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  cursor: pointer;
}

.view-mode-btn.active {
  background-color: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

/* Equipment card styles */
.equipment-items {
  display: grid;
  gap: 20px;
  margin-bottom: 24px;
}

.view-grid {
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
}

.view-list {
  grid-template-columns: 1fr;
}

.equipment-card {
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: var(--shadow-sm);
  border-top: 4px solid var(--color-primary);
}

.equipment-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}

.equipment-card.status-disponível {
  border-top-color: var(--color-success);
}

.equipment-card.status-em-uso {
  border-top-color: var(--color-info);
}

.equipment-card.status-manutenção {
  border-top-color: var(--color-warning);
}

.equipment-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.equipment-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.equipment-status {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background-color: rgba(255, 255, 255, 0.9);
}

.status-disponível .equipment-status {
  color: var(--color-success);
}

.status-em-uso .equipment-status {
  color: var(--color-info);
}

.status-manutenção .equipment-status {
  color: var(--color-warning);
}

.equipment-details {
  padding: 20px;
}

.equipment-model {
  font-size: 18px;
  margin-bottom: 4px;
  font-weight: 600;
}

.equipment-type {
  font-size: 14px;
  color: var(--color-text-light);
  margin-bottom: 12px;
}

.equipment-specs {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 12px;
}

.spec-item {
  font-size: 14px;
  color: var(--color-text-light);
}

.spec-item i {
  margin-right: 4px;
  color: var(--color-primary);
}

.equipment-owner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
}

.owner-name {
  font-size: 14px;
  font-weight: 500;
}

.owner-rating {
  font-weight: 600;
  color: var(--color-secondary-dark);
}

.owner-rating i {
  color: var(--color-secondary);
  margin-right: 4px;
}

.equipment-price {
  margin-bottom: 16px;
}

.price-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--color-primary-dark);
}

.price-unit {
  font-size: 14px;
  color: var(--color-text-light);
}

.equipment-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  flex: 1;
  padding: 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  text-align: center;
  font-size: 14px;
  transition: background-color 0.2s;
}

.details-btn {
  background-color: var(--color-background);
  color: var(--color-text);
}

.details-btn:hover {
  background-color: var(--color-border);
}

.contact-btn {
  background-color: var(--color-primary);
  color: white;
}

.contact-btn:hover {
  background-color: var(--color-primary-dark);
}

/* Loading, error, and no results styles */
.loading-spinner, .error-message, .no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  color: var(--color-text-light);
}

.loading-spinner i, .error-message i, .no-results i {
  margin-bottom: 16px;
  color: var(--color-primary);
}

.error-message i {
  color: var(--color-error);
}

.retry-button, .clear-filters-button {
  margin-top: 16px;
  padding: 10px 20px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.retry-button:hover, .clear-filters-button:hover {
  background-color: var(--color-primary-dark);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
}

.pagination-btn {
  padding: 8px 12px;
  background-color: white;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  cursor: pointer;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  margin: 0 16px;
  font-size: 14px;
}

/* Responsive styles */
@media (max-width: 768px) {
  .equipment-header {
    gap: 12px;
  }
  
  .equipment-filters {
    flex-direction: column;
  }
  
  .search-bar {
    max-width: 100%;
  }
  
  .filter-group {
    flex-wrap: wrap;
  }
  
  .view-grid {
    grid-template-columns: 1fr;
  }
}
</style>