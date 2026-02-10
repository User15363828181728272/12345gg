
import { PAYMENT_API_KEY } from '../constants';
import { PaymentData } from '../types';

// Relative path for Vercel proxy rewrite
const PAYMENT_PROXY_BASE = '/payment-api';

export const createDeposit = async (amount: number): Promise<PaymentData> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); 

  try {
    // Ensuring the endpoint follows: base_url/api/payment/deposit?apikey={key}
    const response = await fetch(`${PAYMENT_PROXY_BASE}/deposit?apikey=${PAYMENT_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Gagal membuat permintaan pembayaran');
    }
    
    const data = await response.json();
    return {
      orderId: data.orderId,
      qrCodeUrl: data.qrCodeUrl,
      amountToPay: data.amountToPay,
      status: 'pending'
    };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Gateway Timeout: Koneksi ke penyedia QRIS terlalu lama.');
    }
    throw error;
  }
};

export const checkStatus = async (orderId: string): Promise<string> => {
  const response = await fetch(`${PAYMENT_PROXY_BASE}/status/${orderId}?apikey=${PAYMENT_API_KEY}`);
  if (!response.ok) throw new Error('Gagal mengecek status pembayaran');
  
  const data = await response.json();
  return data.status; 
};
