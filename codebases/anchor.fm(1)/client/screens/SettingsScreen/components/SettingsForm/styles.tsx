import { css } from '@emotion/core';
import styled from '@emotion/styled';

const HeadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 64px;
  @media (max-width: 600px) {
    padding: 0 24px;
    margin-bottom: 36px;
  }
`;

const Heading = styled.h2`
  margin: 0;
  font-size: 3.2rem;
  font-weight: 800;
  @media (max-width: 600px) {
    font-size: 2.4rem;
    font-weight: bold;
  }
`;

const SectionHeading = styled.h3`
  font-size: 2rem;
  font-weight: bold;
  padding: 0;
  margin: 0 0 15px 0;
  @media (max-width: 600px) {
    font-size: 1.6rem;
    padding: 0 24px;
  }
`;

const InlineLabelHeading = styled.h4`
  font-weight: normal;
  font-size: 1.6rem;
  margin: 0;
  padding: 0;
`;

const FieldSelectWrapper = styled.div`
  max-width: 450px;
  margin-bottom: 24px;
  @media (max-width: 600px) {
    max-width: unset;
    padding: 0 24px;
  }
`;

const Form = styled.form`
  max-width: 926px;
  width: 100%;
  margin: auto;
`;

const WhiteFormSection = styled.div`
  padding: 40px;
  margin-bottom: 56px;
  background-color: #fff;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  @media (max-width: 600px) {
    padding: 24px;
  }
`;

const FieldToggleContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 24px;
  @media (max-width: 600px) {
    padding: 0 24px;
  }
`;

const HorizontalRule = styled.hr`
  border: 1px solid #dfe0e1;
  margin: 72px 0;
  @media (max-width: 600px) {
    margin: 72px 24px;
  }
`;

const FieldWrapper = styled.div`
  margin-bottom: 20px;
`;

const ExplicitFieldWrapper = styled.div`
  display: flex;
  margin-bottom: 36px;
  max-width: 345px;
  width: 100%;
  @media (max-width: 600px) {
    flex-direction: column;
  }
`;

const ExplicitFieldCss = css`
  flex: 1;
  margin-right: 30px;
  @media (max-width: 600px) {
    margin-right: unset;
    margin-bottom: 32px;
  }
`;

const VanitySlugAndColorContainer = styled.div`
  display: flex;
  margin-bottom: 56px;
  max-width: 690px;
  width: 100%;
  justify-content: space-between;
  @media (max-width: 600px) {
    flex-direction: column;
    padding: 0 24px;
  }
`;

const VanitySlugFieldContainer = styled.div`
  margin-right: 30px;
  flex: 2;
  @media (max-width: 600px) {
    margin: 0 0 32px;
  }
`;

const VanitySlugLabelHeadingCss = css`
  margin: 0 12px 0 0;
  height: 46px;
  display: flex;
  align-items: center;
`;

const ProfileHeaderColorFieldCss = css`
  width: 100%;
  max-width: 210px;
  min-width: 167px;
  @media (max-width: 600px) {
    max-width: unset;
    min-width: unset;
  }
`;

const MobileSaveContainer = styled.div`
  background-color: #fff;
  padding: 16px 16px 24px 16px;
  position: fixed;
  width: 100%;
  z-index: 1;
  bottom: 0;
  box-shadow: 0px -2px 6px #dedfe0;
  display: none;
  @media (max-width: 600px) {
    display: block;
  }
`;

const MobileSaveErrorText = styled.p`
  text-align: center;
  margin-bottom: 16px;
`;

const MobileSaveButtonCss = css`
  width: 100%;
  margin: auto;
  @media (max-width: 600px) {
    display: flex;
  }
`;

const FieldDescription = styled.p`
  font-size: 12px;
  line-height: 18px;
  color: #7f8287;
  margin-top: 4px;
`;

export {
  HeadingContainer,
  Heading,
  SectionHeading,
  InlineLabelHeading,
  FieldSelectWrapper,
  FieldDescription,
  Form,
  WhiteFormSection,
  FieldToggleContainer,
  HorizontalRule,
  FieldWrapper,
  ExplicitFieldWrapper,
  ExplicitFieldCss,
  VanitySlugAndColorContainer,
  VanitySlugFieldContainer,
  VanitySlugLabelHeadingCss,
  ProfileHeaderColorFieldCss,
  MobileSaveContainer,
  MobileSaveErrorText,
  MobileSaveButtonCss,
};
