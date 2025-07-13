<template>
  <div class="profile-container">
    <h1>👤 Meu Perfil</h1>
    <div class="profile-card">
      <h2>Informações do Usuário</h2>
      <p><strong>Nome:</strong> AD Administrador Sistema</p>
      <p><strong>Email:</strong> admin@querolocar.com</p>
      <p><strong>Cargo:</strong> Administrador</p>
      <button class="btn-primary">
        Editar Perfil
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProfileView'
}
</script>

<style scoped>
.profile-container {
  padding: 24px;
}
.profile-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 500px;
}
.btn-primary {
  background: #1976D2;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  margin-top: 16px;
}
</style>
