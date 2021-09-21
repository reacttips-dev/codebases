import styled from '@emotion/styled';

const grayLineColor = `#dedfe0`;
const disabledIconColor = `#c9cbcd`;
const enabledIconColor = `#292F36`;
const fontFamily = "'Maax', sans-serif";

export const Root = styled.div`
  & > div {
    background: #ffffff;
    font-family: ${fontFamily};
    border-width: 0;
    > div:first-of-type {
      margin-left: 0;
      margin-right: 0;
      border-bottom: 2px solid #dedfe0;
      padding: 0 14px;
      height: 58px;
      display: flex;
      align-items: center;
      > div {
        margin-bottom: 0;
      }
      input {
        color: #292f36;
        font-size: 14px;
        font-family: ${fontFamily};
      }
    }
    > div:last-child {
      & > div > div > div {
        padding: 16px;
        font-weight: normal;
        line-height: 2.25rem;
        a:hover {
          text-decoration: none;
        }
      }
    }
    li,
    span {
      font-size: 16px;
      color: #292f36;
    }
    a li,
    a span {
      color: #5000b9 !important;
    }
    button {
      border-color: ${grayLineColor};
      background-image: none;
      span {
        color: ${enabledIconColor};
      }
      &:disabled {
        span {
          color: ${disabledIconColor};
        }
      }
    }
  }
`;
