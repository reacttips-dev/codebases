import styled from '@emotion/styled';
import { Button } from '../../../../shared/Button/NewButton';

const Container = styled.div`
  max-width: 930px;
  color: #5f6368;
  background: #ffffff;
  border-radius: 6px;
  border: 0.5px solid #c9cbcd;
  font-size: 16px;
  position: relative;
`;

const UploadBody = styled.div`
  display: flex;
  align-items: center;
  padding: 35px 32px;

  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const ContentWrapper = styled.div`
  display: flex;
  flex: 1;
  @media (max-width: 600px) {
    justify-content: center;
    align-items: center;
  }
`;

const Content = styled.div<{ isUploading?: boolean }>`
  flex: 1;
  margin: 0 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  span {
    margin-right: 10px;
  }

  @media (max-width: 600px) {
    margin: 0 10px;
    width: ${({ isUploading }) => (isUploading ? '100%' : 'auto')};
  }
`;

const ContentHeader = styled.div`
  font-weight: bold;
`;

const ButtonsWrapper = styled.div`
  display: flex;

  @media (max-width: 600px) {
    width: 100%;
    flex-direction: column;

    div {
      width: 100%;
    }
  }
`;

const StyledButton = styled(Button)`
  margin: 0 6px;
  @media (max-width: 600px) {
    width: 100%;
    margin-top: 20px;
  }
`;

const Info = styled.div`
  padding: 12px 170px;
  border-radius: 0 0 10px 10px;
  border-top: 1px solid #dedfe0;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 600px) {
    padding: 12px 25px;
  }
`;

const UploadProgressWell = styled.div`
  height: 16px;
  border-radius: 10px;
  background: rgba(80, 0, 185, 0.2);
  position: relative;
`;

const UploadProgressBar = styled.div<{ complete?: boolean }>`
  width: 0%;
  height: 16px;
  border-radius: 10px 0 0 10px;
  ${({ complete }) =>
    complete &&
    `border-top-right-radius: 10px;
     border-bottom-right-radius: 10px;
    `}
  background: #5000b9;
  position: absolute;
  left: 0;
`;

const ProgressInfo = styled.div`
  font-size: 1.6rem;
`;

const Backout = styled.button`
  text-align: right;
  cursor: pointer;
  position: absolute;
  top: -30px;
  right: 0;
  font-size: 1.6rem;
  font-weight: normal;
  color: #5f6368;
  text-decoration: underline;

  &:hover {
    color: #5f6368;
  }

  &:focus {
    color: #5000b9;
  }
`;

export {
  Backout,
  ProgressInfo,
  Container,
  UploadBody,
  ContentWrapper,
  Content,
  ContentHeader,
  ButtonsWrapper,
  StyledButton,
  Info,
  UploadProgressWell,
  UploadProgressBar,
};
