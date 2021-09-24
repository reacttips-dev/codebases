import { css } from '@emotion/core';
import styled from '@emotion/styled';

const DeleteAccountParagraph = styled.p`
  font-size: 1.6rem;
  color: #5f6368;
  margin-bottom: 24px;
`;

const DeleteContainerCss = css`
  max-width: 690px;
  width: 100%;
  @media (max-width: 600px) {
    padding: 0 24px 24px;
  }
`;

const OverridePanelCss = css`
  a:hover {
    text-decoration: none;
    cursor: pointer;
  }
  .panel-default {
    border: 0;
  }
  .panel-collapse {
    cursor: default;
  }
  .panel-body {
    padding: 0;
  }
  .panel,
  .panel-heading {
    padding: 0;
    color: #292f36;
    background: none;
    background-color: #f2f2f4;
    box-shadow: none;
    border: none;
    &:hover {
      text-decoration: none;
    }
    h4 {
      cursor: pointer;
      display: inline;
      a {
        color: #292f36;
        &:hover,
        &:active,
        &:focus,
        &:active:focus {
          color: #292f36;
        }
      }
    }
  }
`;
export { DeleteAccountParagraph, OverridePanelCss, DeleteContainerCss };
