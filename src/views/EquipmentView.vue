<template>
  <div class="equipment-view">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b border-gray-200 mb-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">
              Equipamentos
            </h1>
            <p class="mt-2 text-gray-600">
              Gerencie e visualize todos os equipamentos disponíveis
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <div class="bg-blue-50 px-4 py-2 rounded-lg">
              <span class="text-sm font-medium text-blue-700">Total: {{ equipmentStats.total }}</span>
            </div>
            <div class="bg-green-50 px-4 py-2 rounded-lg">
              <span class="text-sm font-medium text-green-700">Disponíveis: {{ equipmentStats.available }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Search and Filters -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <!-- Search -->
          <div class="lg:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Buscar Equipamentos</label>
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Nome, tipo, marca ou localização..."
                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <!-- Type Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
            <select
              v-model="filters.type"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">
                Todos os Tipos
              </option>
              <option
                v-for="type in uniqueTypes"
                :key="type"
                :value="type"
              >
                {{ type }}
              </option>
            </select>
          </div>

          <!-- Category Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Categoria</label>
            <select
              v-model="filters.category"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">
                Todas as Categorias
              </option>
              <option
                v-for="category in uniqueCategories"
                :key="category"
                :value="category"
              >
                {{ category }}
              </option>
            </select>
          </div>

          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              v-model="filters.status"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">
                Todos os Status
              </option>
              <option value="available">
                Disponível
              </option>
              <option value="rented">
                Alugado
              </option>
              <option value="maintenance">
                Manutenção
              </option>
            </select>
          </div>
        </div>

        <!-- Price Range Filter -->
        <div class="mt-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Faixa de Preço Diário: R$ {{ filters.priceRange[0] }} - R$ {{ filters.priceRange[1] }}
          </label>
          <div class="flex items-center space-x-4">
            <input
              v-model.number="filters.priceRange[0]"
              type="range"
              min="0"
              max="2000"
              step="50"
              class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            >
            <input
              v-model.number="filters.priceRange[1]"
              type="range"
              min="0"
              max="2000"
              step="50"
              class="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            >
          </div>
        </div>

        <!-- Clear Filters -->
        <div class="mt-4 flex justify-end">
          <button
            class="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            @click="clearAllFilters"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      <!-- Results Count -->
      <div class="mb-4">
        <p class="text-sm text-gray-600">
          Mostrando {{ filteredEquipment.length }} de {{ equipmentStats.total }} equipamentos
        </p>
      </div>

      <!-- Equipment Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div
          v-for="equipment in filteredEquipment"
          :key="equipment.id"
          class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
          @click="selectEquipment(equipment)"
        >
          <!-- Equipment Image -->
          <div class="aspect-video bg-gray-100 rounded-t-lg flex items-center justify-center">
            <div class="text-center">
              <svg
                class="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <p class="mt-2 text-sm text-gray-500">
                {{ equipment.type }}
              </p>
            </div>
          </div>

          <!-- Equipment Info -->
          <div class="p-6">
            <!-- Status Badge -->
            <div class="flex justify-between items-start mb-3">
              <span
                :class="{
                  'bg-green-100 text-green-800': equipment.status === 'available',
                  'bg-red-100 text-red-800': equipment.status === 'rented',
                  'bg-yellow-100 text-yellow-800': equipment.status === 'maintenance'
                }"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              >
                {{ getStatusText(equipment.status) }}
              </span>
              <span class="text-sm text-gray-500">{{ equipment.year }}</span>
            </div>

            <!-- Equipment Name -->
            <h3 class="text-lg font-semibold text-gray-900 mb-2">
              {{ equipment.name }}
            </h3>

            <!-- Brand and Model -->
            <p class="text-sm text-gray-600 mb-3">
              {{ equipment.brand }} {{ equipment.model }}
            </p>

            <!-- Location -->
            <div class="flex items-center text-sm text-gray-500 mb-3">
              <svg
                class="h-4 w-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {{ equipment.location }}
            </div>

            <!-- Specifications -->
            <div class="space-y-1 mb-4">
              <div
                v-for="(value, key) in equipment.specifications"
                :key="key"
                class="flex justify-between text-xs text-gray-600"
              >
                <span class="capitalize">{{ key.replace('_', ' ') }}:</span>
                <span class="font-medium">{{ value }}</span>
              </div>
            </div>

            <!-- Pricing -->
            <div class="border-t pt-4">
              <div class="flex justify-between items-center">
                <div>
                  <span class="text-lg font-bold text-green-600">
                    R$ {{ equipment.pricePerDay.toFixed(2) }}
                  </span>
                  <span class="text-sm text-gray-500">/dia</span>
                </div>
                <button
                  :disabled="equipment.status !== 'available'"
                  :class="{
                    'bg-blue-600 hover:bg-blue-700 text-white': equipment.status === 'available',
                    'bg-gray-300 text-gray-500 cursor-not-allowed': equipment.status !== 'available'
                  }"
                  class="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
                >
                  {{ equipment.status === 'available' ? 'Alugar' : 'Indisponível' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div
        v-if="filteredEquipment.length === 0"
        class="text-center py-12"
      >
        <svg
          class="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1"
            d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2-5V7a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2z"
          />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">
          Nenhum equipamento encontrado
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          Tente ajustar os filtros para encontrar equipamentos.
        </p>
      </div>
    </div>

    <!-- Equipment Detail Modal -->
    <div
      v-if="selectedEquipmentData"
      class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      @click="closeModal"
    >
      <div
        class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="flex items-center justify-between pb-4 border-b">
          <h2 class="text-xl font-bold text-gray-900">
            {{ selectedEquipmentData.name }}
          </h2>
          <button
            class="text-gray-400 hover:text-gray-600"
            @click="closeModal"
          >
            <svg
              class="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Modal Content -->
        <div class="py-4 space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 class="font-semibold text-gray-900 mb-2">
                Informações Gerais
              </h3>
              <div class="space-y-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">Marca:</span>
                  <span class="font-medium">{{ selectedEquipmentData.brand }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Modelo:</span>
                  <span class="font-medium">{{ selectedEquipmentData.model }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Ano:</span>
                  <span class="font-medium">{{ selectedEquipmentData.year }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Categoria:</span>
                  <span class="font-medium">{{ selectedEquipmentData.category }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">Localização:</span>
                  <span class="font-medium">{{ selectedEquipmentData.location }}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 class="font-semibold text-gray-900 mb-2">
                Especificações Técnicas
              </h3>
              <div class="space-y-2 text-sm">
                <div
                  v-for="(value, key) in selectedEquipmentData.specifications"
                  :key="key"
                  class="flex justify-between"
                >
                  <span class="text-gray-600 capitalize">{{ key.replace('_', ' ') }}:</span>
                  <span class="font-medium">{{ value }}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 class="font-semibold text-gray-900 mb-2">
              Descrição
            </h3>
            <p class="text-sm text-gray-600">
              {{ selectedEquipmentData.description }}
            </p>
          </div>

          <div>
            <h3 class="font-semibold text-gray-900 mb-2">
              Preços
            </h3>
            <div class="grid grid-cols-3 gap-4 text-center">
              <div class="bg-gray-50 p-3 rounded-lg">
                <div class="text-lg font-bold text-green-600">
                  R$ {{ selectedEquipmentData.pricePerDay.toFixed(2) }}
                </div>
                <div class="text-sm text-gray-500">
                  por dia
                </div>
              </div>
              <div class="bg-gray-50 p-3 rounded-lg">
                <div class="text-lg font-bold text-green-600">
                  R$ {{ selectedEquipmentData.pricePerWeek.toFixed(2) }}
                </div>
                <div class="text-sm text-gray-500">
                  por semana
                </div>
              </div>
              <div class="bg-gray-50 p-3 rounded-lg">
                <div class="text-lg font-bold text-green-600">
                  R$ {{ selectedEquipmentData.pricePerMonth.toFixed(2) }}
                </div>
                <div class="text-sm text-gray-500">
                  por mês
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="flex items-center justify-end pt-4 border-t space-x-3">
          <button
            class="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            @click="closeModal"
          >
            Fechar
          </button>
          <button
            v-if="selectedEquipmentData.status === 'available'"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Solicitar Aluguel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, watch } from 'vue'
import { useEquipmentStore } from '../stores/equipment'

export default {
  name: 'EquipmentView',
  setup() {
    const equipmentStore = useEquipmentStore()
    const selectedEquipmentData = ref(null)

    // Reactive references for filters and search
    const searchQuery = ref('')
    const filters = ref({
      type: '',
      category: '',
      status: '',
      priceRange: [0, 2000]
    })

    // Watch for changes and update store
    watch(searchQuery, (newQuery) => {
      equipmentStore.setSearchQuery(newQuery)
    })

    watch(filters, (newFilters) => {
      Object.keys(newFilters).forEach(key => {
        equipmentStore.setFilter(key, newFilters[key])
      })
    }, { deep: true })

    // Computed properties from store
    const filteredEquipment = computed(() => equipmentStore.filteredEquipment)
    const equipmentStats = computed(() => equipmentStore.equipmentStats)
    const uniqueTypes = computed(() => equipmentStore.uniqueTypes)
    const uniqueCategories = computed(() => equipmentStore.uniqueCategories)

    // Methods
    const selectEquipment = (equipment) => {
      selectedEquipmentData.value = equipment
      equipmentStore.selectEquipment(equipment)
    }

    const closeModal = () => {
      selectedEquipmentData.value = null
    }

    const clearAllFilters = () => {
      searchQuery.value = ''
      filters.value = {
        type: '',
        category: '',
        status: '',
        priceRange: [0, 2000]
      }
      equipmentStore.clearFilters()
    }

    const getStatusText = (status) => {
      const statusMap = {
        available: 'Disponível',
        rented: 'Alugado',
        maintenance: 'Manutenção'
      }
      return statusMap[status] || status
    }

    return {
      // Reactive data
      searchQuery,
      filters,
      selectedEquipmentData,
      
      // Computed from store
      filteredEquipment,
      equipmentStats,
      uniqueTypes,
      uniqueCategories,
      
      // Methods
      selectEquipment,
      closeModal,
      clearAllFilters,
      getStatusText
    }
  }
}
</script>

<style scoped>
/* Custom styles for range sliders */
input[type="range"] {
  -webkit-appearance: none;
  appearance: none;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3B82F6;
  cursor: pointer;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

input[type="range"]::-moz-range-thumb {
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #3B82F6;
  cursor: pointer;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

/* Modal backdrop animation */
.fixed {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Card hover effects */
.bg-white:hover {
  transform: translateY(-2px);
  transition: transform 0.2s ease-in-out;
}
</style>