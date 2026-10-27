<script setup lang="ts">
import { useInvoiceStore } from '@/stores/invoice';
import { formatCurrency } from '@/utils/formatters';

const store = useInvoiceStore();
</script>

<template>
  <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
    <!-- Header with Step Indicator -->
    <div class="flex items-center justify-between border-b border-slate-800/80 pb-3.5">
      <div class="flex items-center gap-3">
        <span class="w-6 h-6 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 font-mono text-xs font-semibold flex items-center justify-center">
          03
        </span>
        <div>
          <h2 class="text-sm font-semibold text-slate-100">Work & Items Delivered</h2>
          <p class="text-xs text-slate-400">Services, goods, or deliverables being billed</p>
        </div>
      </div>

      <button
        type="button"
        @click="store.addItem"
        class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition cursor-pointer"
      >
        <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Add Another Item
      </button>
    </div>

    <!-- Line Item Cards -->
    <div class="space-y-3">
      <div
        v-for="(item, index) in store.invoice.items"
        :key="item.id"
        class="p-4 bg-slate-950/70 border border-slate-800/90 rounded-xl space-y-3 text-xs hover:border-slate-700 transition"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1">
            <label class="block text-[11px] text-slate-400 font-medium mb-1">
              Description of Work #{{ index + 1 }}
            </label>
            <input
              v-model="item.description"
              type="text"
              placeholder="e.g. Web Design & Frontend Development (Milestone 1)"
              class="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-violet-500 transition"
            />
          </div>
          <button
            v-if="store.invoice.items.length > 1"
            type="button"
            @click="store.removeItem(index)"
            class="text-slate-500 hover:text-rose-400 transition cursor-pointer p-1.5 rounded hover:bg-slate-900 mt-5"
            title="Remove this item"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        <!-- Numerics Grid with Live Line Calculation -->
        <div class="grid grid-cols-12 gap-2.5 pt-1 items-end">
          <div class="col-span-3">
            <label class="block text-[11px] text-slate-400 font-medium mb-1">Quantity / Hours</label>
            <input
              v-model.number="item.quantity"
              type="number"
              min="1"
              class="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-violet-500 transition text-center"
            />
          </div>

          <div class="col-span-5">
            <label class="block text-[11px] text-slate-400 font-medium mb-1">
              Unit Rate ({{ store.invoice.currency }})
            </label>
            <input
              v-model.number="item.unitPrice"
              type="number"
              min="0"
              class="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-violet-500 transition"
            />
          </div>

          <div class="col-span-4">
            <label class="block text-[11px] text-slate-400 font-medium mb-1">Discount %</label>
            <input
              v-model.number="item.discountRate"
              type="number"
              min="0"
              max="100"
              placeholder="0%"
              class="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:outline-none focus:border-violet-500 transition text-center"
            />
          </div>
        </div>

        <!-- Calculated Line Subtotal Badge -->
        <div class="flex justify-between items-center pt-1 border-t border-slate-900 text-[11px]">
          <span class="text-slate-500">Row Total:</span>
          <span class="font-mono font-semibold text-slate-300">
            {{ formatCurrency((item.quantity * item.unitPrice) * (1 - (item.discountRate || 0) / 100), store.invoice.currency) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>