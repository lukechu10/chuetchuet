import { ParamListBase } from '@react-navigation/native';

import { ProductCategory } from '../util/types';

export enum Screens {
  Home = 'Home',
  BuyerProductCategories = 'BuyerProductCategories',
  BuyerProductList = 'BuyerProductList',
  SellerProductCategories = 'SellerProductCategories',
  SellerProductList = 'SellerProductList'
}

export interface MainStackParamList extends ParamListBase {
  Home: undefined;
  BuyerProductCategories: undefined;
  BuyerProductList: { productCategory: ProductCategory };
  SellerProductCategories: undefined;
  SellerProductList: { productCategory: ProductCategory };
}
