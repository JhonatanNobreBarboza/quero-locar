<template>
  <div class="login-container">
    <div class="login-card">
      <h1>🔐 Quero Locar</h1>
      <h2>Login do Sistema</h2>

      <form class="login-form" @submit.prevent="handleLogin">
        <div class="form-group">
          <label>E-mail:</label>
          <input
            v-model="email"
            type="email"
            placeholder="seu_email@email.com"
            autocomplete="username"
            required
          />
        </div>

        <div class="form-group">
          <label>Senha:</label>
          <input
            v-model="password"
            type="password"
            placeholder="******"
            autocomplete="current-password"
            required
          />
        </div>

        <button type="submit" class="btn-login">
          Entrar no Sistema
        </button>

        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: ''
    }
  },
  methods: {
    async handleLogin() {
      const payload = {
        email: this.email.trim().toLowerCase(),
        password: this.password
      }

      console.log('📤 Enviando login com:', payload)

      try {
        const authStore = useAuthStore()
        const router = useRouter()

        await authStore.login(payload)
        router.push('/dashboard')
      } catch (error) {
        console.error('❌ Erro no login:', error)
        this.errorMessage = 'Credenciais inválidas. Verifique e tente novamente.'
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1976D2 0%, #42A5F5 100%);
}

.login-card {
  background: white;
  padding: 48px;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  width: 100%;
}

.login-card h1 {
  color: #1976D2;
  font-size: 32px;
  text-align: center;
  margin-bottom: 8px;
}

.login-card h2 {
  color: #666;
  font-size: 18px;
  text-align: center;
  margin-bottom: 32px;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #1976D2;
}

.btn-login {
  width: 100%;
  background: #1976D2;
  color: white;
  border: none;
  padding: 16px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-login:hover {
  background: #1565C0;
}

.error {
  color: red;
  margin-top: 1rem;
  text-align: center;
}
</style>
