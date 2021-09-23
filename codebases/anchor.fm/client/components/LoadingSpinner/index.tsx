import styled from '@emotion/styled';
import React from 'react';
import { Spinner } from '../../shared/Spinner';

type Props = {
  color?: string;
  width?: number;
  className?: string;
};

export const LoadingSpinner = ({ color, width = 34, className }: Props) => {
  return (
    <SpinnerWrapper
      data-testid="loadingSpinner"
      width={width}
      className={className}
    >
      <Spinner type="circle" color={color} />
    </SpinnerWrapper>
  );
};

const SpinnerWrapper = styled.div<{ width: number }>`
  width: ${({ width }) => `${width}px`};
  height: ${({ width }) => `${width}px`};
`;
