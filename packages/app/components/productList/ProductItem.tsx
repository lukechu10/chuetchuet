import React from 'react';
import Entypo from 'react-native-vector-icons/Entypo';
import styled from 'styled-components/native';

const ItemContainer = styled.View`
  border-radius: 30px;
  margin: 18px;
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

const ItemSubheader = styled.View`
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

const ItemSizeContainer = styled.View`
  border-radius: 8px;
  background: #d9d9d9;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ItemSizeType = styled.Text`
  font-size: 14px;
  text-align: center;
`;

const ItemSizeImageContainer = styled.View`
  padding-left: 16px;
  padding-right: 16px;
  margin-top: 4px;
  margin-bottom: 4px;
  width: 100%;
`;

const ItemSizeImage = styled.Image`
  aspect-ratio: 1;
  width: 100%;
`;

const ItemSizePrice = styled.Text`
  font-size: 12px;
  font-weight: 600;
`;

const ItemSizeSpacer = styled.View`
  width: 8px;
`;

function ItemSize() {
  return (
    <ItemSizeButton>
      <ItemSizeContainer>
        <ItemSizeType>Sac</ItemSizeType>
        <ItemSizeImageContainer>
          <ItemSizeImage
            source={{
              uri: 'https://images.immediate.co.uk/production/volatile/sites/30/2017/01/Bananas-218094b-scaled.jpg'
            }}
          />
        </ItemSizeImageContainer>
        <ItemSizePrice>28000 CFA</ItemSizePrice>
      </ItemSizeContainer>
    </ItemSizeButton>
  );
}

export function ProductItem() {
  return (
    <ItemContainer>
      <ItemImage
        source={{
          uri: 'https://images.immediate.co.uk/production/volatile/sites/30/2017/01/Bananas-218094b-scaled.jpg'
        }}
      />
      <ItemInfo>
        <ItemHeader>
          <ItemTitle>Banane</ItemTitle>
          <ItemSelector>
            <ItemSelectorIconContainer>
              <Entypo name="minus" size={14} color="#ffffff" />
            </ItemSelectorIconContainer>
            <ItemSelectorQuantity>1</ItemSelectorQuantity>
            <ItemSelectorIconContainer>
              <Entypo name="plus" size={14} color="#ffffff" />
            </ItemSelectorIconContainer>
          </ItemSelector>
        </ItemHeader>
        <ItemSubheader>
          <ChooseSizeText>Choisir la taille</ChooseSizeText>
          <PriceText>8000 CFA</PriceText>
        </ItemSubheader>
        <ItemFooter>
          <ItemSize />
          <ItemSizeSpacer />
          <ItemSize />
          <ItemSizeSpacer />
          <ItemSize />
        </ItemFooter>
      </ItemInfo>
    </ItemContainer>
  );
}
