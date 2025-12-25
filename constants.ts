
import { Category, Product, SiteContent, FooterContent } from './types';

export const COLORS = {
  primary: '#111827',
  secondary: '#16A34A',
  bgMain: '#FFFFFF',
  bgSecondary: '#F9FAFB',
  textMain: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
};

export const DEFAULT_SITE_CONTENT: SiteContent = {
  heroTitle: "Elegansi Abadi untuk Penampilan Anda",
  heroSubtitle: "Temukan koleksi parfum premium dan skincare organik terbaik yang dirancang khusus untuk kulit tropis.",
  ctaText: "Hubungi Kami",
  whatsappNumber: "6281234567890",
  aboutText: "Berdiri sejak 2020, kami berkomitmen menghadirkan produk kecantikan berkualitas tinggi dengan bahan alami terbaik. Setiap produk kami melewati kontrol kualitas ketat untuk memastikan kepuasan Anda.",
  brandName: "LUXE & BEAUTY"
};

export const DEFAULT_FOOTER: FooterContent = {
  text: "Kualitas Premium, Keanggunan yang Terjangkau.",
  socialLinks: {
    instagram: "https://instagram.com/brand",
    facebook: "https://facebook.com/brand",
    tiktok: "https://tiktok.com/@brand"
  }
};

export const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Perfume', slug: 'perfume', isActive: true },
  { id: '2', name: 'Skincare', slug: 'skincare', isActive: true },
  { id: '3', name: 'Cosmetic', slug: 'cosmetic', isActive: true },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Midnight Rose Eau de Parfum',
    price: 450000,
    description: 'Wangi floral yang dalam dengan sentuhan vanilla dan musk.',
    longDescription: 'Midnight Rose adalah mahakarya wewangian yang menggabungkan kesegaran mawar Bulgaria dengan kehangatan kayu cendana. Cocok untuk penggunaan malam hari dan acara formal.',
    ingredients: 'Alcohol Denat, Aqua, Fragrance, Bulgarian Rose Oil, Sandalwood Extract, Musk.',
    usage: 'Semprotkan pada titik nadi seperti pergelangan tangan dan leher dari jarak 15cm.',
    weight: '50ml',
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&q=80&w=800',
    categoryId: '1',
    isActive: true,
    badge: 'Best Seller',
    createdAt: new Date().toISOString()
  },
  {
    id: 'p2',
    name: 'Glowing Serum Vitamin C',
    price: 185000,
    description: 'Serum mencerahkan kulit dan melindungi dari radikal bebas.',
    longDescription: 'Diformulasikan dengan 10% L-Ascorbic Acid murni untuk mencerahkan noda hitam dan meratakan warna kulit. Mengandung antioksidan tinggi.',
    ingredients: 'Aqua, Glycerin, 10% Vitamin C, Ferulic Acid, Hyaluronic Acid, Aloe Vera.',
    usage: 'Gunakan 2-3 tetes pada wajah yang bersih di pagi dan malam hari sebelum pelembab.',
    weight: '30ml',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80&w=800',
    categoryId: '2',
    isActive: true,
    badge: 'New',
    createdAt: new Date().toISOString()
  },
  {
    id: 'p3',
    name: 'Matte Liquid Lipstick - Rouge',
    price: 95000,
    description: 'Lipstick tahan lama dengan hasil akhir matte sempurna.',
    longDescription: 'Lipstick cair dengan pigmentasi tinggi yang tidak membuat bibir kering. Tahan hingga 12 jam tanpa transfer.',
    ingredients: 'Isododecane, Trimethylsiloxysilicate, Vitamin E, Jojoba Oil, Pigments.',
    usage: 'Aplikasikan merata pada bibir. Biarkan mengering selama 30 detik untuk hasil matte maksimal.',
    weight: '5g',
    imageUrl: 'https://images.unsplash.com/photo-1586776977607-310e9c725c37?auto=format&fit=crop&q=80&w=800',
    categoryId: '3',
    isActive: true,
    createdAt: new Date().toISOString()
  }
];
