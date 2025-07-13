<template>
  <div class="app-layout">
    <header class="app-header">
      <div class="header-container">
        <div class="logo-container">
          <router-link
            to="/"
            class="logo-link"
          >
            <span class="logo-text">Quero<span class="logo-highlight">Locar</span></span>
          </router-link>
        </div>
        
        <div class="nav-container">
          <nav class="main-nav">
            <router-link
              to="/dashboard"
              class="nav-item"
            >
              <i class="fas fa-chart-pie" />
              <span>Dashboard</span>
            </router-link>
            <router-link
              to="/equipment"
              class="nav-item"
            >
              <i class="fas fa-truck" />
              <span>Equipamentos</span>
            </router-link>
            <router-link
              to="/equipment/map"
              class="nav-item"
            >
              <i class="fas fa-map-marked-alt" />
              <span>Mapa</span>
            </router-link>
            <router-link
              v-if="hasFinancePermission"
              to="/finance"
              class="nav-item"
            >
              <i class="fas fa-dollar-sign" />
              <span>Financeiro</span>
            </router-link>
            <router-link
              to="/client-portal"
              class="nav-item"
            >
              <i class="fas fa-user-circle" />
              <span>Portal Cliente</span>
            </router-link>
          </nav>
        </div>
        
        <div class="user-container">
          <div class="search-box">
            <i class="fas fa-search" />
            <input
              type="text"
              placeholder="Buscar equipamentos..."
            >
          </div>
          
          <div class="user-menu">
            <!-- Replace with NotificationBell component -->
            <notification-bell />
            
            <div 
              class="user-profile"
              @click="toggleUserMenu"
            >
              <div class="user-avatar">
                <img
                  :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=1976D2&color=fff`"
                  :alt="userName"
                >
              </div>
              <span class="user-name">{{ userName }}</span>
              <i class="fas fa-chevron-down" />
              
              <!-- User dropdown menu - FIXED VERSION -->
              <div
                v-show="showUserMenu"
                class="user-dropdown"
                @click.stop
              >
                <div class="user-info">
                  <strong>{{ userName }}</strong>
                  <span class="user-role">{{ userRoleDisplay }}</span>
                </div>
                <div class="dropdown-divider" />
                <ul class="dropdown-menu">
                  <li>
                    <a
                      href="#"
                      @click.prevent="goToProfile"
                    >
                      <i class="fas fa-user" /> Meu Perfil
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      @click.prevent="goToSettings"
                    >
                      <i class="fas fa-cog" /> Configurações
                    </a>
                  </li>
                  <li class="dropdown-divider" />
                  <li>
                    <a
                      href="#"
                      class="logout-button"
                      @click.prevent="handleLogout"
                    >
                      <i class="fas fa-sign-out-alt" /> Sair
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
    
    <main class="app-content">
      <router-view />
    </main>
    
    <footer class="app-footer">
      <div class="footer-container">
        <div class="footer-section">
          <h3 class="footer-title">
            Quero Locar
          </h3>
          <p class="footer-description">
            Plataforma para locação de equipamentos de construção civil e industrial.
            Conectamos empresas e profissionais aos melhores equipamentos disponíveis.
          </p>
        </div>
        
        <div class="footer-section">
          <h3 class="footer-title">
            Links Rápidos
          </h3>
          <ul class="footer-links">
            <li>
              <router-link to="/dashboard">
                Dashboard
              </router-link>
            </li>
            <li>
              <router-link to="/equipment">
                Equipamentos
              </router-link>
            </li>
            <li>
              <router-link to="/equipment/map">
                Mapa
              </router-link>
            </li>
            <li><a href="#">Sobre nós</a></li>
            <li><a href="#">Contato</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h3 class="footer-title">
            Contato
          </h3>
          <ul class="footer-contact">
            <li><i class="fas fa-map-marker-alt" /> Av. Brasil, 123 - Três Lagoas, MS</li>
            <li><i class="fas fa-phone" /> (67) 3333-4444</li>
            <li><i class="fas fa-envelope" /> contato@querolocar.com.br</li>
          </ul>
          
          <div class="social-links">
            <a
              href="#"
              class="social-link"
            ><i class="fab fa-facebook-f" /></a>
            <a
              href="#"
              class="social-link"
            ><i class="fab fa-instagram" /></a>
            <a
              href="#"
              class="social-link"
            ><i class="fab fa-linkedin-in" /></a>
            <a
              href="#"
              class="social-link"
            ><i class="fab fa-whatsapp" /></a>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <div class="copyright">
          &copy; {{ currentYear }} Quero Locar. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import NotificationBell from '../notifications/components/NotificationBell.vue'

export default {
  name: 'ShellApp',
  components: {
    NotificationBell
  },
  setup() {
    // Router and store
    const router = useRouter()
    const authStore = useAuthStore()
    
    // State
    const currentYear = computed(() => new Date().getFullYear())
    const showUserMenu = ref(false)
    
    // User data
    const userName = computed(() => authStore.userName)
    const userRole = computed(() => authStore.userRole)
    const userRoleDisplay = computed(() => {
      switch (userRole.value) {
        case 'admin': return 'Administrador'
        case 'locador': return 'Locador'
        case 'locatario': return 'Locatário'
        default: return 'Visitante'
      }
    })
    
    // Computed permissions
    const hasFinancePermission = computed(() => {
      const permissions = authStore.user?.permissions || []
      return permissions.includes('finance')
    })
    
    // FIXED: Toggle user menu with proper debugging
    function toggleUserMenu(event) {
      console.log('🔧 LOGOUT DEBUG: Toggle user menu clicked!', event)
      
      // Stop propagation to prevent immediate closing
      event.stopPropagation()
      event.preventDefault()
      
      // Toggle menu
      showUserMenu.value = !showUserMenu.value
      console.log('🔧 LOGOUT DEBUG: showUserMenu is now:', showUserMenu.value)
      
      // Add/remove click outside listener
      if (showUserMenu.value) {
        // Remove existing listener first to prevent duplicates
        document.removeEventListener('click', closeOnOutsideClick)
        
        // Use setTimeout to ensure DOM is updated before adding listener
        setTimeout(() => {
          document.addEventListener('click', closeOnOutsideClick)
          console.log('🔧 LOGOUT DEBUG: Added outside click listener')
        }, 50)
        
        // Force dropdown visibility with inline styles as fallback
        setTimeout(() => {
          const dropdown = document.querySelector('.user-dropdown')
          if (dropdown) {
            dropdown.style.display = 'block'
            dropdown.style.visibility = 'visible'
            dropdown.style.opacity = '1'
            dropdown.style.zIndex = '9999'
            console.log('🔧 LOGOUT DEBUG: Dropdown forced visible with inline styles')
          }
        }, 10)
      } else {
        document.removeEventListener('click', closeOnOutsideClick)
        console.log('🔧 LOGOUT DEBUG: Removed outside click listener')
      }
    }
    
    // Close menu when clicking outside
    function closeOnOutsideClick(event) {
      const userProfile = document.querySelector('.user-profile')
      const userDropdown = document.querySelector('.user-dropdown')
      
      // Check if click is outside both the user profile and its dropdown
      const isClickOutside = userProfile && !userProfile.contains(event.target) && 
                            (!userDropdown || (userDropdown && !userDropdown.contains(event.target)))
      
      if (isClickOutside) {
        showUserMenu.value = false
        document.removeEventListener('click', closeOnOutsideClick)
        console.log('🔧 LOGOUT DEBUG: Closed dropdown due to outside click')
      }
    }
    
    // Navigation
    function goToProfile() {
      console.log('🔧 LOGOUT DEBUG: Going to profile')
      router.push('/profile')
      showUserMenu.value = false
    }
    
    function goToSettings() {
      console.log('🔧 LOGOUT DEBUG: Going to settings')
      router.push('/settings')
      showUserMenu.value = false
    }
    
    // FIXED: Logout with comprehensive debugging
    function handleLogout() {
      console.log('🔧 LOGOUT DEBUG: ✅ LOGOUT INITIATED!')
      showUserMenu.value = false
      
      try {
        // Use auth store logout - the redirection happens in the store
        authStore.logout()
        console.log('🔧 LOGOUT DEBUG: ✅ LOGOUT SUCCESSFUL!')
      } catch (e) {
        console.error('🔧 LOGOUT DEBUG: ❌ Error in logout:', e)
        // Fallback direct redirect if store logout fails
        window.location.href = '/login'
      }
    }
    
    // Clean up on component mount/unmount
    onMounted(() => {
      console.log('🔧 LOGOUT DEBUG: ShellApp mounted')
    })
    
    onUnmounted(() => {
      document.removeEventListener('click', closeOnOutsideClick)
      console.log('🔧 LOGOUT DEBUG: ShellApp unmounted, cleaned up listeners')
    })
    
    // Watch for route changes to close menus
    watch(() => router.currentRoute.value, () => {
      showUserMenu.value = false
      document.removeEventListener('click', closeOnOutsideClick)
    })
    
    return {
      currentYear,
      userName,
      userRole,
      userRoleDisplay,
      hasFinancePermission,
      showUserMenu,
      toggleUserMenu,
      goToProfile,
      goToSettings,
      handleLogout
    }
  }
}
</script>

<style>
/* Global styles (these can also be added to style.css) */
:root {
  --header-height: 70px;
  --footer-height: 300px;
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  color: var(--color-text);
  background-color: var(--color-background);
  line-height: 1.6;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>

<style scoped>
/* App Layout */
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Header Styles */
.app-header {
  height: var(--header-height);
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  height: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* Logo */
.logo-container {
  display: flex;
  align-items: center;
}

.logo-link {
  text-decoration: none;
  display: flex;
  align-items: center;
}

.logo-text {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text);
}

.logo-highlight {
  color: var(--color-primary);
}

/* Navigation */
.nav-container {
  flex: 1;
  display: flex;
  justify-content: center;
}

.main-nav {
  display: flex;
  gap: 16px;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-decoration: none;
  color: var(--color-text-light);
  font-size: 14px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.nav-item.router-link-active {
  color: var(--color-primary);
  background-color: rgba(25, 118, 210, 0.1);
}

.nav-item i {
  font-size: 16px;
  margin-bottom: 4px;
}

/* User Section */
.user-container {
  display: flex;
  align-items: center;
  gap: 16px;
}

.search-box {
  display: flex;
  align-items: center;
  background-color: var(--color-background);
  border-radius: 20px;
  padding: 6px 12px;
  width: 200px;
}

.search-box i {
  color: var(--color-text-light);
  margin-right: 8px;
}

.search-box input {
  border: none;
  background: none;
  outline: none;
  font-size: 14px;
  width: 100%;
  color: var(--color-text);
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  position: relative;
  padding: 6px 10px;
  border-radius: 20px;
  transition: background-color 0.2s;
}

.user-profile:hover {
  background-color: var(--color-background);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
}

.user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
}

/* FIXED: User dropdown menu with maximum visibility */
.user-dropdown {
  position: absolute !important;
  top: calc(100% + 12px) !important;
  right: 0 !important;
  width: 220px !important;
  background-color: white !important;
  border-radius: 8px !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  z-index: 9999 !important;
  animation: dropdownFadeIn 0.2s ease-out forwards !important;
  transform-origin: top right !important;
  pointer-events: auto !important;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  border: 1px solid #e0e0e0 !important;
}

@keyframes dropdownFadeIn {
  from { 
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to { 
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.user-dropdown::before {
  content: "";
  position: absolute;
  top: -8px;
  right: 20px;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid white;
}

.user-info {
  padding: 16px;
  border-bottom: 1px solid var(--color-border);
}

.user-info strong {
  display: block;
  margin-bottom: 4px;
}

.user-role {
  font-size: 12px;
  color: var(--color-text-light);
}

.dropdown-menu {
  list-style: none;
  padding: 8px 0;
}

.dropdown-menu li a {
  display: flex;
  align-items: center;
  padding: 10px 16px;
  text-decoration: none;
  color: var(--color-text);
  font-size: 14px;
  transition: background-color 0.2s;
}

.dropdown-menu li a i {
  margin-right: 12px;
  width: 16px;
  text-align: center;
  color: var(--color-text-light);
}

.dropdown-menu li a:hover {
  background-color: var(--color-background);
}

.dropdown-divider {
  height: 1px;
  background-color: var(--color-border);
  margin: 8px 0;
}

.logout-button {
  color: var(--color-error) !important;
}

.logout-button i {
  color: var(--color-error) !important;
}

/* Main Content */
.app-content {
  flex: 1;
  min-height: calc(100vh - var(--header-height) - var(--footer-height));
}

/* Footer Styles */
.app-footer {
  background-color: #1D2939;
  color: #fff;
  padding: 40px 0 20px;
  margin-top: auto;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: 40px;
}

.footer-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 20px;
  color: white;
}

.footer-description {
  font-size: 14px;
  max-width: 400px;
  color: rgba(255, 255, 255, 0.7);
}

.footer-links {
  list-style: none;
}

.footer-links li {
  margin-bottom: 10px;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  transition: color 0.2s;
  font-size: 14px;
}

.footer-links a:hover {
  color: white;
}

.footer-contact {
  list-style: none;
}

.footer-contact li {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.footer-contact i {
  color: var(--color-primary-light);
}

.social-links {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.social-link {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.social-link:hover {
  background-color: var(--color-primary);
}

.footer-bottom {
  max-width: 1400px;
  margin: 40px auto 0;
  padding: 20px 1rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  text-align: center;
}

.copyright {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.5);
}

/* Responsive styles */
@media (max-width: 1024px) {
  .footer-container {
    grid-template-columns: 1fr 1fr;
  }
  
  .footer-section:first-child {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .header-container {
    flex-wrap: wrap;
    height: auto;
    padding: 12px 1rem;
  }
  
  .logo-container {
    flex: 1;
  }
  
  .nav-container {
    order: 3;
    width: 100%;
    margin-top: 12px;
  }
  
  .main-nav {
    width: 100%;
    justify-content: space-around;
  }
  
  .search-box {
    width: 40px;
    overflow: hidden;
  }
  
  .search-box input {
    width: 0;
  }
  
  .user-name {
    display: none;
  }
  
  .footer-container {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .footer-section:first-child {
    grid-column: span 1;
  }
}
</style>