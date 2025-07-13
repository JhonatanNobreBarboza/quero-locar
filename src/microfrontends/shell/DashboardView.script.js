import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { format, formatDistance } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import mapboxgl from 'mapbox-gl';
import { useServicesStore } from '../../shared/store/services';
import { useScoresStore } from '../../shared/store/scores';

export default {
  name: 'DashboardView',
  setup() {
    // Stores
    const servicesStore = useServicesStore();
    const scoresStore = useScoresStore();

    // State
    const lastUpdate = ref(new Date());
    const locationFilter = ref('all');
    const mapInstance = ref(null);
    const equipmentByTypeChart = ref(null);
    const revenue = ref(145000); // Example fixed value for monthly revenue

    // Computed properties
    const lastUpdateFormatted = computed(() => {
      return format(lastUpdate.value, 'dd/MM/yyyy HH:mm', { locale: ptBR });
    });

    const availableEquipments = computed(() => {
      return servicesStore.getEquipmentsByStatus('DISPONÍVEL');
    });

    const inUseEquipments = computed(() => {
      return servicesStore.getEquipmentsByStatus('EM USO');
    });

    const maintenanceEquipments = computed(() => {
      return servicesStore.getEquipmentsByStatus('MANUTENÇÃO');
    });

    // Sample data for the dashboard
    const recentActivities = ref([
      {
        type: 'rental',
        title: 'Equipamento Alugado',
        description: 'Caminhão Basculante VW 24.280 alugado pela Obras Rápidas LTDA',
        time: new Date('2025-07-08T14:30:00')
      },
      {
        type: 'return',
        title: 'Equipamento Devolvido',
        description: 'Retroescavadeira JCB 3CX devolvida após locação pela ConstruBem',
        time: new Date('2025-07-08T11:15:00')
      },
      {
        type: 'maintenance',
        title: 'Manutenção Iniciada',
        description: 'Manutenção preventiva iniciada na Escavadeira CAT 320',
        time: new Date('2025-07-08T09:45:00')
      },
      {
        type: 'alert',
        title: 'Alerta de Operação',
        description: 'Alerta de sobrecarga reportado no Trator Komatsu D61EX-23',
        time: new Date('2025-07-07T16:20:00')
      },
      {
        type: 'system',
        title: 'Backup do Sistema',
        description: 'Backup automático dos dados do sistema concluído com sucesso',
        time: new Date('2025-07-07T03:00:00')
      }
    ]);

    const healthStatus = ref([
      {
        title: 'Excelente',
        count: 42,
        level: 'excellent',
        trend: 5
      },
      {
        title: 'Bom',
        count: 28,
        level: 'good',
        trend: -2
      },
      {
        title: 'Regular',
        count: 15,
        level: 'regular',
        trend: 0
      },
      {
        title: 'Crítico',
        count: 5,
        level: 'critical',
        trend: -8
      }
    ]);

    const upcomingMaintenance = ref([
      {
        id: 'eqp-002-2025',
        type: 'Caminhão',
        model: 'VW 24.280',
        daysLeft: 22
      },
      {
        id: 'eqp-001-2025',
        type: 'Escavadeira',
        model: 'CAT 320',
        daysLeft: 5
      },
      {
        id: 'eqp-005-2025',
        type: 'Trator',
        model: 'Komatsu D61EX-23',
        daysLeft: 27
      },
      {
        id: 'eqp-003-2025',
        type: 'Retroescavadeira',
        model: 'JCB 3CX',
        daysLeft: 1
      }
    ]);

    // Methods
    function formatCurrency(value) {
      return value.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }

    function calcPercentage(count) {
      const total = servicesStore.equipments.length;
      if (total === 0) return 0;
      return Math.round((count / total) * 100);
    }

    function getActivityIcon(type) {
      const icons = {
        rental: 'fas fa-handshake',
        return: 'fas fa-undo',
        maintenance: 'fas fa-tools',
        alert: 'fas fa-exclamation-triangle',
        system: 'fas fa-server'
      };
      
      return icons[type] || 'fas fa-info-circle';
    }

    function formatActivityTime(date) {
      return formatDistance(date, new Date(), { addSuffix: true, locale: ptBR });
    }

    function getMaintenanceUrgencyClass(daysLeft) {
      if (daysLeft <= 3) return 'urgent';
      if (daysLeft <= 7) return 'warning';
      return 'normal';
    }

    function initializeMap() {
      // Initialize Mapbox
      mapboxgl.accessToken = 'pk.eyJ1IjoicXVlcm9sb2NhciIsImEiOiJjbHVsMW1sZm0wcWJmMmpsdjQwbjZpcXgxIn0.nUVxhO4vZD3d-CPxb0E_Dw';
      
      mapInstance.value = new mapboxgl.Map({
        container: 'location-overview-map',
        style: 'mapbox://styles/mapbox/light-v10',
        center: [-49.0, -15.0], // Center on Brazil
        zoom: 3
      });
      
      // Add navigation controls
      mapInstance.value.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Wait for map to load before adding markers
      mapInstance.value.on('load', () => {
        updateMapMarkers();
      });
    }

    function updateMapMarkers() {
      // Filter equipments based on selected filter
      let equipmentsToShow = servicesStore.equipments;
      
      if (locationFilter.value === 'available') {
        equipmentsToShow = availableEquipments.value;
      } else if (locationFilter.value === 'inUse') {
        equipmentsToShow = inUseEquipments.value;
      }
      
      // Remove existing markers if any
      const markers = document.querySelectorAll('.mapboxgl-marker');
      markers.forEach(marker => marker.remove());
      
      // Add markers for each equipment
      equipmentsToShow.forEach(equipment => {
        // Create marker element
        const el = document.createElement('div');
        el.className = `map-marker status-${equipment.status.toLowerCase()}`;
        
        // Create icon element
        const icon = document.createElement('i');
        let iconClass = 'fas ';
        
        // Set different icon based on equipment type
        switch(equipment.type) {
          case 'Escavadeira':
            iconClass += 'fa-truck-monster';
            break;
          case 'Caminhão':
            iconClass += 'fa-truck';
            break;
          case 'Retroescavadeira':
            iconClass += 'fa-truck-pickup';
            break;
          case 'Compactador':
            iconClass += 'fa-truck-moving';
            break;
          case 'Trator':
            iconClass += 'fa-tractor';
            break;
          default:
            iconClass += 'fa-tools';
        }
        
        icon.className = iconClass;
        el.appendChild(icon);
        
        // Create popup
        const popup = new mapboxgl.Popup({ offset: 25 })
          .setHTML(`
            <div class="map-popup">
              <div class="popup-header">
                <span class="popup-title">${equipment.type} - ${equipment.subtype}</span>
                <span class="popup-status status-${equipment.status.toLowerCase()}">${equipment.status}</span>
              </div>
              <div class="popup-content">
                <div class="popup-detail"><strong>Modelo:</strong> ${equipment.model}</div>
                <div class="popup-detail"><strong>Local:</strong> ${equipment.location.address.split(',')[0]}</div>
                <div class="popup-detail"><strong>Preço:</strong> R$ ${equipment.price.toFixed(2)}/${equipment.priceUnit}</div>
              </div>
            </div>
          `);
        
        // Add marker to map
        new mapboxgl.Marker(el)
          .setLngLat([equipment.location.longitude, equipment.location.latitude])
          .setPopup(popup)
          .addTo(mapInstance.value);
      });
      
      // Fit map to markers if there are any
      if (equipmentsToShow.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        equipmentsToShow.forEach(equipment => {
          bounds.extend([equipment.location.longitude, equipment.location.latitude]);
        });
        
        mapInstance.value.fitBounds(bounds, {
          padding: 50,
          duration: 1000
        });
      }
    }

    function createEquipmentByTypeChart() {
      // Count equipments by type
      const equipmentCounts = {};
      servicesStore.equipments.forEach(equipment => {
        if (!equipmentCounts[equipment.type]) {
          equipmentCounts[equipment.type] = 0;
        }
        equipmentCounts[equipment.type]++;
      });
      
      // Create a simple chart representation
      const chartElement = equipmentByTypeChart.value;
      if (!chartElement) return;
      
      chartElement.innerHTML = '';
      
      // Create chart container
      const chartContent = document.createElement('div');
      chartContent.className = 'equipment-type-chart';
      
      // Create bars for each equipment type
      Object.keys(equipmentCounts).forEach((type, index) => {
        const barContainer = document.createElement('div');
        barContainer.className = 'type-bar-container';
        
        const label = document.createElement('div');
        label.className = 'type-label';
        label.textContent = type;
        
        const barWrapper = document.createElement('div');
        barWrapper.className = 'type-bar-wrapper';
        
        const bar = document.createElement('div');
        bar.className = 'type-bar';
        bar.style.width = `${(equipmentCounts[type] / servicesStore.equipments.length) * 100}%`;
        bar.style.backgroundColor = getColorByIndex(index);
        
        const count = document.createElement('div');
        count.className = 'type-count';
        count.textContent = equipmentCounts[type];
        
        barWrapper.appendChild(bar);
        barWrapper.appendChild(count);
        
        barContainer.appendChild(label);
        barContainer.appendChild(barWrapper);
        
        chartContent.appendChild(barContainer);
      });
      
      chartElement.appendChild(chartContent);
    }

    function getColorByIndex(index) {
      const colors = [
        '#4285F4', // Blue
        '#EA4335', // Red
        '#FBBC05', // Yellow
        '#34A853', // Green
        '#8F00FF', // Purple
      ];
      
      return colors[index % colors.length];
    }

    function refreshData() {
      servicesStore.fetchEquipments().then(() => {
        lastUpdate.value = new Date();
        createEquipmentByTypeChart();
        updateMapMarkers();
      });
      
      scoresStore.loadScores();
    }

    // Watch for filter changes
    watch(locationFilter, () => {
      if (mapInstance.value) {
        updateMapMarkers();
      }
    });

    // Lifecycle hooks
    onMounted(async () => {
      // Fetch data if needed
      if (servicesStore.equipments.length === 0) {
        await servicesStore.fetchEquipments();
      }
      
      if (scoresStore.regionPerformance.length === 0) {
        await scoresStore.loadScores();
      }
      
      // Initialize map and charts after the DOM is ready
      nextTick(() => {
        initializeMap();
        createEquipmentByTypeChart();
      });
    });

    return {
      lastUpdate,
      lastUpdateFormatted,
      locationFilter,
      revenue,
      availableEquipments,
      inUseEquipments,
      maintenanceEquipments,
      recentActivities,
      healthStatus,
      upcomingMaintenance,
      equipmentByTypeChart,
      formatCurrency,
      calcPercentage,
      getActivityIcon,
      formatActivityTime,
      getMaintenanceUrgencyClass,
      refreshData
    };
  }
};