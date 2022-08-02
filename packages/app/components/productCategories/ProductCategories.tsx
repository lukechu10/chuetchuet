import React from 'react';

import { ProductCategory } from '../../util/types';
import { CategoriesGrid } from './CategoriesGrid';
import { InfoCarousel } from './InfoCarousel';

export interface ProductCategoriesProps {
  showProductList: (productCategory: ProductCategory) => void;
}

export function ProductCategories({ showProductList }: ProductCategoriesProps) {
  return (
    <>
      <InfoCarousel />
      <CategoriesGrid showProductList={showProductList} />
    </>
  );
}
