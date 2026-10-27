<script setup lang="ts">
import { ref, computed } from 'vue';
import { useInvoiceStore } from '@/stores/invoice';
import { sanitizeKraPin, fileToBase64, isValidKraPin } from '@/utils/formatters';

const store = useInvoiceStore();
const fileInput = ref<HTMLInputElement | null>(null);

const onKraInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  store.invoice.sender.kraPin = sanitizeKraPin(target.value);
};

const isKraValid = computed(() => {
  if (!store.invoice.sender.kraPin) return null;
  return isValidKraPin(store.invoice.sender.kraPin);
});

const handleLogoChange = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  try {
    const base64 = await fileToBase64(file);
    store.setLogo(base64);
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Please select an image file under 2MB.');
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};
</script>

<template>
  <div class="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
    <!-- Header with Step Indicator -->
    <div class="flex items-center justify-between border-b border-slate-800/80 pb-3.5">
      <div class="flex items-center gap-3">
        <span class="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-semibold flex items-center justify-center">
          01
        </span>
        <div>
          <h2 class="text-sm font-semibold text-slate-100">Your Business / Profile</h2>
          <p class="text-xs text-slate-400">Who is sending this invoice? (Saved automatically)</p>
        </div>
      </div>

      <!-- Logo Picker -->
      <div>
        <input
          ref="fileInput"
          type="file"
          accept="image/png,image/jpeg,image/svg+xml"
          class="hidden"
          @change="handleLogoChange"
        />
        <div v-if="store.invoice.sender.logoUrl" class="flex items-center gap-2">
          <img
            :src="store.invoice.sender.logoUrl"
            alt="Uploaded Business Logo"
            class="w-8 h-8 object-contain rounded-lg bg-slate-950 border border-slate-700 p-0.5"
          />
          <button
            type="button"
            @click="store.removeLogo()"
            class="text-xs text-rose-400 hover:text-rose-300 font-medium transition cursor-pointer"
          >
            Remove
          </button>
        </div>
        <button
          v-else
          type="button"
          @click="triggerFileInput"
          class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 transition cursor-pointer"
        >
          <svg class="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Add Logo
        </button>
      </div>
    </div>

    <!-- Form Inputs -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
      <div class="md:col-span-2">
        <label class="flex items-center justify-between text-slate-300 font-medium mb-1.5">
          <span>Your Business Name or Full Name <span class="text-emerald-400">*</span></span>
          <span class="text-[11px] text-slate-500 font-normal">Appears as main header</span>
        </label>
        <input
          v-model="store.invoice.sender.name"
          type="text"
          placeholder="e.g. Karani DevLabs or Brian Karani"
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
        />
      </div>

      <div>
        <label class="block text-slate-300 font-medium mb-1.5">Email Address</label>
        <input
          v-model="store.invoice.sender.email"
          type="email"
          placeholder="brian@example.com"
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
        />
      </div>

      <div>
        <label class="block text-slate-300 font-medium mb-1.5">Phone Number</label>
        <input
          v-model="store.invoice.sender.phone"
          type="tel"
          placeholder="0712 345 678"
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
        />
      </div>

      <div>
        <label class="block text-slate-300 font-medium mb-1.5">Physical Location / Town</label>
        <input
          v-model="store.invoice.sender.address"
          type="text"
          placeholder="e.g. Kilimani, Nairobi"
          class="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition"
        />
      </div>

      <div>
        <label class="flex items-center justify-between text-slate-300 font-medium mb-1.5">
          <span>KRA PIN (Optional)</span>
          <span v-if="isKraValid === true" class="text-[11px] text-emerald-400 font-mono">✓ Valid PIN</span>
          <span v-else-if="isKraValid === false" class="text-[11px] text-amber-400 font-mono">Format: A012345678B</span>
        </label>
        <input
          :value="store.invoice.sender.kraPin"
          @input="onKraInput"
          type="text"
          maxlength="11"
          placeholder="A012345678B"
          :class="isKraValid === false ? 'border-amber-500/60 focus:border-amber-500' : 'border-slate-800 focus:border-emerald-500'"
          class="w-full bg-slate-950 border rounded-xl px-3.5 py-2.5 text-slate-100 font-mono uppercase placeholder-slate-600 focus:outline-none transition"
        />
      </div>
    </div>
  </div>
</template>