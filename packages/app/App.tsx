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
          <ProductItem />
        </ScrollView>
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;
