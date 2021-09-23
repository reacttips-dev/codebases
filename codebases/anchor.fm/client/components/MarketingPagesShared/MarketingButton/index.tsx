import { css } from 'emotion';
import React from 'react';
import { Button, ButtonProps } from '../../../shared/Button/NewButton';
import { BREAKPOINT_SMALL } from '../styles';

const className = css`
  white-space: nowrap;

  @media (max-width: ${BREAKPOINT_SMALL}px) {
    width: 100%;
  }
`;

export function MarketingButton(props: ButtonProps) {
  return <Button color="yellow" className={className} {...props} />;
}
