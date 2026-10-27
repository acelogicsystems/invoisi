<script setup lang="ts">
import { ref } from 'vue';
import SenderSection from '@/components/editor/SenderSection.vue';
import ClientSection from '@/components/editor/ClientSection.vue';
import LineItemsSection from '@/components/editor/LineItemsSection.vue';
import TaxPaymentSection from '@/components/editor/TaxPaymentSection.vue';
import ActionToolbar from '@/components/editor/ActionToolbar.vue';
import InvoicePreview from '@/components/preview/InvoicePreview.vue';
import CurrencySwitcher from '@/components/editor/CurrencySwitcher.vue';

const activeMobileTab = ref<'editor' | 'preview'>('editor');

const handlePrint = () => {
  window.print();
};
</script>

<template>
  <div class="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col antialiased">
    <!-- Navbar Header -->
    <header class="no-print h-16 border-b border-slate-800/80 bg-[#0e1420]/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-emerald-400 text-slate-950 font-bold flex items-center justify-center text-sm shadow-sm">
          ₦
        </div>
        <div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-bold tracking-tight text-white">Invoisi<span class="text-emerald-400">.ke</span></span>
            <span class="hidden sm:inline-block px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full">
              Kenya Edition
            </span>
          </div>
          <p class="text-[11px] text-slate-400 hidden sm:block">Zero-login freelance & SME invoice studio</p>
        </div>
      </div>

      <!-- Currency Switcher Pill Container -->
      <div class="hidden md:flex items-center">
        <CurrencySwitcher />
      </div>

      <div class="flex items-center gap-2.5">
        <!-- Mobile tab toggle -->
        <div class="flex lg:hidden bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            @click="activeMobileTab = 'editor'"
            :class="activeMobileTab === 'editor' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400'"
            class="px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer"
          >
            Edit
          </button>
          <button
            type="button"
            @click="activeMobileTab = 'preview'"
            :class="activeMobileTab === 'preview' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400'"
            class="px-3 py-1.5 text-xs font-semibold rounded-lg transition cursor-pointer"
          >
            Preview
          </button>
        </div>

        <ActionToolbar @trigger-print="handlePrint" />
      </div>
    </header>

    <!-- Split-Screen Workstation -->
    <main class="flex-1 flex flex-col lg:flex-row overflow-hidden">
      <!-- Left Panel: Form Controls -->
      <section
        :class="activeMobileTab === 'editor' ? 'flex' : 'hidden lg:flex'"
        class="no-print w-full lg:w-[48%] xl:w-[45%] flex-col border-r border-slate-800/80 bg-[#0b0f17] overflow-y-auto max-h-[calc(100vh-4rem)] p-4 sm:p-6 space-y-5"
      >
        <SenderSection />
        <ClientSection />
        <LineItemsSection />
        <TaxPaymentSection />
      </section>

      <!-- Right Panel: Live A4 Document -->
      <section
        :class="activeMobileTab === 'preview' ? 'flex' : 'hidden lg:flex'"
        class="preview-container w-full lg:w-[52%] xl:w-[55%] bg-[#080b11] p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[calc(100vh-4rem)] justify-center items-start"
      >
        <InvoicePreview />
      </section>
    </main>
  </div>
</template>