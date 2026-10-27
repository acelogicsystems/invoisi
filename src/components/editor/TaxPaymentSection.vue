<script setup lang="ts">
import { useInvoiceStore } from '@/stores/invoice';

const store = useInvoiceStore();
</script>

<template>
  <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
    <div class="border-b border-slate-800 pb-3">
      <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-300">Taxes & Payment Gateway</h3>
      <p class="text-[11px] text-slate-500">Kenyan withholding tax, VAT & M-Pesa channels</p>
    </div>

    <!-- Tax Toggles -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
      <div class="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-lg">
        <div>
          <span class="font-medium text-slate-200 block">16% VAT</span>
          <span class="text-[10px] text-slate-500">VAT registered businesses</span>
        </div>
        <input
          v-model="store.invoice.taxConfig.vatEnabled"
          type="checkbox"
          class="accent-emerald-500 w-4 h-4 cursor-pointer"
        />
      </div>

      <div class="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
        <div class="flex items-center justify-between">
          <div>
            <span class="font-medium text-slate-200 block">Withholding Tax (WHT)</span>
            <span class="text-[10px] text-slate-500">Corporate client deduction</span>
          </div>
          <input
            v-model="store.invoice.taxConfig.whtEnabled"
            type="checkbox"
            class="accent-emerald-500 w-4 h-4 cursor-pointer"
          />
        </div>

        <div v-if="store.invoice.taxConfig.whtEnabled" class="flex items-center gap-2 pt-1 border-t border-slate-900">
          <label class="text-[10px] text-slate-400">Rate:</label>
          <select
            v-model.number="store.invoice.taxConfig.whtRate"
            class="bg-slate-900 border border-slate-700 text-slate-200 rounded px-2 py-0.5 text-xs font-mono focus:outline-none"
          >
            <option :value="5">5% (Professional / Consultancy)</option>
            <option :value="3">3% (Contractual / Works)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Payment Gateway Selection -->
    <div class="space-y-3 text-xs pt-1">
      <label class="block text-slate-400 font-medium">Payment Settlement Account</label>

      <div class="grid grid-cols-3 gap-2">
        <button
          type="button"
          @click="store.setPaymentType('mpesa_till')"
          :class="store.invoice.paymentDetails.type === 'mpesa_till' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-950 text-slate-400 border-slate-800'"
          class="p-2 border rounded-lg text-center font-medium transition cursor-pointer"
        >
          Buy Goods Till
        </button>
        <button
          type="button"
          @click="store.setPaymentType('mpesa_paybill')"
          :class="store.invoice.paymentDetails.type === 'mpesa_paybill' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-950 text-slate-400 border-slate-800'"
          class="p-2 border rounded-lg text-center font-medium transition cursor-pointer"
        >
          Paybill
        </button>
        <button
          type="button"
          @click="store.setPaymentType('pochi')"
          :class="store.invoice.paymentDetails.type === 'pochi' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-950 text-slate-400 border-slate-800'"
          class="p-2 border rounded-lg text-center font-medium transition cursor-pointer"
        >
          Pochi la Biashara
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
        <div>
          <label class="block text-[11px] text-slate-400 mb-1">
            {{ store.invoice.paymentDetails.type === 'pochi' ? 'Pochi Mobile Number' : 'Till / Paybill Number' }}
          </label>
          <input
            v-model="store.invoice.paymentDetails.identifier"
            type="text"
            placeholder="e.g. 543210"
            class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div v-if="store.invoice.paymentDetails.type === 'mpesa_paybill'">
          <label class="block text-[11px] text-slate-400 mb-1">Account Number / Reference</label>
          <input
            v-model="store.invoice.paymentDetails.accountNumber"
            type="text"
            placeholder="e.g. INV-001 or Client Name"
            class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div :class="store.invoice.paymentDetails.type !== 'mpesa_paybill' ? 'md:col-span-1' : 'md:col-span-2'">
          <label class="block text-[11px] text-slate-400 mb-1">Account Name / Store Name</label>
          <input
            v-model="store.invoice.paymentDetails.accountName"
            type="text"
            placeholder="e.g. Karani Tech"
            class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>
    </div>
  </div>
</template>