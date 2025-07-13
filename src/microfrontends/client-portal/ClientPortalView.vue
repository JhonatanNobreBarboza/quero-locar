<template>
  <div class="client-portal-container">
    <div class="welcome-section">
      <h1 class="text-3xl font-bold mb-4">
        Portal do Cliente
      </h1>
      <p class="text-lg mb-6">
        Bem-vindo ao Portal do Cliente Quero Locar. Gerencie seus equipamentos, acompanhe
        locações e solicite novos orçamentos.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Active Rentals Section -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex items-center mb-4">
          <i class="fas fa-truck-loading text-blue-600 text-2xl mr-3" />
          <h2 class="text-xl font-semibold">
            Locações Ativas
          </h2>
        </div>
        <div v-if="activeRentals.length > 0">
          <div
            v-for="rental in activeRentals"
            :key="rental.id"
            class="mb-3 p-3 border border-gray-200 rounded-md"
          >
            <div class="flex justify-between">
              <span class="font-medium">{{ rental.equipmentName }}</span>
              <span class="text-sm text-gray-600">{{ formatDate(rental.startDate) }} - {{ formatDate(rental.endDate) }}</span>
            </div>
            <div class="mt-1 text-sm text-gray-700">
              {{ rental.location }}
            </div>
            <div class="mt-2 flex justify-between items-center">
              <span
                class="text-sm"
                :class="{
                  'text-green-600': rental.status === 'Ativo',
                  'text-yellow-600': rental.status === 'Pendente',
                  'text-orange-600': rental.status === 'Finalização Próxima'
                }"
              >
                {{ rental.status }}
              </span>
              <button class="text-blue-600 text-sm hover:underline">
                Detalhes
              </button>
            </div>
          </div>
        </div>
        <div
          v-else
          class="py-4 text-center text-gray-500"
        >
          Nenhuma locação ativa no momento
        </div>
      </div>

      <!-- New Quote Request Section -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex items-center mb-4">
          <i class="fas fa-file-invoice-dollar text-green-600 text-2xl mr-3" />
          <h2 class="text-xl font-semibold">
            Solicitar Orçamento
          </h2>
        </div>
        <p class="text-gray-600 mb-4">
          Solicite um orçamento rápido para seu próximo projeto
        </p>
        <form @submit.prevent="submitQuoteRequest">
          <div class="mb-3">
            <label
              for="equipmentType"
              class="block text-sm font-medium text-gray-700 mb-1"
            >Tipo de Equipamento</label>
            <select
              id="equipmentType"
              v-model="quoteRequest.equipmentType"
              class="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option
                value=""
                disabled
              >
                Selecione um tipo
              </option>
              <option value="caçamba">
                Caçamba de Entulho
              </option>
              <option value="betoneira">
                Betoneira
              </option>
              <option value="andaime">
                Andaime
              </option>
              <option value="carretinha">
                Carretinha de Poda
              </option>
            </select>
          </div>
          
          <div class="mb-3">
            <label
              for="location"
              class="block text-sm font-medium text-gray-700 mb-1"
            >Localização</label>
            <input
              id="location"
              v-model="quoteRequest.location"
              type="text"
              class="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Endereço de entrega"
            >
          </div>
          
          <div class="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label
                for="startDate"
                class="block text-sm font-medium text-gray-700 mb-1"
              >Data Início</label>
              <input
                id="startDate"
                v-model="quoteRequest.startDate"
                type="date"
                class="w-full border border-gray-300 rounded-md px-3 py-2"
              >
            </div>
            <div>
              <label
                for="endDate"
                class="block text-sm font-medium text-gray-700 mb-1"
              >Data Fim</label>
              <input
                id="endDate"
                v-model="quoteRequest.endDate"
                type="date"
                class="w-full border border-gray-300 rounded-md px-3 py-2"
              >
            </div>
          </div>
          
          <div class="mb-3">
            <label
              for="additionalInfo"
              class="block text-sm font-medium text-gray-700 mb-1"
            >Informações Adicionais</label>
            <textarea
              id="additionalInfo"
              v-model="quoteRequest.additionalInfo"
              class="w-full border border-gray-300 rounded-md px-3 py-2"
              rows="2"
            />
          </div>
          
          <button
            type="submit"
            class="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Solicitar Orçamento
          </button>
        </form>
      </div>

      <!-- Recent Activity and Documents Section -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex items-center mb-4">
          <i class="fas fa-history text-purple-600 text-2xl mr-3" />
          <h2 class="text-xl font-semibold">
            Atividades Recentes
          </h2>
        </div>
        <div v-if="recentActivities.length > 0">
          <div
            v-for="activity in recentActivities"
            :key="activity.id"
            class="mb-3 pb-3 border-b border-gray-200"
          >
            <div class="flex items-start">
              <i :class="`fas fa-${activity.icon} text-${activity.color}-500 mt-1 mr-2`" />
              <div>
                <div class="font-medium">
                  {{ activity.title }}
                </div>
                <div class="text-sm text-gray-600">
                  {{ activity.description }}
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  {{ formatDateTime(activity.timestamp) }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-else
          class="py-4 text-center text-gray-500"
        >
          Nenhuma atividade recente
        </div>

        <div class="mt-6">
          <div class="flex items-center mb-4">
            <i class="fas fa-file-alt text-gray-600 text-2xl mr-3" />
            <h2 class="text-xl font-semibold">
              Documentos
            </h2>
          </div>
          <div v-if="documents.length > 0">
            <div
              v-for="doc in documents"
              :key="doc.id"
              class="flex justify-between items-center mb-2 p-2 hover:bg-gray-50 rounded"
            >
              <div class="flex items-center">
                <i :class="`fas ${getFileIcon(doc.type)} text-gray-500 mr-2`" />
                <span>{{ doc.name }}</span>
              </div>
              <button class="text-blue-600 hover:underline text-sm">
                <i class="fas fa-download mr-1" /> Baixar
              </button>
            </div>
          </div>
          <div
            v-else
            class="py-4 text-center text-gray-500"
          >
            Nenhum documento disponível
          </div>
          <div class="mt-3">
            <button class="w-full flex items-center justify-center bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300">
              <i class="fas fa-upload mr-2" /> Enviar Documento
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Quote History Section -->
    <div class="mt-6 bg-white p-6 rounded-lg shadow-md">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center">
          <i class="fas fa-file-invoice text-orange-600 text-2xl mr-3" />
          <h2 class="text-xl font-semibold">
            Histórico de Orçamentos
          </h2>
        </div>
        <div class="flex items-center gap-2">
          <button class="text-blue-600 hover:underline text-sm">
            <i class="fas fa-filter mr-1" /> Filtrar
          </button>
          <button class="text-blue-600 hover:underline text-sm">
            <i class="fas fa-download mr-1" /> Exportar
          </button>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th class="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nº
              </th>
              <th class="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Equipamento
              </th>
              <th class="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Localização
              </th>
              <th class="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Período
              </th>
              <th class="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              <th class="py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr
              v-for="quote in quoteHistory"
              :key="quote.id"
            >
              <td class="py-3 text-sm text-gray-800">
                {{ quote.number }}
              </td>
              <td class="py-3 text-sm text-gray-800">
                {{ quote.equipment }}
              </td>
              <td class="py-3 text-sm text-gray-800">
                {{ quote.location }}
              </td>
              <td class="py-3 text-sm text-gray-800">
                {{ formatDate(quote.startDate) }} - {{ formatDate(quote.endDate) }}
              </td>
              <td class="py-3 text-sm">
                <span
                  class="px-2 py-1 rounded-full text-xs"
                  :class="{
                    'bg-green-100 text-green-800': quote.status === 'Aprovado',
                    'bg-yellow-100 text-yellow-800': quote.status === 'Pendente',
                    'bg-red-100 text-red-800': quote.status === 'Recusado',
                    'bg-gray-100 text-gray-800': quote.status === 'Expirado'
                  }"
                >
                  {{ quote.status }}
                </span>
              </td>
              <td class="py-3 text-sm text-gray-800">
                {{ formatCurrency(quote.value) }}
              </td>
              <td class="py-3 text-sm">
                <button class="text-blue-600 hover:underline mr-3">
                  Ver
                </button>
                <button
                  v-if="quote.status === 'Pendente'"
                  class="text-green-600 hover:underline"
                >
                  Aprovar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div
        v-if="quoteHistory.length === 0"
        class="py-4 text-center text-gray-500"
      >
        Nenhum orçamento no histórico
      </div>
      
      <div
        v-if="quoteHistory.length > 0"
        class="mt-4 flex justify-between items-center"
      >
        <div class="text-sm text-gray-600">
          Mostrando 1-{{ quoteHistory.length }} de {{ quoteHistory.length }} resultados
        </div>
        <div class="flex gap-2">
          <button
            class="px-3 py-1 border border-gray-300 rounded-md text-sm bg-gray-50 text-gray-400"
            disabled
          >
            Anterior
          </button>
          <button
            class="px-3 py-1 border border-gray-300 rounded-md text-sm bg-gray-50 text-gray-400"
            disabled
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Mock data for active rentals
const activeRentals = ref([
  { 
    id: 1, 
    equipmentName: 'Caçamba de Entulho 5m³', 
    startDate: '2025-07-05', 
    endDate: '2025-07-15',
    location: 'Rua dos Ipês, 234 - Jardim Botânico',
    status: 'Ativo'
  },
  { 
    id: 2, 
    equipmentName: 'Betoneira 150L', 
    startDate: '2025-07-08', 
    endDate: '2025-07-12',
    location: 'Av. das Flores, 4567 - Barra da Tijuca',
    status: 'Finalização Próxima'
  }
])

// Quote request form data
const quoteRequest = ref({
  equipmentType: '',
  location: '',
  startDate: '',
  endDate: '',
  additionalInfo: ''
})

// Recent activities
const recentActivities = ref([
  { 
    id: 1, 
    title: 'Orçamento Aprovado', 
    description: 'Seu orçamento #2345 foi aprovado e está em processamento.',
    timestamp: '2025-07-08T14:32:00',
    icon: 'check-circle',
    color: 'green'
  },
  { 
    id: 2, 
    title: 'Equipamento Entregue', 
    description: 'Caçamba de Entulho 5m³ foi entregue no endereço solicitado.',
    timestamp: '2025-07-05T09:15:00',
    icon: 'truck',
    color: 'blue'
  },
  { 
    id: 3, 
    title: 'Novo Orçamento', 
    description: 'Você solicitou um orçamento para Betoneira 150L.',
    timestamp: '2025-07-02T16:45:00',
    icon: 'file-invoice',
    color: 'orange'
  }
])

// Documents
const documents = ref([
  { id: 1, name: 'Contrato_Caçamba_5m3.pdf', type: 'pdf' },
  { id: 2, name: 'NF_2345_QueroLocar.pdf', type: 'pdf' },
  { id: 3, name: 'Manual_Operacao_Betoneira.pdf', type: 'pdf' },
  { id: 4, name: 'Termo_Responsabilidade.docx', type: 'word' }
])

// Quote history
const quoteHistory = ref([
  { 
    id: 1, 
    number: 'ORC-2345',
    equipment: 'Caçamba de Entulho 5m³',
    location: 'Rua dos Ipês, 234 - Jardim Botânico',
    startDate: '2025-07-05',
    endDate: '2025-07-15',
    status: 'Aprovado',
    value: 950.00
  },
  { 
    id: 2, 
    number: 'ORC-2346',
    equipment: 'Betoneira 150L',
    location: 'Av. das Flores, 4567 - Barra da Tijuca',
    startDate: '2025-07-08',
    endDate: '2025-07-12',
    status: 'Aprovado',
    value: 350.00
  },
  { 
    id: 3, 
    number: 'ORC-2347',
    equipment: 'Andaime Fachadeiro (10m²)',
    location: 'Rua Alameda dos Anjos, 123 - Centro',
    startDate: '2025-07-20',
    endDate: '2025-07-30',
    status: 'Pendente',
    value: 1200.00
  }
])

// Format date from YYYY-MM-DD to DD/MM/YYYY
const formatDate = (dateString) => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
}

// Format datetime
const formatDateTime = (dateTimeString) => {
  if (!dateTimeString) return '';
  const date = new Date(dateTimeString);
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Format currency to BRL
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

// Get icon for file types
const getFileIcon = (type) => {
  const icons = {
    pdf: 'fa-file-pdf',
    word: 'fa-file-word',
    excel: 'fa-file-excel',
    image: 'fa-file-image',
    default: 'fa-file'
  };
  return icons[type] || icons.default;
}

// Submit quote request
const submitQuoteRequest = () => {
  // In a real app, this would send the request to the backend
  console.log('Submitting quote request:', quoteRequest.value);
  
  // Show confirmation and reset form
  alert('Orçamento solicitado com sucesso! Entraremos em contato em breve.');
  quoteRequest.value = {
    equipmentType: '',
    location: '',
    startDate: '',
    endDate: '',
    additionalInfo: ''
  };
}

onMounted(() => {
  // In a real app, we would fetch data from an API here
  console.log('Client Portal component mounted');
})
</script>

<style scoped>
.client-portal-container {
  @apply p-6;
}

.welcome-section {
  @apply mb-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-lg shadow-lg;
}
</style>