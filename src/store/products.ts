import { defineStore } from 'pinia';
import axios from 'axios'; // You'll need Axios for fetching

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

interface ProductState {
  items: Record<string, Product>;
  ids: number[];
}

export const useProductStore = defineStore({
  id: 'products',

  state: (): ProductState => ({
    items: {},
    ids: [],
  }),

  getters: {
    list(): Product[] {
      return this.ids.map((i) => this.items[i]);
    },

    loaded(): boolean {
      return this.ids.length > 0;
    },
  },

  actions: {


async fetchAll() {
  if (this.loaded) return;

  try {
    const res = await axios.get('products.json'); 
    const data: Product[] = res.data; // Access the JSON within the 'data' property
    this.ids = data.map((product) => {
      this.items[product.id] = product;
      return product.id;
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    // Optionally, set an error state in your store
  }
});
