<script setup lang="ts">
import { useInvoiceStore } from '@/stores/invoice';

const store = useInvoiceStore();
</script>

<template>
  <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-5">
    <!-- Header with Step Indicator -->
    <div class="border-b border-slate-800/80 pb-3.5 flex items-center gap-3">
      <span class="w-6 h-6 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-semibold flex items-center justify-center">
        04
      </span>
      <div>
        <h2 class="text-sm font-semibold text-slate-100">Taxes & Payment Settlement</h2>
        <p class="text-xs text-slate-400">Kenyan statutory deductions and how you want to be paid</p>
      </div>
    </div>

    <!-- Tax Toggles -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
      <!-- VAT -->
      <label class="flex items-start justify-between p-3.5 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer hover:border-slate-700 transition">
        <div class="pr-3">
          <span class="font-semibold text-slate-200 block">Add 16% VAT</span>
          <span class="text-[11px] text-slate-500 block mt-0.5">Check this if you are VAT-registered with KRA.</span>
        </div>
        <input
          v-model="store.invoice.taxConfig.vatEnabled"
          type="checkbox"
          class="accent-emerald-500 w-4 h-4 cursor-pointer mt-0.5"
        />
      </label>

      <!-- WHT -->
      <div class="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2.5">
        <label class="flex items-start justify-between cursor-pointer">
          <div class="pr-3">
            <span class="font-semibold text-slate-200 block">Deduct Withholding Tax (WHT)</span>
            <span class="text-[11px] text-slate-500 block mt-0.5">Deducted if your client is a corporate tax agent.</span>
          </div>
          <input
            v-model="store.invoice.taxConfig.whtEnabled"
            type="checkbox"
            class="accent-emerald-500 w-4 h-4 cursor-pointer mt-0.5"
          />
        </label>

        <div v-if="store.invoice.taxConfig.whtEnabled" class="flex items-center justify-between pt-2 border-t border-slate-900">
          <span class="text-[11px] text-slate-400">Statutory Rate:</span>
          <select
            v-model.number="store.invoice.taxConfig.whtRate"
            class="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs font-mono focus:outline-none"
          >
            <option :value="5">5% (Consultancy & Professional)</option>
            <option :value="3">3% (Contractual & Works)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Payment Gateway Section -->
    <div class="space-y-3.5 text-xs pt-1">
      <div class="flex items-center justify-between">
        <label class="text-slate-300 font-semibold">M-Pesa Payment Channel</label>
        <span class="text-[11px] text-slate-500">Pick where the money lands</span>
      </div>

      <!-- Channel Pills -->
      <div class="grid grid-cols-3 gap-2">
        <button
          type="button"
          @click="store.setPaymentType('mpesa_till')"
          :class="store.invoice.paymentDetails.type === 'mpesa_till' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/50 shadow-sm' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-300'"
          class="p-2.5 border rounded-xl text-center font-medium transition cursor-pointer flex flex-col items-center gap-0.5"
        >
          <span class="text-xs font-semibold">Buy Goods Till</span>
          <span class="text-[10px] opacity-70">Lipa na M-Pesa</span>
        </button>

        <button
          type="button"
          @click="store.setPaymentType('mpesa_paybill')"
          :class="store.invoice.paymentDetails.type === 'mpesa_paybill' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/50 shadow-sm' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-300'"
          class="p-2.5 border rounded-xl text-center font-medium transition cursor-pointer flex flex-col items-center gap-0.5"
        >
          <span class="text-xs font-semibold">Paybill</span>
          <span class="text-[10px] opacity-70">Business Number</span>
        </button>

        <button
          type="button"
          @click="store.setPaymentType('pochi')"
          :class="store.invoice.paymentDetails.type === 'pochi' ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/50 shadow-sm' : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-300'"
          class="p-2.5 border rounded-xl text-center font-medium transition cursor-pointer flex flex-col items-center gap-0.5"
        >
          <span class="text-xs font-semibold">Pochi</span>
          <span class="text-[10px] opacity-70">Pochi la Biashara</span>
        </button>
      </div>

      <!-- Detail Fields for the Chosen Mode -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
        <div>
          <label class="block text-slate-300 font-medium mb-1.5">
            {{ store.invoice.paymentDetails.type === 'pochi' ? 'Pochi Mobile Number' : (store.invoice.paymentDetails.type === 'mpesa_till' ? 'Till Number' : 'Paybill Number') }}
          </label>
          <input
            v-model="store.invoice.paymentDetails.identifier"
            type="text"
            :placeholder="store.invoice.paymentDetails.type === 'pochi' ? '0712 345 678' : 'e.g. 543210'"
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 font-mono focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div v-if="store.invoice.paymentDetails.type === 'mpesa_paybill'">
          <label class="block text-slate-300 font-medium mb-1.5">Account Number / Reference</label>
          <input
            v-model="store.invoice.paymentDetails.accountNumber"
            type="text"
            placeholder="e.g. INV-001 or Client Name"
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 font-mono focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div :class="store.invoice.paymentDetails.type !== 'mpesa_paybill' ? 'md:col-span-1' : 'md:col-span-2'">
          <label class="block text-slate-300 font-medium mb-1.5">Registered Account / Business Name</label>
          <input
            v-model="store.invoice.paymentDetails.accountName"
            type="text"
            placeholder="e.g. Karani systems"
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div class="md:col-span-2">
          <label class="block text-slate-300 font-medium mb-1.5">Payment Terms / Notes</label>
          <input
            v-model="store.invoice.paymentDetails.notes"
            type="text"
            placeholder="e.g. Payment due within 14 days of invoice date."
            class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>
      </div>
    </div>
  </div>
</template>