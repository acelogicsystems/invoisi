export type CurrencyCode = 'KES' | 'USD' | 'EUR' | 'GBP';

export type PaymentMethodType = 'mpesa_till' | 'mpesa_paybill' | 'pochi' | 'bank' | 'custom';

export interface PaymentDetails {
  type: PaymentMethodType;
  accountName: string;
  identifier: string; // Till Number, Paybill Number, or Pochi Phone Number
  accountNumber?: string; // Required only when type === 'mpesa_paybill'
  bankName?: string;
  branch?: string;
  swiftCode?: string;
  notes?: string;
}

export interface InvoiceParty {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  kraPin?: string; // e.g. A012345678B
  logoUrl?: string; // Base64 data URI
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discountRate?: number; // In percentage (0 - 100)
}

export interface TaxConfig {
  vatRate: number; // Defaults to 16 for Kenya
  vatEnabled: boolean;
  whtRate: number; // 3 or 5 for Kenya
  whtEnabled: boolean;
}

export interface InvoiceState {
  id: string;
  invoiceNumber: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string;   // YYYY-MM-DD
  currency: CurrencyCode;
  
  sender: InvoiceParty;
  client: InvoiceParty;
  
  items: InvoiceItem[];
  taxConfig: TaxConfig;
  
  paymentDetails: PaymentDetails;
  
  notes: string;
  terms: string;
  showWatermark: boolean;
}