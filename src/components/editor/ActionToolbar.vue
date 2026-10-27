<script setup lang="ts">
import { ref } from 'vue';
import { useInvoiceStore } from '@/stores/invoice';
import { downloadElementAsPng } from '@/utils/exporter';

const emit = defineEmits<{
  (e: 'trigger-print'): void;
}>();

const store = useInvoiceStore();
const isExportingImage = ref(false);

const openWhatsApp = () => {
  window.open(store.whatsappShareUrl, '_blank');
};

const handleNewInvoice = () => {
  if (
    confirm(
      `Start a new invoice? This will save your business profile, advance to ${
        store.invoice.invoiceNumber ? 'the next invoice number' : 'INV-002'
      }, and clear current items.`
    )
  ) {
    store.createNewInvoice();
  }
};

const handleDownloadImage = async () => {
  const targetElement = document.getElementById('invoice-capture-area');
  if (!targetElement) return;

  try {
    isExportingImage.value = true;
    const invNum = store.invoice.invoiceNumber || 'INV-001';
    await downloadElementAsPng(targetElement, `Invoice-${invNum}`);
  } catch (err) {
    alert('Failed to generate image. Please try the PDF download instead.');
  } finally {
    isExportingImage.value = false;
  }
};
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- New Invoice Auto-Increment Button -->
    <button
      @click="handleNewInvoice"
      type="button"
      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition cursor-pointer"
      title="Create next invoice and preserve your business settings"
    >
      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      <span>New</span>
    </button>

    <!-- Save as PNG Image -->
    <button
      @click="handleDownloadImage"
      type="button"
      :disabled="isExportingImage"
      class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition cursor-pointer disabled:opacity-50"
      title="Download high-resolution PNG for WhatsApp"
    >
      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
      <span>{{ isExportingImage ? 'Saving...' : 'Image' }}</span>
    </button>

    <!-- WhatsApp Share Button (Soft Sage #A8D5BA Accent) -->
    <button
      @click="openWhatsApp"
      type="button"
      class="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-[#A8D5BA]/15 text-[#A8D5BA] border border-[#A8D5BA]/30 hover:bg-[#A8D5BA]/25 transition cursor-pointer"
      title="Open WhatsApp with structured invoice summary"
    >
      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.174.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.144.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z"/>
      </svg>
      <span>WhatsApp</span>
    </button>

    <!-- Download PDF / Print Button (Electric Cobalt #3155ff Primary) -->
    <button
      @click="emit('trigger-print')"
      type="button"
      class="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-[#3155ff] text-white hover:bg-[#2443d6] shadow-sm shadow-[#3155ff]/30 transition cursor-pointer"
      title="Download PDF or Print"
    >
      <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
      <span>PDF</span>
    </button>
  </div>
</template>