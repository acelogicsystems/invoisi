<script setup lang="ts">
import { useInvoiceStore } from '@/stores/invoice';

const store = useInvoiceStore();
</script>

<template>
  <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
    <div class="flex items-center justify-between border-b border-slate-800 pb-3">
      <div>
        <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-300">Deliverables & Line Items</h3>
        <p class="text-[11px] text-slate-500">Service descriptions and quantities</p>
      </div>
      <button
        type="button"
        @click="store.addItem"
        class="text-xs font-medium text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer transition"
      >
        + Add Item
      </button>
    </div>

    <div class="space-y-3">
      <div
        v-for="(item, index) in store.invoice.items"
        :key="item.id"
        class="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg space-y-2 text-xs"
      >
        <div class="flex items-start justify-between gap-2">
          <input
            v-model="item.description"
            type="text"
            placeholder="Item or service description..."
            class="w-full bg-transparent border-b border-slate-800 focus:border-emerald-500 pb-1 text-slate-100 placeholder-slate-600 focus:outline-none"
          />
          <button
            v-if="store.invoice.items.length > 1"
            type="button"
            @click="store.removeItem(index)"
            class="text-slate-500 hover:text-rose-400 transition cursor-pointer px-1 text-sm leading-none"
            title="Delete item"
          >
            &times;
          </button>
        </div>

        <div class="grid grid-cols-3 gap-2 pt-1 font-mono">
          <div>
            <label class="block text-[10px] text-slate-500 uppercase">Quantity</label>
            <input
              v-model.number="item.quantity"
              type="number"
              min="1"
              class="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label class="block text-[10px] text-slate-500 uppercase">Unit Price</label>
            <input
              v-model.number="item.unitPrice"
              type="number"
              min="0"
              class="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div>
            <label class="block text-[10px] text-slate-500 uppercase">Discount %</label>
            <input
              v-model.number="item.discountRate"
              type="number"
              min="0"
              max="100"
              class="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>