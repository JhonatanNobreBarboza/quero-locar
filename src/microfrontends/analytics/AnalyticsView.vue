<template>
  <div class="analytics-container">
    <h1 class="page-title">
      Analytics & Relatórios
    </h1>
    
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="loading-container"
    >
      <div class="loading-spinner" />
      <p>Carregando dados de analytics...</p>
    </div>
    
    <!-- Error State -->
    <div
      v-else-if="error"
      class="error-message"
    >
      <i class="fas fa-exclamation-triangle" />
      <p>{{ error }}</p>
      <button
        class="retry-btn"
        @click="loadData"
      >
        Tentar Novamente
      </button>
    </div>
    
    <!-- Analytics Content -->
    <div
      v-else
      class="analytics-content"
    >
      <!-- Report Controls -->
      <div class="report-controls">
        <div class="date-range">
          <div class="date-field">
            <label>Data Inicial</label>
            <input
              v-model="dateRange.start"
              type="date"
              @change="updateReports"
            >
          </div>
          <div class="date-field">
            <label>Data Final</label>
            <input
              v-model="dateRange.end"
              type="date"
              @change="updateReports"
            >
          </div>
        </div>
        
        <div class="report-actions">
          <button class="action-btn">
            <i class="fas fa-download" /> Exportar Relatórios
          </button>
          <button class="action-btn">
            <i class="fas fa-print" /> Imprimir
          </button>
        </div>
      </div>
      
      <!-- KPI Cards -->
      <div class="kpi-cards">
        <div class="kpi-card">
          <div class="kpi-icon revenue-icon">
            <i class="fas fa-dollar-sign" />
          </div>
          <div class="kpi-content">
            <div class="kpi-value">
              R$ {{ formatCurrency(totalRevenue) }}
            </div>
            <div class="kpi-label">
              Receita Total
            </div>
            <div class="kpi-trend positive">
              <i class="fas fa-arrow-up" /> 8.5% desde o último mês
            </div>
          </div>
        </div>
        
        <div class="kpi-card">
          <div class="kpi-icon rentals-icon">
            <i class="fas fa-handshake" />
          </div>
          <div class="kpi-content">
            <div class="kpi-value">
              {{ totalRentals }}
            </div>
            <div class="kpi-label">
              Total de Locações
            </div>
            <div class="kpi-trend positive">
              <i class="fas fa-arrow-up" /> 12% desde o último mês
            </div>
          </div>
        </div>
        
        <div class="kpi-card">
          <div class="kpi-icon utilization-icon">
            <i class="fas fa-chart-pie" />
          </div>
          <div class="kpi-content">
            <div class="kpi-value">
              {{ utilizationRate }}%
            </div>
            <div class="kpi-label">
              Taxa de Utilização
            </div>
            <div class="kpi-trend positive">
              <i class="fas fa-arrow-up" /> 5% desde o último mês
            </div>
          </div>
        </div>
        
        <div class="kpi-card">
          <div class="kpi-icon satisfaction-icon">
            <i class="fas fa-star" />
          </div>
          <div class="kpi-content">
            <div class="kpi-value">
              {{ satisfactionScore }}
            </div>
            <div class="kpi-label">
              Satisfação do Cliente
            </div>
            <div class="kpi-trend positive">
              <i class="fas fa-arrow-up" /> 0.2 desde o último mês
            </div>
          </div>
        </div>
      </div>
      
      <!-- Chart Grids -->
      <div class="chart-grid">
        <div class="chart-card">
          <div class="card-header">
            <h2>Receita Mensal</h2>
            <div class="header-actions">
              <button class="card-action-btn">
                <i class="fas fa-ellipsis-v" />
              </button>
            </div>
          </div>
          <div class="card-content">
            <canvas
              id="revenue-chart"
              class="chart"
            />
          </div>
        </div>
        
        <div class="chart-card">
          <div class="card-header">
            <h2>Utilização por Tipo de Equipamento</h2>
            <div class="header-actions">
              <button class="card-action-btn">
                <i class="fas fa-ellipsis-v" />
              </button>
            </div>
          </div>
          <div class="card-content">
            <canvas
              id="equipment-chart"
              class="chart"
            />
          </div>
        </div>
        
        <div class="chart-card">
          <div class="card-header">
            <h2>Performance por Região</h2>
            <div class="header-actions">
              <button class="card-action-btn">
                <i class="fas fa-ellipsis-v" />
              </button>
            </div>
          </div>
          <div class="card-content">
            <div class="table-container">
              <table class="region-table">
                <thead>
                  <tr>
                    <th>Região</th>
                    <th>Receita</th>
                    <th>Crescimento</th>
                    <th>Equipamentos</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(region, index) in regionPerformance"
                    :key="index"
                  >
                    <td>{{ region.region }}</td>
                    <td>R$ {{ formatCurrency(region.revenue) }}</td>
                    <td class="growth-cell">
                      <span :class="['growth-value', region.growth > 0 ? 'positive' : 'negative']">
                        <i :class="region.growth > 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'" />
                        {{ region.growth }}%
                      </span>
                    </td>
                    <td>{{ region.equipmentCount || 0 }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <div class="chart-card">
          <div class="card-header">
            <h2>Satisfação do Cliente</h2>
            <div class="header-actions">
              <button class="card-action-btn">
                <i class="fas fa-ellipsis-v" />
              </button>
            </div>
          </div>
          <div class="card-content">
            <canvas
              id="satisfaction-chart"
              class="chart"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useScoresStore } from '../../shared/store/scores';
import Chart from 'chart.js/auto';

export default {
  name: 'AnalyticsView',
  setup() {
    const scoresStore = useScoresStore();
    // No need to use servicesStore for now
    
    // State
    const isLoading = ref(true);
    const error = ref(null);
    const revenueChart = ref(null);
    const equipmentChart = ref(null);
    const satisfactionChart = ref(null);
    const dateRange = ref({
      start: '2025-01-01',
      end: '2025-07-09',
    });
    
    // Computed values
    const totalRevenue = ref(2345000);
    const totalRentals = ref(87);
    const utilizationRate = ref(76);
    const satisfactionScore = ref(4.6);
    const regionPerformance = ref([]);
    
    // Methods
    async function loadData() {
      try {
        isLoading.value = true;
        error.value = null;
        
        // Load data from stores
        if (scoresStore.revenueData.length === 0) {
          await scoresStore.loadScores();
        }
        
        regionPerformance.value = scoresStore.regionPerformance.map(region => ({
          ...region,
          equipmentCount: Math.floor(Math.random() * 30) + 10 // Mock data
        }));
        
        // Initialize charts after data is loaded
        setTimeout(() => {
          initCharts();
        }, 100);
        
        isLoading.value = false;
      } catch (err) {
        isLoading.value = false;
        error.value = 'Erro ao carregar dados de analytics. Por favor, tente novamente.';
        console.error('Error loading analytics data:', err);
      }
    }
    
    function updateReports() {
      // In a real application, this would fetch new data based on the date range
      console.log('Updating reports for date range:', dateRange.value);
      // For demo purposes, we'll just re-initialize the charts
      if (revenueChart.value) revenueChart.value.destroy();
      if (equipmentChart.value) equipmentChart.value.destroy();
      if (satisfactionChart.value) satisfactionChart.value.destroy();
      
      setTimeout(() => {
        initCharts();
      }, 100);
    }
    
    function formatCurrency(value) {
      return value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
    
    function initCharts() {
      // Revenue Chart
      const revenueCtx = document.getElementById('revenue-chart');
      if (revenueCtx) {
        revenueChart.value = new Chart(revenueCtx, {
          type: 'bar',
          data: {
            labels: scoresStore.revenueData.map(d => d.month),
            datasets: [{
              label: 'Receita Mensal (R$)',
              data: scoresStore.revenueData.map(d => d.revenue),
              backgroundColor: '#1976d2',
              borderColor: '#1976d2',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  callback: function(value) {
                    return value.toLocaleString('pt-BR', { 
                      style: 'currency',
                      currency: 'BRL',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0
                    });
                  }
                }
              }
            }
          }
        });
      }
      
      // Equipment Utilization Chart
      const equipmentCtx = document.getElementById('equipment-chart');
      if (equipmentCtx) {
        equipmentChart.value = new Chart(equipmentCtx, {
          type: 'horizontalBar',
          data: {
            labels: scoresStore.equipmentUtilization.map(d => d.type),
            datasets: [{
              label: 'Taxa de Utilização (%)',
              data: scoresStore.equipmentUtilization.map(d => d.utilization),
              backgroundColor: [
                '#1976d2',
                '#42a5f5',
                '#0d47a1',
                '#64b5f6',
                '#01579b',
                '#90caf9'
              ],
              borderWidth: 0
            }]
          },
          options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              x: {
                beginAtZero: true,
                max: 100,
                ticks: {
                  callback: function(value) {
                    return value + '%';
                  }
                }
              }
            }
          }
        });
      }
      
      // Client Satisfaction Chart
      const satisfactionCtx = document.getElementById('satisfaction-chart');
      if (satisfactionCtx) {
        satisfactionChart.value = new Chart(satisfactionCtx, {
          type: 'line',
          data: {
            labels: scoresStore.clientSatisfaction.map(d => d.month),
            datasets: [{
              label: 'Satisfação do Cliente (1-5)',
              data: scoresStore.clientSatisfaction.map(d => d.score),
              backgroundColor: 'rgba(40, 167, 69, 0.2)',
              borderColor: '#28a745',
              borderWidth: 2,
              tension: 0.3,
              fill: true,
              pointBackgroundColor: '#28a745',
              pointBorderColor: '#ffffff',
              pointRadius: 5,
              pointHoverRadius: 7
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 5,
                ticks: {
                  stepSize: 1
                }
              }
            }
          }
        });
      }
    }
    
    // Lifecycle hooks
    onMounted(() => {
      loadData();
    });
    
    return {
      isLoading,
      error,
      dateRange,
      totalRevenue,
      totalRentals,
      utilizationRate,
      satisfactionScore,
      regionPerformance,
      formatCurrency,
      loadData,
      updateReports
    };
  }
};
</script>

<style scoped>
.analytics-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 1.5rem;
}

/* Loading & Error States */
.loading-container,
.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
  margin-top: 2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(25, 118, 210, 0.1);
  border-radius: 50%;
  border-top-color: var(--color-primary);
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-message i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--color-error);
}

.retry-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
}

/* Report Controls */
.report-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  background-color: white;
  padding: 1rem 1.5rem;
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
}

.date-range {
  display: flex;
  gap: 1rem;
}

.date-field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.date-field label {
  font-size: 0.75rem;
  color: var(--color-text-light);
}

.date-field input {
  padding: 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 0.875rem;
}

.report-actions {
  display: flex;
  gap: 0.75rem;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  background-color: white;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.action-btn:hover {
  background-color: #f0f0f0;
}

/* KPI Cards */
.kpi-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.kpi-card {
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: var(--shadow-sm);
}

.kpi-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.revenue-icon {
  background-color: #1976d2;
}

.rentals-icon {
  background-color: #28a745;
}

.utilization-icon {
  background-color: #ffa726;
}

.satisfaction-icon {
  background-color: #6f42c1;
}

.kpi-content {
  flex-grow: 1;
}

.kpi-value {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.kpi-label {
  font-size: 0.875rem;
  color: var(--color-text-light);
  margin-bottom: 0.5rem;
}

.kpi-trend {
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.kpi-trend.positive {
  color: var(--color-success);
}

.kpi-trend.negative {
  color: var(--color-error);
}

/* Chart Grid */
.chart-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
}

.chart-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.chart-card:nth-child(1) {
  grid-column: span 8;
  grid-row: span 1;
}

.chart-card:nth-child(2) {
  grid-column: span 4;
  grid-row: span 1;
}

.chart-card:nth-child(3) {
  grid-column: span 6;
  grid-row: span 1;
}

.chart-card:nth-child(4) {
  grid-column: span 6;
  grid-row: span 1;
}

.card-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h2 {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0;
}

.card-action-btn {
  background: none;
  border: none;
  color: var(--color-text-light);
  cursor: pointer;
}

.card-content {
  padding: 1.5rem;
  height: 300px;
}

/* Table Styles */
.table-container {
  height: 100%;
  overflow-y: auto;
}

.region-table {
  width: 100%;
  border-collapse: collapse;
}

.region-table th {
  text-align: left;
  padding: 0.75rem;
  font-size: 0.875rem;
  color: var(--color-text-light);
  border-bottom: 1px solid var(--color-border);
}

.region-table td {
  padding: 0.75rem;
  font-size: 0.875rem;
  border-bottom: 1px solid var(--color-border);
}

.growth-cell {
  text-align: center;
}

.growth-value {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.growth-value.positive {
  background-color: rgba(40, 167, 69, 0.1);
  color: var(--color-success);
}

.growth-value.negative {
  background-color: rgba(220, 53, 69, 0.1);
  color: var(--color-error);
}

/* Chart */
.chart {
  width: 100%;
  height: 100%;
}

/* Responsive */
@media (max-width: 1200px) {
  .chart-card:nth-child(1),
  .chart-card:nth-child(2),
  .chart-card:nth-child(3),
  .chart-card:nth-child(4) {
    grid-column: span 12;
  }
  
  .kpi-cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .report-controls {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .date-range {
    width: 100%;
    justify-content: space-between;
  }
  
  .report-actions {
    width: 100%;
    justify-content: space-between;
  }
  
  .kpi-cards {
    grid-template-columns: 1fr;
  }
}
</style>