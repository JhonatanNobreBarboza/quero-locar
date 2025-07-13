<template>
  <div class="dashboard-container">
    <h1 class="dashboard-title">
      Dashboard
    </h1>
    
    <div
      v-if="isLoading"
      class="loading-spinner"
    >
      <i class="fas fa-circle-notch fa-spin fa-3x" />
      <p>Carregando dados...</p>
    </div>
    
    <div
      v-else-if="error"
      class="error-message"
    >
      <i class="fas fa-exclamation-triangle" />
      <p>{{ error }}</p>
      <button
        class="retry-button"
        @click="loadData"
      >
        Tentar novamente
      </button>
    </div>
    
    <div
      v-else
      class="dashboard-content"
    >
      <!-- KPI Cards - Fixed to display in a single row -->
      <div class="stats-container">
        <div class="stats-card">
          <div class="stats-icon">
            🚚
          </div>
          <div class="stats-content">
            <div class="stats-value">
              {{ inUseEquipments.length }}
            </div>
            <div class="stats-label">
              Serviços Ativos
            </div>
          </div>
        </div>
        
        <div class="stats-card">
          <div class="stats-icon">
            ⏱️
          </div>
          <div class="stats-content">
            <div class="stats-value">
              1
            </div>
            <div class="stats-label">
              Serviços Pendentes
            </div>
          </div>
        </div>
        
        <div class="stats-card">
          <div class="stats-icon">
            📅
          </div>
          <div class="stats-content">
            <div class="stats-value">
              1
            </div>
            <div class="stats-label">
              Serviços Agendados
            </div>
          </div>
        </div>
        
        <div class="stats-card">
          <div class="stats-icon">
            ✅
          </div>
          <div class="stats-content">
            <div class="stats-value">
              1
            </div>
            <div class="stats-label">
              Serviços Concluídos
            </div>
          </div>
        </div>
      </div>
      
      <!-- KPI Cards - Detailed metrics -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-icon equipment-icon">
            <i class="fas fa-truck" />
          </div>
          <div class="kpi-content">
            <h3 class="kpi-title">
              Equipamentos
            </h3>
            <div class="kpi-value">
              {{ equipments.length }}
            </div>
            <div class="kpi-detail">
              <span class="kpi-available">{{ availableEquipments.length }} disponíveis</span>
            </div>
          </div>
        </div>
        
        <div class="kpi-card">
          <div class="kpi-icon utilization-icon">
            <i class="fas fa-chart-line" />
          </div>
          <div class="kpi-content">
            <h3 class="kpi-title">
              Taxa de Utilização
            </h3>
            <div class="kpi-value">
              {{ utilizationRate }}%
            </div>
            <div class="kpi-detail">
              <span class="kpi-trend">
                <i class="fas fa-arrow-up" /> 5% desde o mês passado
              </span>
            </div>
          </div>
        </div>
        
        <div class="kpi-card">
          <div class="kpi-icon revenue-icon">
            <i class="fas fa-dollar-sign" />
          </div>
          <div class="kpi-content">
            <h3 class="kpi-title">
              Faturamento
            </h3>
            <div class="kpi-value">
              R$ {{ formatCurrency(monthlyRevenue) }}
            </div>
            <div class="kpi-detail">
              <span class="kpi-trend">
                <i class="fas fa-arrow-up" /> 12% desde o mês passado
              </span>
            </div>
          </div>
        </div>
        
        <div class="kpi-card">
          <div class="kpi-icon satisfaction-icon">
            <i class="fas fa-star" />
          </div>
          <div class="kpi-content">
            <h3 class="kpi-title">
              Satisfação
            </h3>
            <div class="kpi-value">
              {{ satisfactionScore }}
            </div>
            <div class="kpi-detail">
              <span class="kpi-stars">
                <i class="fas fa-star" />
                <i class="fas fa-star" />
                <i class="fas fa-star" />
                <i class="fas fa-star" />
                <i class="fas fa-star-half-alt" />
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Charts Section -->
      <div class="charts-grid">
        <div class="chart-card revenue-chart">
          <h3 class="chart-title">
            Faturamento Mensal
          </h3>
          <div class="chart-container">
            <div class="chart-placeholder">
              <div class="chart-bars">
                <div
                  v-for="(item, index) in revenueData"
                  :key="index"
                  class="chart-bar-container"
                >
                  <div
                    class="chart-bar"
                    :style="{ height: `${(item.revenue / maxRevenue) * 100}%` }"
                  />
                  <div class="chart-label">
                    {{ item.month }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="chart-card equipment-chart">
          <h3 class="chart-title">
            Equipamentos por Status
          </h3>
          <div class="chart-container">
            <div class="chart-placeholder">
              <div class="status-chart">
                <div class="status-item">
                  <div
                    class="status-bar available"
                    :style="{ width: `${(availableEquipments.length / equipments.length) * 100}%` }"
                  />
                  <div class="status-label">
                    Disponível
                  </div>
                  <div class="status-value">
                    {{ availableEquipments.length }}
                  </div>
                </div>
                
                <div class="status-item">
                  <div
                    class="status-bar in-use"
                    :style="{ width: `${(inUseEquipments.length / equipments.length) * 100}%` }"
                  />
                  <div class="status-label">
                    Em Uso
                  </div>
                  <div class="status-value">
                    {{ inUseEquipments.length }}
                  </div>
                </div>
                
                <div class="status-item">
                  <div
                    class="status-bar maintenance"
                    :style="{ width: `${(maintenanceEquipments.length / equipments.length) * 100}%` }"
                  />
                  <div class="status-label">
                    Manutenção
                  </div>
                  <div class="status-value">
                    {{ maintenanceEquipments.length }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Equipment Table -->
      <div class="table-section">
        <div class="table-header">
          <h3 class="table-title">
            Equipamentos Recentes
          </h3>
          <router-link
            to="/equipment"
            class="view-all-btn"
          >
            Ver Todos <i class="fas fa-arrow-right" />
          </router-link>
        </div>
        
        <div class="equipment-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Modelo</th>
                <th>Tipo</th>
                <th>Status</th>
                <th>Localização</th>
                <th>Preço/Dia</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="equipment in recentEquipments"
                :key="equipment.id"
              >
                <td>{{ equipment.id }}</td>
                <td>{{ equipment.model }}</td>
                <td>{{ equipment.type }}</td>
                <td>
                  <span 
                    class="status-badge"
                    :class="`status-${equipment.status.toLowerCase().replace(' ', '-')}`"
                  >
                    {{ equipment.status }}
                  </span>
                </td>
                <td>{{ getShortAddress(equipment.location.address) }}</td>
                <td>R$ {{ equipment.price.toLocaleString('pt-BR') }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Regional Performance -->
      <div class="region-section">
        <h3 class="region-title">
          Desempenho Regional
        </h3>
        
        <div class="region-grid">
          <div
            v-for="(region, index) in regionPerformance"
            :key="index"
            class="region-card"
          >
            <div class="region-header">
              <h4 class="region-name">
                {{ region.region }}
              </h4>
              <div
                class="region-growth"
                :class="region.growth >= 0 ? 'positive' : 'negative'"
              >
                <i
                  class="fas"
                  :class="region.growth >= 0 ? 'fa-arrow-up' : 'fa-arrow-down'"
                />
                {{ Math.abs(region.growth) }}%
              </div>
            </div>
            
            <div class="region-stats">
              <div class="region-stat">
                <span class="stat-label">Faturamento</span>
                <span class="stat-value">R$ {{ formatCurrency(region.revenue) }}</span>
              </div>
              
              <div class="region-stat">
                <span class="stat-label">Equipamentos</span>
                <span class="stat-value">{{ region.equipmentCount }}</span>
              </div>
              
              <div class="region-stat">
                <span class="stat-label">Utilização</span>
                <span class="stat-value">{{ region.utilization }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useServicesStore } from '../../stores/services'
import { useScoresStore } from '../../stores/scores'

export default {
  name: 'DashboardView',
  setup() {
    const servicesStore = useServicesStore()
    const scoresStore = useScoresStore()
    
    const isLoading = ref(true)
    const error = ref(null)
    
    // Computed properties based on store data
    const equipments = computed(() => servicesStore.equipments)
    const availableEquipments = computed(() => servicesStore.availableEquipments)
    const inUseEquipments = computed(() => servicesStore.inUseEquipments)
    const maintenanceEquipments = computed(() => servicesStore.maintenanceEquipments)
    
    const revenueData = computed(() => scoresStore.revenueData)
    const regionPerformance = computed(() => scoresStore.regionPerformance)
    const satisfactionScore = computed(() => scoresStore.getLatestSatisfactionScore())
    
    // Dashboard calculations
    const utilizationRate = computed(() => scoresStore.calculateAverageUtilization())
    
    const monthlyRevenue = computed(() => {
      if (!revenueData.value || revenueData.value.length === 0) return 0
      return revenueData.value[revenueData.value.length - 1].revenue
    })
    
    const maxRevenue = computed(() => {
      if (!revenueData.value || revenueData.value.length === 0) return 1
      return Math.max(...revenueData.value.map(item => item.revenue))
    })
    
    // Recent equipment (top 5)
    const recentEquipments = computed(() => {
      return equipments.value.slice(0, 5)
    })
    
    // Fetch data
    async function loadData() {
      isLoading.value = true
      error.value = null
      
      try {
        await Promise.all([
          servicesStore.fetchEquipments(),
          scoresStore.loadScores()
        ])
        
        isLoading.value = false
      } catch (err) {
        console.error('Error loading dashboard data:', err)
        error.value = 'Falha ao carregar dados do dashboard. Por favor, tente novamente.'
        isLoading.value = false
      }
    }
    
    // Format currency
    function formatCurrency(value) {
      return value.toLocaleString('pt-BR')
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
    
    // Load data when component mounts
    onMounted(async () => {
      await loadData()
    })
    
    return {
      equipments,
      availableEquipments,
      inUseEquipments,
      maintenanceEquipments,
      revenueData,
      regionPerformance,
      satisfactionScore,
      utilizationRate,
      monthlyRevenue,
      maxRevenue,
      recentEquipments,
      isLoading,
      error,
      loadData,
      formatCurrency,
      getShortAddress
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  padding: 24px;
}

.dashboard-title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 24px;
  color: var(--color-primary-dark);
}

.loading-spinner, .error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
}

.loading-spinner i, .error-message i {
  margin-bottom: 16px;
  color: var(--color-primary);
}

.error-message i {
  color: var(--color-error);
}

.retry-button {
  margin-top: 16px;
  padding: 10px 20px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Stats Cards - For statistics in a single row */
.stats-container {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
}

.stats-card {
  background-color: white;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  box-shadow: var(--shadow-sm);
  flex: 1;
  min-width: 200px;
}

.stats-icon {
  font-size: 28px;
  margin-right: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stats-content {
  display: flex;
  flex-direction: column;
}

.stats-value {
  font-size: 24px;
  font-weight: 700;
  line-height: 1.2;
}

.stats-label {
  font-size: 14px;
  color: var(--color-text-light);
}

/* KPI Cards */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.kpi-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  box-shadow: var(--shadow-sm);
}

.kpi-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 16px;
  font-size: 24px;
}

.equipment-icon {
  background-color: rgba(25, 118, 210, 0.1);
  color: var(--color-primary);
}

.utilization-icon {
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--color-success);
}

.revenue-icon {
  background-color: rgba(255, 152, 0, 0.1);
  color: var(--color-secondary);
}

.satisfaction-icon {
  background-color: rgba(244, 67, 54, 0.1);
  color: var(--color-error);
}

.kpi-content {
  flex: 1;
}

.kpi-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-light);
  margin-bottom: 4px;
}

.kpi-value {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 4px;
}

.kpi-detail {
  font-size: 14px;
}

.kpi-available {
  color: var(--color-success);
}

.kpi-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-success);
}

.kpi-trend i {
  font-size: 12px;
}

.kpi-stars {
  color: var(--color-secondary);
  font-size: 16px;
}

/* Charts Section */
.charts-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
  margin-bottom: 32px;
}

.chart-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: var(--shadow-sm);
}

.chart-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--color-primary-dark);
}

.chart-container {
  height: 250px;
  position: relative;
}

.chart-placeholder {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: flex-end;
}

/* Revenue Chart */
.chart-bars {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
  height: 100%;
  padding-top: 30px;
}

.chart-bar-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  height: 100%;
}

.chart-bar {
  width: 40px;
  background-color: var(--color-primary);
  border-radius: 4px 4px 0 0;
  transition: height 1s ease-out;
}

.chart-label {
  margin-top: 8px;
  font-size: 12px;
  color: var(--color-text-light);
}

/* Status Chart */
.status-chart {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  height: 100%;
  justify-content: center;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
}

.status-bar {
  height: 24px;
  border-radius: 4px;
  transition: width 1s ease-out;
}

.status-bar.available {
  background-color: var(--color-success);
}

.status-bar.in-use {
  background-color: var(--color-info);
}

.status-bar.maintenance {
  background-color: var(--color-warning);
}

.status-label {
  width: 80px;
  font-size: 14px;
}

.status-value {
  font-size: 14px;
  font-weight: 600;
}

/* Equipment Table */
.table-section {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 32px;
  box-shadow: var(--shadow-sm);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary-dark);
}

.view-all-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-primary);
  font-weight: 500;
  text-decoration: none;
}

.equipment-table {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background-color: var(--color-background);
}

th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: var(--color-text-light);
  font-size: 14px;
}

td {
  padding: 12px 16px;
  border-top: 1px solid var(--color-border);
  font-size: 14px;
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.status-disponível {
  background-color: rgba(76, 175, 80, 0.1);
  color: var(--color-success);
}

.status-badge.status-em-uso {
  background-color: rgba(33, 150, 243, 0.1);
  color: var(--color-info);
}

.status-badge.status-manutenção {
  background-color: rgba(255, 152, 0, 0.1);
  color: var(--color-warning);
}

/* Regional Performance */
.region-section {
  margin-bottom: 32px;
}

.region-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--color-primary-dark);
}

.region-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
}

.region-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: var(--shadow-sm);
}

.region-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.region-name {
  font-size: 18px;
  font-weight: 600;
}

.region-growth {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 600;
}

.region-growth.positive {
  color: var(--color-success);
}

.region-growth.negative {
  color: var(--color-error);
}

.region-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.region-stat {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 14px;
  color: var(--color-text-light);
  margin-bottom: 4px;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
}

/* Responsive styles */
@media (max-width: 1200px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
}

/* Tablet styles */
@media (max-width: 900px) {
  .stats-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 16px;
  }
  
  .kpi-grid, .region-grid {
    grid-template-columns: 1fr;
  }
  
  .equipment-table {
    overflow-x: auto;
  }
  
  table {
    min-width: 600px;
  }
}

/* Mobile styles */
@media (max-width: 576px) {
  .stats-container {
    grid-template-columns: 1fr;
  }
  
  .stats-card {
    min-width: 100%;
  }
}
</style>