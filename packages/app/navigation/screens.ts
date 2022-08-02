import { ParamListBase } from '@react-navigation/native';

import { ProductCategory } from '../util/types';

export enum Screens {
  Home = 'Home',
  BuyerProductCategories = 'BuyerProductCategories',
  BuyerProductList = 'BuyerProductList'
}

export interface MainStackParamList extends ParamListBase {
  Home: undefined;
  ProductCategories: undefined;
  BuyerProductList: { productCategory: ProductCategory };
}
