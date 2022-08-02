import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native';

import { ProductItem } from './components/productList/ProductItem';

const App = () => {
  return (
    <NavigationContainer>
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
    </NavigationContainer>
  );
};

export default App;
