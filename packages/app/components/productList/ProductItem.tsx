import React, { useCallback, useMemo, useState } from 'react';
import { GestureResponderEvent, ImageSourcePropType } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import styled from 'styled-components/native';

import { QUANTITY_PER_UNIT } from '../../util/constants';

const ItemContainer = styled.View`
  border-radius: 30px;
  margin: 18px;
  margin-bottom: 0;
  background: #f4f4f4;
  display: flex;
  flex-direction: row;
  overflow: hidden;
`;

const ItemImage = styled.Image`
  flex: 2;
`;

const ItemInfo = styled.View`
  flex: 5;
  display: flex;
  flex-direction: column;
  padding: 8px;
  margin-right: 8px;
`;

const ItemHeader = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const ItemSubHeader = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  height: 20px;
  margin-top: 4px;
  margin-bottom: 4px;
`;

const ItemTitle = styled.Text`
  flex: 1;
  font-size: 18px;
  font-weight: 600;
`;

const ItemSelector = styled.View`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  background: #84d182;
  border-radius: 8px;
  padding: 4px;
  height: 26px;
`;

const ItemSelectorIconContainer = styled.View`
  background: #5fba5d;
  border-radius: 50px;
  padding: 2px;
`;

const ItemSelectorQuantity = styled.Text`
  color: #ffffff;
  font-size: 14px;
`;

const ChooseSizeText = styled.Text`
  flex: 1;
  font-size: 14px;
  color: #b8b8b8;
`;

const PriceText = styled.Text`
  flex: 1;
  font-size: 14px;
  font-weight: 900;
  text-align: center;
`;

const ItemFooter = styled.View`
  display: flex;
  flex-direction: row;
`;

const ItemSizeButton = styled.TouchableOpacity`
  flex: 1;
`;

const ItemSizeContainer = styled.View<{ selected: boolean }>`
  border-radius: 8px;
  background: ${({ selected }) => (selected ? '#B8B8B8' : '#d9d9d9')};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ItemSizeType = styled.Text`
  font-size: 14px;
  text-align: center;
`;

const ItemSizeImageContainer = styled.View`
  margin-top: 4px;
  margin-bottom: 4px;
  width: 100%;
  padding-left: 16px;
  padding-right: 16px;
`;

const ItemSizeImageSubContainer = styled.View`
  aspect-ratio: 1;
`;

const ItemSizeImage = styled.Image`
  width: 100%;
  height: 100%;
`;

const ItemSizePrice = styled.Text`
  font-size: 12px;
  font-weight: 600;
`;

const ItemSizeSpacer = styled.View`
  width: 8px;
`;

interface ItemSizeProps {
  sizeType: string;
  sizeImage: ImageSourcePropType;
  sizePrice: number;
  selected: boolean;
  onPress: (event: GestureResponderEvent) => void;
}

function ItemSize({
  sizeType,
  sizeImage,
  sizePrice,
  selected,
  onPress
}: ItemSizeProps) {
  return (
    <ItemSizeButton activeOpacity={0.8} onPress={onPress}>
      <ItemSizeContainer selected={selected}>
        <ItemSizeType>{sizeType}</ItemSizeType>
        <ItemSizeImageContainer>
          <ItemSizeImageSubContainer>
            <ItemSizeImage source={sizeImage} />
          </ItemSizeImageSubContainer>
        </ItemSizeImageContainer>
        <ItemSizePrice>{sizePrice} CFA</ItemSizePrice>
      </ItemSizeContainer>
    </ItemSizeButton>
  );
}

interface ProductItemProps {
  name: string;
  availableQuantity: number;
  price: number; // For a bucket
  coverImage: string;
}

export function ProductItem({
  name,
  availableQuantity,
  price,
  coverImage
}: ProductItemProps) {
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(0);
  const [selectedType, setSelectedType] = useState<'bag' | 'bucket' | 'tub'>(
    'bucket'
  );

  const getNewQuantityAndSetTotalPrice = useCallback(
    (newQuantity: number, selectedType: 'bag' | 'bucket' | 'tub') => {
      if (newQuantity < 0) {
        newQuantity = 0;
      }
      if (newQuantity > availableQuantity / QUANTITY_PER_UNIT[selectedType]) {
        newQuantity = Math.floor(
          availableQuantity / QUANTITY_PER_UNIT[selectedType]
        );
      }
      setTotalPrice(newQuantity * price * QUANTITY_PER_UNIT[selectedType]);
      return newQuantity;
    },
    [availableQuantity, price]
  );

  const changeQuantity = useCallback(
    (direction: number) => {
      setSelectedQuantity((oldQuantity) =>
        getNewQuantityAndSetTotalPrice(oldQuantity + direction, selectedType)
      );
    },
    [getNewQuantityAndSetTotalPrice, selectedType]
  );

  const selectType = useCallback(
    (type: 'bag' | 'bucket' | 'tub') => {
      setSelectedType(type);
      setSelectedQuantity((quantity) =>
        getNewQuantityAndSetTotalPrice(quantity === 0 ? 1 : quantity, type)
      );
    },
    [getNewQuantityAndSetTotalPrice]
  );

  const isSoldOut = useMemo(() => {
    return (
      Math.floor(availableQuantity / QUANTITY_PER_UNIT[selectedType]) === 0
    );
  }, [availableQuantity, selectedType]);

  return (
    <ItemContainer>
      <ItemImage
        source={{
          uri: coverImage
        }}
      />
      <ItemInfo>
        <ItemHeader>
          <ItemTitle>{name}</ItemTitle>
          <ItemSelector>
            {selectedQuantity > 0 ? (
              <>
                <ItemSelectorIconContainer>
                  <Entypo
                    name="minus"
                    size={14}
                    color="#ffffff"
                    onPress={() => changeQuantity(-1)}
                  />
                </ItemSelectorIconContainer>
                <ItemSelectorQuantity>{selectedQuantity}</ItemSelectorQuantity>
                <ItemSelectorIconContainer>
                  <Entypo
                    name="plus"
                    size={14}
                    color="#ffffff"
                    onPress={() => changeQuantity(1)}
                  />
                </ItemSelectorIconContainer>
              </>
            ) : isSoldOut ? (
              <ItemSelectorQuantity>Rupture de stock</ItemSelectorQuantity>
            ) : (
              <ItemSelectorQuantity onPress={() => changeQuantity(1)}>
                Ajouter
              </ItemSelectorQuantity>
            )}
          </ItemSelector>
        </ItemHeader>
        <ItemSubHeader>
          <ChooseSizeText>Choisir la taille</ChooseSizeText>
          <PriceText>{totalPrice} CFA</PriceText>
        </ItemSubHeader>
        <ItemFooter>
          <ItemSize
            sizeType="Sac"
            sizeImage={require('../../assets/images/placeholder.png')}
            sizePrice={price * QUANTITY_PER_UNIT.bag}
            selected={selectedType === 'bag'}
            onPress={() => selectType('bag')}
          />
          <ItemSizeSpacer />
          <ItemSize
            sizeType="Seau"
            sizeImage={require('../../assets/images/placeholder.png')}
            sizePrice={price * QUANTITY_PER_UNIT.bucket}
            selected={selectedType === 'bucket'}
            onPress={() => selectType('bucket')}
          />
          <ItemSizeSpacer />
          <ItemSize
            sizeType="Bassine"
            sizeImage={require('../../assets/images/placeholder.png')}
            sizePrice={price * QUANTITY_PER_UNIT.tub}
            selected={selectedType === 'tub'}
            onPress={() => selectType('tub')}
          />
        </ItemFooter>
      </ItemInfo>
    </ItemContainer>
  );
}
