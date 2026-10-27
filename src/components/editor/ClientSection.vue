<script setup lang="ts">
import { useInvoiceStore } from '@/stores/invoice';
import { sanitizeKraPin } from '@/utils/formatters';

const store = useInvoiceStore();

const onKraInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  store.invoice.client.kraPin = sanitizeKraPin(target.value);
};
</script>

<template>
  <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
    <div class="flex items-center justify-between border-b border-slate-800 pb-3">
      <div>
        <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-300">Client / Billed To</h3>
        <p class="text-[11px] text-slate-500">Recipient Information</p>
      </div>
      <div class="flex gap-2">
        <input
          v-model="store.invoice.invoiceNumber"
          type="text"
          class="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500 w-24 text-right"
          placeholder="INV-001"
        />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
      <div class="md:col-span-2">
        <label class="block text-slate-400 mb-1">Client Name / Business Name *</label>
        <input
          v-model="store.invoice.client.name"
          type="text"
          placeholder="e.g. Acme Africa Ltd"
          class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div>
        <label class="block text-slate-400 mb-1">Client Phone (For WhatsApp share)</label>
        <input
          v-model="store.invoice.client.phone"
          type="tel"
          placeholder="0712345678"
          class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div>
        <label class="block text-slate-400 mb-1">Client Email</label>
        <input
          v-model="store.invoice.client.email"
          type="email"
          placeholder="billing@acme.co.ke"
          class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div>
        <label class="block text-slate-400 mb-1">Client Address / Location</label>
        <input
          v-model="store.invoice.client.address"
          type="text"
          placeholder="Westlands, Nairobi"
          class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div>
        <label class="block text-slate-400 mb-1">Client KRA PIN (Optional)</label>
        <input
          :value="store.invoice.client.kraPin"
          @input="onKraInput"
          type="text"
          maxlength="11"
          placeholder="P051234567X"
          class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono placeholder-slate-600 uppercase focus:outline-none focus:border-emerald-500"
        />
      </div>

      <!-- Dates -->
      <div>
        <label class="block text-slate-400 mb-1">Issue Date</label>
        <input
          v-model="store.invoice.issueDate"
          type="date"
          class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div>
        <label class="block text-slate-400 mb-1">Due Date</label>
        <input
          v-model="store.invoice.dueDate"
          type="date"
          class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
        />
      </div>
    </div>
  </div>
</template>