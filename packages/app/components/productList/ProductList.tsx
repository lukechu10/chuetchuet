import React from 'react';

import { ProductItem } from './ProductItem';

export function ProductList() {
  return (
    <>
      <ProductItem
        name="Banane"
        availableQuantity={5}
        price={4000}
        coverImage="https://images.immediate.co.uk/production/volatile/sites/30/2017/01/Bananas-218094b-scaled.jpg"
      />
      <ProductItem
        name="Avocat"
        availableQuantity={5}
        price={4000}
        coverImage="https://youmatter.world/app/uploads/sites/2/2018/12/avocado-benefits-production-environmental-impact.jpg"
      />
    </>
  );
}
