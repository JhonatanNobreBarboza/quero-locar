<template>
  <div class="notifications-container">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold">
        Notificações
      </h1>
      <div class="flex gap-3">
        <button
          class="px-4 py-2 text-sm bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center"
          @click="markAllAsRead"
        >
          <i class="fas fa-check-double mr-2" />
          Marcar todas como lidas
        </button>
        <button
          class="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          @click="openNotificationSettings"
        >
          <i class="fas fa-cog mr-2" />
          Configurações
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white p-4 rounded-md shadow mb-6">
      <div class="flex flex-wrap gap-3">
        <button 
          class="px-4 py-2 text-sm rounded-md" 
          :class="activeFilter === 'all' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'" 
          @click="setActiveFilter('all')"
        >
          Todas
        </button>
        <button 
          class="px-4 py-2 text-sm rounded-md" 
          :class="activeFilter === 'unread' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'" 
          @click="setActiveFilter('unread')"
        >
          Não lidas
        </button>
        <button 
          class="px-4 py-2 text-sm rounded-md" 
          :class="activeFilter === 'equipment' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'" 
          @click="setActiveFilter('equipment')"
        >
          Equipamentos
        </button>
        <button 
          class="px-4 py-2 text-sm rounded-md" 
          :class="activeFilter === 'contract' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'" 
          @click="setActiveFilter('contract')"
        >
          Contratos
        </button>
        <button 
          class="px-4 py-2 text-sm rounded-md" 
          :class="activeFilter === 'maintenance' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'" 
          @click="setActiveFilter('maintenance')"
        >
          Manutenção
        </button>
        <button 
          class="px-4 py-2 text-sm rounded-md" 
          :class="activeFilter === 'system' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'" 
          @click="setActiveFilter('system')"
        >
          Sistema
        </button>
      </div>
    </div>

    <!-- Notifications List -->
    <div class="bg-white rounded-md shadow">
      <div
        v-if="filteredNotifications.length > 0"
        class="divide-y"
      >
        <div 
          v-for="notification in filteredNotifications" 
          :key="notification.id" 
          class="p-4 hover:bg-gray-50 transition-colors"
          :class="{'bg-blue-50': !notification.read}"
        >
          <div class="flex">
            <div 
              class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4"
              :class="{
                'bg-blue-100 text-blue-600': notification.category === 'equipment',
                'bg-green-100 text-green-600': notification.category === 'contract',
                'bg-yellow-100 text-yellow-600': notification.category === 'maintenance',
                'bg-purple-100 text-purple-600': notification.category === 'system'
              }"
            >
              <i :class="`fas ${getCategoryIcon(notification.category)}`" />
            </div>
            <div class="flex-grow">
              <div class="flex justify-between">
                <h3
                  class="font-medium"
                  :class="{'font-semibold': !notification.read}"
                >
                  {{ notification.title }}
                </h3>
                <div class="text-xs text-gray-500">
                  {{ formatRelativeTime(notification.timestamp) }}
                </div>
              </div>
              <p class="text-gray-700 mt-1">
                {{ notification.message }}
              </p>
              <div class="mt-2 flex justify-between">
                <div>
                  <span 
                    class="px-2 py-1 rounded text-xs font-medium"
                    :class="{
                      'bg-blue-100 text-blue-800': notification.category === 'equipment',
                      'bg-green-100 text-green-800': notification.category === 'contract',
                      'bg-yellow-100 text-yellow-800': notification.category === 'maintenance',
                      'bg-purple-100 text-purple-800': notification.category === 'system'
                    }"
                  >
                    {{ getCategoryName(notification.category) }}
                  </span>
                  <span 
                    v-if="notification.priority === 'high'" 
                    class="ml-2 px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-medium"
                  >
                    Alta Prioridade
                  </span>
                </div>
                <div class="flex gap-3">
                  <button
                    v-if="!notification.read"
                    class="text-blue-600 text-sm hover:underline"
                    @click="markAsRead(notification.id)"
                  >
                    Marcar como lida
                  </button>
                  <button
                    v-if="notification.action"
                    class="text-blue-600 text-sm hover:underline"
                  >
                    {{ notification.action }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="p-8 text-center text-gray-500"
      >
        <i class="fas fa-bell-slash text-4xl mb-3 text-gray-400" />
        <p>Nenhuma notificação encontrada para os filtros selecionados</p>
      </div>
    </div>

    <!-- Pagination -->
    <div class="mt-6 flex justify-between items-center">
      <div class="text-sm text-gray-600">
        Mostrando {{ filteredNotifications.length }} de {{ totalNotifications }} notificações
      </div>
      <div class="flex gap-2">
        <button 
          class="px-3 py-1 border border-gray-300 rounded-md text-sm" 
          :class="currentPage === 1 ? 'bg-gray-50 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'"
          :disabled="currentPage === 1"
        >
          Anterior
        </button>
        <button 
          class="px-3 py-1 border border-gray-300 rounded-md text-sm" 
          :class="currentPage === totalPages ? 'bg-gray-50 text-gray-400' : 'bg-white text-gray-700 hover:bg-gray-50'"
          :disabled="currentPage === totalPages"
        >
          Próximo
        </button>
      </div>
    </div>

    <!-- Notification Settings Modal -->
    <div
      v-if="showSettings"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-xl font-semibold">
            Configurações de Notificação
          </h2>
          <button
            class="text-gray-500 hover:text-gray-700"
            @click="closeNotificationSettings"
          >
            <i class="fas fa-times" />
          </button>
        </div>
        
        <div class="mb-4">
          <h3 class="font-medium mb-2">
            Receber notificações para:
          </h3>
          <div class="space-y-2">
            <div class="flex items-center">
              <input
                id="notify-equipment"
                v-model="notificationSettings.equipment"
                type="checkbox"
                class="mr-2"
              >
              <label for="notify-equipment">Equipamentos (entregas, retiradas)</label>
            </div>
            <div class="flex items-center">
              <input
                id="notify-contract"
                v-model="notificationSettings.contract"
                type="checkbox"
                class="mr-2"
              >
              <label for="notify-contract">Contratos (aprovações, renovações)</label>
            </div>
            <div class="flex items-center">
              <input
                id="notify-maintenance"
                v-model="notificationSettings.maintenance"
                type="checkbox"
                class="mr-2"
              >
              <label for="notify-maintenance">Manutenção e Inspeções</label>
            </div>
            <div class="flex items-center">
              <input
                id="notify-system"
                v-model="notificationSettings.system"
                type="checkbox"
                class="mr-2"
              >
              <label for="notify-system">Atualizações do Sistema</label>
            </div>
          </div>
        </div>
        
        <div class="mb-4">
          <h3 class="font-medium mb-2">
            Canais de Notificação:
          </h3>
          <div class="space-y-2">
            <div class="flex items-center">
              <input
                id="channel-app"
                v-model="notificationSettings.channels.app"
                type="checkbox"
                class="mr-2"
              >
              <label for="channel-app">No aplicativo</label>
            </div>
            <div class="flex items-center">
              <input
                id="channel-email"
                v-model="notificationSettings.channels.email"
                type="checkbox"
                class="mr-2"
              >
              <label for="channel-email">E-mail</label>
            </div>
            <div class="flex items-center">
              <input
                id="channel-sms"
                v-model="notificationSettings.channels.sms"
                type="checkbox"
                class="mr-2"
              >
              <label for="channel-sms">SMS</label>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end gap-3">
          <button
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            @click="closeNotificationSettings"
          >
            Cancelar
          </button>
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            @click="saveNotificationSettings"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Filter state
const activeFilter = ref('all')
const currentPage = ref(1)
const totalPages = ref(1)

// Modal state
const showSettings = ref(false)

// Notification settings
const notificationSettings = ref({
  equipment: true,
  contract: true,
  maintenance: true,
  system: true,
  channels: {
    app: true,
    email: true,
    sms: false
  }
})

// Notifications data
const notifications = ref([
  {
    id: 1,
    title: 'Nova entrega agendada',
    message: 'Caçamba de 5m³ agendada para entrega amanhã às 10:00',
    timestamp: '2025-07-09T08:00:00',
    category: 'equipment',
    priority: 'normal',
    read: false,
    action: 'Ver detalhes'
  },
  {
    id: 2,
    title: 'Contrato pendente de aprovação',
    message: 'O contrato #C3456 precisa de sua aprovação para proceder com a entrega',
    timestamp: '2025-07-08T16:30:00',
    category: 'contract',
    priority: 'high',
    read: false,
    action: 'Aprovar agora'
  },
  {
    id: 3,
    title: 'Manutenção programada',
    message: 'Betoneira B-35 está agendada para manutenção preventiva em 3 dias',
    timestamp: '2025-07-08T10:15:00',
    category: 'maintenance',
    priority: 'normal',
    read: true,
    action: 'Ver calendário'
  },
  {
    id: 4,
    title: 'Retirada concluída',
    message: 'Andaime A-12 foi retirado com sucesso do cliente C-78',
    timestamp: '2025-07-07T17:45:00',
    category: 'equipment',
    priority: 'normal',
    read: true,
    action: null
  },
  {
    id: 5,
    title: 'Nova atualização do sistema',
    message: 'Uma nova versão do sistema está disponível com melhorias na funcionalidade de mapas',
    timestamp: '2025-07-07T09:00:00',
    category: 'system',
    priority: 'normal',
    read: true,
    action: 'Ver detalhes'
  },
  {
    id: 6,
    title: 'Atraso na devolução',
    message: 'Carretinha CR-45 está com 2 dias de atraso na devolução',
    timestamp: '2025-07-06T14:20:00',
    category: 'contract',
    priority: 'high',
    read: true,
    action: 'Contatar cliente'
  },
  {
    id: 7,
    title: 'Relatório mensal disponível',
    message: 'O relatório de utilização de equipamentos do mês anterior está disponível para visualização',
    timestamp: '2025-07-05T08:30:00',
    category: 'system',
    priority: 'normal',
    read: true,
    action: 'Ver relatório'
  }
])

// Computed
const totalNotifications = computed(() => notifications.value.length)

const filteredNotifications = computed(() => {
  let filtered = [...notifications.value]
  
  // Apply category filter
  if (activeFilter.value === 'unread') {
    filtered = filtered.filter(n => !n.read)
  } else if (activeFilter.value !== 'all') {
    filtered = filtered.filter(n => n.category === activeFilter.value)
  }
  
  // Sort by timestamp (newest first)
  filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  
  return filtered
})

// Methods
const setActiveFilter = (filter) => {
  activeFilter.value = filter
  currentPage.value = 1
}

const markAsRead = (id) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.read = true
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(n => {
    n.read = true
  })
}

const openNotificationSettings = () => {
  showSettings.value = true
}

const closeNotificationSettings = () => {
  showSettings.value = false
}

const saveNotificationSettings = () => {
  // In a real app, save settings to user preferences
  console.log('Saving notification settings:', notificationSettings.value)
  showSettings.value = false
}

const getCategoryIcon = (category) => {
  const icons = {
    equipment: 'fa-truck-loading',
    contract: 'fa-file-signature',
    maintenance: 'fa-tools',
    system: 'fa-cogs'
  }
  return icons[category] || 'fa-bell'
}

const getCategoryName = (category) => {
  const names = {
    equipment: 'Equipamento',
    contract: 'Contrato',
    maintenance: 'Manutenção',
    system: 'Sistema'
  }
  return names[category] || 'Geral'
}

const formatRelativeTime = (dateString) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffInSeconds = Math.floor((now - date) / 1000)
  
  if (diffInSeconds < 60) {
    return 'Agora mesmo'
  } else if (diffInSeconds < 3600) {
    const mins = Math.floor(diffInSeconds / 60)
    return `${mins} ${mins === 1 ? 'minuto' : 'minutos'} atrás`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} ${hours === 1 ? 'hora' : 'horas'} atrás`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} ${days === 1 ? 'dia' : 'dias'} atrás`
  } else {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date)
  }
}

onMounted(() => {
  // In a real app, we would fetch notifications from an API here
  console.log('Notifications component mounted')
})
</script>

<style scoped>
.notifications-container {
  @apply p-6;
}
</style>