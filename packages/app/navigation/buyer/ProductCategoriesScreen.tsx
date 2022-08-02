import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import styled from 'styled-components/native';

import { CategoriesGrid } from '../../components/productCategories/CategoriesGrid';
import { InfoCarousel } from '../../components/productCategories/InfoCarousel';
import { ProductCategory } from '../../util/types';
import { MainStackParamList, Screens } from '../screens';

const ScrollView = styled.ScrollView.attrs({
  contentContainerStyle: { flexGrow: 1 }
})`
  height: 100%;
`;

type ProductCategoriesScreenProps = NativeStackScreenProps<
  MainStackParamList,
  Screens.BuyerProductCategories
>;

export default function ProductCategoriesScreen({
  navigation
}: ProductCategoriesScreenProps) {
  const showProductList = useCallback(
    (productCategory: ProductCategory) => {
      navigation.navigate(Screens.BuyerProductList, { productCategory });
    },
    [navigation]
  );

  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <InfoCarousel />
        <CategoriesGrid showProductList={showProductList} />
      </ScrollView>
    </SafeAreaView>
  );
}
