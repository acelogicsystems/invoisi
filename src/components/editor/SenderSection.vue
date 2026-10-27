<script setup lang="ts">
import { ref } from 'vue';
import { useInvoiceStore } from '@/stores/invoice';
import { sanitizeKraPin, fileToBase64 } from '@/utils/formatters';

const store = useInvoiceStore();
const fileInput = ref<HTMLInputElement | null>(null);

const onKraInput = (e: Event) => {
  const target = e.target as HTMLInputElement;
  store.invoice.sender.kraPin = sanitizeKraPin(target.value);
};

const handleLogoChange = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  try {
    const base64 = await fileToBase64(file);
    store.setLogo(base64);
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Failed to process logo');
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};
</script>

<template>
  <div class="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
    <div class="flex items-center justify-between border-b border-slate-800 pb-3">
      <div>
        <h3 class="text-xs font-semibold uppercase tracking-wider text-slate-300">Your Business Details</h3>
        <p class="text-[11px] text-slate-500">Issuer Information</p>
      </div>

      <!-- Logo Uploader Pill -->
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
            alt="Business Logo"
            class="w-7 h-7 object-contain rounded bg-slate-800 border border-slate-700"
          />
          <button
            type="button"
            @click="store.removeLogo()"
            class="text-[11px] text-rose-400 hover:text-rose-300 transition"
          >
            Remove
          </button>
        </div>
        <button
          v-else
          type="button"
          @click="triggerFileInput"
          class="px-2.5 py-1 text-[11px] rounded bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition"
        >
          + Upload Logo
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
      <div class="md:col-span-2">
        <label class="block text-slate-400 mb-1">Business Name / Full Name *</label>
        <input
          v-model="store.invoice.sender.name"
          type="text"
          placeholder="e.g. Karani Tech Solutions"
          class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div>
        <label class="block text-slate-400 mb-1">Email</label>
        <input
          v-model="store.invoice.sender.email"
          type="email"
          placeholder="accounts@karani.co.ke"
          class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div>
        <label class="block text-slate-400 mb-1">Phone</label>
        <input
          v-model="store.invoice.sender.phone"
          type="tel"
          placeholder="+254 7..."
          class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div>
        <label class="block text-slate-400 mb-1">Address / Street</label>
        <input
          v-model="store.invoice.sender.address"
          type="text"
          placeholder="e.g. Ngong Road, Kilimani"
          class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div>
        <label class="block text-slate-400 mb-1">KRA PIN (Sender)</label>
        <input
          :value="store.invoice.sender.kraPin"
          @input="onKraInput"
          type="text"
          maxlength="11"
          placeholder="A012345678B"
          class="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-100 font-mono placeholder-slate-600 uppercase focus:outline-none focus:border-emerald-500"
        />
      </div>
    </div>
  </div>
</template>