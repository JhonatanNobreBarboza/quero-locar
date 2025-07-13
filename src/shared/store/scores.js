import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Store for managing financial and performance data
 * This leverages the same architecture pattern but uses static data for demo purposes
 */
export const useScoresStore = defineStore('scores', () => {
  // State
  const revenueData = ref([
    { month: 'Jan', revenue: 120000 },
    { month: 'Fev', revenue: 145000 },
    { month: 'Mar', revenue: 165000 },
    { month: 'Abr', revenue: 140000 },
    { month: 'Mai', revenue: 180000 },
    { month: 'Jun', revenue: 210000 }
  ]);
  
  const satisfactionScores = ref([
    { date: '2023-01-15', score: 4.2 },
    { date: '2023-02-15', score: 4.3 },
    { date: '2023-03-15', score: 4.1 },
    { date: '2023-04-15', score: 4.4 },
    { date: '2023-05-15', score: 4.6 },
    { date: '2023-06-15', score: 4.7 }
  ]);
  
  const regionPerformance = ref([
    {
      region: 'Três Lagoas',
      revenue: 95000,
      equipmentCount: 48,
      utilization: 78,
      growth: 12
    },
    {
      region: 'Campo Grande',
      revenue: 120000,
      equipmentCount: 72,
      utilization: 82,
      growth: 8
    },
    {
      region: 'Dourados',
      revenue: 75000,
      equipmentCount: 35,
      utilization: 65,
      growth: -3
    },
    {
      region: 'Andradina',
      revenue: 45000,
      equipmentCount: 22,
      utilization: 70,
      growth: 5
    },
    {
      region: 'Ivinhema',
      revenue: 38000,
      equipmentCount: 18,
      utilization: 75,
      growth: 15
    }
  ]);
  
  // Actions
  function loadScores() {
    // In a real application, this would fetch data from an API or repository
    // For now, we'll just use the mock data above
    return Promise.resolve({
      revenueData: revenueData.value,
      satisfactionScores: satisfactionScores.value,
      regionPerformance: regionPerformance.value
    });
  }
  
  function getLatestSatisfactionScore() {
    if (satisfactionScores.value.length === 0) return 0;
    return satisfactionScores.value[satisfactionScores.value.length - 1].score;
  }
  
  function calculateAverageUtilization() {
    if (regionPerformance.value.length === 0) return 0;
    
    const total = regionPerformance.value.reduce((sum, region) => sum + region.utilization, 0);
    return Math.round(total / regionPerformance.value.length);
  }
  
  // In a real application, we would add functionality to update these metrics
  function updateRevenue(monthIndex, newRevenue) {
    if (monthIndex >= 0 && monthIndex < revenueData.value.length) {
      revenueData.value[monthIndex].revenue = newRevenue;
      // In a real application, we'd save to an API or repository here
      return true;
    }
    return false;
  }
  
  function addMonthlyRevenue(month, revenue) {
    revenueData.value.push({ month, revenue });
    // In a real application, we'd save to an API or repository here
    return revenueData.value.length - 1; // Return index of the new item
  }
  
  function updateSatisfactionScore(score) {
    const newScore = {
      date: new Date().toISOString().split('T')[0],
      score
    };
    satisfactionScores.value.push(newScore);
    // In a real application, we'd save to an API or repository here
    return satisfactionScores.value.length - 1; // Return index of the new item
  }
  
  return {
    revenueData,
    satisfactionScores,
    regionPerformance,
    loadScores,
    getLatestSatisfactionScore,
    calculateAverageUtilization,
    updateRevenue,
    addMonthlyRevenue,
    updateSatisfactionScore
  };
});