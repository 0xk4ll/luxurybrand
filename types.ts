
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  longDescription?: string;
  ingredients?: string;
  usage?: string;
  weight?: string;
  imageUrl: string;
  categoryId: string;
  isActive: boolean;
  createdAt: string;
  badge?: 'Best Seller' | 'New' | 'Limited';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
}

export interface SiteContent {
  heroTitle: string;
  heroSubtitle: string;
  ctaText: string;
  whatsappNumber: string;
  aboutText: string;
  brandName: string;
}

export interface FooterContent {
  text: string;
  socialLinks: {
    instagram: string;
    facebook: string;
    tiktok: string;
  };
}

export enum AuthStatus {
  AUTHENTICATED = 'AUTHENTICATED',
  UNAUTHENTICATED = 'UNAUTHENTICATED'
}
