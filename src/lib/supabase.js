import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// In-memory cache for fast snappy browsing
let cachedProducts = null;
let productsPromise = null;
let cachedCollections = null;
let collectionsPromise = null;
let cachedCollectionMap = null;
let cachedNavigation = null;
let cachedPages = null;
let cachedPolicies = null;

export const dataService = {
  async getProducts() {
    if (cachedProducts) return cachedProducts;
    if (productsPromise) return productsPromise;

    productsPromise = (async () => {
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase.from('products').select('*');
          if (!error && data && data.length > 0) {
            cachedProducts = data;
            return data;
          }
        } catch (err) {
          console.warn('Supabase fetch failed, falling back to local dataset', err);
        }
      }

      // Offline / pre-crawled fallback
      try {
        const res = await fetch('/data/products.json');
        const data = await res.json();
        cachedProducts = data;
        return data;
      } catch (err) {
        console.error('Failed to load products.json', err);
        return [];
      }
    })();

    return productsPromise;
  },

  async getProductByHandle(handle) {
    const products = await this.getProducts();
    return products.find(p => p.handle === handle) || null;
  },

  async getCollections() {
    if (cachedCollections) return cachedCollections;
    if (collectionsPromise) return collectionsPromise;

    collectionsPromise = (async () => {
      if (isSupabaseConfigured) {
        try {
          const { data, error } = await supabase.from('collections').select('*');
          if (!error && data && data.length > 0) {
            cachedCollections = data;
            return data;
          }
        } catch (err) {
          console.warn('Supabase fetch failed, falling back to local dataset', err);
        }
      }

      try {
        const res = await fetch('/data/collections.json');
        const data = await res.json();
        cachedCollections = data;
        return data;
      } catch (err) {
        console.error('Failed to load collections.json', err);
        return [];
      }
    })();

    return collectionsPromise;
  },

  async getCollectionByHandle(handle) {
    const collections = await this.getCollections();
    return collections.find(c => c.handle === handle) || null;
  },

  async getCollectionProductsMap() {
    if (cachedCollectionMap) return cachedCollectionMap;
    try {
      const res = await fetch('/data/collection_products.json');
      cachedCollectionMap = await res.json();
      return cachedCollectionMap;
    } catch {
      return {};
    }
  },

  async getNavigation() {
    if (cachedNavigation) return cachedNavigation;
    try {
      const res = await fetch('/data/navigation.json');
      cachedNavigation = await res.json();
      return cachedNavigation;
    } catch {
      return { main_menu: [] };
    }
  },

  async getPages() {
    if (cachedPages) return cachedPages;
    try {
      const res = await fetch('/data/pages.json');
      cachedPages = await res.json();
      return cachedPages;
    } catch {
      return [];
    }
  },

  async getPageBySlug(slug) {
    const pages = await this.getPages();
    return pages.find(p => p.slug === slug) || null;
  },

  async getPolicies() {
    if (cachedPolicies) return cachedPolicies;
    try {
      const res = await fetch('/data/policies.json');
      cachedPolicies = await res.json();
      return cachedPolicies;
    } catch {
      return [];
    }
  },

  async getPolicyBySlug(slug) {
    const policies = await this.getPolicies();
    return policies.find(p => p.slug === slug) || null;
  }
};
