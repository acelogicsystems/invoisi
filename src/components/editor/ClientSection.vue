<script setup lang="ts">
import { computed } from 'vue';
import { useInvoiceStore } from '@/stores/invoice';
import { sanitizeKraPin, isValidKraPin } from '@/utils/formatters';

const store = useInvoiceStore();

const onKraInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  store.invoice.client.kraPin = sanitizeKraPin(target.value);
};

const isKraValid = computed(() => {
  if (!store.invoice.client.kraPin) return null;
  return isValidKraPin(store.invoice.client.kraPin);
});
</script>

<template>
  <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
    <!-- Header with Step Indicator -->
    <div class="flex items-center justify-between border-b border-slate-800/80 pb-3.5">
      <div class="flex items-center gap-3">
        <span class="w-6 h-6 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-semibold flex items-center justify-center">
          02
        </span>
        <div>
          <h2 class="text-sm font-semibold text-slate-100">Client / Customer</h2>
          <p class="text-xs text-slate-400">Who is paying for this work?</p>
        </div>
      </div>

      <!-- Invoice Number Pill -->
      <div class="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1">
        <span class="text-[11px] text-slate-500 font-mono">Invoice #</span>
        <input
          v-model="store.invoice.invoiceNumber"
          type="text"
          class="w-20 bg-transparent text-xs font-mono font-bold text-emerald-400 focus:outline-none text-right"
          placeholder="INV-001"
        />
      </div>
    </div>

    <!-- Form Inputs -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
      <div class="md:col-span-2">
        <label class="block text-slate-300 font-medium mb-1.5">
          Client or Company Name <span class="text-emerald-400">*</span>
        </label>
        <input
          v-model="store.invoice.client.name"
          type="text"
          placeholder="e.g. Safaricom Ltd or Mary Wanjiku"
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition"
        />
      </div>

      <div>
        <label class="flex items-center justify-between text-slate-300 font-medium mb-1.5">
          <span>Client Phone Number</span>
          <span class="text-[11px] text-emerald-400 font-normal">Used for WhatsApp send</span>
        </label>
        <input
          v-model="store.invoice.client.phone"
          type="tel"
          placeholder="0712 345 678"
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition"
        />
      </div>

      <div>
        <label class="block text-slate-300 font-medium mb-1.5">Client Email</label>
        <input
          v-model="store.invoice.client.email"
          type="email"
          placeholder="accounts@client.co.ke"
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition"
        />
      </div>

      <div>
        <label class="block text-slate-300 font-medium mb-1.5">Client Location / Address</label>
        <input
          v-model="store.invoice.client.address"
          type="text"
          placeholder="e.g. Westlands, Nairobi"
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition"
        />
      </div>

      <div>
        <label class="flex items-center justify-between text-slate-300 font-medium mb-1.5">
          <span>Client KRA PIN (Optional)</span>
          <span v-if="isKraValid === true" class="text-[11px] text-emerald-400 font-mono">✓ Valid PIN</span>
          <span v-else-if="isKraValid === false" class="text-[11px] text-amber-400 font-mono">Format: P051234567X</span>
        </label>
        <input
          :value="store.invoice.client.kraPin"
          @input="onKraInput"
          type="text"
          maxlength="11"
          placeholder="P051234567X"
          :class="isKraValid === false ? 'border-amber-500/60 focus:border-amber-500' : 'border-slate-800 focus:border-cyan-500'"
          class="w-full bg-slate-950 border rounded-xl px-3.5 py-2.5 text-slate-100 font-mono uppercase placeholder-slate-600 focus:outline-none transition"
        />
      </div>

      <!-- Dates -->
      <div>
        <label class="block text-slate-300 font-medium mb-1.5">Date of Issue</label>
        <input
          v-model="store.invoice.issueDate"
          type="date"
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 font-mono focus:outline-none focus:border-cyan-500 transition"
        />
      </div>

      <div>
        <label class="block text-slate-300 font-medium mb-1.5">Payment Due Date</label>
        <input
          v-model="store.invoice.dueDate"
          type="date"
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 font-mono focus:outline-none focus:border-cyan-500 transition"
        />
      </div>
    </div>
  </div>
</template>