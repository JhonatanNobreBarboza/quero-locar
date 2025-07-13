<template>
  <div class="relative">
    <button 
      class="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-200 focus:outline-none relative" 
      aria-label="Notificações"
      @click="toggleDropdown"
    >
      <i class="fas fa-bell text-xl" />
      <span 
        v-if="unreadCount > 0" 
        class="absolute top-1 right-1 flex items-center justify-center bg-red-500 text-white text-xs rounded-full"
        :class="unreadCount > 9 ? 'w-5 h-5' : 'w-4 h-4'"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </button>

    <div 
      v-if="isOpen" 
      ref="dropdown"
      class="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 overflow-hidden"
    >
      <div class="p-3 border-b border-gray-200 flex justify-between items-center">
        <h3 class="font-medium">
          Notificações
        </h3>
        <div class="flex items-center gap-3">
          <button 
            v-if="unreadCount > 0"
            class="text-blue-600 text-sm hover:underline" 
            @click="markAllAsRead"
          >
            Marcar todas como lidas
          </button>
          <router-link
            to="/notifications"
            class="text-blue-600 text-sm hover:underline"
          >
            Ver todas
          </router-link>
        </div>
      </div>

      <div
        v-if="notifications.length > 0"
        class="max-h-96 overflow-y-auto"
      >
        <div 
          v-for="notification in recentNotifications" 
          :key="notification.id"
          class="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
          :class="{'bg-blue-50': !notification.read}"
          @click="openNotification(notification)"
        >
          <div class="flex">
            <div 
              class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mr-3"
              :class="{
                'bg-blue-100 text-blue-600': notification.category === 'equipment',
                'bg-green-100 text-green-600': notification.category === 'contract',
                'bg-yellow-100 text-yellow-600': notification.category === 'maintenance',
                'bg-purple-100 text-purple-600': notification.category === 'system'
              }"
            >
              <i :class="`fas ${getCategoryIcon(notification.category)} text-sm`" />
            </div>
            <div class="flex-grow">
              <div
                class="text-sm font-medium"
                :class="{'font-semibold': !notification.read}"
              >
                {{ notification.title }}
              </div>
              <div class="text-xs text-gray-600 mt-1 line-clamp-2">
                {{ notification.message }}
              </div>
              <div class="text-xs text-gray-500 mt-1">
                {{ formatRelativeTime(notification.timestamp) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div
        v-else
        class="py-8 text-center text-gray-500"
      >
        <i class="fas fa-bell-slash text-2xl mb-2" />
        <p class="text-sm">
          Nenhuma notificação recente
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isOpen = ref(false)
const dropdown = ref(null)

// Example notifications - in a real app, this would come from a store or service
const notifications = ref([
  {
    id: 1,
    title: 'Nova entrega agendada',
    message: 'Caçamba de 5m³ agendada para entrega amanhã às 10:00',
    timestamp: '2025-07-09T08:00:00',
    category: 'equipment',
    priority: 'normal',
    read: false,
  },
  {
    id: 2,
    title: 'Contrato pendente de aprovação',
    message: 'O contrato #C3456 precisa de sua aprovação para proceder com a entrega',
    timestamp: '2025-07-08T16:30:00',
    category: 'contract',
    priority: 'high',
    read: false,
  },
  {
    id: 3,
    title: 'Manutenção programada',
    message: 'Betoneira B-35 está agendada para manutenção preventiva em 3 dias',
    timestamp: '2025-07-08T10:15:00',
    category: 'maintenance',
    priority: 'normal',
    read: true,
  }
])

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

const recentNotifications = computed(() => {
  // Create a new sorted array instead of mutating the original
  return [...notifications.value]
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 5) // Show only 5 most recent notifications
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = (event) => {
  if (dropdown.value && !dropdown.value.contains(event.target)) {
    isOpen.value = false
  }
}

const markAllAsRead = (event) => {
  event.stopPropagation()
  notifications.value.forEach(notification => {
    notification.read = true
  })
}

const openNotification = (notification) => {
  // Mark as read
  notification.read = true
  
  // Navigate to notifications page with this notification focused
  // In a real app, you might navigate to a different page based on notification type
  router.push('/notifications')
  
  // Close dropdown
  isOpen.value = false
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
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>

<style scoped>
/* To support line-clamp in browsers that don't natively support it */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>