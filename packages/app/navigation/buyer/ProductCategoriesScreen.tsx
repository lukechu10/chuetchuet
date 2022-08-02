import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';

import { ProductCategories } from '../../components/productCategories/ProductCategories';
import { ScrollView } from '../../components/ScrollView';
import { ProductCategory } from '../../util/types';
import { MainStackParamList, Screens } from '../screens';

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
      <ScrollView>
        <ProductCategories showProductList={showProductList} />
      </ScrollView>
    </SafeAreaView>
  );
}
