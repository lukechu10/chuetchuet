import { ParamListBase } from '@react-navigation/native';

export enum Screens {
  Home = 'Home',
  Settings = 'Settings'
}

export interface MainStackParamList extends ParamListBase {
  Home: undefined;
  BuyerProductListScreen: undefined;
}
