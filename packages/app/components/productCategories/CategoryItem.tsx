import React from 'react';
import { ImageSourcePropType } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styled from 'styled-components/native';

const ItemOuterContainer = styled.View`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ItemContainer = styled.View`
  width: 100%;
  aspect-ratio: 1;
  border-radius: 30px;
  padding: 18px;
  background: #f4f4f4;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const ItemImage = styled.Image``;

const ItemText = styled.Text`
  padding-top: 2px;
  text-align: center;
  font-size: 20px;
  font-weight: 600;
`;

export interface CategoryItemProps {
  name: string;
  image: ImageSourcePropType;
  onPress: () => void;
}

export function CategoryItem({ name, image, onPress }: CategoryItemProps) {
  return (
    <ItemOuterContainer>
      <TouchableOpacity activeOpacity={0.8} onPress={onPress}>
        <ItemContainer>
          <ItemImage source={image} />
        </ItemContainer>
      </TouchableOpacity>
      <ItemText>{name}</ItemText>
    </ItemOuterContainer>
  );
}
