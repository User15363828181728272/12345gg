
import { PAYMENT_API_KEY } from '../constants';
import { PaymentData } from '../types';

// Path relatif untuk rewrite proxy Vercel (mencegah CORS)
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
      // Ambil pesan error asli dari Gateway (misal: "Min deposit 1000")
      const errorMsg = data?.message || data?.msg || data?.error || `Gateway Error ${response.status}`;
      throw new Error(errorMsg);
    }
    
    if (!data) throw new Error('API Gateway tidak memberikan respon data.');

    // Mendukung data root langsung atau di dalam objek 'data'
    const source = data.data || data;
    
    // Pencarian kunci ID Order yang agresif
    const orderId = source.order_id || source.orderId || source.id || source.external_id || source.ref_id;
    
    // Pencarian data QRIS (bisa berupa link gambar atau teks mentah 000201...)
    const qrRaw = source.qr_string || source.qr_code || source.qr_link || source.qrCodeUrl || source.qr_url || source.qris_data || source.qris;
    
    const amountToPay = source.amount || source.amount_to_pay || source.amountToPay || amount;

    if (!orderId || !qrRaw) {
      console.error("DEBUG API Response:", data);
      throw new Error('Gateway tidak mengirim data QRIS/ID. Periksa saldo atau limit API.');
    }

    // Jika qrRaw adalah teks mentah QRIS (bukan URL), ubah jadi URL gambar menggunakan API generator
    const qrCodeUrl = (typeof qrRaw === 'string' && qrRaw.startsWith('http')) 
      ? qrRaw 
      : `https://api.qrserver.com/v1/create-qr-code/?size=512x512&data=${encodeURIComponent(qrRaw)}`;

    return {
      orderId: String(orderId),
      qrCodeUrl: qrCodeUrl,
      amountToPay: Number(amountToPay),
      status: 'pending'
    };
  } catch (error: any) {
    if (error.name === 'AbortError') throw new Error('Gateway Timeout (Koneksi lambat)');
    throw error;
  }
};

export const checkStatus = async (orderId: string): Promise<string> => {
  try {
    const response = await fetch(`${PAYMENT_PROXY_BASE}/status/${orderId}?apikey=${PAYMENT_API_KEY}`);
    if (!response.ok) return 'pending';
    const data = await response.json();
    const source = data.data || data;
    // Status umum: settlement, paid, success, Selesai
    return source.status || source.payment_status || 'pending'; 
  } catch (e) {
    return 'pending';
  }
};
