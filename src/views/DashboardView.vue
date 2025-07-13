<template>
  <div class="dashboard-view">
    <!-- Welcome Header -->
    <div class="bg-gradient-to-r from-blue-600 to-blue-800 text-white mb-6">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold">
              Dashboard
            </h1>
            <p class="mt-2 text-blue-100">
              Bem-vindo ao Quero Locar - Visão geral dos seus equipamentos
            </p>
          </div>
          <div class="text-right">
            <p class="text-blue-100">
              {{ currentDate }}
            </p>
            <p class="text-sm text-blue-200">
              Última atualização: {{ lastUpdate }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
      <!-- Statistics Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- Total Equipment -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  class="h-6 w-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-4 flex-1">
              <p class="text-sm font-medium text-gray-600">
                Total de Equipamentos
              </p>
              <p class="text-2xl font-bold text-gray-900">
                {{ equipmentStats.total }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                Cadastrados na plataforma
              </p>
            </div>
          </div>
        </div>

        <!-- Available Equipment -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  class="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-4 flex-1">
              <p class="text-sm font-medium text-gray-600">
                Disponíveis
              </p>
              <p class="text-2xl font-bold text-green-600">
                {{ equipmentStats.available }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                {{ availabilityPercentage }}% do total
              </p>
            </div>
          </div>
        </div>

        <!-- Rented Equipment -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <svg
                  class="h-6 w-6 text-yellow-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-4 flex-1">
              <p class="text-sm font-medium text-gray-600">
                Alugados
              </p>
              <p class="text-2xl font-bold text-yellow-600">
                {{ equipmentStats.rented }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                Gerando receita
              </p>
            </div>
          </div>
        </div>

        <!-- Revenue Estimate -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg
                  class="h-6 w-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
            </div>
            <div class="ml-4 flex-1">
              <p class="text-sm font-medium text-gray-600">
                Receita Diária Estimada
              </p>
              <p class="text-2xl font-bold text-purple-600">
                R$ {{ dailyRevenue.toFixed(2) }}
              </p>
              <p class="text-xs text-gray-500 mt-1">
                Dos equipamentos alugados
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Charts and Activity Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Equipment by Type Chart -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Equipamentos por Tipo
          </h3>
          <div class="space-y-3">
            <div
              v-for="(count, type) in equipmentByType"
              :key="type"
              class="flex items-center justify-between"
            >
              <div class="flex items-center">
                <div
                  :class="getTypeColor(type)"
                  class="w-3 h-3 rounded-full mr-3"
                />
                <span class="text-sm font-medium text-gray-700">{{ type }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-900 font-medium">{{ count.length }}</span>
                <div class="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    :class="getTypeColor(type)"
                    class="h-2 rounded-full" 
                    :style="{ width: (count.length / equipmentStats.total * 100) + '%' }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Atividade Recente
          </h3>
          <div class="space-y-4">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="flex items-start space-x-3"
            >
              <div
                :class="activity.iconBg"
                class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
              >
                <svg
                  :class="activity.iconColor"
                  class="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    v-if="activity.type === 'rental'"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2"
                  />
                  <path
                    v-else-if="activity.type === 'return'"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4"
                  />
                  <path
                    v-else
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v3m0 0v3m0-3h3m-3 0H9"
                  />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900">
                  {{ activity.title }}
                </p>
                <p class="text-xs text-gray-500">
                  {{ activity.description }}
                </p>
                <p class="text-xs text-gray-400 mt-1">
                  {{ activity.time }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Equipment Status Overview -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900">
            Status dos Equipamentos
          </h3>
          <button 
            class="text-sm text-blue-600 hover:text-blue-800 font-medium"
            @click="refreshData"
          >
            Atualizar
          </button>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Available Equipment List -->
          <div>
            <h4 class="text-sm font-medium text-green-700 mb-3 flex items-center">
              <div class="w-2 h-2 bg-green-500 rounded-full mr-2" />
              Disponíveis ({{ availableEquipment.length }})
            </h4>
            <div class="space-y-2 max-h-64 overflow-y-auto">
              <div
                v-for="equipment in availableEquipment.slice(0, 5)"
                :key="equipment.id" 
                class="flex items-center justify-between p-2 bg-green-50 rounded-lg"
              >
                <div>
                  <p class="text-xs font-medium text-gray-900">
                    {{ equipment.name }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ equipment.location }}
                  </p>
                </div>
                <span class="text-xs font-medium text-green-600">R$ {{ equipment.pricePerDay }}</span>
              </div>
              <div
                v-if="availableEquipment.length > 5"
                class="text-xs text-gray-500 text-center py-2"
              >
                +{{ availableEquipment.length - 5 }} mais...
              </div>
            </div>
          </div>

          <!-- Rented Equipment List -->
          <div>
            <h4 class="text-sm font-medium text-yellow-700 mb-3 flex items-center">
              <div class="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
              Alugados ({{ rentedEquipment.length }})
            </h4>
            <div class="space-y-2 max-h-64 overflow-y-auto">
              <div
                v-for="equipment in rentedEquipment"
                :key="equipment.id" 
                class="flex items-center justify-between p-2 bg-yellow-50 rounded-lg"
              >
                <div>
                  <p class="text-xs font-medium text-gray-900">
                    {{ equipment.name }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ equipment.current_rental?.renter_name }}
                  </p>
                </div>
                <span class="text-xs font-medium text-yellow-600">{{ equipment.current_rental?.end_date }}</span>
              </div>
            </div>
          </div>

          <!-- Maintenance Equipment List -->
          <div>
            <h4 class="text-sm font-medium text-red-700 mb-3 flex items-center">
              <div class="w-2 h-2 bg-red-500 rounded-full mr-2" />
              Manutenção ({{ maintenanceEquipment.length }})
            </h4>
            <div class="space-y-2 max-h-64 overflow-y-auto">
              <div
                v-for="equipment in maintenanceEquipment"
                :key="equipment.id" 
                class="flex items-center justify-between p-2 bg-red-50 rounded-lg"
              >
                <div>
                  <p class="text-xs font-medium text-gray-900">
                    {{ equipment.name }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ equipment.maintenance_info?.issue }}
                  </p>
                </div>
                <span class="text-xs font-medium text-red-600">{{ equipment.maintenance_info?.expected_completion }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Ações Rápidas
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <router-link 
            to="/equipment" 
            class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <svg
                class="h-5 w-5 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">
                Ver Equipamentos
              </p>
              <p class="text-xs text-gray-500">
                Gerenciar inventário
              </p>
            </div>
          </router-link>

          <router-link 
            to="/reports" 
            class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div class="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
              <svg
                class="h-5 w-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">
                Relatórios
              </p>
              <p class="text-xs text-gray-500">
                Análises e dados
              </p>
            </div>
          </router-link>

          <button class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div class="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
              <svg
                class="h-5 w-5 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">
                Novo Equipamento
              </p>
              <p class="text-xs text-gray-500">
                Cadastrar item
              </p>
            </div>
          </button>

          <button class="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
            <div class="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-3">
              <svg
                class="h-5 w-5 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0V7a1 1 0 011-1h6a1 1 0 011 1v8z"
                />
              </svg>
            </div>
            <div>
              <p class="text-sm font-medium text-gray-900">
                Novo Aluguel
              </p>
              <p class="text-xs text-gray-500">
                Registrar locação
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref, onMounted } from 'vue'
import { useEquipmentStore } from '../stores/equipment'

export default {
  name: 'DashboardView',
  setup() {
    const equipmentStore = useEquipmentStore()
    const currentDate = ref('')
    const lastUpdate = ref('')

    // Computed properties from equipment store
    const equipmentStats = computed(() => equipmentStore.equipmentStats)
    const equipmentByType = computed(() => equipmentStore.equipmentByType)
    const availableEquipment = computed(() => equipmentStore.availableEquipment)
    const rentedEquipment = computed(() => equipmentStore.rentedEquipment)  
    const maintenanceEquipment = computed(() => equipmentStore.maintenanceEquipment)

    // Computed derived data
    const availabilityPercentage = computed(() => {
      if (equipmentStats.value.total === 0) return 0
      return Math.round((equipmentStats.value.available / equipmentStats.value.total) * 100)
    })

    const dailyRevenue = computed(() => {
      return rentedEquipment.value.reduce((total, equipment) => {
        return total + equipment.pricePerDay
      }, 0)
    })

    // Mock recent activities based on equipment data
    const recentActivities = computed(() => {
      const activities = []
      
      // Add rental activities
      rentedEquipment.value.forEach(equipment => {
        if (equipment.current_rental) {
          activities.push({
            id: `rental-${equipment.id}`,
            type: 'rental',
            title: `${equipment.name} alugado`,
            description: `Para ${equipment.current_rental.renter_name}`,
            time: `${equipment.current_rental.start_date}`,
            iconBg: 'bg-yellow-100',
            iconColor: 'text-yellow-600'
          })
        }
      })

      // Add maintenance activities
      maintenanceEquipment.value.forEach(equipment => {
        if (equipment.maintenance_info) {
          activities.push({
            id: `maintenance-${equipment.id}`,
            type: 'maintenance',
            title: `${equipment.name} em manutenção`,
            description: equipment.maintenance_info.issue,
            time: `Conclusão: ${equipment.maintenance_info.expected_completion}`,
            iconBg: 'bg-red-100',
            iconColor: 'text-red-600'
          })
        }
      })

      // Add some available equipment as "added" activities
      availableEquipment.value.slice(0, 2).forEach(equipment => {
        activities.push({
          id: `available-${equipment.id}`,
          type: 'available',
          title: `${equipment.name} disponível`,
          description: `Em ${equipment.location}`,
          time: `Disponível desde ${equipment.availability.start_date}`,
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600'
        })
      })

      return activities.slice(0, 6) // Show only latest 6
    })

    // Methods
    const getTypeColor = (type) => {
      const colors = {
        'Escavadeira': 'bg-blue-500',
        'Retroescavadeira': 'bg-green-500',
        'Guindaste': 'bg-purple-500',
        'Compactador': 'bg-yellow-500',
        'Trator': 'bg-red-500',
        'Caminhão': 'bg-indigo-500',
        'Betoneira': 'bg-pink-500',
        'Gerador': 'bg-orange-500',
        'Compressor': 'bg-teal-500'
      }
      return colors[type] || 'bg-gray-500'
    }

    const refreshData = () => {
      lastUpdate.value = new Date().toLocaleTimeString('pt-BR')
    }

    const updateDateTime = () => {
      const now = new Date()
      currentDate.value = now.toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
      lastUpdate.value = now.toLocaleTimeString('pt-BR')
    }

    // Lifecycle
    onMounted(() => {
      updateDateTime()
      // Update time every minute
      setInterval(updateDateTime, 60000)
    })

    return {
      // Reactive data
      currentDate,
      lastUpdate,
      
      // Computed from store
      equipmentStats,
      equipmentByType,
      availableEquipment,
      rentedEquipment,
      maintenanceEquipment,
      
      // Computed derived
      availabilityPercentage,
      dailyRevenue,
      recentActivities,
      
      // Methods
      getTypeColor,
      refreshData
    }
  }
}
</script>

<style scoped>
/* Custom scrollbar for activity lists */
.max-h-64::-webkit-scrollbar {
  width: 4px;
}

.max-h-64::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.max-h-64::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.max-h-64::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Smooth animations */
.grid > div {
  transition: transform 0.2s ease-in-out;
}

.grid > div:hover {
  transform: translateY(-1px);
}

/* Gradient background animation */
.bg-gradient-to-r {
  background-size: 200% 200%;
  animation: gradientShift 10s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style>