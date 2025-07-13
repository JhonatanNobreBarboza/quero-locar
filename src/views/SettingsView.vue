<template>
  <div class="settings-container">
    <h1>⚙️ Configurações</h1>
    <div class="settings-card">
      <h2>Configurações do Sistema</h2>
      <div class="setting-item">
        <label>Tema:</label>
        <select>
          <option>Claro</option>
          <option>Escuro</option>
        </select>
      </div>
      <div class="setting-item">
        <label>Idioma:</label>
        <select>
          <option>Português</option>
          <option>English</option>
        </select>
      </div>
      <button class="btn-primary">
        Salvar Configurações
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SettingsView'
}
</script>

<style scoped>
.settings-container {
  padding: 24px;
}
.settings-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 500px;
}
.setting-item {
  margin-bottom: 16px;
}
.setting-item label {
  display: block;
  margin-bottom: 4px;
  font-weight: 500;
}
.setting-item select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
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
