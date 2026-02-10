
import { PAYMENT_API_KEY } from '../constants';
import { PaymentData } from '../types';

// Relative path for Vercel proxy rewrite defined in vercel.json
const PAYMENT_PROXY_BASE = '/payment-api';

export const createDeposit = async (amount: number): Promise<PaymentData> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000); 

  try {
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

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      // Try to extract the specific error message from the API (e.g. "Minimum deposit 1000")
      const errorMsg = data?.message || data?.msg || data?.error || `Error ${response.status}: Gagal menghubungi Gateway.`;
      throw new Error(errorMsg);
    }
    
    if (!data) {
      throw new Error('API Gateway tidak memberikan respon data.');
    }

    // Support both direct root keys and nested data object (common in many gateways)
    const source = data.data || data;
    
    // Support various naming conventions (camelCase or snake_case)
    const orderId = source.orderId || source.order_id || source.id || source.external_id;
    const qrCodeUrl = source.qrCodeUrl || source.qr_link || source.qr_code || source.qr_url || source.qr_string;
    const amountToPay = source.amountToPay || source.amount_to_pay || source.amount || amount;

    if (!orderId || !qrCodeUrl) {
      console.error("Invalid API Response Structure:", data);
      throw new Error('Format data Gateway tidak sesuai (Missing ID/QR). Cek logs.');
    }

    return {
      orderId: String(orderId),
      qrCodeUrl: qrCodeUrl,
      amountToPay: Number(amountToPay),
      status: 'pending'
    };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error('Gateway Timeout: Koneksi ke penyedia QRIS terlalu lambat.');
    }
    throw error;
  }
};

export const checkStatus = async (orderId: string): Promise<string> => {
  try {
    const response = await fetch(`${PAYMENT_PROXY_BASE}/status/${orderId}?apikey=${PAYMENT_API_KEY}`);
    if (!response.ok) return 'pending';
    const data = await response.json();
    const source = data.data || data;
    return source.status || 'pending'; 
  } catch (e) {
    return 'pending';
  }
};
