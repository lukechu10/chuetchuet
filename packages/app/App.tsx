import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, Text, View } from 'react-native';

const App = () => {
  return (
    <SafeAreaView>
      <StatusBar />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View>
          <Text>Chuetchuet</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
