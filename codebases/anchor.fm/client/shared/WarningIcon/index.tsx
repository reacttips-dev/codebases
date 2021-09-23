import styled from '@emotion/styled';
import React from 'react';

export const WarningIcon = ({ width = 16 }: { width?: number }) => (
  <WarningIconWrapper width={width}>!</WarningIconWrapper>
);

const WarningIconWrapper = styled.span<{ width: number }>`
  width: ${({ width }) => width}px;
  height: ${({ width }) => width}px;
  color: #fff;
  border-radius: 50%;
  background: #e54751;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin-right: 8px;
  line-height: 1.2;
  flex-shrink: 0;
`;
