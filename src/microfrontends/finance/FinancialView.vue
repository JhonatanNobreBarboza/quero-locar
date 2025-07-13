<template>
  <div class="finance-container">
    <h1 class="finance-title">
      Financeiro
    </h1>
    
    <div
      v-if="isLoading"
      class="loading-spinner"
    >
      <i class="fas fa-circle-notch fa-spin fa-3x" />
      <p>Carregando dados financeiros...</p>
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
      class="finance-content"
    >
      <!-- Financial KPI Cards -->
      <div class="finance-kpi-grid">
        <div class="kpi-card">
          <div class="kpi-icon revenue-icon">
            <i class="fas fa-dollar-sign" />
          </div>
          <div class="kpi-content">
            <h3 class="kpi-title">
              Receita Mensal
            </h3>
            <div class="kpi-value">
              R$ {{ formatCurrency(monthlyRevenue) }}
            </div>
            <div class="kpi-detail">
              <span class="kpi-trend positive">
                <i class="fas fa-arrow-up" /> 12% em relação ao mês anterior
              </span>
            </div>
          </div>
        </div>
        
        <div class="kpi-card">
          <div class="kpi-icon expense-icon">
            <i class="fas fa-file-invoice-dollar" />
          </div>
          <div class="kpi-content">
            <h3 class="kpi-title">
              Despesas
            </h3>
            <div class="kpi-value">
              R$ {{ formatCurrency(monthlyExpenses) }}
            </div>
            <div class="kpi-detail">
              <span class="kpi-trend negative">
                <i class="fas fa-arrow-up" /> 3% em relação ao mês anterior
              </span>
            </div>
          </div>
        </div>
        
        <div class="kpi-card">
          <div class="kpi-icon profit-icon">
            <i class="fas fa-chart-line" />
          </div>
          <div class="kpi-content">
            <h3 class="kpi-title">
              Lucro Líquido
            </h3>
            <div class="kpi-value">
              R$ {{ formatCurrency(netProfit) }}
            </div>
            <div class="kpi-detail">
              <span class="kpi-trend positive">
                <i class="fas fa-arrow-up" /> 15% em relação ao mês anterior
              </span>
            </div>
          </div>
        </div>
        
        <div class="kpi-card">
          <div class="kpi-icon utilization-icon">
            <i class="fas fa-percentage" />
          </div>
          <div class="kpi-content">
            <h3 class="kpi-title">
              Margem de Lucro
            </h3>
            <div class="kpi-value">
              {{ profitMargin }}%
            </div>
            <div class="kpi-detail">
              <span class="kpi-trend positive">
                <i class="fas fa-arrow-up" /> 2.5% em relação ao mês anterior
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Charts Grid -->
      <div class="finance-charts-grid">
        <!-- Revenue vs Expenses Chart -->
        <div class="chart-card revenue-expense-chart">
          <div class="chart-header">
            <h3 class="chart-title">
              Receitas vs Despesas
            </h3>
            <div class="chart-actions">
              <select
                v-model="revenueChartPeriod"
                class="period-selector"
              >
                <option value="last6months">
                  Últimos 6 meses
                </option>
                <option value="last12months">
                  Últimos 12 meses
                </option>
                <option value="year">
                  Este ano
                </option>
              </select>
            </div>
          </div>
          
          <div class="chart-container">
            <canvas ref="revenueExpenseChart" />
          </div>
        </div>
        
        <!-- Profit Margin Chart -->
        <div class="chart-card profit-margin-chart">
          <div class="chart-header">
            <h3 class="chart-title">
              Margem de Lucro
            </h3>
            <div class="chart-actions">
              <select
                v-model="profitMarginChartPeriod"
                class="period-selector"
              >
                <option value="last6months">
                  Últimos 6 meses
                </option>
                <option value="last12months">
                  Últimos 12 meses
                </option>
                <option value="year">
                  Este ano
                </option>
              </select>
            </div>
          </div>
          
          <div class="chart-container">
            <canvas ref="profitMarginChart" />
          </div>
        </div>
      </div>
      
      <!-- Second Row of Charts -->
      <div class="finance-charts-grid">
        <!-- Revenue Sources Chart -->
        <div class="chart-card revenue-sources-chart">
          <h3 class="chart-title">
            Fontes de Receita
          </h3>
          <div class="chart-container donut-chart-container">
            <canvas ref="revenueSourcesChart" />
          </div>
          
          <div class="chart-legend">
            <div
              v-for="(source, index) in revenueSources"
              :key="index"
              class="legend-item"
            >
              <div
                class="legend-color"
                :style="{ backgroundColor: chartColors[index % chartColors.length] }"
              />
              <div class="legend-text">
                <span class="legend-label">{{ source.name }}</span>
                <span class="legend-value">R$ {{ formatCurrency(source.value) }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Expense Categories Chart -->
        <div class="chart-card expense-categories-chart">
          <h3 class="chart-title">
            Categorias de Despesas
          </h3>
          <div class="chart-container donut-chart-container">
            <canvas ref="expenseCategoriesChart" />
          </div>
          
          <div class="chart-legend">
            <div
              v-for="(category, index) in expenseCategories"
              :key="index"
              class="legend-item"
            >
              <div
                class="legend-color"
                :style="{ backgroundColor: chartColors[(index + 5) % chartColors.length] }"
              />
              <div class="legend-text">
                <span class="legend-label">{{ category.name }}</span>
                <span class="legend-value">R$ {{ formatCurrency(category.value) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Financial Transactions -->
      <div class="transactions-section">
        <div class="section-header">
          <h3 class="section-title">
            Transações Recentes
          </h3>
          <div class="section-actions">
            <button class="btn-outline">
              Ver Todas
            </button>
          </div>
        </div>
        
        <div class="transactions-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Tipo</th>
                <th>Valor</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="transaction in recentTransactions"
                :key="transaction.id"
              >
                <td>#{{ transaction.id }}</td>
                <td>{{ formatDate(transaction.date) }}</td>
                <td>{{ transaction.description }}</td>
                <td>{{ transaction.category }}</td>
                <td>
                  <span 
                    class="transaction-type" 
                    :class="transaction.type === 'RECEITA' ? 'type-revenue' : 'type-expense'"
                  >
                    {{ transaction.type }}
                  </span>
                </td>
                <td 
                  class="transaction-amount"
                  :class="transaction.type === 'RECEITA' ? 'amount-positive' : 'amount-negative'"
                >
                  {{ transaction.type === 'RECEITA' ? '+' : '-' }} R$ {{ formatCurrency(transaction.amount) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useScoresStore } from '../../stores/scores'
import Chart from 'chart.js/auto'

export default {
  name: 'FinancialView',
  setup() {
    const scoresStore = useScoresStore()
    
    // Chart refs
    const revenueExpenseChart = ref(null)
    const profitMarginChart = ref(null)
    const revenueSourcesChart = ref(null)
    const expenseCategoriesChart = ref(null)
    
    // Chart instances
    let revenueExpenseChartInstance = null
    let profitMarginChartInstance = null
    let revenueSourcesChartInstance = null
    let expenseCategoriesChartInstance = null
    
    // Chart periods
    const revenueChartPeriod = ref('last6months')
    const profitMarginChartPeriod = ref('last6months')
    
    // UI state
    const isLoading = ref(true)
    const error = ref(null)
    
    // Chart colors
    const chartColors = [
      '#1976D2', '#2196F3', '#4CAF50', '#8BC34A', 
      '#CDDC39', '#FFC107', '#FF9800', '#FF5722',
      '#E91E63', '#9C27B0', '#673AB7'
    ]
    
    // Get financial data from store
    const monthlyRevenue = computed(() => scoresStore.currentMonthRevenue)
    const monthlyExpenses = computed(() => scoresStore.currentMonthExpenses)
    const netProfit = computed(() => scoresStore.currentMonthProfit)
    const profitMargin = computed(() => scoresStore.profitMargin)
    
    // Get revenue sources data from store
    const revenueSources = computed(() => {
      const sources = scoresStore.getEquipmentRevenueSources()
      return sources.map(source => ({
        name: `Locação de ${source.type}`,
        value: source.revenue
      }))
    })
    
    // Get expense categories from store
    const expenseCategories = computed(() => {
      return scoresStore.getExpenseCategories().map(cat => ({
        name: cat.category,
        value: cat.value
      }))
    })
    
    // Recent transactions - this would typically come from an API in a real application
    const recentTransactions = ref([
      {
        id: '1254',
        date: '2025-07-07',
        description: 'Locação Caçamba 5m³',
        category: 'Locação',
        type: 'RECEITA',
        amount: 8500
      },
      {
        id: '1253',
        date: '2025-07-06',
        description: 'Manutenção preventiva',
        category: 'Manutenção',
        type: 'DESPESA',
        amount: 3200
      },
      {
        id: '1252',
        date: '2025-07-05',
        description: 'Locação Betoneira 150L',
        category: 'Locação',
        type: 'RECEITA',
        amount: 4200
      },
      {
        id: '1251',
        date: '2025-07-04',
        description: 'Compra de peças',
        category: 'Manutenção',
        type: 'DESPESA',
        amount: 1800
      },
      {
        id: '1250',
        date: '2025-07-03',
        description: 'Locação Andaime Fachadeiro',
        category: 'Locação',
        type: 'RECEITA',
        amount: 3600
      }
    ])
    
    // Load data from the store
    async function loadData() {
      isLoading.value = true
      error.value = null
      
      try {
        // Load financial data from the store
        await scoresStore.loadFinancialData()
        
        // After data is loaded, initialize charts
        initCharts()
        
        isLoading.value = false
      } catch (err) {
        console.error('Error loading financial data:', err)
        error.value = 'Falha ao carregar dados financeiros. Por favor, tente novamente.'
        isLoading.value = false
      }
    }
    
    // Initialize all charts
    function initCharts() {
      initRevenueExpenseChart()
      initProfitMarginChart()
      initRevenueSourcesChart()
      initExpenseCategoriesChart()
    }
    
    // Initialize Revenue vs Expenses chart
    function initRevenueExpenseChart() {
      if (revenueExpenseChartInstance) {
        revenueExpenseChartInstance.destroy()
      }
      
      // Get data from the store based on selected period
      const chartData = scoresStore.getRevenueExpenseData(revenueChartPeriod.value)
      const labels = chartData.map(item => item.month)
      const revenues = chartData.map(item => item.revenues)
      const expenses = chartData.map(item => item.expenses)
      
      const canvas = revenueExpenseChart.value.getContext('2d')
      
      revenueExpenseChartInstance = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Receitas',
              data: revenues,
              backgroundColor: 'rgba(33, 150, 243, 0.6)',
              borderColor: 'rgba(33, 150, 243, 1)',
              borderWidth: 1
            },
            {
              label: 'Despesas',
              data: expenses,
              backgroundColor: 'rgba(244, 67, 54, 0.6)',
              borderColor: 'rgba(244, 67, 54, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return 'R$ ' + value.toLocaleString('pt-BR')
                }
              }
            }
          },
          plugins: {
            legend: {
              position: 'top'
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.raw.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })
                  return `${context.dataset.label}: ${value}`
                }
              }
            }
          }
        }
      })
    }
    
    // Initialize Profit Margin chart
    function initProfitMarginChart() {
      if (profitMarginChartInstance) {
        profitMarginChartInstance.destroy()
      }
      
      // Get profit margin data from store
      const profitData = scoresStore.getProfitMarginData(profitMarginChartPeriod.value)
      const labels = profitData.map(item => item.month)
      const margins = profitData.map(item => item.value)
      
      const canvas = profitMarginChart.value.getContext('2d')
      
      profitMarginChartInstance = new Chart(canvas, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: 'Margem de Lucro (%)',
            data: margins,
            backgroundColor: 'rgba(76, 175, 80, 0.2)',
            borderColor: 'rgba(76, 175, 80, 1)',
            borderWidth: 2,
            fill: true,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 100,
              ticks: {
                callback: function(value) {
                  return value + '%'
                }
              }
            }
          },
          plugins: {
            legend: {
              display: false
            }
          }
        }
      })
    }
    
    // Initialize Revenue Sources chart
    function initRevenueSourcesChart() {
      if (revenueSourcesChartInstance) {
        revenueSourcesChartInstance.destroy()
      }
      
      const sources = revenueSources.value
      const canvas = revenueSourcesChart.value.getContext('2d')
      
      revenueSourcesChartInstance = new Chart(canvas, {
        type: 'doughnut',
        data: {
          labels: sources.map(source => source.name),
          datasets: [{
            data: sources.map(source => source.value),
            backgroundColor: chartColors.slice(0, sources.length),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.raw.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })
                  return `${context.label}: ${value}`
                }
              }
            }
          }
        }
      })
    }
    
    // Initialize Expense Categories chart
    function initExpenseCategoriesChart() {
      if (expenseCategoriesChartInstance) {
        expenseCategoriesChartInstance.destroy()
      }
      
      const categories = expenseCategories.value
      const canvas = expenseCategoriesChart.value.getContext('2d')
      
      expenseCategoriesChartInstance = new Chart(canvas, {
        type: 'doughnut',
        data: {
          labels: categories.map(category => category.name),
          datasets: [{
            data: categories.map(category => category.value),
            backgroundColor: chartColors.slice(5, 5 + categories.length),
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const value = context.raw.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                  })
                  return `${context.label}: ${value}`
                }
              }
            }
          }
        }
      })
    }
    
    // Format currency
    function formatCurrency(value) {
      return value.toLocaleString('pt-BR')
    }
    
    // Format date
    function formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('pt-BR')
    }
    
    // Watch for period changes and update charts
    watch(revenueChartPeriod, () => {
      initRevenueExpenseChart()
    })
    
    watch(profitMarginChartPeriod, () => {
      initProfitMarginChart()
    })
    
    // Load data when component mounts
    onMounted(() => {
      loadData()
      
      // Clean up charts on unmount
      return () => {
        if (revenueExpenseChartInstance) revenueExpenseChartInstance.destroy()
        if (profitMarginChartInstance) profitMarginChartInstance.destroy()
        if (revenueSourcesChartInstance) revenueSourcesChartInstance.destroy()
        if (expenseCategoriesChartInstance) expenseCategoriesChartInstance.destroy()
      }
    })
    
    return {
      // Chart refs
      revenueExpenseChart,
      profitMarginChart,
      revenueSourcesChart,
      expenseCategoriesChart,
      
      // Chart periods
      revenueChartPeriod,
      profitMarginChartPeriod,
      
      // UI state
      isLoading,
      error,
      
      // Data
      monthlyRevenue,
      monthlyExpenses,
      netProfit,
      profitMargin,
      revenueSources,
      expenseCategories,
      recentTransactions,
      chartColors,
      
      // Methods
      loadData,
      formatCurrency,
      formatDate
    }
  }
}
</script>