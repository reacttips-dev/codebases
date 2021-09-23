import { css } from '@emotion/core';
import styled from '@emotion/styled';

export const PodcastSetupSubtitle = styled.p`
  font-size: 1.8rem;
  line-height: 1.16;
  text-align: center;
  max-width: 80%;
  margin: 0 auto 20px auto;
`;

export const PodcastSetupTitle = styled.h3`
  font-size: 2.4rem;
  line-height: 1.16;
  text-align: center;
  color: #292f36;
  font-weight: 800;
  margin-bottom: 1.6rem;
`;

export const GlobalOverrides = css`
  .modal-content p {
    color: #7f8287;
  }
`;
