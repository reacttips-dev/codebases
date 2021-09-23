import styled from '@emotion/styled';

export const WarningBannerElement = styled.div`
  align-items: center;
  background: #9a201c;
  color: #ffffff;
  display: flex;
  justify-content: center;
  min-height: 50px;
  padding: 10px 0;
  text-align: center;

  span {
    width: 70%;
  }

  @media (max-width: 480px) {
    padding: 12px;

    span {
      width: 100%;
    }
  }
`;
