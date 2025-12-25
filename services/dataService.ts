
import { Product, Category, SiteContent, FooterContent } from '../types';
import { INITIAL_CATEGORIES as CATS, INITIAL_PRODUCTS as PRODS, DEFAULT_SITE_CONTENT as SITE, DEFAULT_FOOTER as FOOT } from '../constants';

const KEYS = {
  PRODUCTS: 'luxe_products',
  CATEGORIES: 'luxe_categories',
  SITE: 'luxe_site',
  FOOTER: 'luxe_footer',
  AUTH: 'luxe_auth_token'
};

export const dataService = {
  getProducts: (): Product[] => {
    const data = localStorage.getItem(KEYS.PRODUCTS);
    return data ? JSON.parse(data) : PRODS;
  },
  saveProducts: (products: Product[]) => {
    localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
  },
  
  getCategories: (): Category[] => {
    const data = localStorage.getItem(KEYS.CATEGORIES);
    return data ? JSON.parse(data) : CATS;
  },
  saveCategories: (categories: Category[]) => {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
  },

  getSiteContent: (): SiteContent => {
    const data = localStorage.getItem(KEYS.SITE);
    return data ? JSON.parse(data) : SITE;
  },
  saveSiteContent: (content: SiteContent) => {
    localStorage.setItem(KEYS.SITE, JSON.stringify(content));
  },

  getFooter: (): FooterContent => {
    const data = localStorage.getItem(KEYS.FOOTER);
    return data ? JSON.parse(data) : FOOT;
  },
  saveFooter: (footer: FooterContent) => {
    localStorage.setItem(KEYS.FOOTER, JSON.stringify(footer));
  },

  setAuth: (token: string | null) => {
    if (token) localStorage.setItem(KEYS.AUTH, token);
    else localStorage.removeItem(KEYS.AUTH);
  },
  getAuth: () => localStorage.getItem(KEYS.AUTH)
};
