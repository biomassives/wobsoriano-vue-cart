<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

import { useCartStore } from '@/store/cart';
import { useProductStore } from '@/store/products';
import type { Product } from '@/store/products';
import { toCurrency } from '@/shared/utils';

import CartCardSkeleton from '@/components/CartCardSkeleton.vue';

const cartStore = useCartStore();
const productStore = useProductStore();
const route = useRoute();

// Convert the route parameter 'productId' to a number
const productId = Number(route.params.productId);
const product = computed<Product | undefined>(() => productStore.items[productId]);


</script>

<template>
  <div class="p-4 max-w-4xl mx-auto">
    <div v-if="!productStore.loaded">
      <CartCardSkeleton />
    </div>
    <div v-else-if="product" class="card lg:card-side bordered">
      <figure class="px-10 pt-10">
        <img
          :src="product.image"
          alt="Card Image"
          class="object-contain w-full h-64"
        >
      </figure>
      <div class="card-body">
        <h2 class="card-title" v-text="product.title" />

        <div v-if="!productStore.loaded" class="loading">
          Loading product details...
        </div>
        <div v-else class="text-error">
          No product found with the provided ID. <a href="/products">Return to products list.</a>
        </div>

        
        <p v-text="product.description" />
        <p class="mt-4 text-lg">
          {{ toCurrency(product.price) }}
        </p>
        
        <p class="mt-4 text-lg"> Product options placeholder
        </p>
        
        <div class="card-actions">
          <button class="btn btn-primary" @click="cartStore.add(product.id)">
            Add to Cart
          </button>
        </div>
        <div v-if="productStore.error" class="text-error">
          Error loading products: {{ productStore.error }}
        </div>
        
        
        
      </div>
    </div>
    <div v-else>
      <h1 class="text-xl text-error">
        No product found with id {{ route.params.productId }}
      </h1>
    </div>
  </div>
</template>
