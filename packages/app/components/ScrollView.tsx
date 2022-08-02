import styled from 'styled-components/native';

export const ScrollView = styled.ScrollView.attrs({
  contentInsetAdjustmentBehavior: 'automatic',
  contentContainerStyle: { flexGrow: 1 }
})`
  height: 100%;
`;
