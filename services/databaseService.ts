
import { SUPABASE_URL, SUPABASE_ANON_KEY, INITIAL_PACKAGES } from '../constants';
import { Package, Promo } from '../types';

const HEADERS = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
  'Prefer': 'return=representation'
};

export const dbService = {
  // --- PACKAGES ---
  async getPackages(): Promise<Package[]> {
    try {
      if (SUPABASE_URL.includes("your-project-url")) {
        return INITIAL_PACKAGES;
      }
      
      const res = await fetch(`${SUPABASE_URL}/rest/v1/packages?select=*&order=ram.asc`, { 
        headers: HEADERS,
        signal: AbortSignal.timeout(5000) 
      });
      
      if (!res.ok) throw new Error("DB Connection Error");
      const data = await res.json();
      return data.length > 0 ? data : INITIAL_PACKAGES;
    } catch (e) {
      console.warn("Database unavailable. Using local fallback packages.");
      return INITIAL_PACKAGES;
    }
  },

  async updatePackage(pkgId: string, updates: Partial<Package>) {
    return fetch(`${SUPABASE_URL}/rest/v1/packages?id=eq.${pkgId}`, {
      method: 'PATCH',
      headers: HEADERS,
      body: JSON.stringify(updates)
    });
  },

  // --- PROMOS ---
  async getPromos(): Promise<Promo[]> {
    try {
      if (SUPABASE_URL.includes("your-project-url")) return [];
      
      const res = await fetch(`${SUPABASE_URL}/rest/v1/promos?select=*&order=id.desc`, { 
        headers: HEADERS,
        signal: AbortSignal.timeout(5000)
      });
      
      if (!res.ok) throw new Error("DB Error");
      return await res.json();
    } catch (e) {
      return [];
    }
  },

  // Fix: Added missing addPromo method to allow adding new promotions to the database
  async addPromo(promo: Omit<Promo, 'id'>) {
    return fetch(`${SUPABASE_URL}/rest/v1/promos`, {
      method: 'POST',
      headers: HEADERS,
      body: JSON.stringify(promo)
    });
  },

  // Fix: Added missing deletePromo method to allow removing promotions from the database
  async deletePromo(promoId: string) {
    return fetch(`${SUPABASE_URL}/rest/v1/promos?id=eq.${promoId}`, {
      method: 'DELETE',
      headers: HEADERS
    });
  }
};
