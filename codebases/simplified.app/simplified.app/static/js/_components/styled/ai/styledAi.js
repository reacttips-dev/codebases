import { Field } from "formik";
import { Col, Form, Nav, Row, Tab } from "react-bootstrap";
import styled from "styled-components";
import {
  blackAlpha12,
  greyBlack,
  blackAlpha008,
  colorDisabled,
  primary,
  primaryHover,
  blackAlpha24,
  grey,
  lightInactive,
  trInputBackground,
  placeholderColor,
  white,
  primary_00,
} from "../variable";

export const StyledNav = styled.div`
  font-size: 0.875rem;
  width: 100%;

  a {
    padding-left: 0px;
    padding-right: 0px;
    margin-right: 0px;
    text-align: start;
    width: fit-content;
  }

  .nav-link {
    padding-left: 12px;
    padding-right: 12px;
  }
`;

export const StyledAiTemplate = styled.div`
  display: flex;
  flex-direction: row;
  // align-items: flex-start;
  border: 3px solid ${blackAlpha008};
  border-radius: 8px;
  padding: 12px; // TODO: Padding should change using media query
  background: ${trInputBackground};

  &:hover {
    cursor: pointer;
    border: 3px #ffac41 solid;
    box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);
    -webkit-box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);
    -moz-box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);
  }

  .icon {
    &.new-document-icon {
      font-size: 34px;
      margin: 2px 0px 0px 8px;

      .fa-pencil-alt {
        font-size: 30px;
      }
    }
  }

  .info-container {
    display: flex;
    flex-direction: column;
    margin-left: 1rem;
  }

  .title {
    font-weight: 500;
    margin-top: 5px;
    width: 100%;
    color: ${lightInactive};
    font-size: 16px;
  }

  .title2 {
    font-weight: 500;
    margin-top: 5px;
    width: 100%;
    color: ${lightInactive};
    font-size: 16px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .subtitle {
    font-weight: normal;
    color: #888888;
    font-size: 14px;
    letter-spacing: 0;

    &.description {
      display: block;
      display: -webkit-box;
      max-width: 100%;
      height: 60px;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

export const StyledAiRow = styled(StyledAiTemplate)`
  margin-top: 1px;
  border-radius: 8px;
  border: unset;
  border: 3px solid #323232;
  ${(allowOverflow) => (!allowOverflow ? "overflow: hidden;" : "")};
  background-color: #232323;
  padding: unset !important;

  .thumbnail {
    position: relative;
    height: 100%;
    width: 100%;
    padding: 12px;

    .document-action {
      position: absolute;
      top: 10px;
      right: 13px;

      svg {
        path {
          fill: ${primary};
        }
      }
    }

    .favorite-action {
      position: absolute;
      top: 10px;
      right: 13px;
    }

    .title {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
`;

export const StyledCenterAlignedRow = styled(StyledAiRow)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${lightInactive};
`;

export const StyledAiHeaderText = styled(Row)`
  font-size: 22px; // TODO: Font size should be in rem
  font-weight: bold;
  line-height: 28px;
  justify-content: center;
  text-align: center;
  display: flex;
  align-items: center;
`;

export const StyledHeaderText = styled.div`
  font-size: 22px;
  font-weight: bold;
  line-height: 28px;
  justify-content: start;
  text-align: center;
  display: flex;
  align-items: center;
`;

export const StyledAiSubHeaderText = styled(Col)`
  font-size: 16px;
  justify-content: center;
  color: ${grey};
  //text-align: center;

  text-align: ${(props) => (props.textAlign ? props.textAlign : "center")};
  margin-left: ${(props) => (props.marginLeft ? props.marginLeft : "")};
`;

export const StyledAITabNav = styled(Nav.Link)`
  font-weight: 500;
  color: ${(props) =>
    props.tldrbtn === "primary"
      ? primary
      : props.tldrbtn === "secondary"
      ? primary
      : lightInactive};
  text-transform: capitalize;
  border-bottom: ${(props) =>
    props.tldrbtn === "primary"
      ? "3px solid " + primary
      : "3px solid " + blackAlpha12} !important;

  :hover {
    background: ${blackAlpha24} !important;
    color: ${(props) =>
      props.tldrbtn === "primary"
        ? primary
        : props.tldrbtn === "secondary"
        ? primaryHover
        : lightInactive};
  }

  :disabled {
    background: ${(props) =>
      props.tldrbtn === "primary" ? colorDisabled : blackAlpha12} !important;
    color: ${(props) =>
      props.tldrbtn === "primary" ? greyBlack : lightInactive};
  }

  :focus {
    color: ${(props) =>
      props.tldrbtn === "primary"
        ? lightInactive
        : props.tldrbtn === "secondary"
        ? primaryHover
        : primary};
    outline: none;
    box-shadow: none !important;
  }
`;

export const StyledAINavMainTab = styled(Nav.Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  text-transform: capitalize;
  min-width: 160px;
  font-size: 0.875rem;
  border-bottom: ${(props) =>
    props.isactive ? `2px solid ${primary_00}` : `2px solid transparent`};

  :hover {
    color: ${(props) => (props.tldrbtn === "primary" ? primary : primaryHover)};
  }

  :disabled {
    background: ${(props) =>
      props.tldrbtn === "primary" ? colorDisabled : blackAlpha12} !important;
    color: ${(props) =>
      props.tldrbtn === "primary" ? greyBlack : lightInactive};
  }

  :focus {
    outline: none;
    box-shadow: none !important;
  }
  margin-top: 20px;
  // width: 180px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 0.75rem;
    border-bottom: ${(props) =>
      props.isactive ? `2px solid ${primary_00}` : `2px solid transparent`};
  }
`;

export const StyledAICol = styled(Col)`
  padding: 0.5rem;
  .title {
    color: ${white};
    font-size: 17px;
    margin-bottom: 6px;
  }

  .modified {
    font-weight: normal;
    color: #888888;
    font-size: 12px;
    letter-spacing: 0;
  }

  .ai-result-save-action {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0rem 0.7rem;
  }

  .blog-headline {
    color: ${white};
    overflow: hidden;
    font-family: Rubik;
    font-size: 16px;
    white-space: break-spaces;
  }
`;

export const StyledAIHeaderBox = styled(Col)`
  box-sizing: border-box;
  border: 3px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  margin-right: 0px;
  margin-left: 0px;
`;

export const StyledAIRow = styled(Row)`
  padding: 0 0.5rem;
  align-content: flex-end;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .result-options-container {
    display: flex;
    align-items: center;

    .dropdown {
      margin-left: 0.7rem !important;
    }
  }
`;

export const StyledAIColHeader = styled(StyledAICol)`
  padding: 0.5rem;
  display: flex;
  flex-direction: column;

  .title {
    align-self: ${(props) => props.align};
  }
`;

export const StyledAIColHeaderWithButton = styled(StyledAIColHeader)`
  align-items: ${(props) => props.align};
  padding-top: 0rem;
`;

export const StyledAIResultsListGroupItem = styled.div`
  background-color: rgba(0, 0, 0, 0.16);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 3px solid ${blackAlpha008};
  border-radius: 8px;
  padding: 5px;
  svg {
    cursor: pointer;
  }

  ${(props) =>
    props.hoverEnabled &&
    `
    :hover {
      cursor: pointer;
      border: 3px solid ${primaryHover};
      box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);
      -webkit-box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);
      -moz-box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);
    }

    &.active {
      background-color: unset;
      cursor: pointer;
      border: 3px solid ${primaryHover};
      box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);
      -webkit-box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);
      -moz-box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);
    }
  
  `}
`;

export const StyledAiEditor = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;

  @media (max-width: 576px) {
    flex-direction: column;
  }

  .ai-box {
    width: 100%;

    .settings-card-body {
      border-radius: 8px;
    }
  }

  .editor {
  }
`;

export const StyledTabPane = styled(Tab.Pane)`
  width: ${(props) => (props.width ? props.width : "100%")};
`;

export const StyledTabContent = styled(Tab.Content)`
  display: flex;
  justify-content: center;
`;

export const StyledAIResultFormControl = styled(Form.Control)`
  padding: 1rem;
  width: 100%;
  background-color: ${trInputBackground};
  border: 2px transparent solid !important;
  color: ${lightInactive};
  height: 150px;
  max-height: 150px;
  border-radius: 4px;
  padding-left: 1rem;

  &::placeholder {
    color: ${placeholderColor};
    font-size: 1rem;
    letter-spacing: 0.08px;
    line-height: 28px;
  }

  &:-ms-input-placeholder {
    color: ${placeholderColor};
    font-size: 1rem;
    letter-spacing: 0.08px;
    line-height: 28px;
  }

  &::-ms-input-placeholder {
    color: ${placeholderColor};
    font-size: 1rem;
    letter-spacing: 0.08px;
    line-height: 28px;
  }

  .input {
    background-color: ${trInputBackground} !important;
    color: ${lightInactive}; !important;
    font-size: 1rem !important;
    letter-spacing: 0.08px !important;
    line-height: 28px !important;
    outline: none;
  }

  :focus {
    color:${lightInactive};
    background-color: ${trInputBackground} !important;
  }
  :hover {
    border: ${(props) =>
      props.showBorderOnHover ? `2px ${primary} solid !important` : ``};
  }
`;

export const StyledAIPlaygroundNav = styled(Nav)`
  background-color: #232323;
  max-height: 60px !important;
  min-height: 60px !important;
  overflow: scroll;
`;

export const StyledAiInputFormField = styled(Field)`
  background-color: ${trInputBackground};
  border: 0px;
  color: ${lightInactive};
  height: 48px;
  border-radius: 4px;
  padding-left: 1rem;
  font-size: 1rem;
  letter-spacing: 0.08px;
  line-height: 28px;

  &::placeholder {
    font-size: 1rem;
    letter-spacing: 0.08px;
    line-height: 28px;
  }

  &:-ms-input-placeholder {
    background-color: ${trInputBackground} !important;
    color: ${placeholderColor};
    font-size: 1rem;
    letter-spacing: 0.08px;
    line-height: 28px;
  }

  &::-ms-input-placeholder {
    background-color: ${trInputBackground} !important;
    color: ${placeholderColor};
    font-size: 1rem;
    letter-spacing: 0.08px;
    line-height: 28px;
  }

  .input {
    background-color: ${trInputBackground} !important;
    color: ${placeholderColor} !important;
    font-size: 1rem !important;
    letter-spacing: 0.08px !important;
    line-height: 28px !important;
    outline: none;
  }

  :focus {
    background-color: ${trInputBackground} !important;
    color: ${placeholderColor};
  }
  :hover {
    border: 2px ${primary} solid !important;
  }
`;
