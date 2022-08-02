import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import BuyerProductCategoriesScreen from './navigation/buyer/ProductCategoriesScreen';
import BuyerProductListScreen from './navigation/buyer/ProductListScreen';
import HomeScreen from './navigation/HomeScreen';
import { MainStackParamList, Screens } from './navigation/screens';
import SellerProductCategoriesScreen from './navigation/seller/ProductCategoriesScreen';
import SellerProductListScreen from './navigation/seller/ProductListScreen';
import { PRODUCT_CATEGORIES_TO_NAME } from './util/constants';

const Stack = createNativeStackNavigator<MainStackParamList>();

const App = () => {
  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: { ...DefaultTheme.colors, background: '#ffffff' }
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerBackTitleVisible: false
        }}
      >
        <Stack.Screen name={Screens.Home} component={HomeScreen} />
        <Stack.Screen
          name={Screens.BuyerProductCategories}
          component={BuyerProductCategoriesScreen}
          options={{ title: 'Catégories Acheteur' }}
        />
        <Stack.Screen
          name={Screens.BuyerProductList}
          component={BuyerProductListScreen}
          options={({ route }) => ({
            title: PRODUCT_CATEGORIES_TO_NAME[route.params.productCategory]
          })}
        />
        <Stack.Screen
          name={Screens.SellerProductCategories}
          component={SellerProductCategoriesScreen}
          options={{ title: 'Catégories Vendeur' }}
        />
        <Stack.Screen
          name={Screens.SellerProductList}
          component={SellerProductListScreen}
          options={({ route }) => ({
            title: PRODUCT_CATEGORIES_TO_NAME[route.params.productCategory]
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
