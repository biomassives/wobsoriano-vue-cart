import { defineStore } from 'pinia'
import { useProductStore } from './products'
import { CART_STORAGE } from '@/composables/usePersistCart'

export interface Purchase {
  productId: number
  quantity: number
}

// Assuming CartItem has the same structure as Purchase for now
// Adjust this interface to match your actual CartItem structure
export interface CartItem {
  productId: number
  quantity: number
}

interface CartState {
  // Make sure to use the correct type for contents
  // Use number as key if you're indexing by the productId which is a number
  contents: Record<number, Purchase>
}

export interface CartPreview {
  id: number
  image: string
  title: string
  prodopt1: string
  prodopt2: string
  prodopt3: string
  quantity: number
  cost: number
}

export const useCartStore = defineStore({
  id: 'cart',

  state: (): CartState => ({
    // Parse the localStorage value safely by ensuring the parsed result is of the correct type
    contents: JSON.parse(localStorage.getItem(CART_STORAGE) || '{}') as Record<number, Purchase>,
  }),

  getters: {
    count(state): number {
      return Object.values(state.contents).reduce((acc, purchase) => {
        return acc + purchase.quantity;
      }, 0);
    },

    total(state): number {
      const products = useProductStore();
      return Object.values(state.contents).reduce((acc, purchase) => {
        const product = products.items[purchase.productId];
        return acc + (product?.price || 0) * purchase.quantity;
      }, 0);
    },

    formattedCart(state): CartPreview[] {
      const products = useProductStore();

      if (!products.loaded)
        return [];

      return Object.values(state.contents).map((purchase) => {
        const product = products.items[purchase.productId];
        return {
          id: purchase.productId,
          image: product?.image || '',
          title: product?.title || '',
          prodopt1: product?.prodopt1 || '',
          prodopt2: product?.prodopt2 || '',
          prodopt3: product?.prodopt3 || '',
          quantity: purchase.quantity,
          cost: purchase.quantity * (product?.price || 0),
        };
      });
    },
  },

  actions: {
    add(productId: number) {
      if (this.contents[productId]) {
        this.contents[productId].quantity += 1;
      } else {
        this.contents[productId] = {
          productId,
          quantity: 1,
        };
      }
      
      // Persist the updated contents to localStorage
      this.persistCart();
    },
    
    remove(productId: number) {
      if (!this.contents[productId])
        return;

      this.contents[productId].quantity -= 1;

      if (this.contents[productId].quantity <= 0) {
        delete this.contents[productId];
      }
      // Persist the updated contents to localStorage
      this.persistCart();
    },
    
    // Save the current state of the cart to localStorage
    persistCart() {
      localStorage.setItem(CART_STORAGE, JSON.stringify(this.contents));
    },
    
  },
});
