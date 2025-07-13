<template>
  <div class="client-login-container">
    <div class="client-login-form-container">
      <div class="logo-container">
        <img
          src="/vite.svg"
          alt="Quero Locar Logo"
          class="logo"
        >
        <h1>Quero Locar</h1>
      </div>
      
      <div
        v-if="isLoading"
        class="loading-spinner"
      >
        <i class="fas fa-circle-notch fa-spin fa-3x" />
        <p>Verificando suas credenciais...</p>
      </div>
      
      <form
        v-else
        class="client-login-form"
        @submit.prevent="handleLogin"
      >
        <h2>Portal do Cliente</h2>
        <p class="login-subtitle">
          Acesse sua conta para gerenciar locações e acompanhar pedidos.
        </p>
        
        <div class="form-group">
          <label for="email">E-mail</label>
          <div class="input-with-icon">
            <i class="fas fa-envelope input-icon" />
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="Digite seu e-mail"
              required
              autocomplete="username"
            >
          </div>
        </div>
        
        <div class="form-group">
          <label for="password">Senha</label>
          <div class="input-with-icon">
            <i class="fas fa-lock input-icon" />
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Digite sua senha"
              required
              autocomplete="current-password"
            >
            <button
              type="button"
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'" />
            </button>
          </div>
        </div>
        
        <div class="form-group remember-me">
          <div>
            <input
              id="remember"
              v-model="rememberMe"
              type="checkbox"
            >
            <label for="remember">Lembrar de mim</label>
          </div>
          <a
            href="#"
            class="forgot-password"
            @click.prevent="handleForgotPassword"
          >Esqueceu a senha?</a>
        </div>
        
        <div
          v-if="error"
          class="error-message"
        >
          <i class="fas fa-exclamation-triangle" />
          {{ error }}
        </div>
        
        <button
          type="submit"
          class="login-button"
          :disabled="isLoading"
        >
          Entrar <i class="fas fa-arrow-right" />
        </button>
        
        <div class="or-divider">
          <span>ou</span>
        </div>
        
        <button
          type="button"
          class="register-button"
          @click="handleRegisterClick"
        >
          <i class="fas fa-user-plus" /> Criar nova conta
        </button>

        <div class="demo-login">
          <p>Para demonstração, use:</p>
          <div class="demo-info">
            <div><strong>Email:</strong> cliente@querolocar.com</div>
            <div><strong>Senha:</strong> cliente123</div>
            <button 
              type="button" 
              class="demo-login-button" 
              @click="loginAsDemo()"
            >
              <i class="fas fa-sign-in-alt" /> Entrar com Demo
            </button>
          </div>
        </div>
      </form>
    </div>
    
    <div class="client-login-info">
      <div class="client-login-info-content">
        <h2>Bem-vindo ao Portal do Cliente</h2>
        <p>
          Gerencie suas locações de equipamentos de forma simples e eficiente.
        </p>
        <ul class="feature-list">
          <li><i class="fas fa-search" /> Procure equipamentos disponíveis</li>
          <li><i class="fas fa-file-invoice" /> Solicite orçamentos personalizados</li>
          <li><i class="fas fa-clock" /> Acompanhe status de pedidos</li>
          <li><i class="fas fa-history" /> Visualize histórico de locações</li>
          <li><i class="fas fa-file-contract" /> Acesse contratos e documentos</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

export default {
  name: 'ClientLoginView',
  setup() {
    const router = useRouter()
    const authStore = useAuthStore()
    
    const email = ref('')
    const password = ref('')
    const showPassword = ref(false)
    const rememberMe = ref(false)
    const isLoading = ref(false)
    const error = ref('')
    
    async function handleLogin() {
      if (!email.value || !password.value) {
        error.value = 'Por favor, preencha todos os campos.'
        return
      }
      
      error.value = ''
      isLoading.value = true
      
      try {
        // We'll use a client-specific login method that will set the appropriate role
        await authStore.login({
          email: email.value,
          password: password.value
        })
        router.push('/client')
      } catch (err) {
        console.error('Login error:', err)
        error.value = err?.message || 'Falha ao fazer login. Verifique suas credenciais.'
      } finally {
        isLoading.value = false
      }
    }
    
    async function loginAsDemo() {
      isLoading.value = true
      error.value = ''
      
      try {
        email.value = 'cliente@querolocar.com'
        password.value = 'cliente123'
        
        await authStore.login({
          email: email.value,
          password: password.value
        })
        router.push('/client')
      } catch (err) {
        console.error('Demo login error:', err)
        error.value = 'Falha ao fazer login de demonstração.'
      } finally {
        isLoading.value = false
      }
    }
    
    function handleForgotPassword() {
      alert('Recurso de recuperação de senha será implementado em breve.')
    }
    
    function handleRegisterClick() {
      router.push('/client/register')
    }
    
    return {
      email,
      password,
      showPassword,
      rememberMe,
      isLoading,
      error,
      handleLogin,
      loginAsDemo,
      handleForgotPassword,
      handleRegisterClick
    }
  }
}
</script>

<style scoped>
.client-login-container {
  display: flex;
  min-height: 100vh;
  background-color: var(--color-background);
}

.client-login-form-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 40px;
  justify-content: center;
  align-items: center;
  background-color: white;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 32px;
}

.logo {
  width: 120px;
  height: auto;
  margin-bottom: 16px;
}

.logo-container h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0;
}

.client-login-form {
  width: 100%;
  max-width: 400px;
  padding: 24px;
  border-radius: 8px;
  box-shadow: var(--shadow-md);
}

.client-login-form h2 {
  margin: 0 0 12px 0;
  font-size: 24px;
  text-align: center;
  color: var(--color-primary-dark);
}

.login-subtitle {
  text-align: center;
  color: var(--color-text-light);
  margin-bottom: 24px;
  font-size: 14px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: var(--color-text);
}

.input-with-icon {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-light);
}

input[type="email"],
input[type="password"],
input[type="text"] {
  width: 100%;
  padding: 12px 40px 12px 40px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 16px;
  transition: border 0.3s ease;
}

input[type="email"]:focus,
input[type="password"]:focus,
input[type="text"]:focus {
  border-color: var(--color-primary);
  outline: none;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: var(--color-text-light);
  cursor: pointer;
  padding: 0;
}

.remember-me {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.remember-me div {
  display: flex;
  align-items: center;
}

input[type="checkbox"] {
  margin-right: 8px;
}

.forgot-password {
  color: var(--color-primary);
  text-decoration: none;
  font-size: 14px;
}

.forgot-password:hover {
  text-decoration: underline;
}

.error-message {
  padding: 10px;
  border-radius: 4px;
  background-color: rgba(244, 67, 54, 0.1);
  color: var(--color-error);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-size: 14px;
}

.login-button {
  width: 100%;
  padding: 14px;
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  transition: background-color 0.3s ease;
}

.login-button:hover {
  background-color: var(--color-primary-dark);
}

.login-button:disabled {
  background-color: var(--color-text-light);
  cursor: not-allowed;
}

.register-button {
  width: 100%;
  padding: 14px;
  background-color: var(--color-success);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  transition: background-color 0.3s ease;
  margin-bottom: 16px;
}

.register-button:hover {
  background-color: var(--color-success-dark);
}

.or-divider {
  display: flex;
  align-items: center;
  margin: 24px 0;
}

.or-divider::before,
.or-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background-color: var(--color-border);
}

.or-divider span {
  padding: 0 12px;
  color: var(--color-text-light);
  font-size: 14px;
}

.demo-login {
  margin-top: 20px;
  padding: 16px;
  background-color: var(--color-background);
  border-radius: 4px;
}

.demo-login p {
  font-size: 14px;
  text-align: center;
  margin-bottom: 12px;
  color: var(--color-text-light);
}

.demo-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 14px;
}

.demo-login-button {
  margin-top: 12px;
  padding: 8px;
  background-color: var(--color-primary-light);
  color: var(--color-primary-dark);
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  transition: all 0.3s ease;
}

.demo-login-button:hover {
  background-color: var(--color-primary);
  color: white;
}

.client-login-info {
  flex: 1;
  background-color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 40px;
}

.client-login-info-content {
  max-width: 500px;
}

.client-login-info h2 {
  font-size: 32px;
  margin-bottom: 24px;
}

.client-login-info p {
  font-size: 18px;
  margin-bottom: 32px;
  opacity: 0.9;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  font-size: 18px;
}

.feature-list li i {
  color: white;
  opacity: 0.9;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
}

.loading-spinner i {
  margin-bottom: 16px;
  color: var(--color-primary);
}

@media (max-width: 992px) {
  .client-login-container {
    flex-direction: column;
  }
  
  .client-login-info {
    padding: 40px 20px;
  }
}

@media (max-width: 576px) {
  .client-login-form-container {
    padding: 20px;
  }
}
</style>