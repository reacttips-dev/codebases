import styled from '@emotion/styled';
import { css } from 'emotion';
import { CDN_PATH } from 'components/MarketingPagesShared/constants';

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const ModalHeader = styled.h1`
  font-size: 2.4rem;
  font-weight: 800;
`;

const ModalSubHeader = styled.p`
  font-size: 1.4rem;
  margin-top: 8px;
  margin-bottom: 24px !important; // overwriting bootstrap modal styles
  text-align: center;
`;

const PlatformsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 325px;
`;

const confirmationModalBaseContentClass = css`
  background-color: #5000b9;
  color: #ffffff;
  height: 256px;
  padding: 32px 56px;
  position: relative;
  overflow: hidden;
  border-radius: 10px;

  &::before,
  &::after {
    content: '';
    background-image: url('${CDN_PATH}/distribution/bg-lava.svg');
    transform: rotate(-30deg);
    display: inline-block;
    background-repeat: no-repeat;
    background-position: center;
    position: absolute;
    background-size: 986px 190px;
    width: 100%;
    height: 100%;
    z-index: 1;
    opacity: 0.1;
  }

  &::before {
    left: -103px;
    top: -88px;
  }

  &::after {
    left: 148px;
    top: 115px;
  }

  > * {
    z-index: 2;
    position: relative;
  }
`;

const ErrorMessage = styled.span`
  color: red;
  font-size: 1.4rem;
  display: block;
  max-width: 320px;
  margin: auto;
  margin-top: 16px;
`;

const PaddedContainer = styled(ContentContainer)`
  padding: 48px 56px;
`;

const Note = styled.p`
  background: #f4f4f4;
  border-radius: 8px;
  padding: 16px;
  font-size: 1.4rem;
  margin-top: 16px;
  span {
    font-weight: bold;
  }

  a {
    text-decoration: underline;
    color: inherit;
  }
`;

const ImageWrapper = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 16px;
  overflow: hidden;
`;

export {
  ContentContainer,
  ModalHeader,
  ModalSubHeader,
  PlatformsContainer,
  confirmationModalBaseContentClass,
  ErrorMessage,
  PaddedContainer,
  Note,
  ImageWrapper,
};
