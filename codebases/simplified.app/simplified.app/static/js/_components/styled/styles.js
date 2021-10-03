import styled from "styled-components";
import {
  greyDark,
  primaryHover,
  primaryPrssed,
  primary,
  blackAlpha,
  greyBlack,
  blackAlpha12,
  blackAlpha24,
  blackAlpha32,
  colorDisabled,
  black,
  placeholderColor,
  grey,
  sideBarWidth,
  headerHeight,
  secondaryColor,
  projectGridItemWidth,
  projectGridItemHeight,
  accentGrey,
  lightInactive,
  white,
  trInputBackground,
  studioFooterColor,
  previewNavbarHeight,
  accent,
  md,
  primary_00,
  primayColor,
} from "./variable";
import {
  Button,
  Form,
  Row,
  Navbar,
  Dropdown,
  DropdownButton,
  ListGroup,
  ButtonGroup,
  Modal,
  Badge,
} from "react-bootstrap";
import { FormControl } from "react-bootstrap";
import { Field } from "formik";
import { Rnd } from "react-rnd";

export const StyledNavbar = styled(Navbar)`
  background-color: ${greyDark};
  -webkit-box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.5);
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.5);
  width: 100%;
  z-index: ${(props) =>
    props.location === "dashboard"
      ? "101"
      : props.location === "editor"
      ? "1001"
      : "1001"};
  position: sticky;
  top: 0;
  height: 61px;

  @media (max-width: ${md}){
    padding: 0.5rem 1.5rem;

    svg {
      margin-right: 1.25rem !important;
    }

    .ai-share-document-span {
      display: none;
    }
  }

  .nav-link {
    padding: 0.1rem;
  }

  .navbar-toggler,
  .icon-bar {
    border: 1px solid ${grey};
  }

  .navbar-collapse .navbar-nav {
    .nav-link {
      color: ${grey};
      background-color: transparent;
    }

    .nav-link:hover {
      color: ${primaryHover};
    }

    .selected {
      color: ${lightInactive};
    }
  }

  .dropdown {
    .dropdown-menu {
      -webkit-box-shadow:: 0 8px 16px 0 rgba(0, 0, 0, 0.5);
      -moz-box-shadow:: 0 8px 16px 0 rgba(0, 0, 0, 0.5);
      box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.5);
      background-color: ${greyDark};
    }

    .nav-link {
      color: ${grey};
    }
    .dropdown-item {
      color: ${grey};
      background-color: transparent;
      display: flex;
    }

    .dropdown-item:hover {
      color: ${primaryHover};
    }

    .dropdown-item:active {
      color: ${primaryPrssed};
    }

    .dropdown-divider {
      border-top: 1px solid ${greyBlack};
    }

    .dropdown-toggle::after {
      display: none;
      position: absolute;
      top: 50%;
      ${"" /* right: 10px; */}
      right: ${(props) => (props.iscompact === "true" ? "-11px" : "10px")};
      transform: translateY(-50%);
    }
  }

  .btn-group {
    .btn-primary,
    .btn-primary:active {
      background-color: transparent;
      border-color: transparent;
      padding: 0px;
    }

    .btn-primary:focus {
      outline: none;
      box-shadow: none !important;
    }
  }

  .nav-brand-icon {
    margin-right: 1rem !important;
  
    @media (max-width: ${md}) {
      margin-right: 24px !important;
    }
  }

  .story-brand-icon {
    @media (max-width: ${md}) {
      display: none;
    }
  }

`;

export const StyledPreviewNavbar = styled(Navbar)`
  width: 100%;
  z-index: 1001;
  position: absolute;
  top: 0;
  height: ${previewNavbarHeight};
  border-bottom: 1px solid rgb(255 255 255 / 20%);

  .navbar-brand{
    margin-top: 5px;
    margin-right: 24px !important;
    // @media (max-width: ${md}) {
    //   margin: 0px !important;
    // }
  }

  .nav-link {
    padding: 0.1rem;
  }

  .navbar-toggler,
  .icon-bar {
    border: 1px solid ${grey};
  }

  .navbar-collapse{
    justify-content: space-between;
  }

  .navbar-collapse .navbar-nav {
    .nav-link {
      color: ${grey};
      background-color: transparent;
    }

    .nav-link:hover {
      color: ${primaryHover};
    }

    .selected {
      color: ${white};
    }
  }

  .dropdown {
    .dropdown-menu {
      -webkit-box-shadow:: 0 8px 16px 0 rgba(0, 0, 0, 0.5);
      -moz-box-shadow:: 0 8px 16px 0 rgba(0, 0, 0, 0.5);
      box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.5);
      background-color: ${greyDark};
    }

    .nav-link {
      color: ${grey};
    }
    .dropdown-item {
      color: ${grey};
      background-color: transparent;
      display: flex;
    }

    .dropdown-item:hover {
      color: ${primaryHover};
    }

    .dropdown-item:active {
      color: ${primaryPrssed};
    }

    .dropdown-divider {
      border-top: 1px solid ${greyBlack};
    }

    .dropdown-toggle::after {
      display: none;
      position: absolute;
      top: 50%;
      ${"" /* right: 10px; */}
      right: ${(props) => (props.iscompact === "true" ? "-11px" : "10px")};
      transform: translateY(-50%);
    }
  }

  .btn-group {
    .btn-primary,
    .btn-primary:active {
      background-color: transparent;
      border-color: transparent;
      padding: 0px;
    }

    .btn-primary:focus {
      outline: none;
      box-shadow: none !important;
    }
  }
  
`;

/* export const  StyledPreviewNavbar = styled(Navbar)`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  flex-direction: row;

  .nav-link {
    padding: 0.1rem;
  }

  .dropdown {
    .dropdown-menu {
      -webkit-box-shadow:: 0 8px 16px 0 rgba(0, 0, 0, 0.5);
      -moz-box-shadow:: 0 8px 16px 0 rgba(0, 0, 0, 0.5);
      box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.5);
      background-color: ${greyDark};
    }

    .nav-link {
      color: ${grey};
    }
    .dropdown-item {
      color: ${grey};
      background-color: transparent;
      display: flex;
    }

    .dropdown-item:hover {
      color: ${primaryHover};
    }

    .dropdown-item:active {
      color: ${primaryPrssed};
    }

    .dropdown-divider {
      border-top: 1px solid ${greyBlack};
    }

    .dropdown-toggle::after {
      display: block;
      position: absolute;
      top: 50%;
      right: -11px;
      transform: translateY(-50%);
    }
  }

  .btn-group {
    .btn-primary,
    .btn-primary:active {
      background-color: transparent;
      border-color: transparent;
      padding: 0px;
    }

    .btn-primary:focus {
      outline: none;
      box-shadow: none !important;
    }
  }
`; */

export const StyledDropdown = styled(Dropdown)`

  .dropdown-menu {
    -webkit-box-shadow:: 0 8px 16px 0 rgba(0, 0, 0, 0.5);
    -moz-box-shadow:: 0 8px 16px 0 rgba(0, 0, 0, 0.5);
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.5);
    background-color: ${greyDark};
  }


  .btn-primary.dropdown-toggle {
    font-size:14px;
    color: #fff;
    background-color:  ${greyDark};
    border-color: ${grey};
  }

  .btn-primary.dropdown-toggle:focus{
    box-shadow: 0 0 0 0.2rem #ffac41;
    background-color: #323232
  }

  .btn-primary:focus{
    box-shadow: 0 0 0 0.2rem #ffac41;
    background-color: #323232
  }

  .nav-link {
    color: ${grey};
  }
  .dropdown-item {
    font-size:14px;
    color: ${grey};
    background-color: transparent;
  }

  .dropdown-item:hover {
    color: ${primaryHover};
  }

  .dropdown-item:active {
    color: ${primaryPrssed};
  }

  .dropdown-divider {
    border-top: 1px solid ${greyBlack};
  }
`;

export const StyledDropdownToggle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${blackAlpha};
  border-radius: 50%;
  height: 30px;
  width: 30px;
  align-self: center;

  :hover {
    cursor: pointer;
  }

  svg {
    color: ${primary};
  }
`;

export const StyledNavbarSecondary = styled(Navbar)`
  width: 100%;
  background-color: #323232;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.5);
  top: ${(props) => (props.$zeroTopMargin ? "56px" : "60px")};
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 80px;
  position: sticky;
  z-index: 100;
`;

export const StyledButton = styled(Button)`
  background: ${(props) =>
    props.tldrbtn === "primary"
      ? primary
      : props.tldrbtn === "secondary"
      ? greyBlack
      : blackAlpha12} !important;
  font-weight: 500;
  color: ${(props) =>
    props.tldrbtn === "primary"
      ? `${greyBlack} !important`
      : props.tldrbtn === "secondary"
      ? primary
      : lightInactive};
  border: ${(props) =>
    props.tldrbtn === "secondary" ? "2px solid" + primary : "0px solid"};
  border-radius: 8px;

  :hover:enabled {
    background: ${(props) =>
      props.tldrbtn === "primary"
        ? primaryHover
        : props.tldrbtn === "secondary"
        ? greyBlack
        : blackAlpha24} !important;
    color: ${(props) =>
      props.tldrbtn === "primary"
        ? greyBlack
        : props.tldrbtn === "secondary"
        ? primaryHover
        : lightInactive};
    border: ${(props) =>
      props.tldrbtn === "secondary" ? "2px solid" + primaryHover : "0px solid"};
  }

  :disabled {
    background: ${(props) =>
      props.tldrbtn === "primary" ? colorDisabled : blackAlpha12} !important;
    color: ${(props) =>
      props.tldrbtn === "primary" ? greyBlack : lightInactive};
    border: ${(props) =>
      props.tldrbtn === "secondary"
        ? "2px solid" + colorDisabled
        : "0px solid"};
  }

  :focus {
    background: ${(props) =>
      props.tldrbtn === "primary"
        ? primaryPrssed
        : props.tldrbtn === "secondary"
        ? greyBlack
        : blackAlpha32} !important;
    color: ${(props) =>
      props.tldrbtn === "primary"
        ? greyBlack
        : props.tldrbtn === "secondary"
        ? primaryPrssed
        : lightInactive};
    outline: none;
    box-shadow: none !important;
    border: ${(props) =>
      props.tldrbtn === "secondary"
        ? "2px solid" + primaryPrssed
        : "0px solid"};
  }
`;

export const StyledButtonLg = styled(StyledButton)`
  border-radius: 8px;
`;

export const StyledZoomActionButton = styled(StyledButton)`
  background: none !important;
  color: ${(props) =>
    props.type === "true" ? primaryPrssed : lightInactive} !important;
  font-size: 14px;
  height: ${(props) => (props.height ? props.height : "auto")};
  width: ${(props) => (props.width ? props.width : "auto")};
  justify-content: ${(props) =>
    props.justifycontent ? props.justifycontent : "unset"};
  padding: ${(props) => (props.padding ? props.padding : "0px 12px")};
  border-radius: 0.5em;
  display: flex;
  align-items: center;

  svg {
    height: 14px;
    width: 14px;
  }

  :hover:enabled {
    background: ${(props) =>
      props.hidehover ? "none !important" : `${accentGrey} !important`};
  }

  :disabled {
    background: ${studioFooterColor} !important;
    pointer-events: none;
  }

  :focus {
    background: ${studioFooterColor} !important;
  }

  @media (max-width: ${md}) {
    padding: 0px;
    pointer-events: all;
  }
`;

export const StyledCloseActionButton = styled(StyledZoomActionButton)`
  @media (max-width: ${md}) {
    margin-left: 24px;
  }
`;

export const StyledFooterArtBoardDropdownButton = styled(DropdownButton)`
  background: ${greyDark} !important;
  color: ${(props) => (props.type ? primaryPrssed : lightInactive)} !important;
  font-size: 14px;

  :hover:enabled {
    background: ${accentGrey} !important;
  }

  :focus {
    background: ${greyDark} !important;
  }
`;

export const StyledRoundedPill = styled(StyledButton)`
  border-radius: 999px;

  &.template-categories {
    margin-right: 1rem !important;
    width: fit-content !important;
    background-color: transparent !important;
    color: ${lightInactive} !important;
    border: ${(props) =>
      props.tldrbtn === "primary"
        ? `1px solid ${primary}`
        : props.tldrbtn === "secondary"
        ? `1px solid ${greyBlack}`
        : "1px solid transparent"} !important;

    :hover:enabled {
      background-color: transparent !important;
      border: ${primary} 1px solid !important;
    }

    :focus {
      border: ${primary} 1px solid !important;
    }
  }
`;

export const StyledNavbarButton = styled(StyledButton)`
  font-weight: 500;
  font-size: 1em;
  margin: ${(props) =>
    props.transparentbg === "true"
      ? "0rem 0.35rem 0.2rem 0rem"
      : "0rem 0.25rem"};
  background: ${(props) =>
    props.transparentbg === "true" ? "transparent !important" : "transparent"};
  height: 36px;
  font-size: 16px;
  text-align: center;
  width: ${(props) => (props.transparentbg === "true" ? "42px" : "unset")};

  :hover:enabled {
    background: ${(props) =>
      props.transparentbg === "true"
        ? "transparent !important"
        : "transparent"};
  }

  :focus {
    background: ${(props) =>
      props.transparentbg === "true"
        ? "transparent !important"
        : "transparent"};
  }

  svg {
    font-size: ${(props) => (props.transparentbg === "true" ? "30px" : "")};
  }

  // If true, will have same styles for desktop and mobile
  ${(props) =>
    props.unresponsive === "true"
      ? ""
      : `
   @media (max-width: ${md}) {
    background: transparent !important;
    padding: 0px 4px;
    display: flex;
    flex-direction: row;
    width: 24px;
    height: 24px;
    margin: 0px;
    align-items: center;
    justify-content: center;
    transition: none;

    :hover:enabled {
      background: transparent !important;
    }

    :hover {
      background: transparent !important;
    }

    :disabled {
      background: transparent !important;
    }

    :enabled {
      background: transparent !important;
    }
  }
  `}
`;

export const StyledDrawerButton = styled(StyledNavbarButton)`
  width: 100%;
  justify-content: flex-start;
  margin: 24px;

  .icon {
    height: 24px;
    width: 24px;
    padding: 4px;
    margin-right: 28px;
  }

  .label {
    color: #d8d8d8;
    font-size: 1.125rem;
    font-weight: 400;
  }

  .share-mobile {
    @media (max-width: ${md}) {
      margin-right: 28px !important;
    }
  }
`;

export const StyledDownloadOptionDropdown = styled(StyledNavbarButton)`
  svg {
    align-items: center;
    justify-content: center;

    @media (max-width: ${md}) {
      margin-left: 0px !important;
    }
  }
`;
export const StyledCommentButton = styled(StyledNavbarButton)`
  width: 100%;
  justify-content: flex-start;
  margin: 24px;

  .icon {
    height: 24px;
    width: 24px;
    padding: 4px;
    margin-right: 28px;
  }

  .label {
    color: ${lightInactive};
    fontsize: 1.125rem;
    fontweight: 400;
  }
`;

export const StyledIntercomChatButton = styled(StyledButton)`
  font-weight: 500;
  font-size: 1em;
  border-radius: 24px;
  margin-right: 10px;
  margin-bottom: 10px;
  color: ${black};
  background: ${primary} !important;
  height: 39px;
  font-size: 16px;
  text-align: center;
  width: 39px;
  position: absolute;
  bottom: 0;
  right: 0;

  :hover:enabled {
    color: ${black};
    background: ${primaryHover} !important;
  }

  :focus {
    background: ${primaryHover} !important;
  }

  svg {
    font-size: ${(props) => (props.transparentbg === "true" ? "30px" : "")};
  }
`;

export const StyledPreviewNavbarButton = styled(StyledButton)`
  border-radius: 16px;
  margin-top: 5px;
  margin-right: 8px;
  background-color: rgba(255, 255, 255, 0.08);
  height: 32px;
  width: 32px;
  padding: 2px;

  display: flex;
  align-items: center;
  justify-content: center;

  :hover:enabled {
    background: ${(props) =>
      props.transparentbg === "true"
        ? "transparent !important"
        : "transparent"};
  }

  :focus {
    background: ${(props) =>
      props.transparentbg === "true"
        ? "transparent !important"
        : "transparent"};
  }

  svg {
    height: 16px;
    width: 16px;
  }
`;

export const StyledNavbarEditButton = styled(StyledButton)`
  font-weight: 500;
  font-size: 1em;
  background: transparent;
  height: 36px;
  font-size: 16px;
  text-align: center;
  border-radius: 8px 0px 0px 8px;
`;

export const StyledNavbarPreviewButton = styled(StyledButton)`
  font-weight: 500;
  font-size: 1em;
  margin-right: 0.25rem;
  background: transparent;
  height: 36px;
  font-size: 16px;
  text-align: center;
  border-radius: 0px 8px 8px 0px;
`;

export const StyledBackNavbarButton = styled(StyledNavbarButton)`
  @media (max-width: ${md}) {
    margin-right: 24px;
  }
`;

export const StyledUndoNavbarButton = styled(StyledNavbarButton)`
  border-radius: 8px 0px 0px 8px;

  :hover {
    cursor: pointer;
  }

  @media (max-width: ${md}) {
    margin-right: 24px;
  }
`;

export const StyledRedoNavbarButton = styled(StyledNavbarButton)`
  border-radius: 0px 8px 8px 0px;

  :hover {
    cursor: pointer;
  }

  @media (max-width: ${md}) {
    margin-right: 24px;
  }
`;

export const StyledContextNavbarButton = styled(StyledNavbarButton)`
  margin-left: 24px;

  :hover {
    cursor: pointer;
  }

  // @media (max-width: ${md}) {
  //   background-color: transparent;
  // }
`;

export const StyledNavbarEditableText = styled.div`
  font-weight: 500;
  font-size: 1em;
  margin: 0rem 0.5rem;
  padding: 0.5em 1em;
`;

export const StyledSearchForm = styled(Form)`
  height: 44px;
  width: 100%;
  border-radius: 6px;
  border: none;
  background-color: ${blackAlpha12};
  color: ${grey};
  letter-spacing: 0.08px;
  line-height: 28px;
  align-items: center !important;

  .form-group {
    color: ${grey} !important;
    width: 100%;
    border-radius: 6px;
  }

  .input-group-prepend {
    padding-left: 1rem;
    padding-right: 0.5rem;
  }

  .input-group-append {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }

  .form-control {
    border: none;
    &::placeholder {
      color: ${grey};
      font-size: 1rem;
      letter-spacing: 0.08px;
      line-height: 28px;
    }

    &:-ms-input-placeholder {
      color: ${grey};
      font-size: 1rem;
      letter-spacing: 0.08px;
      line-height: 28px;
    }

    &::-webkit-search-cancel-button {
      -webkit-appearance: none;
    }
  }

  input[type="search"] {
    background-color: transparent !important;
    color: ${grey} !important;
    font-size: 1rem !important;
    letter-spacing: 0.08px !important;
    line-height: 28px !important;
    outline: none;

    :focus {
      outline: none;
    }
  }
`;

export const StyledSliderContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  height: 100%;
  position: relative;
  justify-content: center;
`;

export const StyledStoryWrapper = styled.div`
  height: 100%;
  width: 100%;
  // background: ${secondaryColor};
  // border-radius: 0.5rem 0.5rem 0 0;
`;

export const StyledStoryPageWrapper = styled.div`
  ${(props) => `
    height: 100%;
    width: ${props.artboardSize.widthPercentage}%;
  `}
`;

export const StyledSlideHeader = styled.div`
  width: 100%;
  height: 5%;
  font-weight: 400;
  color: ${lightInactive};
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  padding: 0rem 0.75rem;
  flex-direction: row;
  justify-content: space-between;
  background: ${secondaryColor};
  border-radius: 0.5rem 0.5rem 0 0;
  transform: translateY(-100%);
  position: absolute;

  div {
    svg {
      margin-left: 0.5rem;
      margin-right: 0.5rem;
    }
  }
`;

export const StyledSlideBody = styled.div`
  height: 100%;
  width: 100%;
`;

export const StyledSlideInActive = styled.div`
  background-color: ${black};
  opacity: 0.85;
  position: absolute;
  top: 0;
  left: 0;
  max-width: 100%;
  height: 100%;
  width: 100%;
`;

export const StyledDesignCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  ${(props) => props.cardHeight && `height: ${props.cardHeight};`}
  ${(allowOverflow) => (!allowOverflow ? "overflow: hidden;" : "")};

  .thumbnail {
    align-items: center;
    display: flex;
    justify-content: center;
    height: 84%;
    position: relative;
    width: 100%;
    background-color: ${greyDark};
    border-radius: 8px;
    border: 4px transparent solid;

    .placeholder {
      width: ${(props) =>
        props.varient === "story"
          ? "108px"
          : props.varient === "cover"
          ? "205px"
          : props.varient === "post"
          ? "151px"
          : props.varient === "ad"
          ? "240px"
          : props.varient === "app_ad"
          ? "45px"
          : props.varient === "header_cover"
          ? "205px"
          : "74px"};

      height: ${(props) =>
        props.varient === "story"
          ? "192px"
          : props.varient === "cover"
          ? "78px"
          : props.varient === "post"
          ? "151px"
          : props.varient === "ad"
          ? "125.6px"
          : props.varient === "app_ad"
          ? "45px"
          : props.varient === "header_cover"
          ? "78px"
          : "74px"};
      border-radius: 8px;
      height: 80%;
      display: flex;
      width: 90%;
      flex-direction: column;

      .breathing {
        width: 100% !important;
        height: unset !important;
        aspect-ratio: 1/1;
        overflow: hidden;
        box-sizing: border-box;
        display: flex;
        max-height: 100%;
        margin: auto;
        aspect-ratio: ${(props) =>
          props.varient === "story"
            ? "9/16"
            : props.varient === "cover"
            ? "205/78"
            : props.varient === "post"
            ? "1"
            : props.varient === "ad"
            ? "1.91"
            : props.varient === "app_ad"
            ? "1"
            : props.varient === "header_cover"
            ? "2.62"
            : "1"}}
      }
    }

    img {
      height: 100%;
      width: 100%;
      object-fit: contain;
    }
  }

  .thumbnail:hover {
    border-radius: 8px;
    border: 4px ${primary} solid;

    img {
      opacity: 0.4;
    }
  }

  .template {
    font-weight: 500;
    color: #939393;
    font-family: Rubik;
    font-size: 10px;
    letter-spacing: 0;
    position: absolute;
    right: 0;
    top: 0;
    margin: 10px;
    border-radius: 18px;
    background-color: #1e1e1e;
    padding: 5px 10px 5px 10px;
    text-transform: uppercase;
  }

  .title {
    font-weight: 500;
    margin-top: 5px;
    width: 100%;
    color: ${lightInactive};
    font-size: 14px;
    word-wrap: break-word;
    word-break: break-all;
  }

  .subtitle {
    font-weight: normal;
    color: #888888;
    font-size: 12px;
    letter-spacing: 0;
  }

  .actions {
    height: 50px;
    background-color: rgba(255, 172, 65, 0.9);
    position: absolute;
    border-radius: 8px 8px 0 0;
    display: flex;
    width: 100%;
    bottom: 0;
    align-items: center;
    justify-content: space-around;

    .action {
      font-weight: 500;
      text-align: center;
      padding: 7px;
      color: ${black};
    }
  }
`;

export const StyledMarketplaceDesignCard = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  cursor: pointer;

  .thumbnail {
    height: 261px;
    width: 237px;
    background-color: rgba(255, 255, 255, 0.04);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 3px solid rgba(255, 255, 255, 0.08);
  }

  .start-from-scratch-thumbnail {
    // height: 261px;
    // width: 238px;
    width: auto;
    background-color: #232323;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 2px solid #1e1e1e;
    box-sizing: border-box;

    transition: 0.3s transform cubic-bezier(0.155, 1.105, 0.295, 1.12),
      0.3s box-shadow,
      0.3s -webkit-transform cubic-bezier(0.155, 1.105, 0.295, 1.12);
    cursor: pointer;

    .rect-container {
      height: 100%;
      display: flex;
      align-items: center;
      padding-top: 10px;
    }

    .format-footer {
      flex: 1;
      min-width: 0;
    }

    img {
      height: auto;
      width: auto;
      max-height: calc(100% - 63px);
      max-width: 100%;
      object-fit: contain;
    }

    &.swiper-thumbnail {
      height: auto !important;
      width: unset !important;

      :hover {
        transform: scale(1.01);
        box-shadow: 0px 0px 40px #000000;
        -webkit-box-shadow: 0px 0px 40px #000000;
        -moz-box-shadow: 0px 0px 40px #000000;
      }

      .marketplace-template-format-swiper-image {
        width: 150px;
        max-width: 150px;
        height: 125px;
        max-height: 125px;
        object-fit: contain;

        /* Extra small devices (phones, 600px and below) */
        @media (max-width: 600px) {
          // width: 70px;
          // height: 45px;
        }

        /* Small devices (portrait tablets and large phones, 600px and above) */
        @media (min-width: 600px) {
          width: 120px;
          height: 95px;
        }

        /* Extra large devices (large laptops and desktops, 768px and above) */
        @media (min-width: 768px) {
          width: 150px;
          height: 125px;
        }
      }
    }
  }

  .design-card-thumbnail {
    height: 100%;
    width: 100%;
    position: relative;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: 0.3s transform cubic-bezier(0.155, 1.105, 0.295, 1.12),
      0.3s box-shadow,
      0.3s -webkit-transform cubic-bezier(0.155, 1.105, 0.295, 1.12);

    img {
      border-radius: 8px;
      display: block;
      object-fit: cover;
      width: 100%;
      height: 100%;
    }
    img:before {
      content: " ";
      display: block;

      position: absolute;
      top: -10px;
      left: 0;
      height: calc(100% + 10px);
      width: 100%;
      background-color: rgb(230, 230, 230);
      border: 2px dotted rgb(200, 200, 200);
      border-radius: 5px;
    }

    img:after {
      content: "\f127"" Broken Image of " attr(alt);
      display: block;
      font-size: 16px;
      font-style: normal;
      font-family: FontAwesome;
      color: rgb(100, 100, 100);

      position: absolute;
      top: 5px;
      left: 0;
      width: 100%;
      text-align: center;
    }
  }

  .design-card-thumbnail:hover {
    border-radius: 8px;
    transform: scale(1.01);
    box-shadow: 0px 0px 40px #000000;
    -webkit-box-shadow: 0px 0px 40px #000000;
    -moz-box-shadow: 0px 0px 40px #000000;

    img {
      opacity: 0.4;
    }
  }

  .start-from-scratch-thumbnail:hover {
    border-radius: 8px;
    transform: scale(1.01);

    box-shadow: 0px 0px 40px #000000;
    -webkit-box-shadow: 0px 0px 40px #000000;
    -moz-box-shadow: 0px 0px 40px #000000;
  }

  .divider {
    margin: 10px 0 10px 0;
    height: 1px;
    width: 100%;
    background-color: #494949;
  }

  .title {
    margin-top: 10px;
    font-weight: 500;
    width: 100%;
    color: ${lightInactive};
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .subtitle {
    color: #888888;
    font-family: Rubik;
    font-size: 12px;
    letter-spacing: 0;
  }

  .actions {
    height: 100%;
    background-color: rgba(30, 30, 30, 0.6);
    position: absolute;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: auto;
    top: 0;
    bottom: 0;
    align-items: center;
    justify-content: center;
    color: ${white};

    .action {
      font-weight: 500;
      text-align: center;
      padding: 7px;
      color: ${white};
    }
  }
`;

export const StyledMarketPlaceFormatRect = styled.div`
  border: 2px dashed grey;
  border-radius: 8px;
  ${(props) =>
    `height: calc(${props.imageHeight}px * ${props.heightScaleFactor})`};
  ${(props) =>
    `width: calc(${props.imageWidth}px * ${props.widthScaleFactor})`};
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 18px;
  }
`;

export const StyledHeaderWithIcon = styled(Row)`
  justify-content: start;
  align-items: center;
  color: ${primary};
  H1 {
    font-weight: 700;
    color: ${primary};
  }
`;

export const StyledHeader = styled(Row)`
  h1,
  h2 {
    font-weight: 700;
    color: ${primary};
  }

  div {
    color: ${lightInactive};
  }
`;

export const StyledCollection = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(${projectGridItemWidth}, ${projectGridItemWidth})
  );
  grid-gap: 20px;
  grid-auto-rows: minmax(${projectGridItemHeight}, ${projectGridItemHeight});
  color: ${lightInactive};
  justify-content: center;
  height: 100vh;
`;

export const StyledViewAllTemplateCollection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(204px, 204px));
  grid-gap: 40px;
  color: ${lightInactive};
  justify-content: center;
  // height: 100vh;
  grid-auto-rows: auto
    ${(props) =>
      props.varient === "story"
        ? "minmax(414px, 414px)"
        : props.varient === "cover"
        ? "minmax(31px, 31px)"
        : props.varient === "post"
        ? "minmax(246px, 246px)"
        : props.varient === "ad"
        ? "minmax(32px, 32px)"
        : props.varient === "app_ad"
        ? "minmax(45px, 45px)"
        : "minmax(74px, 74px)"};
`;

export const StyledStarterStoryCard = styled(StyledDesignCard)`
  .story-image {
    border: 2px ${primary} dashed;
    background-color: ${greyBlack};
    text-align: center;
    color: ${primary};
    display: flex;
    align-items: center;
  }
`;

export const StyledLoginFormControl = styled(FormControl)`
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

export const StyledInviteForm = styled.div`
  display: flex;
  flex-direction: row;
`;

export const StyledLoginFormField = styled(Field)`
  background-color: ${greyDark};
  border: 1px ${lightInactive} solid !important;
  color: ${lightInactive};
  height: 40px;
  flex-grow: 1;
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
    background-color: transparent !important;
    color: ${lightInactive} !important;
    font-size: 1rem !important;
    letter-spacing: 0.08px !important;
    line-height: 28px !important;
    outline: none;
    padding-left: 1rem;
  }

  :focus {
    color: ${lightInactive};
    background-color: ${greyDark} !important;
  }
  :hover {
    border: 2px ${primary} solid !important;
  }
`;

export const StyledWallpaper = styled.div`
  text-align: center;
  position: absolute;

  div {
    display: inline-block;
    height: ${(props) => props.maxHeight}px;
    width: ${(props) => props.maxWidth}px;
    overflow: hidden;
    position: relative;
  }

  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    min-width: 100%;
    min-height: 100%;
    -webkit-user-drag: none;

    ${(props) =>
      props.filters &&
      `
      -webkit-filter: ${props.filters};
      filter:${props.filters};
      `};

    ${(props) =>
      props.opacity &&
      `
      opacity: ${props.opacity}
    `};
  }
`;

export const StyledContentOverlay = styled.div`
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.7441351540616247) 50%,
    #000000 100%
  );
  position: absolute;
  height: 100%;
  width: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  opacity: 0;
  transition: all 0.4s ease-in-out 0s;
  border-radius: 6px;
  -webkit-user-drag: none;

  ${(props) =>
    props.isDragging &&
    `
    opacity: 0 !important;
    `};
`;

export const StyledContentDetails = styled.div`
  position: absolute;
  text-align: center;
  width: 100%;
  height: 100%;
  top: 0%;
  opacity: 0;
  transition: all 0.3s ease-in-out 0s;
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  -webkit-user-drag: none;

  p {
    color: ${lightInactive};
    font-size: 0.75rem;
    margin-bottom: 2px !important;

    a {
      color: ${primary};
      font-size: inherit;
    }
  }

  .actions {
    z-index: 100;
    padding-left: -1em;
    padding-right: -1em;
    height: 50px;
    background-color: rgba(255, 172, 65, 0.9);
    position: absolute;
    border-radius: 8px 8px 0 0;
    display: flex;
    width: 100%;
    bottom: 0;
    align-items: center;
    justify-content: space-around;

    .action {
      font-weight: 500;
      text-align: center;
      padding: 7px;
      color: ${black};
    }
  }

  ${(props) =>
    props.isDragging &&
    `
    opacity: 0 !important;
    `};
`;

export const StyledContentAction = styled.div`
  align-self: flex-end;
  margin-top: -5px;
  margin-right: ${(props) => (props.marginRight ? "-10px" : "0px")};
  padding: 10px;

  svg {
    cursor: pointer;
  }
`;

export const StyledSidebarAside = styled.aside`
  width: ${sideBarWidth} !important;
  height: calc(100vh - ${headerHeight}) !important;
  -webkit-box-shadow: 8px 0 16px 0 rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 8px 0 16px 0 rgba(184, 154, 154, 0.5);
  box-shadow: 8px 0 16px 0 rgba(0, 0, 0, 0.5);
  background-color: ${secondaryColor};
  z-index: 499;
  position: fixed;
  overflow-y: scroll;
  overflow-y: overlay;
  // margin-top: ${headerHeight};
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &::-webkit-scrollbar {
    display: none;
  }
`;

StyledSidebarAside.methodName = "TLDRMainSidebar";

export const StyledNavbarUserInfo = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;

  .picture {
    color: ${primary};
    background-color: ${(props) =>
      props.selected ? primaryHover : props.bgColor};
    padding: 2px;
    display: flex;
    justify-content: center;
    text-align: center;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    min-width: 30px;

    &.medium-size {
      width: 32px;
      height: 32px;

      svg {
        height: 30px;
        width: 30px;
      }
    }

    img {
      border-radius: 50%;
      object-fit: cover;
      width: 100%;
      height: 100%;
    }

    svg {
      align-self: center;
      justify-content: center;
    }

    :hover {
      background-color: ${primaryHover};
      cursor: pointer;
    }
  }

  .fa-angle-down,
  .fa-angle-up {
    path {
      fill: ${lightInactive};
    }
  }

  .user {
    margin-right: 10px;
    padding-left: 8px;
    text-overflow: ellipsis;

    .email,
    .subscription {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 170px;
      font-size: 12px;
      letter-spacing: 0;
      color: ${lightInactive};
    }

    .email.navbar-header-item {
      display: flex;
      flex-direction: row;
      align-items: center;
      width: 155px;
    }

    .company {
      color: ${lightInactive};
      overflow: hidden;
      text-overflow: ellipsis;
      width: 125px;
      font-size: 14px;
    }

    .subscription {
      ${(props) => `color: ${props.subscriptionColor}`};
    }
  }

  .pro-icon {
    background-color: #1e1e1e;
    border-radius: 50%;
    margin-right: 10px;
    font-size: 14px;
    width: 35px;
    min-width: 35px;
    height: 35px;
    line-height: 35px;
    text-align: center;
  }

  .organization-initials {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
    font-weight: bold;
    color: ${lightInactive};
    width: 35px;
    min-width: 35px;
    height: 35px;
    border-radius: 50%;
    ${(props) => `border: 2px ${props.subscriptionColor} solid`};
  }
`;

export const StyledNavbarUserInfoContainer = styled.div`
  max-height: 310px;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const StyledListGroupItem = styled(ListGroup.Item)`
  background-color: rgba(0, 0, 0, 0);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-left: unset;
  border-right: unset;
  svg {
    cursor: pointer;
  }
  :hover {
    color: ${primary};
  }
`;

export const StyledListGroup = styled(ListGroup)``;
export const StyledMotionPanelButton = styled(StyledButton)`
  font-weight: 500;
  font-size: 1em;
  background: transparent;
  height: 36px;
  font-size: 16px;
  text-align: center;
`;

export const StyledAnimationButtonGroup = styled(ButtonGroup)``;

export const StyledSpeedActionButton = styled(StyledButton)`
  font-weight: 500;
  font-size: 1em;
  color: ${lightInactive};

  &.active {
    color: ${black} !important;
    background: ${primary} !important;
  }
`;
export const StyledVideoTrimmingModalBody = styled(Modal.Body)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledVideoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const StyledDurationContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`;

export const StyledRnd = styled(Rnd)`
  display: flex !important;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0);
  position: relative !important;
  border: 3px solid ${primary};
  border-radius: 8px;
`;

export const StyledRndContainer = styled.div`
  width: 79%;
  position: absolute;
  bottom: 49px;
  left: 55px;
  margin: 0rem 1rem 0rem 1rem;
`;

export const StyledVideoHorizontalResizeHandleComponent = styled.div`
  background: ${primary};
  height: 30px;
  width: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px !important;
  position: absolute;
  bottom: 5px;
  ${(props) => (props.side === "right" ? "left: 2px" : "right: 2px")};
`;

export const StyledVideoSeekBar = styled.input`
  -webkit-appearance: none;
  width: 82%;
  height: 5px;
  background: ${blackAlpha12};
  margin-top: 15px;
  outline: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 3px;
    height: 30px;
    background: ${lightInactive};
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 3px;
    height: 30px;
    background: ${lightInactive};
    cursor: pointer;
  }
`;

export const StyledVideoDurationContainer = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  padding: 2px 6px;
  color: ${lightInactive};
  background: rgba(0, 0, 0, 0.6);
  border-radius: 8px;
  font-size: 12px;
`;

export const StyledAddBrandkitButton = styled(StyledButton)`
  margin: ${(props) =>
    props.bottomMargin
      ? "2rem 0rem 2rem 0rem"
      : props.topMargin
      ? "2rem 0rem 0rem 0rem"
      : "0rem"};
`;

export const StyledCopied = styled.span`
  color: #ffac41;
  //margin-left: 10px;
  margin-top: 10px;
`;

export const StyledShareWeb = styled.div`
  display: flex;
  flex-direction: column;

  .control {
    width: 100%;
    display: flex;
    flex-direction: row;
  }

  .info {
    flex: 1;
    .title {
      font-weight: 500;
      margin-top: 5px;
      width: 100%;
      color: ${lightInactive};
      font-size: 14px;
      word-wrap: break-word;
      word-break: break-all;
    }

    .subtitle {
      font-weight: normal;
      color: #888888;
      font-size: 14px;
      letter-spacing: 0;
    }
  }

  .toggle {
    align-self: center;
  }
`;

export const StyledCommandKTooltipContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 7px;

  .tooltip-title {
    color: ${lightInactive};
    font-size: 14px;
    text-align: center;
    margin-bottom: 0.5rem;
  }

  .tooltip-subtitle {
    color: ${grey};
    text-align: center;
    margin-bottom: 0.5rem;
  }

  .hotkeys {
    font-size: 18px;
  }
`;

export const StyledTemplateActionsDropDownMenu = styled(Dropdown.Menu)`
  background-color: ${secondaryColor};
  -webkit-box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.5);
  -moz-box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.5);
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.5);
  //width: 250px;
`;

export const StyledTemplateActionsDropDownItem = styled(Dropdown.Item)`
  color: ${lightInactive};
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  :hover {
    background-color: ${primary};
  }
`;

export const StyledPublishTemplateModalBody = styled(Modal.Body)`
  display: flex;
  flex-direction: column;
`;

export const StyledTagsInputContainer = styled.div`
  background-color: ${trInputBackground};
  border: 0px;
  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
  padding: 5px 5px 0;
  width: 100%;
  align-items: center;

  input,
  textarea {
    border: none;
    width: 100%;
    background: transparent;
    color: ${lightInactive};
    outline: none;
  }

  textarea {
    height: 100px;
  }

  .clear-tags-container {
    color: ${lightInactive};
    font-size: 14px;

    :hover {
      cursor: pointer;
    }
  }
`;

export const StyledTagsInputList = styled.ul`
  display: inline-flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
  width: 97.5%;

  li {
    align-items: center;
    background: ${primary};
    border-radius: 30px;
    color: ${greyBlack};
    display: flex;
    font-size: 14px;
    list-style: none;
    margin-bottom: 5px;
    margin-right: 5px;
    padding: 5px 5px;

    &.input-tag-pill {
      max-width: 309px;
      overflow-wrap: anywhere;

      .input-tag-text {
        margin: unset !important;
        padding-left: 0.25rem;
      }
    }

    &.input-tag-tags-input {
      background: none;
      flex-grow: 1;
      padding: 0;
    }
  }
`;

export const StyledRemoveTagsButton = styled.div`
  display: flex;
  align-items: center;
  appearance: none;
  background: ${greyBlack};
  border: none;
  border-radius: 50%;
  color: ${lightInactive};
  cursor: pointer;
  display: inline-flex;
  font-size: 9.5px;
  height: 15px;
  justify-content: center;
  line-height: 0;
  margin-left: 0.25rem;
  padding: 10px;
  width: 15px;
`;

export const StyledKeyboardShortcutsCategories = styled.div`
  color: ${lightInactive};
  font-weight: bold;

  .kbd-shortcuts-panel-hr {
    margin-top: 0.3rem !important;
    border-color: ${lightInactive} !important;
    opacity: 0.5;
  }
`;

export const StyledKeyboardShortcutsSubcategories = styled.div`
  color: ${lightInactive};
  font-weight: normal;
  font-size: 14px;

  .keyboard-shortcuts,
  .keyboard-shortcuts-keys {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    p {
      margin-bottom: 0 !important;
      margin-left: 0.25rem;
    }
  }

  .kbd-shortcuts-panel-hr {
    margin-top: 0.3rem !important;
    border-color: ${lightInactive} !important;
    opacity: 0.2;
  }

  kbd {
    margin-left: 0.25rem;
  }
`;

export const StyledStoryNameLabel = styled.label`
  color: ${lightInactive};
  border-radius: 8px;
  font-size: 16px;
  //margin: 0rem 0.5rem;
  padding: 5px 5px;
  outline: none;
  box-shadow: none !important;
  height: 32px;
`;

export const StyledStoryNameSubLabel = styled.label`
  color: #888888;
  border-radius: 8px;
  font-size: 12px;
  //margin: 0rem 0.5rem;
  //padding: 5px 2px;
  outline: none;
  box-shadow: none !important;
  height: 14px;
  line-height: 14px;
  padding-left: 5px;
  padding-top: 2px;

  @media (max-width: ${md}) {
    margin-bottom: 0px;
  }
`;

export const StyledStoryNameInput = styled.div`
  color: ${lightInactive};
  border-radius: 8px;
  font-size: 14px;
  //margin: 0rem 0.5rem;
  //padding: 5px 2px;
  outline: none;
  box-shadow: none !important;
  height: 19px;
  width: 150px;
  line-height: 17px;
  padding-left: 5px;
  padding-top: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  .previewTitle {
    font-size: 24px;
    width: unset;
    display: flex;
    justify-content: center;
  }

  :hover {
    cursor: pointer;
  }

  .icon {
    height: 16px;
    width: 16px;
  }

  @media (max-width: ${md}) {
    font-size: 18px;
    height: auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: auto;
  }
`;

export const StyledPreviewStoryName = styled.div`
  font-size: 18px;
  font-family: Rubik;
  font-weight: 500;
  width: 400px;
  display: flex;
  color: ${lightInactive};
  outline: none;
  box-shadow: none !important;
  height: 22px;
  line-height: 22px;
  margin-top: 5px;
  justify-content: center;

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const StyledSaveAsTemplateTextBlock = styled.div`
  display: block;
  margin-bottom: 15px;
  font-size: 15px;
`;

export const StyledStoryNameDetails = styled.label`
  color: ${lightInactive};
  border-radius: 8px;
  font-size: 16px;
  margin: 0rem 0.5rem;
  padding: 5px 5px 5px 5px;
  outline: none;
  box-shadow: none !important;
  height: 56px;
`;

export const StyledStoryNameBlock = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const StyledStoryNameSubBlock = styled.div`
  height: 40px;
  margin-top: 20px;
  margin-bottom: 19px;
  width: 200px;

  @media (max-width: ${md}) {
    margin: 24px;
    margin-top: 0px;
    width: auto;
  }
`;

export const StyledCategories = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding-left: 2.5rem;
  padding-right: 2.5rem;
`;

export const StyledAICategories = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding-left: 2.5rem;
  padding-right: 2.5rem;
`;

export const StyledUserOrgsContainer = styled.div`
  max-height: 320px;
  overflow-y: auto;
`;

export const StyledTldrLabel = styled.div`
  height: 14px;
  color: ${lightInactive};
  font-family: Rubik;
  font-size: 12px;
  letter-spacing: 0;
  line-height: 14px;
  text-transform: uppercase;
`;

export const StyledAiResultButton = styled(StyledButton)`
  background: transparent !important;

  :focus {
    background: transparent !important;
  }
`;

export const StyledAiFavoriteButton = styled(StyledButton)`
  background: transparent !important;

  :focus {
    background: transparent !important;
  }
  :hover:enabled {
  }
`;

export const StyledImage = styled.img`
  width: ${(props) => (props.width ? props.width : "36px")};
  height: ${(props) => (props.height ? props.height : "36px")};
  margin-bottom: 15px;
  margin-left: ${(props) => (props.marginLeft ? props.marginLeft : "")};
`;

export const StyledNewProjectCollapsed = styled(Button)`
  &.btn.btn-tprimary {
    height: 42px !important;
  }
  & > svg {
    vertical-align: middle !important;
  }
`;

export const StyledNewProjectButton = styled(Button)`
  width: 100%;
`;

export const StyledVideoModal = styled.div`
  .view-in-action-link {
    color: ${accent};
  }

  /* .view-in-action-video {
    margin-top: Math.max(0, (window.innerHeight - 315) / 2);
  } */

  .modal {
    max-width: calc(100vw - 80px);
    max-height: calc(100vh - 80px);
  }

  .modal-body {
    max-height: calc(100vh - 200px);
    overflow-y: auto;
  }

  .modal-backdrop {
    opacity: 0.5 !important;
  }
`;

export const StyledExpandableNavbarUserInfo = styled.div`
  .container {
    padding: 8px;
  }
  .divider {
    background-color: ${primayColor};
    height: 1px;
  }
`;

export const StyledExpandableNavbar = styled.div`
  background-color: rgba(255, 255, 255, 0.08);
  width: 90%;
  margin-left: 5%;
  margin-right: 5%;
  border-radius: 8px;
  margin-bottom: 10px;

  .container {
    padding: 8px;
  }

  .angle {
    left: 85%;
  }

  .expanded-content-container {
    width: 95%;
    margin-left: 2.5%;
    margin-right: 2.5%;
    border-radius: 4px;
  }

  .item-container {
    padding: 12px 16px;
    font-size: 0.875rem;
  }

  .divider {
    background-color: ${primayColor};
    height: 1px;
  }
`;

export const StyledSidebarFooter = styled.div`
  .divider {
    margin-bottom: 12px !important;
    margin-top: 12px !important;
  }
  .container {
    display: flex;
    flex-direction: column;
  }
  .container:hover {
    color: ${primaryHover};
  }
  .icon-wrapper {
    height: 35px;
    width: 35px;
    background-color: rgba(255, 255, 255, 0.08);
    border-radius: 50%;
    align-self: center;
    align-items: center;
    justify-content: center;
    display: flex;
  }
  .active {
    color: ${primary_00};
  }
  .label {
    padding-top: 10px;
  }
  .label:hover {
    color: ${primaryHover};
  }
`;

export const StyledMFilterPresetCategoriesWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding-left: 1rem;
  padding-right: 1rem;
  justify-content: flex-end;
`;

export const StyledDrawer = styled.div`
  .drawer {
    background-color: #323232 !important;
    height: fit-content;
  }

  .drawer__backdrop {
    display: none:
  }

  .drawer__handle-wrapper {
    background-color: #323232;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  .drawer__handle {
  }

  .drawer__content {
    background-color: #323232;
    max-height: unset !important;
  }
`;

export const StyledAdvancedDrawer = styled.div`
  .drawer {
    background-color: #323232 !important;
    height: 35%;
    display: flex;
    flex-direction: column;
  }

  .drawer__backdrop {
    display: none;
  }

  .drawer__handle-wrapper {
    background-color: #323232;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  .drawer__handle {
  }

  .drawer__content {
    background-color: #323232;
    overflow-y: scroll;
    height: 100%;
    padding: 0px;
    max-height: unset;
  }
`;

export const StyledFullDrawer = styled.div`
  .drawer {
    background-color: #323232 !important;
    height: calc(100% - 122px);
    display: flex;
    flex-direction: column;
    bottom: 61px;
    z-index: 11;
  }

  .drawer__backdrop {
    display: none;
    height: 100%;
  }

  .drawer__handle-wrapper {
    background-color: #323232;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
  }

  .drawer__handle {
  }

  .drawer__content {
    background-color: #323232;
    max-height: unset !important;
    padding: 0px;
  }
`;

export const StyledAdvancedFullDrawer = styled(StyledFullDrawer)`
  .drawer__content {
    height: 100%;
  }
`;

export const BottomDrawerDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${grey};
`;

export const TabbarWrapper = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${studioFooterColor};
  overflow: hidden;

  .cross-btn-container {
    height: 60px;
    width: 60px;
    min-width: 60px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: ${studioFooterColor};
  }

  .cross-btn {
    height: 32px;
    width: 32px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: ${lightInactive};
    border-radius: 16px;
  }
`;

export const StyldedTLDRBadge = styled(Badge)`
  background-color: ${accent};
  color: ${primayColor};
  ${(props) =>
    props.isDisabled &&
    `
  background-color: ${colorDisabled}
  `}
`;
