import { css } from '@emotion/core';
import styled from '@emotion/styled';

const ImageWrapper = styled.div`
  width: 100%;
  max-width: 148px;
  margin-right: 32px;
  border-radius: 6px;
  overflow: hidden;
  @media (max-width: 768px) {
    max-width: 68px;
  }
  @media (max-width: 600px) {
    max-width: 124px;
    margin: auto auto 32px auto;
  }
`;

const ImageUploadButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  @media (max-width: 600px) {
    flex-direction: column-reverse;
    text-align: center;
  }
`;

const ImageUploadParagraph = styled.p`
  color: #7f8287;
  font-size: 1.6rem;
  margin-bottom: 24px;
  @media (max-width: 600px) {
    margin-bottom: unset;
    margin-top: 24px;
  }
`;

const ImageUploadContainer = styled.div`
  display: flex;
  border: 2px solid #dedfe0;
  border-radius: 6px;
  padding: 24px;
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const ButtonWrapper = styled.div`
  width: 100%;
  max-width: 412px;
  display: flex;
  justify-content: space-between;
  @media (max-width: 600px) {
    flex-direction: column;
    margin: auto;
    width: 100%;
  }
`;

const UpdateCoverArtButtonCss = css`
  flex: 1;
  margin-right: 12px;
  max-width: 200px;
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
  @media (max-width: 600px) {
    max-width: 100%;
    width: 100%;
    margin-right: unset;
    margin-bottom: 12px;
    flex: 0 0 40px;
  }
`;

const DownloadArtButtonCss = css`
  flex: 1;
  @media (max-width: 768px) {
    font-size: 1.4rem;
  }
  @media (max-width: 600px) {
    margin-bottom: 12px;
    flex: 0 0 40px;
  }
`;

const DownloadIconWrapper = styled.span`
  display: inline-block;
  width: 12px;
  margin-right: 4px;
`;

export {
  ImageWrapper,
  ImageUploadButtonContainer,
  ImageUploadParagraph,
  ImageUploadContainer,
  ButtonWrapper,
  UpdateCoverArtButtonCss,
  DownloadArtButtonCss,
  DownloadIconWrapper,
};
