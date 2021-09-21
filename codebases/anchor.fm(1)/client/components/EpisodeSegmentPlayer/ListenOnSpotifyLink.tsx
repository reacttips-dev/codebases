import styled from '@emotion/styled';

export const ListenOnSpotifyLink = styled.a`
  background: rgba(0, 0, 0, 0.6);
  width: 167px;
  height: 32px;
  display: inline-flex;
  line-height: 1;
  justify-content: center;
  border-radius: 25px;
  color: #fff;
  &:hover,
  &:focus {
    color: #fff;
    text-decoration: none;
  }
  &:active,
  &:active:focus,
  &:active:hover:focus {
    color: #fff;
    text-decoration: none;
    background: #5f6369;
  }
  &:focus {
    background-color: #292f36;
  }
  &:hover {
    background-color: #41464d;
  }
  svg {
    margin-left: 0.4rem;
  }
  @media (max-width: 769px) {
    width: 144px;
    height: 48px;
    font-size: 1.2rem;
    line-height: 1.4rem;
    padding-left: 8px;
    svg {
      margin-left: 0.2rem;
      height: 18px;
    }
  }
`;

export const LinkText = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;
