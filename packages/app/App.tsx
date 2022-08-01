import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native';

import { Title, Wrapper } from './components/productList/ProductItem';

const App = () => {
  return (
    <NavigationContainer>
      <SafeAreaView>
        <StatusBar />
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <View>
            <Text>Chuetchuet</Text>
          </View>
          <Wrapper>
            <Title>Hello World</Title>
          </Wrapper>
        </ScrollView>
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;
