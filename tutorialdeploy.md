# Panduan Deploy ke Vercel

Agar fitur pembayaran (QRIS) dan integrasi API Pterodactyl berfungsi, aplikasi ini **WAJIB** di-deploy ke Vercel karena menggunakan fitur `rewrites` di `vercel.json`.

## Langkah-langkah Deployment:

1. **Siapkan Repository**:
   - Upload semua file ini ke repository GitHub (Private atau Public).

2. **Masuk ke Vercel**:
   - Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub Anda.
   - Klik **"Add New"** -> **"Project"**.

3. **Impor Project**:
   - Pilih repository yang baru saja Anda buat.

4. **Konfigurasi Environment Variables**:
   - Di bagian **"Environment Variables"**, tambahkan key berikut:
     - `API_KEY`: (Isi dengan Google Gemini API Key Anda untuk fitur Chat AI).
   - *Catatan: API Key Pterodactyl dan Gateway sudah ada di `constants.ts`, namun untuk keamanan produksi, disarankan memindahkannya ke Environment Variables nanti.*

5. **Deploy**:
   - Klik tombol **"Deploy"**.
   - Tunggu hingga proses selesai.

6. **Tes Pembayaran**:
   - Buka URL yang diberikan Vercel (misal: `depstore-cloud.vercel.app`).
   - Coba lakukan pemesanan. Sekarang QRIS akan muncul karena proxy `/payment-api` sudah aktif di server Vercel.

## Kenapa QRIS tidak muncul di Localhost?
Karena di localhost, browser Anda tidak mengerti instruksi `/payment-api`. Vercel bertindak sebagai perantara yang meneruskan permintaan tersebut ke server gateway yang asli agar tidak terjadi error CORS.
