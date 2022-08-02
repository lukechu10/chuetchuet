import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { StatusBar } from 'react-native';

import {
  DeliveryBanner,
  SafeAreaView
} from '../../components/productList/DeliveryBanner';
import { ProductList } from '../../components/productList/ProductList';
import { SafeAreaContainer } from '../../components/SafeAreaContainer';
import { ScrollView } from '../../components/ScrollView';
import { MainStackParamList, Screens } from '../screens';

type ProductListScreenProps = NativeStackScreenProps<
  MainStackParamList,
  Screens.BuyerProductList
>;

export default function ProductListScreen({
  navigation
}: ProductListScreenProps) {
  return (
    <SafeAreaView>
      <SafeAreaContainer>
        <StatusBar />
        <ScrollView>
          <ProductList />
        </ScrollView>
        <DeliveryBanner text="Date livraison: samedi 25 juin" />
      </SafeAreaContainer>
    </SafeAreaView>
  );
}
