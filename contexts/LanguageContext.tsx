
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  id: {
    welcome: "Selamat Datang di Depstore Cloud",
    deploy: "Build Server Private",
    dashboard: "Dashboard Server",
    login: "Masuk",
    register: "Daftar",
    howToOrder: "Cara Order",
    promo: "Promo",
    faq: "Tanya Jawab",
    extend: "Perpanjang",
    ramIndo: "Private Server RAM Indonesia",
    uptime: "Aktif 99.9%",
    lowLatency: "Latensi Rendah",
    support: "Bantuan",
    serverName: "Nama Server",
    waNumber: "Nomor WhatsApp",
    payNow: "Bayar Sekarang",
    successMsg: "Server Private berhasil dibuat! Detail dikirim ke WA.",
    max30Days: "Maksimal masa aktif 30 hari",
    min5Days: "Minimal perpanjang 5 hari",
    pricePer5Days: "Rp 2.000 / 5 hari",
    noControl: "Server 100% Private & Terisolasi.",
    botOnly: "Hanya untuk Bot WhatsApp, Telegram, & Discord",
    period30: "Masa Aktif 30 Hari",
    activePeriod: "Masa Aktif",
    notifications: "Notifikasi Browser",
    enableNotif: "Nyalakan Notifikasi",
    disableNotif: "Matikan Notifikasi"
  },
  en: {
    welcome: "Welcome to Depstore Cloud",
    deploy: "Build Private Server",
    dashboard: "Private Dashboard",
    login: "Login",
    register: "Register",
    howToOrder: "Order Guide",
    promo: "Promo",
    faq: "FAQ",
    extend: "Extend",
    ramIndo: "Indonesian Private Server RAM",
    uptime: "99.9% Uptime",
    lowLatency: "Low Latency",
    support: "Support",
    serverName: "Server Name",
    waNumber: "WhatsApp Number",
    payNow: "Pay Now",
    successMsg: "Private Server created! Credentials sent to WhatsApp.",
    max30Days: "Max active period 30 days",
    min5Days: "Minimum extend 5 days",
    pricePer5Days: "Rp 2,000 / 5 days",
    noControl: "100% Private & Isolated Server.",
    botOnly: "WhatsApp, Telegram, & Discord Bots Only",
    period30: "30 Days Active Period",
    activePeriod: "Active Period",
    notifications: "Browser Notifications",
    enableNotif: "Enable Notifications",
    disableNotif: "Disable Notifications"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('id');

  const t = (key: string) => {
    return (translations[lang] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
};
