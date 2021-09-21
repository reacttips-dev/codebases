import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import { Button, ButtonProps } from '../../../../shared/Button/NewButton';
import { MD_SCREEN_MIN, MD_SCREEN_MAX } from '../../../../modules/Styleguide';

type ProfileButtonProps = {
  icon?: ReactNode;
};

export const ProfileButton = (props: ProfileButtonProps & ButtonProps) => {
  const { icon, children } = props;
  return (
    <StyledButton color="onDark" {...props}>
      <ButtonContent>
        {icon && <IconWrapper>{icon}</IconWrapper>}
        {children}
      </ButtonContent>
    </StyledButton>
  );
};

const StyledButton = styled(Button)`
  &,
  &:focus:before {
    border-radius: 10px;
  }

  &:hover,
  &:focus,
  &:active,
  &:active:focus,
  &:active:hover:focus {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const ButtonContent = styled.span`
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.span`
  margin-right: 10px;
  // To prevent any leading whitespace
  font-size: 0;
  // Because some buttons use the "Icon" component, requiring a parent width
  width: 18px;

  svg {
    min-width: 14px;
  }

  @media (min-width: ${MD_SCREEN_MIN}px) and (max-width: ${MD_SCREEN_MAX}px) {
    display: none;
  }
`;
