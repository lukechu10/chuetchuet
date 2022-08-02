import React from 'react';
import { Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import styled from 'styled-components/native';

const entries = [
  { image: require('../../assets/images/groceryDelivery.png') },
  { image: require('../../assets/images/girlsEducation.png') },
  { image: require('../../assets/images/agroforestry.png') }
];

const Image = styled.Image`
  width: 100%;
  height: 300px;
`;

const windowWidth = Dimensions.get('window').width;
const height = (windowWidth * 242) / 377;

export function InfoCarousel() {
  return (
    <Carousel
      data={entries}
      renderItem={({ item }) => {
        return <Image source={item.image} />;
      }}
      width={windowWidth}
      height={height}
      autoPlay
      autoPlayInterval={5000}
      scrollAnimationDuration={1000}
    />
  );
}
