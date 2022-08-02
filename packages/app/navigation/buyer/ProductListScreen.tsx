import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import styled from 'styled-components/native';

import { ProductItem } from '../../components/productList/ProductItem';
import { MainStackParamList, Screens } from '../screens';

const ScrollView = styled.ScrollView.attrs({
  contentContainerStyle: { flexGrow: 1 }
})`
  height: 100%;
`;

type ProductListScreenProps = NativeStackScreenProps<
  MainStackParamList,
  Screens.BuyerProductList
>;

export default function ProductListScreen({
  navigation
}: ProductListScreenProps) {
  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
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
      </ScrollView>
    </SafeAreaView>
  );
}
