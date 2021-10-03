import styled from "styled-components";
import {
  secondaryColor,
  primary,
  accentGrey,
  primaryHover,
  greyBlack,
  primaryPrssed,
  lightInactive,
  white,
  colorDisabled,
  studioFooterColor,
  trInputBackground,
  greyDark,
  placeholderColor,
  accent,
  grey,
  blackAlpha12,
} from "../variable";
import { Button, Container, Modal, Nav, Row } from "react-bootstrap";
import { Field } from "formik";
// import { StyledTextEditorActionButton } from "../details/stylesDetails";

export const StyledTextEditorActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: inline-block;
  float: left;
  height: 24px;
  padding: 3px 5px;
  color: ${lightInactive};
  font-size: 1.125rem;
  line-height: 1.375rem;
  font-family: "Rubik" !important;
  width: auto !important;

  :hover:not([disabled]) {
    color: ${primary} !important;
    outline: none !important;
  }

  :focus {
    outline: none !important;
  }

  :disabled {
    color: ${accentGrey};
    cursor: not-allowed;
  }

  &.active {
    color: ${primary};
  }
`;

// Both the left and right sections together:
export const StyledSettingsContent = styled.div`
  width: 100%;
  min-height: calc(100vh - #{$header-height});
  margin-top: $header-height;
  display: flex;
  margin-top: 5px;
`;

// Font awesome left angle :NOT USED YET
export const StyledFontAwesomeLeftAngle = styled.div`
  height: 36px;
  width: 36px;
  display: flex;
  //flex-direction: row;
  //margin-bottom: 500px;
  //margin-left: 42px;
  //margin-right: 600px;

  .svg-inline--fa fa-angle-left fa-w-8 {
    height: 10em;
  }
`;

// 'My Profile' text :
export const StyledSettingsHeading = styled.div`
  height: 57px;
  width: fit-content;
  color: #ffac41;
  top: 65px;
  font-family: Rubik;
  font-size: 48px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 57px;
  margin-top: 100px;
  margin-left: 44px;
  margin-bottom: 5px;
  .svg-inline--fa {
    margin-right: 10px;
  }

  .home-link {
    color: #ffac41;
  }
`;

/* export const StyledSettingsContent = styled.div`
  width: 1098px;
  height: 906px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${secondaryColor};
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.5);
  border-radius: 0.5rem;
  padding: 0.5rem;
`;
 */
export const StyledContentPicMenu = styled.div`
  width: 350px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${secondaryColor};
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.5);
  margin-left: 44px;
  margin-right: 24px;
  margin-top: 15px;
  padding: 0.5rem;

  .content-pic-menu {
    width: 350px;
    height: 290px;
    border-radius: 4px 4px 0 0;
    margin-left: 7px;
  }
`;

// Entire 'Basics' section on the right
export const StyledContentBasics = styled.div`
  width: 700px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${secondaryColor};
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.5);
  margin-left: 110px;
  margin-top: 15px;
  padding: 0.5rem;
  border-radius: 4px;
  .styled-tab-content {
    width: 700px;
    height: fit-content;
  }
`;

// Not user right now
export const StyledContentPic = styled.div`
  width: 350px;
  height: fit-content; //290px;
  border-radius: 4px 4px 0 0;
`;

// FirstName LastName
export const StyledPicName = styled.div`
  //height: 27px;
  width: 300px;
  color: ${lightInactive};
  font-family: Rubik;
  font-size: 22px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 27px;
  //margin-top: 25px;
  margin-left: 10px;
  padding: 15px;
`;

export const StyledAccountName = styled.label`
  color: #9ea0a5;
  font-family: Rubik;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 17px;
  margin-left: 16px;
  //margin-right: 235px;
  margin-top: 8px;
  padding: 8px;
`;

export const StyledDivider = styled.hr`
  height: 1px;
  width: 350px;
  opacity: 0.5;
  background-color: #eaedf3;
`;

// Commented out for now
export const StyledContentBase = styled.div`
  border-radius: 4px;
  background-color: #323232;
`;

/* 'Your Profile', 'Change Password', 'Manage Team' section names on the left */
export const StyledContentMenuOptions = styled.label`
  height: 22px;
  width: 200px;
  //color: #6b6c6f;
  font-family: Rubik;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 22px;
  margin-top: 5px;
  margin-bottom: 5px;
  margin-left: 15px;
`;

// 'Your Profile'/ 'Change Password' / 'Manage Team' sections on right
// margin-bottom: 96px;
export const StyledSubSectionsOnRight = styled.div`
  height: fit-content;
  width: 660px;
  margin: auto;

  .tldr-settings {
    color: ${lightInactive};
  }

  .fill {
    border-radius: 8px;
    background-color: #ffac41;
  }

  .fill-text {
    height: 36px;
    width: fit-content;
    color: #1e1e1e;
    font-family: Rubik;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.13px;
    margin-left: 455px;
  }

  .variant {
    margin-top: 15px;
    margin-bottom: 15px;
    border-radius: 8px;
    color: #ffac41;
  }
`;

export const StyledSettingsBaseDiv = styled.div`
  ${"" /* margin-top: 100px; */}
`;

export const StyledSectionDivider = styled.div`
  padding: 20px;
`;

export const StyledModalButtons = styled(Button)`
  background-color: #ffac41;
  border-color: #ffac41;
  color: black;
  margin-top: 18px;
  margin-bottom: 18px;

  /* .fill {
    margin-top: 15px;
    margin-bottom: 15px;
    border-radius: 8px;
    background-color: #ffac41;
  }

  .fill-text {
    height: 36px;
    width: fit-content;
    color: #1e1e1e;
    font-family: Rubik;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.13px;
    margin-left: 16px;
  }

  .variant {
    margin-top: 15px;
    margin-bottom: 15px;
    border-radius: 8px;
    color: #ffac41;
  } 

  .btn-outline-warning {
    border-color: #ffac41;
    color: #ffac41;
    margin-left: 16px;
  }

  .btn-warning:disabled {
    background-color: #ffac41;
    border-color: #ffac41;
    color: black;
    margin-left: 16px;
  }

  .btn-warning {
    background-color: #ffac41;
    border-color: #ffac41;
    color: black;
    margin-left: 16px;
  }*/
`;

export const StyledOutlineWarningButton = styled(Button)`
  margin-left: 10px;
  .btn-outline-warning {
  }
`;

// 'Basics'
export const StyledBasicsTitle = styled.label`
  height: 22px;
  width: 200px;
  color: ${lightInactive};
  font-family: Rubik;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 22px;
  margin-right: 635px;
  margin-left: 20px;
  margin-top: 24px;
  margin-bottom: 10px;
`;

export const StyledBasicsDivider = styled.hr`
  height: 1px;
  width: 700px;
  opacity: 0.5;
  background-color: #eaedf3;
`;

export const StyledBasicsSectionDivider = styled.hr`
  height: 1px;
  width: 660px;
  opacity: 0.5;
  background-color: #eaedf3;
`;

// 'Your Details'
export const StyledContentMenuSubtitle = styled.p`
  height: 14px;
  width: 85px;
  color: #9ea0a5;
  font-family: Rubik;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 14px;
  margin-left: 44px;
  margin-right: 235px;
  margin-top: 20px;
`;

// For 'FIRST NAME' , 'LAST NAME' , 'EMAIL ADDRESS', 'USERNAME', etc on the right side sections
export const StyledBasicsSectionLabels = styled.label`
  height: 17px;
  width: 150px;
  color: #9ea0a5;
  font-family: Rubik;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 17px;
`;

// Show Team Members - Data Table:
export const StyledDataTable = styled.div`
  display: inline-block;
  width: 100%;
  .rdt_TableBody {
    .fill {
      border-radius: 8px;
      background-color: #ffac41;
      margin-top: 0px;
      margin-bottom: 0px;
    }

    .fill-text {
      height: 36px;
      width: fit-content;
      color: #1e1e1e;
      font-family: Rubik;
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 0.13px;
      margin-right: 5px;
    }
  }
}
`;

export const StyledTitlesInRightSection = styled.label`
  height: 22px;
  width: 300px;
  color: ${lightInactive};
  font-family: Rubik;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: 0;
  line-height: 22px;
  margin-right: 635px;
  margin-top: 10px;
  margin-bottom: 10px;
`;

export const StyledModal = styled(Modal)`
  .modal-hr{
    margin-top: 0.2rem,
    margin-bottom: 0.2rem
  }
`;

export const StyledFormField = styled(Field)`
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
    color: ${lightInactive};
    font-size: 1rem;
    letter-spacing: 0.08px;
    line-height: 28px;
  }

  &::-ms-input-placeholder {
    background-color: ${trInputBackground} !important;
    color: ${lightInactive};
    font-size: 1rem;
    letter-spacing: 0.08px;
    line-height: 28px;
  }

  .input {
    background-color: ${trInputBackground} !important;
    color: ${lightInactive} !important;
    outline: none;
  }

  :focus {
    color: ${lightInactive};
    background-color: ${trInputBackground} !important;
  }
  :hover {
    border: 2px ${primary} solid !important;
  }
`;

export const StyledFormTextField = styled(StyledFormField)`
  padding: 1rem;
  height: 96px;
  width: 100%;
`;

export const StyledFormCheckboxField = styled(StyledFormField)`
  height: 15px;
  width: 15px;
`;

export const StyledFormRows = styled.div`
  display: flex;
  flex-direction: row;
`;

export const StyledFormColumns = styled.div`
  display: flex;
  flex-direction: column;

  .extra-member-subscription-warning {
    font-size: 14px;
    color: ${lightInactive};
    margin-top: 0.5rem;
  }
`;

export const StyledFormModalButtons = styled.button`
  background-color: #ffac41;
  border-color: #ffac41;
  color: black;
  margin-left: 16px;
  margin-bottom: 18px;

  /* .fill {
    margin-top: 15px;
    margin-bottom: 15px;
    border-radius: 8px;
    background-color: #ffac41;
  }

  .fill-text {
    height: 36px;
    width: fit-content;
    color: #1e1e1e;
    font-family: Rubik;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.13px;
    margin-left: 16px;
  }

  .variant {
    margin-top: 15px;
    margin-bottom: 15px;
    border-radius: 8px;
    color: #ffac41;
  } 

  .btn-outline-warning {
    border-color: #ffac41;
    color: #ffac41;
    margin-left: 16px;
  }

  .btn-warning:disabled {
    background-color: #ffac41;
    border-color: #ffac41;
    color: black;
    margin-left: 16px;
  }

  .btn-warning {
    background-color: #ffac41;
    border-color: #ffac41;
    color: black;
    margin-left: 16px;
  }*/
`;

export const StyledBrandKitContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledBrandKitNameRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 1rem 0rem 1rem 0rem;
  height: 36px;
`;

export const StyledBrandKitColorsAndFontsRow = styled.div`
  :after {
    content: "";
    display: table;
    clear: both;
  }
`;

export const StyledBrandKitColumn = styled.div`
  float: left;
  width: 100%;
`;

export const StyledBrandKitPaletteContainer = styled.div`
  background-color: ${secondaryColor};
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 60px));
  grid-gap: 0.75rem;
  margin: 0rem 0rem 0.25rem 0rem;
  border-radius: 8px;
  padding: 0.75rem;
  width: 100%;
  justify-content: space-evenly;
`;

export const StyledPaletteColorRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  .color-container {
    height: 60px;
    width: 60px;
    border-radius: 8px;
    ${(props) => `background-color: ${props.color}`};
    position: relative;

    :hover {
      cursor: pointer;
    }

    .delete-color-container {
      height: 20px;
      width: 20px;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      background-color: #c4c4c4;
      border: 2px solid black;
      align-items: center;
      justify-content: center;
      position: absolute;
      top: -5px;
      right: -5px;

      svg {
        font-size: 12px;

        path {
          fill: black;
        }
      }
    }
  }
`;

export const StyledBrandKitLogosGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  grid-auto-rows: minmax(150px, auto);
  grid-gap: 1em;
  margin-bottom: 2rem;

  .add-logos-container {
    height: 100%;
    width: 100%;
    border-radius: 8px;
    border: 2px dotted ${grey};
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .thumbnail {
    height: 100%;
    width: 100%;
    border: 4px transparent solid;
    position: relative;

    .placeholder {
      height: 100%;
      width: 100%;

      img {
        object-fit: scale-down;
        height: 100%;
        width: 100%;
      }
    }

    :hover {
      border-radius: 8px;
      border: 4px ${primary} solid;

      box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);
      -webkit-box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);
      -moz-box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);

      img {
        opacity: 0.4;
      }
    }

    .actions {
      width: min-content;
      position: absolute;
      top: 5px;
      right: 8px;

      svg {
        cursor: pointer;
        color: ${primary};
      }
    }
  }
`;

export const StyledBrandKitLogoInfoRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const StyledPaletteColorBox = styled.div`
  height: 30px;
  width: 30px;
  border: 2px solid ${lightInactive};
  border-radius: 4px;
`;

export const StyledColorPickerButtonSettings = styled(
  StyledTextEditorActionButton
)`
  width: ${(props) =>
    props.showColorCode
      ? "auto"
      : props.showValue
      ? "68px"
      : props.onlyInput
      ? "135px"
      : "32px"} !important;
  height: 32px !important;
  border: 1px solid ${accentGrey} !important;
  border-radius: 0px 4px 4px 0px;
`;

export const StyledColorPickerIconButtonSettings = styled(
  StyledTextEditorActionButton
)`
  width: ${(props) =>
    props.showColorCode
      ? "auto"
      : props.showValue
      ? "68px"
      : props.onlyInput
      ? "135px"
      : "32px"} !important;
  height: 32px !important;
  border: 1px solid ${accentGrey} !important;
  border-radius: ${(props) =>
    props.divType === "input" ? "0px" : "4px 0px 0px 4px"};
`;

export const StyledBrandKitAddColorButton = styled(Button)`
  background: none;
  border: 2px dotted ${grey};
  cursor: pointer;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  height: 60px;
  width: 60px;
  position: relative;

  :hover:enabled {
    background: transparent !important;
    color: ${(props) =>
      props.tldrbtn === "primary"
        ? `${greyBlack}`
        : props.tldrbtn === "secondary"
        ? `${primaryHover}`
        : lightInactive};
    border: 2px dotted ${accent};
  }

  :hover:not([disabled]) {
    color: ${primary} !important;
    outline: none !important;
  }

  :focus {
    background: transparent !important;
    color: ${(props) =>
      props.tldrbtn === "primary"
        ? greyBlack
        : props.tldrbtn === "secondary"
        ? primaryPrssed
        : lightInactive};
    outline: none;
    box-shadow: none !important;
    border: 2px dotted ${grey};
  }

  :disabled {
    color: ${accentGrey};
    cursor: not-allowed;
  }

  &.active {
    color: ${primary};
  }
`;

export const StyledCurrentPlanWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  justify-content: space-between;

  .content-div {
    width: 75%;
  }

  .current-plan-buttons-column {
    display: flex;
    flex-direction: column;

    .buttons {
      min-width: 150px;
    }

    .payment-setup-button {
      background-color: ${primary} !important;
      color: ${greyBlack};
    }
  }
`;

export const StyledCurrentPlanContainer = styled(Container)`
  padding-left: unset !important;
  padding-right: unset !important;

  .current-plan-headings,
  .payment-history-info-row {
    text-transform: uppercase;
    font-family: Rubik;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0;
    line-height: 17px;
    color: #9ea0a5;

    svg {
      font-size: 14px;
      margin-left: 0.5rem;
      cursor: pointer;

      path {
        fill: #9ea0a5;
      }
    }
  }

  .payment-history-info {
    background-color: ${greyDark};
    padding: 1rem 1rem;
    margin-bottom: 0.25rem;
    font-weight: lighter;
    font-size: 18px;
    color: ${white};

    &.invoice-download-button {
      color: #ffad00;
      font-size: 14px;

      :hover {
        cursor: pointer;
      }
    }
  }

  .current-plan-title {
    font-size: 24px;
    font-weight: 500;
  }

  .current-plan-price-column {
    display: flex;
    flex-direction: column;

    p {
      margin-bottom: unset !important;
    }

    .current-plan-price-title {
      font-size: 24px;
      color: #85de55;
    }

    .current-plan-price-subtitle {
      color: #9ea0a5;
      font-size: 13px;

      &.trial-ended-warning {
        color: #c84b4b;
        text-transform: unset;
        margin-bottom: unset !important;
      }

      &.cancel-subscription-button {
        color: #c84b4b;
        text-transform: unset;

        :hover {
          cursor: pointer;
        }
      }
    }
  }
`;

export const StyledAllAvailablePlansContainer = styled.div`
  height: 100%;
  width: 100%;
  padding: 15px 20px 15px 20px;
`;

export const StyledAllPlansComponent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2.5rem;
  padding-top: 0.5rem;

  .payment-type-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    width: 70%;
    margin: 0rem 0rem 2rem 0rem;
    background-color: ${greyDark};
    border-radius: 8px;
    padding: 16px;

    .subscription-free-period-info {
      color: ${white} !important;
    }

    .additional-members-container {
      display: flex;
      flex-direction: row;
      align-items: center;
      color: ${white};
    }

    .plan-billing-cycle-type-container {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    .input-options-text {
      color: ${placeholderColor};
      font-family: Rubik;
      font-size: 16px;
      letter-spacing: 0;
      line-height: 14px;
      margin: 0rem 0.75rem;
      opacity: 0.6;

      span {
        color: ${accent};
      }

      &.active {
        color: ${white};
        opacity: 1;
      }
    }
  }

  .trial-ended-warning {
    margin-top: 0.25rem !important;
    margin-bottom: 1.75rem !important;
    color: #c84b4b;
    text-transform: unset;
  }

  .section {
    width: 90%;
    display: flex;
    flex-direction: column;

    .row {
      margin: 0px;
      display: flex;
      justify-content: center;
    }
  }
`;

export const StyledSubscriptionPlanCard = styled.div`
  &.card {
    color: ${lightInactive};
    border-radius: 8px;
    background-color: #323232;
    margin-right: 8px;
    margin-left: 8px;
    padding: 20px;
    align-items: center;
    max-width: 25%;
    border: transparent 2px solid;

    &.active {
      border: ${primary} 2px solid;
    }

    .title {
      ${(props) => `color: ${props.planColor}`};
      font-size: 24px;
      font-weight: 500;
    }

    .plan-context {
      height: 25px;
      max-height: 25px;
    }

    .plan-additional-feature {
      height: 50px;
      max-height: 50px;
      margin-bottom: unset !important;
      font-weight: 500;
      font-size: 18px;
    }

    .price-title {
      font-size: 46px;
      height: 90px;
      max-height: 90px;
      ${(props) => `color: ${props.planColor}`};
    }

    p {
      font-size: 14px;
      text-align: center;
      color: ${lightInactive};
    }

    .plan-features-list {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      height: 100%;
      width: 100%;
    }

    .feature-unordered-list {
      width: 98%;
      padding-top: 1rem;
      padding-left: 16px !important;
      margin-bottom: unset !important;

      li {
        margin-bottom: 0.5rem;
        list-style: none;
        position: relative;
        padding: 0 0 0 25px;

        &::before {
          content: "★";
          font-size: 16px;
          position: absolute;
          left: 0;
          top: 0px;
          ${(props) => `color: ${props.planColor}`};
        }
      }
    }

    .subscription-plan-footer {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;

      p {
        margin-bottom: 0.25rem !important;
      }
    }

    .current-plan-text {
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 90%;
    }

    .upgrade-plan-button {
      width: 90%;
      height: 45px;
      background-color: transparent !important;
      border: ${primary} 2px solid;
      color: ${primary} !important;

      &.disabled {
        opacity: 0.6;
        cursor: unset !important;
      }

      &.enabled:hover {
        background-color: ${primary} !important;
        color: ${greyBlack} !important;
      }
    }
  }
`;

export const StyledBrandkitSectionLabels = styled.div`
  border-bottom: 1px solid ${lightInactive};
  margin-bottom: 1.25rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  label {
    height: 17px;
    width: 150px;
    color: ${lightInactive};
    font-family: Rubik;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 0;
    line-height: 17px;
    text-transform: capitalize;
  }

  .add-logos,
  .add-fonts {
    border-radius: 50%;
    border: 2px solid ${lightInactive};
    height: 20px;
    width: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 10px;
    margin-bottom: 0.5rem;

    :hover {
      cursor: pointer;
    }

    svg {
      font-size: 12px;

      path {
        fill: ${lightInactive};
      }
    }
  }
`;

export const StyledNavRow = styled(Row)`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

export const StyledNavSettingsRow = styled(StyledNavRow)`
  justify-content: flex-start;
  padding-left: 35px;
  background-color: ${studioFooterColor};
`;

export const StyledSettingsTabNav = styled(Nav.Link)`
  border-bottom: ${(props) =>
    props.tldrbtn === "primary" ? "3px solid " + primary : ""};
  font-weight: 500;
  color: ${(props) =>
    props.tldrbtn === "primary"
      ? primary
      : props.tldrbtn === "secondary"
      ? primary
      : lightInactive};
  text-transform: capitalize;

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
  margin-top: 16px;
  margin-right: 0.5rem;
  text-align: center;
`;
