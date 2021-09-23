import styled from '@emotion/styled';
import { ERROR_TEXT_COLOR } from 'client/modules/Styleguide';
import { css } from 'emotion';

export const LoginFormWrapper = styled.div`
  max-width: 363px;
  width: 100%;
  margin: auto;
  text-align: center;
`;

export const TextButton = styled.button`
  color: #5000b9;
  font-weight: bold;
  margin-bottom: 12px;
  &:focus,
  &:hover {
    text-decoration: underline;
  }
`;

export const SocialLoginContainer = styled.ul`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 270px;
  margin: auto;
  padding: 0;
  list-style: none;
`;

export const FieldWrapper = styled.div`
  margin-bottom: 14px;
`;

export const ButtonWrapper = styled.div`
  margin: auto;
  margin-bottom: 16px;
  margin-top: 32px;
  max-width: 300px;
  width: 100%;
`;

export const ErrorAlert = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  background-color: rgba(208, 2, 27, 0.08);
  font-size: 1.2rem;
  color: ${ERROR_TEXT_COLOR};
  margin: 12px 0;
  padding: 8px;
`;

export const SocialSignInBorderCSS = css`
  border: 2px solid #dfe0e1;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;
