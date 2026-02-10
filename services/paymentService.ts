
import { PAYMENT_API_KEY } from '../constants';
import { PaymentData } from '../types';

// Relative path for Vercel proxy rewrite
const PAYMENT_PROXY_BASE = '/payment-api';

export const createDeposit = async (amount: number): Promise<PaymentData> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); 

  try {
    // Ensuring the endpoint follows: base_url/api/payment/deposit?apikey={key}
    // Note: Query parameters should be passed exactly as needed by the destination.
    const url = `${PAYMENT_PROXY_BASE}/deposit?apikey=${PAYMENT_API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ amount }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const msg = errorData.message || `Error ${response.status}: Gagal memproses permintaan pembayaran ke gateway.`;
      throw new Error(msg);
    }
    
    const data = await response.json();
    
    // Validate response structure
    if (!data.orderId || !data.qrCodeUrl) {
      throw new Error('API Gateway mengembalikan format data yang tidak valid.');
    }

    return {
      orderId: data.orderId,
      qrCodeUrl: data.qrCodeUrl,
      amountToPay: data.amountToPay || amount,
      status: 'pending'
    };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Gateway Timeout: Koneksi ke penyedia QRIS memakan waktu terlalu lama. Silakan coba lagi.');
    }
    // Propagate original error for OrderForm to display
    throw error;
  }
};

export const checkStatus = async (orderId: string): Promise<string> => {
  try {
    const response = await fetch(`${PAYMENT_PROXY_BASE}/status/${orderId}?apikey=${PAYMENT_API_KEY}`);
    if (!response.ok) return 'pending';
    const data = await response.json();
    return data.status || 'pending'; 
  } catch (e) {
    return 'pending';
  }
};
