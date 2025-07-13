import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * Store for managing financial and performance data
 * This store provides data for financial charts and metrics used in the application
 */
export const useScoresStore = defineStore('scores', () => {
  // State for financial data
  const financialData = ref({
    // Monthly financial data for the past 12 months
    monthlyData: [
      { month: 'Jul', revenues: 220000, expenses: 154000 },
      { month: 'Ago', revenues: 235000, expenses: 158000 },
      { month: 'Set', revenues: 248000, expenses: 165000 },
      { month: 'Out', revenues: 262000, expenses: 172000 },
      { month: 'Nov', revenues: 275000, expenses: 178000 },
      { month: 'Dez', revenues: 295000, expenses: 188000 },
      { month: 'Jan', revenues: 270000, expenses: 180000 },
      { month: 'Fev', revenues: 285000, expenses: 185000 },
      { month: 'Mar', revenues: 310000, expenses: 195000 },
      { month: 'Abr', revenues: 295000, expenses: 190000 },
      { month: 'Mai', revenues: 320000, expenses: 200000 },
      { month: 'Jun', revenues: 340000, expenses: 215000 }
    ],
    
    // Equipment-specific revenue data
    equipmentRevenue: [
      { type: 'Caçambas', revenue: 112000, percentage: 32.9 },
      { type: 'Betoneiras', revenue: 87500, percentage: 25.7 },
      { type: 'Andaimes', revenue: 45800, percentage: 13.5 },
      { type: 'Carretinhas', revenue: 65200, percentage: 19.2 },
      { type: 'Outros', revenue: 29500, percentage: 8.7 }
    ],
    
    // Expense category data
    expenseCategories: [
      { category: 'Manutenção', value: 68000, percentage: 31.6 },
      { category: 'Salários', value: 72000, percentage: 33.5 },
      { category: 'Operações', value: 32500, percentage: 15.1 },
      { category: 'Marketing', value: 24500, percentage: 11.4 },
      { category: 'Administrativo', value: 18000, percentage: 8.4 }
    ],
    
    // Client data 
    clientRevenue: [
      { client: 'Construções Renovar', revenue: 85000, percentage: 25.0 },
      { client: 'Empreiteira Novos Horizontes', revenue: 65000, percentage: 19.1 },
      { client: 'Engenharia Sólida', revenue: 52000, percentage: 15.3 },
      { client: 'Construtora Pilar', revenue: 48000, percentage: 14.1 },
      { client: 'Outros', revenue: 90000, percentage: 26.5 }
    ],
    
    // Region data
    regionData: [
      { region: 'Três Lagoas', revenue: 108000, utilization: 78 },
      { region: 'Campo Grande', revenue: 126000, utilization: 82 },
      { region: 'Dourados', revenue: 63000, utilization: 65 },
      { region: 'Andradina', revenue: 28000, utilization: 70 },
      { region: 'Ivinhema', revenue: 15000, utilization: 75 }
    ],
    
    // Profit margin by month
    profitMargins: [
      { month: 'Jul', value: 30 },
      { month: 'Ago', value: 33 },
      { month: 'Set', value: 34 },
      { month: 'Out', value: 34 },
      { month: 'Nov', value: 35 },
      { month: 'Dez', value: 36 },
      { month: 'Jan', value: 33 },
      { month: 'Fev', value: 35 },
      { month: 'Mar', value: 37 },
      { month: 'Abr', value: 36 },
      { month: 'Mai', value: 37 },
      { month: 'Jun', value: 37 }
    ],
    
    // KPIs
    kpis: {
      currentMonthRevenue: 340000,
      currentMonthExpenses: 215000,
      previousMonthRevenue: 320000,
      previousMonthExpenses: 200000,
      revenueGrowth: 6.25,
      expenseGrowth: 7.5,
      utilizationRate: 76
    }
  })
  
  // Computed values based on financial data
  const currentMonthRevenue = computed(() => financialData.value.kpis.currentMonthRevenue)
  const currentMonthExpenses = computed(() => financialData.value.kpis.currentMonthExpenses)
  const currentMonthProfit = computed(() => currentMonthRevenue.value - currentMonthExpenses.value)
  const profitMargin = computed(() => Math.round((currentMonthProfit.value / currentMonthRevenue.value) * 100))
  
  // Get data for revenue vs expense chart
  const getRevenueExpenseData = (period = 'last6months') => {
    const monthlyData = [...financialData.value.monthlyData]
    
    // Default to the most recent 6 months
    let months = 6
    
    if (period === 'last12months') {
      months = 12
    } else if (period === 'year') {
      // Current year (January to December)
      const currentMonth = new Date().getMonth()
      return monthlyData.slice(6 - currentMonth, 18 - currentMonth)
    }
    
    // Return the last X months
    return monthlyData.slice(monthlyData.length - months)
  }
  
  // Get profit margin data
  const getProfitMarginData = (period = 'last6months') => {
    const profitMargins = [...financialData.value.profitMargins]
    
    // Default to the most recent 6 months
    let months = 6
    
    if (period === 'last12months') {
      months = 12
    } else if (period === 'year') {
      // Current year (January to December)
      const currentMonth = new Date().getMonth()
      return profitMargins.slice(6 - currentMonth, 18 - currentMonth)
    }
    
    // Return the last X months
    return profitMargins.slice(profitMargins.length - months)
  }
  
  // Get equipment revenue sources data
  const getEquipmentRevenueSources = () => {
    return financialData.value.equipmentRevenue
  }
  
  // Get expense categories data
  const getExpenseCategories = () => {
    return financialData.value.expenseCategories
  }
  
  // Load financial data (simulating API call)
  const loadFinancialData = async () => {
    // In a real application, this would be a call to an API endpoint
    return new Promise(resolve => {
      setTimeout(() => {
        // Data is already loaded in the store, so we just resolve the promise
        resolve(financialData.value)
      }, 800) // Simulate network delay
    })
  }
  
  // Get region performance data
  const getRegionPerformance = () => {
    return financialData.value.regionData
  }
  
  // Get client revenue data
  const getClientRevenue = () => {
    return financialData.value.clientRevenue
  }
  
  // Calculate total revenue for a given period
  const calculateTotalRevenue = (period = 'last6months') => {
    const data = getRevenueExpenseData(period)
    return data.reduce((sum, month) => sum + month.revenues, 0)
  }
  
  // Calculate total expenses for a given period
  const calculateTotalExpenses = (period = 'last6months') => {
    const data = getRevenueExpenseData(period)
    return data.reduce((sum, month) => sum + month.expenses, 0)
  }
  
  // Calculate average profit margin for a given period
  const calculateAverageProfitMargin = (period = 'last6months') => {
    const data = getProfitMarginData(period)
    const total = data.reduce((sum, month) => sum + month.value, 0)
    return Math.round(total / data.length)
  }
  
  return {
    financialData,
    currentMonthRevenue,
    currentMonthExpenses,
    currentMonthProfit,
    profitMargin,
    getRevenueExpenseData,
    getProfitMarginData,
    getEquipmentRevenueSources,
    getExpenseCategories,
    getRegionPerformance,
    getClientRevenue,
    calculateTotalRevenue,
    calculateTotalExpenses,
    calculateAverageProfitMargin,
    loadFinancialData
  }
})