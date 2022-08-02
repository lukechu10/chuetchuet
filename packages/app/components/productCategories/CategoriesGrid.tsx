import React from 'react';
import styled from 'styled-components/native';

import { PRODUCT_CATEGORIES_TO_NAME } from '../../util/constants';
import { ProductCategory } from '../../util/types';
import { CategoryItem } from './CategoryItem';

const Grid = styled.View`
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

const Row = styled.View`
  display: flex;
  flex-direction: row;
`;

const VerticalSpacer = styled.View`
  height: 20px;
`;

const HorizontalSpacer = styled.View`
  width: 20px;
`;

interface CategoriesGridProps {
  showProductList: (productCategory: ProductCategory) => void;
}

export function CategoriesGrid({ showProductList }: CategoriesGridProps) {
  return (
    <Grid>
      <Row>
        <CategoryItem
          onPress={() => showProductList(ProductCategory.Fruits)}
          name={PRODUCT_CATEGORIES_TO_NAME.fruits}
          image={require('../../assets/images/fruits.png')}
        />
        <HorizontalSpacer />
        <CategoryItem
          onPress={() => showProductList(ProductCategory.Vegetables)}
          name={PRODUCT_CATEGORIES_TO_NAME.vegetables}
          image={require('../../assets/images/vegetables.png')}
        />
      </Row>
      <VerticalSpacer />
      <Row>
        <CategoryItem
          onPress={() => showProductList(ProductCategory.Fresh)}
          name={PRODUCT_CATEGORIES_TO_NAME.fresh}
          image={require('../../assets/images/fresh.png')}
        />
        <HorizontalSpacer />
        <CategoryItem
          onPress={() => showProductList(ProductCategory.Dry)}
          name={PRODUCT_CATEGORIES_TO_NAME.dry}
          image={require('../../assets/images/dry.png')}
        />
      </Row>
    </Grid>
  );
}
