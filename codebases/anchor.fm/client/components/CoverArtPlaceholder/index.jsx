import { css } from 'emotion';

import React from 'react';

import { Icon } from '../../shared/Icon/index.tsx';

const CoverArtPlaceholder = () => (
  <div
    className={css`
      background-color: #dedfe0;
      position: relative;
      width: 100%;
      border-radius: 6px;
      :after {
        content: '';
        display: block;
        padding-bottom: 100%;
      }
    `}
  >
    <div
      className={css`
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
      `}
    >
      <div
        className={css`
          width: 50%;
        `}
      >
        <Icon type="anchor_logo" fillColor="white" />
      </div>
    </div>
  </div>
);

export { CoverArtPlaceholder };
