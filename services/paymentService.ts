import { PAYMENT_API_KEY } from '../constants';
import { PaymentData } from '../types';

const PAYMENT_PROXY_BASE = '/payment-api';

export const createDeposit = async (amount: number): Promise<PaymentData> => {
  try {
    const url = `${PAYMENT_PROXY_BASE}/deposit?apikey=${PAYMENT_API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ amount })
    });

    const data = await response.json();

    const result = data.data || data;
    
    // Identifikas String data
    const orderId = result.order_id || result.id || result.ref_id;
    const qrRaw = result.qr_string || result.qr_code || result.qr || result.qris;
    const finalAmount = result.amount || result.amount_to_pay || amount;

    if (!orderId || !qrRaw) {
      throw new Error(data.message || 'Gagal mendapatkan QRIS. Silahkan melakukan pembelian manual.');
    }

    const qrCodeUrl = String(qrRaw).startsWith('http') 
      ? qrRaw 
      : `https://api.qrserver.com/v1/create-qr-code/?size=1024x1024&data=${encodeURIComponent(qrRaw)}`;

    return {
      orderId: String(orderId),
      qrCodeUrl: qrCodeUrl,
      amountToPay: Number(finalAmount),
      status: 'pending'
    };
  } catch (error: any) {
    console.error('Payment Service Error:', error);
    throw new Error(error.message || 'Koneksi ke Gateway gagal.');
  }
};

/**
    cek status pembayaran 
 */
export const checkStatus = async (orderId: string): Promise<string> => {
  try {
    const url = `${PAYMENT_PROXY_BASE}/status/${orderId}?apikey=${PAYMENT_API_KEY}`;
    const response = await fetch(url);
    if (!response.ok) return 'pending';
    
    const data = await response.json();
    const result = data.data || data;
    
    return String(result.status || result.payment_status || 'pending').toLowerCase();
  } catch (e) {
    return 'pending';
  }
};
