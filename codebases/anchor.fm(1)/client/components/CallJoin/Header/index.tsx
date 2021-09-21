/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Box from '../../../shared/Box';
import { AnchorLogoWithWordmark } from '../../svgs/AnchorLogoWithWordmark';

export function Header() {
  return (
    <div
      css={css`
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        padding: 0 26px;
        background-color: #24203F;
        width: 100%;
        @media (max-width: 880px) {
          padding: 0 16px;
        }
      `}
    >
      <Box
        maxWidth={1400}
        width="100%"
        lgHeight={96}
        mdHeight={76}
        smHeight={76}
        display="flex"
        alignItems="center"
      >
        <Box display="flex" alignItems="center">
          <Box marginLeft={3} smWidth={114} mdWidth={124} lgWidth={126}>
            <AnchorLogoWithWordmark />
          </Box>
        </Box>
      </Box>
    </div>
  );
}
