
export type Language = 'id' | 'en';

export interface Package {
  id: string;
  ram: number;
  disk: number;
  price: number;
  isTop?: boolean;
}

export interface CartItem extends Package {
  cartId: string;
  serverName?: string;
}

export interface User {
  id: string;
  username: string;
  isAdmin: boolean;
  whatsapp?: string;
}

export interface ServerInstance {
  id: string;
  name: string;
  ram: number;
  disk: number;
  status: 'active' | 'suspended';
  expiryDate: string;
  daysRemaining: number;
}

export interface Promo {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface PaymentData {
  orderId: string;
  qrCodeUrl: string;
  amountToPay: number;
  status: 'pending' | 'settlement' | 'expired';
}
