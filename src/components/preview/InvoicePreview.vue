<script setup lang="ts">
import { useInvoiceStore } from '@/stores/invoice';
import { formatCurrency } from '@/utils/formatters';

const store = useInvoiceStore();
</script>

<template>
  <div
    id="invoice-capture-area"
    class="a4-sheet w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-900 p-8 sm:p-12 shadow-2xl rounded-sm border border-slate-200 flex flex-col justify-between"
  >
    <div>
      <!-- Header: Branding & Meta -->
      <div class="flex justify-between items-start border-b border-slate-200 pb-8">
        <div class="space-y-2 max-w-[60%]">
          <img
            v-if="store.invoice.sender.logoUrl"
            :src="store.invoice.sender.logoUrl"
            alt="Business Logo"
            class="max-h-12 w-auto object-contain mb-2"
          />
          <h2 class="text-xl font-bold tracking-tight text-slate-900 uppercase">
            {{ store.invoice.sender.name || 'YOUR BUSINESS NAME' }}
          </h2>
          <div class="text-xs text-slate-500 space-y-0.5">
            <p v-if="store.invoice.sender.address">{{ store.invoice.sender.address }}</p>
            <p v-if="store.invoice.sender.email">{{ store.invoice.sender.email }}</p>
            <p v-if="store.invoice.sender.phone">{{ store.invoice.sender.phone }}</p>
            <p v-if="store.invoice.sender.kraPin" class="font-mono font-medium text-slate-700">
              KRA PIN: {{ store.invoice.sender.kraPin }}
            </p>
          </div>
        </div>

        <div class="text-right">
          <span class="inline-block px-3 py-1 bg-slate-100 text-slate-800 font-mono text-xs font-semibold rounded uppercase tracking-wider">
            INVOICE
          </span>
          <p class="font-mono text-sm font-bold text-slate-800 mt-2">
            #{{ store.invoice.invoiceNumber || 'INV-001' }}
          </p>
          <div class="text-xs text-slate-500 mt-1 space-y-0.5 font-mono">
            <p>Issue: {{ store.invoice.issueDate }}</p>
            <p>Due: {{ store.invoice.dueDate }}</p>
          </div>
        </div>
      </div>

      <!-- Bill To Section -->
      <div class="mt-6 pb-6 border-b border-slate-100">
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Billed To</span>
        <h3 class="text-base font-semibold text-slate-800 mt-1">
          {{ store.invoice.client.name || 'Client Name / Company' }}
        </h3>
        <div class="text-xs text-slate-600 mt-1 space-y-0.5">
          <p v-if="store.invoice.client.address">{{ store.invoice.client.address }}</p>
          <p v-if="store.invoice.client.email">{{ store.invoice.client.email }}</p>
          <p v-if="store.invoice.client.phone">{{ store.invoice.client.phone }}</p>
          <p v-if="store.invoice.client.kraPin" class="font-mono text-slate-700 font-medium">
            Client KRA PIN: {{ store.invoice.client.kraPin }}
          </p>
        </div>
      </div>

      <!-- Line Items Table -->
      <div class="mt-6">
        <table class="w-full text-left text-xs border-collapse">
          <thead>
            <tr class="border-b-2 border-slate-900 text-slate-700 uppercase font-semibold">
              <th class="py-2.5">Item Description</th>
              <th class="py-2.5 text-center w-16">Qty</th>
              <th class="py-2.5 text-right w-28">Unit Price</th>
              <th class="py-2.5 text-right w-28">Total</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="item in store.invoice.items" :key="item.id" class="text-slate-800">
              <td class="py-3 pr-2">
                <span class="font-medium text-slate-900">{{ item.description || 'Description of work' }}</span>
                <span v-if="item.discountRate" class="block text-[11px] text-emerald-600">
                  ({{ item.discountRate }}% discount applied)
                </span>
              </td>
              <td class="py-3 text-center text-slate-600 font-mono">{{ item.quantity }}</td>
              <td class="py-3 text-right text-slate-600 font-mono">
                {{ formatCurrency(item.unitPrice, store.invoice.currency) }}
              </td>
              <td class="py-3 text-right font-medium text-slate-900 font-mono">
                {{ formatCurrency((item.quantity * item.unitPrice) * (1 - (item.discountRate || 0)/100), store.invoice.currency) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Financial Totals Summary -->
      <div class="mt-8 flex justify-end">
        <div class="w-72 space-y-2 text-xs totals-summary">
          <div class="flex justify-between py-1 text-slate-600">
            <span>Subtotal:</span>
            <span class="font-mono text-slate-900 font-medium">
              {{ formatCurrency(store.subtotal, store.invoice.currency) }}
            </span>
          </div>

          <div v-if="store.invoice.taxConfig.vatEnabled" class="flex justify-between py-1 text-slate-600">
            <span>VAT ({{ store.invoice.taxConfig.vatRate }}%):</span>
            <span class="font-mono text-slate-900 font-medium">
              {{ formatCurrency(store.vatAmount, store.invoice.currency) }}
            </span>
          </div>

          <div class="flex justify-between py-1 border-t border-slate-200 text-slate-800 font-medium">
            <span>Gross Total:</span>
            <span class="font-mono">
              {{ formatCurrency(store.totalWithVat, store.invoice.currency) }}
            </span>
          </div>

          <div v-if="store.invoice.taxConfig.whtEnabled" class="flex justify-between py-1 text-rose-600">
            <span>Less: WHT ({{ store.invoice.taxConfig.whtRate }}%):</span>
            <span class="font-mono">
              -{{ formatCurrency(store.whtAmount, store.invoice.currency) }}
            </span>
          </div>

          <div class="flex justify-between py-2 border-t-2 border-slate-900 text-slate-900 text-sm font-bold">
            <span>Net Payable:</span>
            <span class="font-mono text-emerald-700">
              {{ formatCurrency(store.netPayable, store.invoice.currency) }}
            </span>
          </div>
        </div>
      </div>

      <!-- Payment Instructions Card -->
      <div class="mt-8 p-4 rounded bg-slate-50 border border-slate-200 text-xs text-slate-700 payment-box">
        <span class="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Payment Instructions
        </span>
        <div class="flex items-center gap-3">
          <div v-if="store.invoice.paymentDetails.type.startsWith('mpesa')" class="px-2 py-0.5 bg-emerald-600 text-white font-bold text-[10px] rounded">
            M-PESA
          </div>
          <div class="space-y-0.5">
            <p v-if="store.invoice.paymentDetails.type === 'mpesa_till'" class="font-medium">
              Buy Goods Till: <span class="font-mono font-bold text-slate-900">{{ store.invoice.paymentDetails.identifier || '123456' }}</span>
              <span v-if="store.invoice.paymentDetails.accountName"> ({{ store.invoice.paymentDetails.accountName }})</span>
            </p>
            <p v-else-if="store.invoice.paymentDetails.type === 'mpesa_paybill'" class="font-medium">
              Paybill: <span class="font-mono font-bold text-slate-900">{{ store.invoice.paymentDetails.identifier }}</span> |
              Account: <span class="font-mono font-bold text-slate-900">{{ store.invoice.paymentDetails.accountNumber || store.invoice.invoiceNumber }}</span>
              <span v-if="store.invoice.paymentDetails.accountName"> ({{ store.invoice.paymentDetails.accountName }})</span>
            </p>
            <p v-else-if="store.invoice.paymentDetails.type === 'pochi'" class="font-medium">
              Pochi la Biashara: <span class="font-mono font-bold text-slate-900">{{ store.invoice.paymentDetails.identifier }}</span>
            </p>
            <p v-if="store.invoice.paymentDetails.notes" class="text-slate-500 text-[11px] mt-1">
              {{ store.invoice.paymentDetails.notes }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Document Footer -->
    <footer class="mt-8 pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
      <span>Generated via Invoisi.ke</span>
      <span v-if="store.invoice.showWatermark" class="text-slate-300">
        Kenyan Freelance & SME Studio
      </span>
    </footer>
  </div>
</template>

<style scoped>
@media print {
  .a4-sheet {
    box-shadow: none !important;
    border: none !important;
    padding: 0 !important;
    max-width: 100% !important;
    width: 100% !important;
    min-height: auto !important;
  }
}
</style>