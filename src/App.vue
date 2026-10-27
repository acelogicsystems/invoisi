<script setup lang="ts">
import { ref } from 'vue';
import SenderSection from '@/components/editor/SenderSection.vue';
import ClientSection from '@/components/editor/ClientSection.vue';
import LineItemsSection from '@/components/editor/LineItemsSection.vue';
import TaxPaymentSection from '@/components/editor/TaxPaymentSection.vue';
import ActionToolbar from '@/components/editor/ActionToolbar.vue';
import InvoicePreview from '@/components/preview/InvoicePreview.vue';
import CurrencySwitcher from './components/editor/CurrencySwitcher.vue';

const activeMobileTab = ref<'editor' | 'preview'>('editor');

const handlePrint = () => {
  window.print();
};
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased">
    <!-- Navbar Header -->
    <header class="no-print h-16 border-b border-slate-800 bg-slate-900/60 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-30">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
          ₦
        </div>
        <div>
          <h1 class="text-sm font-semibold tracking-wide text-white">Invoisi<span class="text-emerald-400">.ke</span></h1>
          <p class="text-[11px] text-slate-400">Kenyan Freelance & SME Invoice Studio</p>
        </div>
      </div>

      <!-- Currency Switcher Pill Container -->
      <div class="hidden sm:flex items-center">
        <CurrencySwitcher />
      </div>

      <div class="flex items-center gap-3">
        <!-- Mobile tab toggle -->
        <div class="flex lg:hidden bg-slate-800 p-1 rounded-lg border border-slate-700">
          <button
            type="button"
            @click="activeMobileTab = 'editor'"
            :class="activeMobileTab === 'editor' ? 'bg-slate-700 text-white' : 'text-slate-400'"
            class="px-3 py-1 text-xs font-medium rounded-md transition"
          >
            Edit
          </button>
          <button
            type="button"
            @click="activeMobileTab = 'preview'"
            :class="activeMobileTab === 'preview' ? 'bg-slate-700 text-white' : 'text-slate-400'"
            class="px-3 py-1 text-xs font-medium rounded-md transition"
          >
            Preview
          </button>
        </div>

        <ActionToolbar @trigger-print="handlePrint" />
      </div>
    </header>
   

    <!-- Split-Screen Body -->
    <main class="flex-1 flex flex-col lg:flex-row overflow-hidden">
      <!-- Left Panel: Form Controls -->
      <section
        :class="activeMobileTab === 'editor' ? 'flex' : 'hidden lg:flex'"
        class="no-print w-full lg:w-[48%] xl:w-[45%] flex-col border-r border-slate-800/80 bg-slate-950 overflow-y-auto max-h-[calc(100vh-4rem)] p-6 space-y-6"
      >
        <SenderSection />
        <ClientSection />
        <LineItemsSection />
        <TaxPaymentSection />
      </section>

      <!-- Right Panel: Live A4 Document -->
      <section
        :class="activeMobileTab === 'preview' ? 'flex' : 'hidden lg:flex'"
        class="preview-container w-full lg:w-[52%] xl:w-[55%] bg-slate-900/40 p-4 lg:p-8 overflow-y-auto max-h-[calc(100vh-4rem)] justify-center items-start"
      >
        <InvoicePreview />
      </section>
    </main>
  </div>
</template>