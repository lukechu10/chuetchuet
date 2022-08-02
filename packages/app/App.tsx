import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import BuyerProductListScreen from './navigation/buyer/ProductListScreen';
import HomeScreen from './navigation/HomeScreen';
import { MainStackParamList } from './navigation/screens';

const Stack = createNativeStackNavigator<MainStackParamList>();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="BuyerProductList"
          component={BuyerProductListScreen}
          options={{ title: 'Product List' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
