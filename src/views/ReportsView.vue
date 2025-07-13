<template>
  <div class="reports-container">
    <h1>📊 Relatórios - Quero Locar</h1>
    
    <div class="reports-grid">
      <div class="report-card">
        <h3><i class="fas fa-chart-line" /> Equipamentos Alugados</h3>
        <p>Relatório de equipamentos atualmente em locação</p>
        <button class="btn-primary">
          Gerar Relatório
        </button>
      </div>
      
      <div class="report-card">
        <h3><i class="fas fa-dollar-sign" /> Faturamento</h3>
        <p>Relatório financeiro e receitas do período</p>
        <button class="btn-primary">
          Gerar Relatório
        </button>
      </div>
      
      <div class="report-card">
        <h3><i class="fas fa-users" /> Clientes</h3>
        <p>Relatório de clientes ativos e histórico</p>
        <button class="btn-primary">
          Gerar Relatório
        </button>
      </div>
      
      <div class="report-card">
        <h3><i class="fas fa-wrench" /> Manutenção</h3>
        <p>Relatório de manutenções e disponibilidade</p>
        <button class="btn-primary">
          Gerar Relatório
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ReportsView'
}
</script>

<style scoped>
.reports-container {
  padding: 24px;
}

.reports-container h1 {
  color: #333;
  margin-bottom: 32px;
  font-size: 28px;
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.report-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.report-card:hover {
  transform: translateY(-2px);
}

.report-card h3 {
  color: #1976D2;
  margin-bottom: 12px;
  font-size: 18px;
}

.report-card h3 i {
  margin-right: 8px;
}

.report-card p {
  color: #666;
  margin-bottom: 20px;
  line-height: 1.5;
}

.btn-primary {
  background: #1976D2;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #1565C0;
}
</style>
