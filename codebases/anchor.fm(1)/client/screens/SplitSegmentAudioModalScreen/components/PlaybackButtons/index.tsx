import React from 'react';
import styled from '@emotion/styled';
import Icon from '../../../../shared/Icon';

type Props = {
  onClick: () => void;
  isDisabled?: boolean;
};

export function PlayButton({ onClick, isDisabled = false }: Props) {
  return (
    <StyledPlayButton onClick={onClick} disabled={isDisabled}>
      <VisuallyHidden>play audio</VisuallyHidden>
      <div>
        <Icon type="play" fillColor="white" />
      </div>
    </StyledPlayButton>
  );
}

export function PauseButton({ onClick, isDisabled = false }: Props) {
  return (
    <StyledPauseButton onClick={onClick} disabled={isDisabled}>
      <VisuallyHidden>pause audio</VisuallyHidden>
    </StyledPauseButton>
  );
}

const StyledButton = styled.button`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  padding: 0;
  background: #292f36;
  border-radius: 50%;
`;

const StyledPlayButton = styled(StyledButton)`
  & > div {
    width: 15px;
    margin-left: 2px;
  }
`;

const StyledPauseButton = styled(StyledButton)`
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 6px;
    height: 18px;
    background: #ffffff;
    border-radius: 1px;
  }
  &::before {
    left: 17px;
  }
  &::after {
    left: 27px;
  }
`;

const VisuallyHidden = styled.span`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;
