import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { ControlledImageUploader } from 'components/ImageUploader/ControlledImageUploader';
import { SM_SCREEN_MAX } from 'client/modules/Styleguide';
import { Button } from 'shared/Button/NewButton';

const PublishHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const PublishMusicHeader = styled(PublishHeader)`
  margin-bottom: 24px;
`;

export const PublishEpisodeHeader = styled(PublishHeader)`
  margin-bottom: 36px;
`;

export const PublishDateContainer = styled.div`
  display: flex;
  align-items: flex-end;
  @media (max-width: ${SM_SCREEN_MAX}px) {
    flex-direction: column;
    align-items: unset;
  }
`;

export const FieldToggleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  @media (max-width: ${SM_SCREEN_MAX}px) {
    margin-top: 24px;
  }

  & > div {
    margin-right: 20px;
    margin-left: 32px;
    @media (max-width: ${SM_SCREEN_MAX}px) {
      margin-left: 0px;
    }
  }
`;

export const DraftButton = styled(Button)`
  min-width: 270px;
  width: 270px;
  margin-right: 24px;
  @media (max-width: ${SM_SCREEN_MAX}px) {
    margin: 0 auto 12px;
  }
`;

export const SaveButton = styled(Button)`
  min-width: 270px;
  @media (max-width: ${SM_SCREEN_MAX}px) {
    margin: 0 auto;
  }
`;

export const FormContainer = styled.div`
  flex: 1;
  background-color: #f2f2f4;
  margin: 0;
  padding: 44px 0 70px;
  width: 100%;

  @media (max-width: ${SM_SCREEN_MAX}px) {
    padding: 26px 0;
  }
`;

export const ResendEmailContainer = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: 0 40px 0 40px;
  margin-bottom: 16px;
`;

export const Form = styled.form`
  max-width: 1200px;
  margin: auto;
`;

const sharedSection = css`
  margin: 0 40px;
`;

export const MainOptionsSection = styled.div`
  ${sharedSection}
  @media (max-width: ${SM_SCREEN_MAX}px) {
    margin: 0 22px;
  }
`;

export const MobileButtonContainer = styled.div`
  display: none;
  flex-direction: column;
  margin-top: 36px;
  @media (max-width: ${SM_SCREEN_MAX}px) {
    display: flex;
  }
`;

export const SectionWrapper = styled.div`
  ${sharedSection};
  @media (max-width: ${SM_SCREEN_MAX}px) {
    margin: 0;
  }
`;

export const CustomizeOptionsHeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  margin-bottom: 20px;
  @media (max-width: ${SM_SCREEN_MAX}px) {
    margin: 0 22px 10px 22px;
    justify-content: center;
  }
`;

export const CustomizeOptionsHeader = styled.h2`
  font-size: 2rem;
  margin: 0;
  font-weight: bold;
  color: #292f36;
  margin-right: 6px;
`;

export const CustomizeOptionsFormContainer = styled.div`
  display: flex;
  flex-direction: row;
  background-color: #ffffff;
  padding: 36px 0;
  border-radius: 6px;
  @media (max-width: 650px) {
    flex-direction: column;
    padding: 22px;
  }
`;

export const CustomizeOptionsFieldContainer = styled.div`
  flex: 1;
  padding: 0 36px;
  @media (max-width: ${SM_SCREEN_MAX}px) {
    margin: 26px auto 0;
  }
  @media (max-width: 400px) {
    max-width: 370px;
    padding: 0;
  }
`;

export const HeaderContainer = styled.div`
  @media (max-width: ${SM_SCREEN_MAX}px) {
    margin: auto;
  }
`;

export const Header = styled.h1`
  font-size: 3.2rem;
  font-weight: 800;
  @media (max-width: ${SM_SCREEN_MAX}px) {
    font-size: 2.2rem;
    text-align: center;
  }
`;

export const DesktopButtonContainer = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: ${SM_SCREEN_MAX}px) {
    display: none;
  }
`;

export const ImageUploader = styled(ControlledImageUploader)`
  justify-content: space-between;
  flex: 1;
`;

export const InlineField = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

export const Label = styled.h4`
  color: #292f36;
  font-size: 1.6rem;
  font-weight: normal;
  margin: 0 0 10px 0;
`;

export const InlineLabelStyles = css`
  margin-right: 40px;
  width: 150px;
`;

export const NumberInputStyles = css`
  width: 74px;
  input {
    text-align: center;
  }
`;

export const ErrorAlert = styled.div`
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  background-color: rgba(208, 2, 27, 0.1);
  font-size: 1.4rem;
  color: #e54751;
  margin: 12px 0;
`;

export const ModalButton = styled(Button)`
  width: 100%;
  &:first-child {
    margin-bottom: 8px;
  }
`;

export const SpinnerContainer = styled.div`
  width: 100%;
  display: flex;
  min-height: 500px;
  align-items: center;
  justify-content: center;
`;
