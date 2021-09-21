import { css } from '@emotion/core';
import styled from '@emotion/styled';

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
  @media (max-width: 560px) {
    flex-direction: column;
    align-items: flex-start;
    margin-bottom: 32px;
  }
`;

export const IconWrapper = styled.div`
  box-sizing: border-box;
  height: 46px;
  width: 46px;
  border: 2px solid #dfe0e1;
  border-radius: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  @media (max-width: 670px) {
    display: none;
  }
`;

export const TextInputWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
`;

export const ProviderLabel = styled.p`
  margin: 0 16px;
  flex: 1;
  color: #5f6369 !important;
  font-size: 1.6rem;
  font-weight: bold;
  @media (max-width: 670px) {
    margin: 0;
  }
  @media (max-width: 560px) {
    margin-bottom: 20px;
  }
`;

export const ContentContainer = styled.div`
  display: flex;
  @media (max-width: 600px) {
    flex-direction: column-reverse;
    align-items: flex-start;
    width: 100%;
  }
`;
