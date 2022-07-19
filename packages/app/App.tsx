import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native';

const App = () => {
  return (
    <NavigationContainer>
      <SafeAreaView>
        <StatusBar />
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          <View>
            <Text>Chuetchuet</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </NavigationContainer>
  );
};

export default App;
