
import { Package } from './types';

// Payment API Configuration
export const PAYMENT_API_KEY = "51f9cc59799beaa9afc37defb56889e113c706f85e8b0d5c66e8eba5f05c996d";
export const PAYMENT_BASE_URL = "https://blackhat.web.id/api/payment";

// Pterodactyl Configuration
export const PTERO_DOMAIN = "https://depstore11-private.shanydev.web.id";
export const PTERO_APPLICATION_KEY = "ptla_Mtz9iAewLPD7hyh6KcFo0C2k746isiQqrkGTIsxwaTI";
export const PTERO_CLIENT_KEY = "ptlc_QIj4VSKFLhCFSSAnugc8GMzohmyIEgwoNGutpCZ9VKg";

// Telegram Configuration
export const TELEGRAM_BOT_TOKEN = "8558345908:AAFUB_auLDNH00roVJvMPZAhA-giIQr0xUk";
export const TELEGRAM_CHAT_ID = "8412273544";

// Database Configuration (Supabase)
export const SUPABASE_URL = "https://your-project-url.supabase.co";
export const SUPABASE_ANON_KEY = "your-anon-key";

// Initial state for fallback (Pterodactyl Spec C6R12)
export const INITIAL_PACKAGES: Package[] = [
  { id: "1gb", ram: 1, disk: 10, price: 500 },
  { id: "2gb", ram: 2, disk: 20, price: 3000 },
  { id: "3gb", ram: 3, disk: 30, price: 4500 },
  { id: "4gb", ram: 4, disk: 40, price: 6000 },
  { id: "5gb", ram: 5, disk: 50, price: 7500, isTop: true },
  { id: "6gb", ram: 6, disk: 60, price: 9000 },
  { id: "7gb", ram: 7, disk: 70, price: 10500 },
  { id: "8gb", ram: 8, disk: 80, price: 12000 },
  { id: "9gb", ram: 9, disk: 90, price: 13500 },
  { id: "10gb", ram: 10, disk: 100, price: 15000 },
];

export const CONTACT_WHATSAPP = "628824244996";
export const CONTACT_TELEGRAM = "@depstore11";
