import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import BuyerProductCategoriesScreen from './navigation/buyer/ProductCategoriesScreen';
import BuyerProductListScreen from './navigation/buyer/ProductListScreen';
import HomeScreen from './navigation/HomeScreen';
import { MainStackParamList, Screens } from './navigation/screens';
import { PRODUCT_CATEGORIES_TO_NAME } from './util/constants';
import { ProductCategory } from './util/types';

const Stack = createNativeStackNavigator<MainStackParamList>();

const App = () => {
  return (
    <NavigationContainer
      theme={{
        ...DefaultTheme,
        colors: { ...DefaultTheme.colors, background: '#ffffff' }
      }}
    >
      <Stack.Navigator>
        <Stack.Screen name={Screens.Home} component={HomeScreen} />
        <Stack.Screen
          name={Screens.BuyerProductCategories}
          component={BuyerProductCategoriesScreen}
          options={{ title: 'Product Categories' }}
        />
        <Stack.Screen
          name={Screens.BuyerProductList}
          component={BuyerProductListScreen}
          options={({ route }) => ({
            title: PRODUCT_CATEGORIES_TO_NAME[route.params.productCategory]
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
