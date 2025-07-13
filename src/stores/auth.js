import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import apiClient from '../config/api'

export const useAuthStore = defineStore('auth', () => {
  // Router
  let router = null
  try {
    router = useRouter()
  } catch (e) {
    // Router might not be available during SSR or initialization
  }
  
  // State
  const user = ref(null)
  const isAuthenticated = ref(false)
  const notifications = ref([])
  const error = ref(null)
  const isLoading = ref(false)
  
  // Load only notifications from localStorage (NOT user data for security)
  const initializeAuth = () => {
    try {
      // Clear any existing user data to ensure fresh start
      localStorage.removeItem('quero-locar-user')
      sessionStorage.removeItem('quero-locar-user')
      
      // Check if we have a valid token
      const token = apiClient.getAuthToken()
      if (token) {
        // Validate token by trying to get user profile
        getCurrentUser()
      }
      
      // Only load notifications, not user authentication
      const storedNotifications = localStorage.getItem('quero-locar-notifications')
      if (storedNotifications) {
        notifications.value = JSON.parse(storedNotifications)
      }
    } catch (e) {
      console.error('Error initializing auth store:', e)
      error.value = 'Error loading notifications'
    }
  }
  
  // Initialize on store creation (but without auto-login)
  initializeAuth()
  
  // Getters
  const userName = computed(() => {
    return user.value?.name || 'Usuário'
  })
  
  const userRole = computed(() => {
    return user.value?.role || 'visitor'
  })
  
  const unreadNotificationsCount = computed(() => {
    return notifications.value.filter(n => !n.read).length
  })
  
  // Actions
  async function login(credentials) {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await apiClient.post('/auth/login', credentials)
      
      if (response.success) {
        const { user: userData, token } = response.data
        
        // Save token
        apiClient.setAuthToken(token)
        
        // Save user data to state (not localStorage for security)
        user.value = userData
        isAuthenticated.value = true
        
        // Add welcome notification
        addNotification({
          type: 'welcome',
          title: 'Bem-vindo de volta!',
          message: `Olá ${userData.name}, seja bem-vindo(a) ao Quero Locar.`
        })
        
        // Navigate to dashboard on successful login
        if (router) {
          router.push({ name: 'dashboard' })
        }
        
        return userData
      }
    } catch (err) {
      error.value = err.message || 'Falha na autenticação'
      throw new Error(error.value)
    } finally {
      isLoading.value = false
    }
  }
  
  async function register(userData) {
    try {
      isLoading.value = true
      error.value = null
      
      const response = await apiClient.post('/auth/register', userData)
      
      if (response.success) {
        const { user: newUser, token } = response.data
        
        // Save token
        apiClient.setAuthToken(token)
        
        // Save user data to state
        user.value = newUser
        isAuthenticated.value = true
        
        // Add welcome notification
        addNotification({
          type: 'welcome',
          title: 'Bem-vindo!',
          message: `Conta criada com sucesso! Seja bem-vindo(a) ao Quero Locar, ${newUser.name}.`
        })
        
        // Navigate to dashboard
        if (router) {
          router.push({ name: 'dashboard' })
        }
        
        return newUser
      }
    } catch (err) {
      error.value = err.message || 'Falha no registro'
      throw new Error(error.value)
    } finally {
      isLoading.value = false
    }
  }
  
  async function getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/me')
      
      if (response.success) {
        user.value = response.data
        isAuthenticated.value = true
        return response.data
      }
    } catch (err) {
      // Token might be invalid, clear it
      logout()
      throw err
    }
  }
  
  function logout() {
    try {
      // Clear user data
      user.value = null
      isAuthenticated.value = false
      
      // Clear token
      apiClient.setAuthToken(null)
      
      // Clear localStorage completely
      localStorage.removeItem('quero-locar-user')
      sessionStorage.removeItem('quero-locar-user')
      localStorage.removeItem('quero-locar-token')
      
      // Remove any auth cookies that might exist
      document.cookie = "quero_locar_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      
      // Redirect to login page
      if (router) {
        router.push('/login')
      } else {
        // As fallback, use direct location change
        window.location.href = '/login'
      }
      
      return true
    } catch (e) {
      console.error('Logout error:', e)
      error.value = 'Erro ao deslogar'
      
      // Even on error, try to redirect
      window.location.href = '/login'
      return false
    }
  }
  
  function addNotification(notification) {
    // Generate unique ID
    const id = Date.now().toString() + Math.floor(Math.random() * 1000).toString()
    
    const newNotification = {
      id,
      createdAt: new Date().toISOString(),
      read: false,
      responded: false,
      ...notification
    }
    
    notifications.value.unshift(newNotification) // Add to beginning of array
    
    // Persist to localStorage
    localStorage.setItem('quero-locar-notifications', JSON.stringify(notifications.value))
    
    return id
  }
  
  function markNotificationAsRead(notificationId) {
    const index = notifications.value.findIndex(n => n.id === notificationId)
    if (index !== -1) {
      notifications.value[index].read = true
      
      // Persist to localStorage
      localStorage.setItem('quero-locar-notifications', JSON.stringify(notifications.value))
      return true
    }
    return false
  }
  
  function deleteNotification(notificationId) {
    const index = notifications.value.findIndex(n => n.id === notificationId)
    if (index !== -1) {
      notifications.value.splice(index, 1)
      
      // Persist to localStorage
      localStorage.setItem('quero-locar-notifications', JSON.stringify(notifications.value))
      return true
    }
    return false
  }
  
  function clearAllNotifications() {
    notifications.value = []
    localStorage.setItem('quero-locar-notifications', JSON.stringify(notifications.value))
  }
  
  return {
    user,
    isAuthenticated,
    notifications,
    error,
    isLoading,
    userName,
    userRole,
    unreadNotificationsCount,
    login,
    register,
    logout,
    getCurrentUser,
    addNotification,
    markNotificationAsRead,
    deleteNotification,
    clearAllNotifications
  }
});