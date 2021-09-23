import styled from '@emotion/styled';
import React from 'react';
import {
  COLOR_MUTED_BORDER,
  COLOR_MUTED_TEXT,
  BORDER_RADIUS_DEFAULT,
} from '../../../../PaywallsShared/constants';

export const ProfilePaywallsPrice = ({ price }: { price: string }) => {
  return (
    <ProfilePaywallsPriceContainer>
      Subscribe for {price}
    </ProfilePaywallsPriceContainer>
  );
};

const ProfilePaywallsPriceContainer = styled.div`
  color: ${COLOR_MUTED_TEXT};
  border: 2px solid ${COLOR_MUTED_BORDER};
  border-radius: ${BORDER_RADIUS_DEFAULT};
  font-size: 1.6rem;
  padding: 14px;
  text-align: center;
  font-weight: bold;
`;
