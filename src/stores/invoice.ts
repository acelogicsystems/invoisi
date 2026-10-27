import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { InvoiceState, PaymentMethodType } from '@/types/invoice';
import { formatCurrency, normalizeKenyanPhone } from '@/utils/formatters';

const DEFAULT_INVOICE: InvoiceState = {
  id: 'draft-01',
  invoiceNumber: 'INV-001',
  issueDate: new Date().toISOString().slice(0, 10),
  dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  currency: 'KES',

  sender: {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: 'Nairobi',
    kraPin: '',
    logoUrl: '',
  },

  client: {
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    kraPin: '',
  },

  items: [
    {
      id: crypto.randomUUID(),
      description: 'Consultancy & Web Development Services',
      quantity: 1,
      unitPrice: 25000,
      discountRate: 0,
    },
  ],

  taxConfig: {
    vatEnabled: false,
    vatRate: 16,
    whtEnabled: false,
    whtRate: 5,
  },

  paymentDetails: {
    type: 'mpesa_till',
    accountName: '',
    identifier: '',
    accountNumber: '',
    notes: 'Payment due within 14 days of invoice date.',
  },

  notes: 'Thank you for your business!',
  terms: 'Late payments may attract a 2% monthly interest fee.',
  showWatermark: true,
};

export const useInvoiceStore = defineStore(
  'invoice',
  () => {
    const invoice = ref<InvoiceState>(structuredClone(DEFAULT_INVOICE));

    // --- Financial Computations ---

    const subtotal = computed(() => {
      return invoice.value.items.reduce((sum, item) => {
        const itemTotal = (item.quantity || 0) * (item.unitPrice || 0);
        const discount = (itemTotal * (item.discountRate || 0)) / 100;
        return sum + (itemTotal - discount);
      }, 0);
    });

    const vatAmount = computed(() => {
      if (!invoice.value.taxConfig.vatEnabled) return 0;
      return (subtotal.value * invoice.value.taxConfig.vatRate) / 100;
    });

    const totalWithVat = computed(() => {
      return subtotal.value + vatAmount.value;
    });

    // Kenyan WHT is calculated on the subtotal before VAT
    const whtAmount = computed(() => {
      if (!invoice.value.taxConfig.whtEnabled) return 0;
      return (subtotal.value * invoice.value.taxConfig.whtRate) / 100;
    });

    const netPayable = computed(() => {
      return totalWithVat.value - whtAmount.value;
    });

    // --- Dynamic WhatsApp Link ---

    const whatsappShareUrl = computed(() => {
      const clientName = invoice.value.client.name || 'Client';
      const invNum = invoice.value.invoiceNumber || 'INV-001';
      const totalStr = formatCurrency(netPayable.value, invoice.value.currency);

      let payInfo = '';
      const { type, identifier, accountNumber, accountName } = invoice.value.paymentDetails;

      if (type === 'mpesa_till') {
        payInfo = `M-Pesa Till: ${identifier || 'N/A'}${accountName ? ` (${accountName})` : ''}`;
      } else if (type === 'mpesa_paybill') {
        payInfo = `Paybill: ${identifier || 'N/A'}, Acc: ${accountNumber || invNum}${accountName ? ` (${accountName})` : ''}`;
      } else if (type === 'pochi') {
        payInfo = `Pochi la Biashara: ${identifier || 'N/A'}${accountName ? ` (${accountName})` : ''}`;
      } else if (type === 'bank') {
        payInfo = `Bank: ${invoice.value.paymentDetails.bankName || ''}, Acc: ${identifier || ''}`;
      } else {
        payInfo = `Details: ${identifier || 'N/A'}`;
      }

      const rawPhone = invoice.value.client.phone || '';
      const cleanPhone = normalizeKenyanPhone(rawPhone);

      const message = `Hello ${clientName},\n\nPlease find invoice *#${invNum}* for *${totalStr}*.\n\n*Payment Details:*\n${payInfo}\n\nDue Date: ${invoice.value.dueDate}\nThank you!`;

      return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    });

    // --- Store Actions ---

    function addItem() {
      invoice.value.items.push({
        id: crypto.randomUUID(),
        description: '',
        quantity: 1,
        unitPrice: 0,
        discountRate: 0,
      });
    }

    function removeItem(index: number) {
      // Guard: Always keep at least 1 item
      if (invoice.value.items.length > 1) {
        invoice.value.items.splice(index, 1);
      }
    }

    function setPaymentType(type: PaymentMethodType) {
      invoice.value.paymentDetails.type = type;
      if (type !== 'mpesa_paybill') {
        invoice.value.paymentDetails.accountNumber = '';
      }
    }

    function setLogo(dataUri: string) {
      invoice.value.sender.logoUrl = dataUri;
    }

    function removeLogo() {
      invoice.value.sender.logoUrl = '';
    }

    function resetInvoice() {
      invoice.value = structuredClone(DEFAULT_INVOICE);
    }

    return {
      invoice,
      subtotal,
      vatAmount,
      totalWithVat,
      whtAmount,
      netPayable,
      whatsappShareUrl,
      addItem,
      removeItem,
      setPaymentType,
      setLogo,
      removeLogo,
      resetInvoice,
    };
  },
  {
    persist: true,
  }
);