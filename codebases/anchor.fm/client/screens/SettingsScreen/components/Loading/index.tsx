import React from 'react';
import { css } from 'emotion';
import { Spinner } from '../../../../shared/Spinner';

export function Loading({
  className,
  color,
}: {
  className?: string;
  color?: string;
}) {
  return (
    <div
      data-testid="loading-spinner"
      className={css`
        display: grid;
        place-content: center;
        ${className}
      `}
    >
      <div
        className={css`
          width: 100%;
          max-width: 50px;
        `}
      >
        <Spinner type="circle" color={color} />
      </div>
    </div>
  );
}
