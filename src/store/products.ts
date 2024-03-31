import { defineStore } from 'pinia';
import axios from 'axios';

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string; 
  rating: {
    rate: number;
    count: number;
  };
  sizes?: string[];
  colors?: string[];
}

interface ProductState {
  items: Record<number, Product>;
  ids: number[];
  loaded: boolean;
  error: string | null; // Include an error state
}

export const useProductStore = defineStore('products', {
  state: (): ProductState => ({
    items: {},
    ids: [],
    loaded: false,
    error: null, // Initialize the error state
  }),

  getters: {
    list(state): Product[] {
      // Efficiently maps over ids to retrieve product objects
      return state.ids.map(id => state.items[id]);
    },
    isLoaded(state): boolean {
      return state.loaded;
    },
  },

  actions: {
    async fetchAll() {
      // Early return if products are already loaded
      if (this.loaded) return;

      try {
        const response = await axios.get('/path/to/your/products.json');
        const products: Product[] = response.data;
        
        // Populate the store
        this.ids = products.map(product => product.id);
        this.items = products.reduce((acc, product) => {
          acc[product.id] = product;
          return acc;
        }, {});

        // Mark as loaded
        this.loaded = true;
      } catch (error) {
        console.error('Error fetching products:', error);
        this.error = 'Failed to fetch products.'; // Update error state
      }
    }
  }
});
