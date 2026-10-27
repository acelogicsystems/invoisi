<script setup lang="ts">
import { useInvoiceStore } from '@/stores/invoice';
import type { CurrencyCode } from '@/types/invoice';

const store = useInvoiceStore();

const currencies: { code: CurrencyCode; label: string; symbol: string }[] = [
  { code: 'KES', label: 'KES', symbol: 'KSh' },
  { code: 'USD', label: 'USD', symbol: '$' },
  { code: 'EUR', label: 'EUR', symbol: '€' },
  { code: 'GBP', label: 'GBP', symbol: '£' },
];

const setCurrency = (code: CurrencyCode) => {
  store.invoice.currency = code;
};
</script>

<template>
  <div class="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
    <button
      v-for="curr in currencies"
      :key="curr.code"
      type="button"
      @click="setCurrency(curr.code)"
      :class="
        store.invoice.currency === curr.code
          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-semibold'
          : 'text-slate-400 hover:text-slate-200 border-transparent font-medium'
      "
      class="px-2.5 py-1 text-[11px] rounded-md border transition cursor-pointer flex items-center gap-1"
      :title="`Switch currency to ${curr.label}`"
    >
      <span class="text-[10px] opacity-70">{{ curr.symbol }}</span>
      <span>{{ curr.label }}</span>
    </button>
  </div>
</template>