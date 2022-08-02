import React from 'react';
import styled from 'styled-components/native';

const BannerContainer = styled.View`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 56px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: #84d182;
`;

const BannerText = styled.Text`
  text-align: center;
  font-size: 20px;
  font-weight: 600;
`;

export const SafeAreaView = styled.SafeAreaView`
  background: #84d182;
`;

export interface DeliveryBannerProps {
  text: string;
}

export function DeliveryBanner({ text }: DeliveryBannerProps) {
  return (
    <BannerContainer>
      <BannerText>{text}</BannerText>
    </BannerContainer>
  );
}
