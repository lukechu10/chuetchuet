import React from 'react';
import { Button, Text, View } from 'react-native';
import { NativeStackScreenProps } from 'react-native-screens/native-stack';

import { MainStackParamList } from './screens';

type HomeScreenProps = NativeStackScreenProps<MainStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Chuetchuet</Text>
      <Button
        onPress={() => navigation.navigate('BuyerProductList')}
        title="Acheter"
      />
    </View>
  );
}
