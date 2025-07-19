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

        <p v-if="error" class="login-error">{{ error }}</p>
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
      error: ''
    }
  },
  setup() {
    const authStore = useAuthStore()
    const router = useRouter()
    return { authStore, router }
  },
  methods: {
    async handleLogin() {
      const email = this.email.trim().toLowerCase()
      try {
        await this.authStore.login({ email, password: this.password })
        this.router.push('/dashboard')
      } catch (err) {
        console.error('Erro ao fazer login:', err)
        this.error = 'Credenciais inválidas. Verifique e tente novamente.'
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f9f9f9;
}
.login-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.login-form {
  display: flex;
  flex-direction: column;
}
.form-group {
  margin-bottom: 1rem;
}
input {
  padding: 0.75rem;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.btn-login {
  padding: 0.75rem;
  background: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.btn-login:hover {
  background: #135ba1;
}
.login-error {
  margin-top: 1rem;
  color: red;
}
</style>
