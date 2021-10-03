import styled from "styled-components";
import {
  greyDark,
  primaryHover,
  primaryPrssed,
  primary,
  greyBlack,
  blackAlpha12,
  blackAlpha24,
  blackAlpha32,
  colorDisabled,
  grey,
  accentGrey,
  placeholderColor,
  accentLight,
  lightInactive,
  primayColor,
  secondaryColor,
  white,
  advancedPanelSliderWidth,
  sidebarItemDetailSliderWidth,
  studioFooterColor,
  accent,
} from "../variable";
import { Row, Tab, Nav, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TO_OPEN_SLIDER } from "../../../_reducers/sidebarSliderReducer";
import { DASHBOARD_BANNER } from "../../../_utils/constants";

export const StyledAddFontAwesomeIcon = styled(FontAwesomeIcon)`
  text-align: center;
  width: 100%;
`;

export const StyledDropdown = styled.div`
  display: flex;
  width: 255px;
  height: 43px;

  .photo {
    text-align: center;
    border-radius: 50%;
    width: 43px;
    height: 43px;
    background: ${grey};
    color: ${greyBlack};
    top: 50%;
  }

  .userinfo {
    width: 177px;
    color: ${grey};

    .name {
      text-overflow: ellipsis;
      font-family: "Rubik";
      font-weight: 700;
      font-size: 16px;
      line-height: 19px;
      overflow: hidden;
      white-space: nowrap;
    }

    .company {
    }
  }
`;

export const StyledTldrTabContainer = styled(Tab.Container)`
  color: ${lightInactive};
  margin-top: 2rem;

  .tab-pane {
    height: 100%;
  }
`;

export const StyledTldrTabPane = styled(Tab.Pane)`
  margin-top: 1.5rem !important;

  @media (max-width: 768px) {
    margin-top: unset !important;
  }
`;

export const StyledTldrTab = styled(Nav.Link)`
  background: ${(props) =>
    props.tldrbtn === "primary"
      ? primary
      : props.tldrbtn === "secondary"
      ? greyBlack
      : blackAlpha12} !important;
  font-size: 16px;
  font-weight: 500;
  color: ${(props) =>
    props.tldrbtn === "primary"
      ? greyBlack
      : props.tldrbtn === "secondary"
      ? primary
      : lightInactive};
  border: ${(props) =>
    props.tldrbtn === "secondary" ? "2px solid" + primary : "0px solid"};
  border-radius: 18px;

  :hover {
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

export const StyledTldrNav = styled(Nav)`
  justify-content: center;
  line-height: 1;
`;

export const StyledMarketplaceContent = styled.div`
  color: ${lightInactive};
  padding: unset;
  height: auto;
  height: 100%;

  .search-bar-row {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 1rem;
  }

  .templates-view-all-headings {
    display: flex;
    flex-direction: row;
    align-items: center;

    .headings-container {
      width: 100%;
      z-index: 0;

      .title {
        font-size: 32px;
        margin-bottom: 8px;
      }
    }
  }

  .start-from-scratch-hero-container {
    width: 96%;
    margin: 0rem auto;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }

  .dashboard-my-assets-dropzone {
    margin: 1.5rem auto 0rem auto;
    width: 95%;
  }
`;

export const StyledMarketPlaceHeader = styled(Row)`
  font-size: 20px;
  font-weight: bold;
  line-height: 28px;
  justify-content: center;

  &.marketplace-template-header,
  &.marketplace-view-all-template-header {
    justify-content: flex-start;
  }

  &.marketplace-templates-search-result-header {
    justify-content: flex-start;
    font-size: 28px;
  }
`;

export const StyledMarketplaceFrames = styled(Row)`
  justify-content: center;
  align-items: flex-end;
`;

export const StyledMarketplaceFrame = styled.div`
  justify-content: center;
  margin-right: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

export const StyledMarketplaceFrameContent = styled.div`
  box-sizing: border-box;
  width: ${(props) =>
    props.varient === "story"
      ? "54px"
      : props.varient === "cover"
      ? "82px"
      : props.varient === "post"
      ? "54px"
      : props.varient === "ad"
      ? "60px"
      : props.varient === "app_ad"
      ? "81px"
      : "54px"};
  height: ${(props) =>
    props.varient === "story"
      ? "96px"
      : props.varient === "cover"
      ? "31px"
      : props.varient === "post"
      ? "54px"
      : props.varient === "ad"
      ? "32px"
      : props.varient === "app_ad"
      ? "45px"
      : "74px"};

  border: 3px solid #323232;
  border-radius: 4px;
  background-color: rgba(50, 50, 50, 0.3);
  align-items: center;
  justify-content: center;
  display: flex;
  color: #323232;

  :hover {
    color: ${primaryHover};
    border: 3px solid ${primaryHover};
  }

  &.active {
    color: ${primary};
    border: 3px solid ${primary};
  }
`;

export const StyledMarketplaceOptionContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const StyledMarketplaceDimentionContainer = styled.div`
  margin-left: 10px;
`;

export const StyledMarketplaceFooter = styled.div`
  background-color: #323232;
  border-radius: 0 0 4px 4px;
  width: 100%;
  height: 63px;
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  justify-content: center;
`;

export const StyledMarketplaceFrameTitle = styled.div`
  font-size: 14px;
  letter-spacing: 0;
  line-height: 19px;
  text-align: left;
`;

export const StyledMarketplaceProjectFormatTitle = styled(
  StyledMarketplaceFrameTitle
)`
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &.marketplace-template-formats-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const StyledMarketplaceFrameSubtitle = styled.div`
  font-size: 12px;
  letter-spacing: 0;
  margin: 0;
  color: ${grey};
`;

export const StyledMarketplaceFrameDescription = styled.div`
  color: #bfbfbf;
  font-size: 12px;
  text-align: left;
  line-height: 14px;

  &.marketplace-template-formats-description {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const StyledMarketplaceFrameRectangle = styled(
  StyledMarketplaceFrameContent
)`
  height: 61px;
  width: 51px;
`;

export const StyledMarketplaceFramePost = styled(StyledMarketplaceFrameContent)`
  height: 51px;
  width: 51px;
`;

export const StyledMarketplaceFrameCover = styled(
  StyledMarketplaceFrameContent
)`
  height: 51px;
  width: 131px;
`;

export const StyledMarketplaceFramePresentation = styled(
  StyledMarketplaceFrameContent
)`
  height: 71px;
  width: 97.45px;
`;

export const StyledMarketplaceFrameAd = styled(StyledMarketplaceFrameContent)`
  height: 51px;
  width: 51px;
`;

export const StyledMarketplaceFrameBanner = styled(
  StyledMarketplaceFrameContent
)`
  height: 31px;
  width: 91px;
`;

export const StyledMarkerplaceCategories = styled(Row)`
  justify-content: center;
`;

export const StyledMarkerplaceSearch = styled(Row)`
  ${(props) =>
    props.width &&
    `
    width: ${props.width};
  `}
  ${(props) =>
    props.height &&
    `
    height: ${props.height};
  `}
  max-width: 700px;
  justify-content: center;

  .search-box {
    width: ${(props) => props.width};
    ${(props) =>
      props.showshadow
        ? `
      box-shadow: 0px 8px 16px 0px rgb(0 0 0 / 50%);
      -webkit-box-shadow: 0px 8px 16px 0px rgb(0 0 0 / 50%);
      -moz-box-shadow: 0px 8px 16px 0px rgb(0 0 0 / 50%);
    `
        : ``};
    border-radius: 8px;
  }

  .input-group-text {
    color: ${accentGrey};
    border-radius: 8px;
    background-color: ${(props) =>
      props.location === "dashboard"
        ? `${secondaryColor}`
        : props.location === "studio"
        ? `${primayColor}`
        : `${primayColor}`};
    border: 0px;

    svg {
      path {
        fill: ${lightInactive};
      }

      :hover {
        cursor: pointer;
      }
    }
  }

  .form-control {
    border: 0px;
    height: ${(props) =>
      props.size === "sm"
        ? "36px"
        : props.size === "lg"
        ? "40px"
        : props.size === "xl"
        ? "48px"
        : "36px"};
    border-radius: 8px;
    background-color: ${(props) =>
      props.location === "dashboard"
        ? `${secondaryColor}`
        : props.location === "studio"
        ? `${primayColor}`
        : `${primayColor}`};
    color: ${lightInactive};

    ::placeholder {
      color: ${grey};
    }
  }

  &.template-search__search-bar {
    height: 100%;
    max-width: 100% !important;
  }
`;

export const StyledMarkerplaceSearchBox = styled.div`
  justify-content: center;
  height: 36px;
  width: 640px;
  border-radius: 8px;
  background-color: ${blackAlpha12};
`;

export const StyledMarketPlaceGallery = styled(Row)`
  margin: auto;
  padding: 2.5rem;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 357px);
  position: relative;
  flex-wrap: nowrap;

  @media (max-width: 768px) {
    padding: 1rem;
  }

  .view-all-header {
    text-align: center;
    font-size: 36px;
    font-weight: 600;
    text-transform: capitalize;
  }

  .marketplace-templates-no-content-container {
    height: 20%;
    width: 100%;
    position: absolute;
    top: 115%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

export const StyledMarketPlacePresetsGallery = styled(Row)`
  margin: 2.5rem;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 357px);
  position: relative;
  flex-wrap: nowrap;

  @media (max-width: 768px) {
    margin: 1rem;
  }
`;

export const StyledMarketplaceHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 12px 0px;

  .header {
    color: ${lightInactive};
    font-size: 18px;
    font-weight: 500;
    letter-spacing: 0;
    text-transform: capitalize;
  }

  .view-all {
    cursor: pointer;
    font-size: 14px;
    color: ${lightInactive};
  }
`;

export const StyledMarketplaceViewAllHeader = styled(StyledMarketplaceHeader)`
  flex-direction: column;
  align-items: flex-start;
  width: fit-content;
  grid-row-start: 1;
  grid-row-end: 2;
  grid-column-start: 1;
  grid-column-end: -1;
  margin-bottom: -30px;

  .view-all {
    cursor: pointer;
    font-size: 16px;
    display: flex;
    align-items: center;

    svg {
      margin-left: unset;
      margin-right: 0.5rem;
      font-size: 16px;

      path {
        fill: ${lightInactive};
      }
    }
  }
`;

export const StyledMarkerplaceCollection = styled.div`
  display: flex;
  max-width: 100%;
`;

export const StyledMarkerplaceCard = styled.div`
  display: flex;
  flex-direction: column;

  height: auto;

  .template-marketplace-empty-container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #232323;
    border-radius: 8px;
    color: ${lightInactive};
    border: 3px solid transparent;
    transition: 0.3s transform cubic-bezier(0.155, 1.105, 0.295, 1.12),
      0.3s box-shadow,
      0.3s -webkit-transform cubic-bezier(0.155, 1.105, 0.295, 1.12);

    .icon-container {
      width: 40px;
      height: 40px;
      background-color: rgba(255, 255, 255, 0.08);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    span {
      text-align: center;
      font-size: 16px;
      margin-top: 0.5rem;
    }

    svg {
      font-size: 18px;
    }

    :hover {
      cursor: pointer;
      transform: scale(1.01);
      box-shadow: 0px 0px 40px #000000;
      -webkit-box-shadow: 0px 0px 40px #000000;
      -moz-box-shadow: 0px 0px 40px #000000;
    }
  }
`;

export const StyledAssetsCard = styled.div`
  display: flex;
  flex-direction: column;
  border: 3px solid #323232;
  border-radius: 8px;
  background-color: #232323;
  padding: 12px;
  position: relative;

  &:hover {
    cursor: pointer;
    border: 3px #ffac41 solid;
    box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);
    -webkit-box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);
    -moz-box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);

    .content-details {
      opacity: 1;
      left: 0;
      right: 0;
    }
  }

  .content-details {
    left: 0;
    right: 0;
  }

  .holder {
    height: ${(props) => (props.autoHeight ? "auto" : "194px")};
    ${({ autoHeight }) => autoHeight && `min-height: 194px;`}
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;

    .thumbnail {
      height: 100%;
      width: inherit;

      img {
        opacity: 1;
        width: 100%;
        height: 100%;
        border-radius: 8px;
        object-fit: contain;
      }
    }

    .thumbnail:hover {
      border-radius: 8px;

      img {
        opacity: 0.4 !important;
      }
    }

    .actions {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }

  .title-content {
    z-index: 1;

    .edit-icon {
      margin-left: 6px;
      cursor: pointer;
    }

    input {
      background-color: #232323;
      outline: none;
      border: 0;
      border-bottom: 2px solid #323232;
    }

    .title {
      color: ${lightInactive};
      font-size: 14px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  .date {
    color: #888888;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

export const HomeTitleRow = styled.div`
  padding: 0 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0rem;
  min-height: 36px;

  @media (max-width: 768px) {
    padding: 0 1rem;
    gap: 1.5rem;
  }

  .search-icon {
    cursor: pointer;
    margin-left: 12px;
  }

  .create-folder-icon {
    margin-right: 12px;
    cursor: pointer;
  }

  h4 {
    color: ${lightInactive};
    font-size: 16px;
    letter-spacing: 0;
    line-height: 19px;
    font-weight: 500;
    margin-bottom: 0px;
  }

  .title {
    font-size: 20px;
    font-weight: bold;
    -webkit-letter-spacing: 0;
    -moz-letter-spacing: 0;
    -ms-letter-spacing: 0;
    letter-spacing: 0;
    line-height: 24px;
  }

  .breadcrumbs-items {
    display: flex;

    h4 {
      cursor: pointer;
      color: ${accentLight};

      &:hover {
        text-decoration: underline;
      }

      &:not(:first-child):before {
        content: "";
        display: inline-block;
        width: 0.4em;
        height: 0.4em;
        border-right: 0.2em solid ${lightInactive};
        border-top: 0.2em solid ${lightInactive};
        transform: rotate(45deg);
        margin-right: 0.5em;
        margin-left: 0.5em;
        margin-bottom: 0.2em;
      }

      &:last-child {
        cursor: unset;
        color: lightgrey;

        &:hover {
          text-decoration: none;
        }
      }
    }
  }
`;

export const HomeSelectionRow = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 0rem;
  min-height: 62px;
  background-color: #323232;
  margin-top: ${(props) => (props.marginTop ? props.marginTop : "-1.5rem")};
  padding: 0 3.5rem;
  position: sticky;
  top: 55px;
  z-index: 100;
  box-shadow: 0 8px 16px 0 rgb(0 0 0 / 50%);

  .count {
    margin-right: 14px;
  }

  .action-items {
    display: flex;
    align-items: center;

    & > div,
    & > svg {
      cursor: pointer;
      margin-right: 20px;
      margin-left: 20px;
    }

    svg {
      font-size: 18px;
    }
  }
`;

export const QuickStartComponent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2.5rem;
  padding-top: 0.5rem;

  @media (max-width: 768px) {
    padding: 1rem;
    margin-top: unset;
    border-top-left-radius: 1.5rem;
    border-top-right-radius: 1.5rem;
    background-color: #1e1e1e;
    margin-top: -1.5rem !important;
  }

  .section {
    width: 100%;
    display: flex;
    flex-direction: column;

    h3 {
      color: ${lightInactive};
      font-family: Rubik;
      font-size: 20px;
      font-weight: bold;
      letter-spacing: 0;
      line-height: 24px;
      margin-bottom: 16px;
    }

    .view-all {
      text-decoration: underline;
      margin-right: 8px;
      cursor: pointer;
    }

    .view-all-icon {
      cursor: pointer;
    }

    .recent-items {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(296px, 1fr));
      grid-gap: 40px 10px;
      grid-auto-rows: minmax(280px, 280px);
    }

    .row {
      margin: 0px;

      .card {
        color: ${lightInactive};
        border: 3px solid #323232;
        border-radius: 8px;
        background-color: transparent;
        margin-right: 8px;
        margin-left: 8px;
        padding: 20px;
        align-items: center;

        &:first-child {
          margin-left: 0px;
        }

        // &:hover {
        //   border: 3px #ffac41 solid;
        //   box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);
        //   -webkit-box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);
        //   -moz-box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);

        //   .content-details {
        //     opacity: 1;
        //     left: 0;
        //     right: 0;
        //   }
        // }

        .action-button-holder {
          display: flex;
          width: 100%;
          justify-content: space-around;
          align-items: center;
          margin-bottom: 28px;
          flex-wrap: wrap;

          .action-button {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .icon-holder {
              height: 80px;
              width: 80px;
              border-radius: 40px;
              background-color: rgba(255, 255, 255, 0.12);
              display: flex;
              justify-content: center;
              align-items: center;
              margin-bottom: 16px;
              cursor: pointer;
            }

            .title {
              color: #ffac41;
              font-size: 20px;
              letter-spacing: 0;
              line-height: 24px;
              text-align: center;
              cursor: pointer;
            }
          }
        }

        .title {
          font-weight: bold;
          font-size: 20px;
          text-align: center;
        }

        .description {
          font-size: 14px;
          letter-spacing: 0;
          line-height: 17px;
          text-align: center;
        }

        button {
          color: ${lightInactive};

          svg {
            margin-right: 8px;
          }
        }
      }
    }
  }
`;

export const CheckboxComponent = styled.div`
  ${({ hasAbsolutePosition }) => hasAbsolutePosition && "position: absolute"};
  cursor: pointer;
  top: -6px;
  left: -9px;
  z-index: 99;
  background: #232323;
  border-radius: 50%;
`;

export const MoveFolderSlide = styled.div`
  display: flex;
  flex-direction: column;
  height: 250px;
  overflow: auto;

  .move-folder-item {
    cursor: pointer;
    padding: 6px 6px;
    border-radius: 4px;
    margin: 2px 0px;
    display: flex;
    align-items: center;

    .arrow {
      margin-right: 12px;
    }

    &.selected {
      background: ${accentLight};
      color: black;
    }

    .name {
      font-size: 16px;
      letter-spacing: 0.08px;
      flex-grow: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .no-folders-content {
    width: fit-content;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
`;

export const FolderComponent = styled.div`
  cursor: pointer;
  width: 230px;
  padding: 10px 20px;
  border: 3px solid #323232;
  border-radius: 24px;
  background-color: #232323;
  display: flex;
  align-items: center;

  &:hover {
    cursor: pointer;
    border: 3px #ffac41 solid;
    box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);
    -webkit-box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);
    -moz-box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);
  }

  .name {
    font-size: 16px;
    letter-spacing: 0.08px;
    margin: 0px 12px;
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .count {
    background: #323232;
    border-radius: 50%;
    font-weight: 500;
    align-items: center;
  }

  .dropdown {
    .dropdown-menu {
      box-shadow: rgba(0, 0, 0, 0.5) 0px 8px 16px 0px;
      background: #323232;

      .dropdown-item {
        color: ${lightInactive};

        &:hover {
          background-color: #454649;
        }
      }
    }
  }
`;

export const ModalInputField = styled.input`
  background-color: ${greyDark};
  border: 1px ${lightInactive} solid !important;
  color: ${lightInactive};
  height: 40px;
  flex-grow: 1;
  border-radius: 4px;
  padding-left: 1rem;
  width: 100%;

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

export const FoldersPanelComponent = styled.div`
  flex-wrap: wrap;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  grid-gap: 15px 30px;
  grid-auto-rows: minmax(0px, auto);
  width: 93%;
  margin-top: 2.5rem;
  margin-left: 2.25rem;
`;

export const EmptyScreenComponent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 75vh;
  margin-top: -1.5rem;

  h1 {
    color: ${grey};
    font-size: 24px;
    font-weight: bold;
    letter-spacing: 0;
    line-height: 28px;
    margin-bottom: 0px;
  }

  img {
    margin-top: 30px;
    margin-bottom: 20px;
  }

  p {
    color: ${grey};
    font-size: 16px;
    letter-spacing: 0;
    line-height: 30px;
    text-align: center;
    margin-bottom: 4px;
  }

  a {
    text-decoration: none;
    color: ${accentLight};
  }
`;

export const HomeComponent = styled.div`
  height: 100%;

  .view-all-template-infinite-scroll {
    grid-template-columns: repeat(auto-fill, minmax(296px, 1fr));
    grid-auto-rows: minmax(280px, 280px);
    grid-gap: 40px 10px;
    padding-top: 3px;
    overflow: unset !important;
  }
`;

export const StyledMarkerplaceHelpText = styled(StyledMarketplaceFrameTitle)`
  margin-top: 0px;
  color: ${grey};
  text-align: center;

  &.marketplace-template-subheader,
  &.marketplace-view-all-template-subheader {
    text-align: start;
  }
`;

export const StyledMarketplaceHeroImage = styled(Row)`
  margin-top: 1rem;
  height: calc(100vh - 306px);
  width: 100%;
  overflow: hidden;
  position: relative;
  margin: unset;

  img {
    height: 100%;
    width: auto;
    position: absolute;
    -webkit-user-drag: none;
    right: 0%;
    top: 0%;
  }
`;

export const StyledMyProjectsCard = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  box-sizing: border-box;
  border: 3px solid #323232;
  border-radius: 8px;
  background-color: rgba(50, 50, 50, 0.3);
`;

export const StyledSearchSuggestionContainer = styled.div`
  // width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: start;

  .suggestion-box {
    max-height: 350px;
    height: auto;
    ${(props) => `width: ${props.width}`};
    display: flex;
    flex-direction: column;
    background-color: ${(props) =>
      props.location === "dashboard"
        ? `${secondaryColor}`
        : props.location === "studio"
        ? `${primayColor}`
        : "none"};
    margin: auto;
    border-radius: 8px;
    position: absolute;
    z-index: 20;
    margin-top: 0.75rem;
    overflow-y: auto;
    -webkit-box-shadow: 0 8px 40px 0 rgba(0, 0, 0, 0.5);
    -moz-box-shadow: 0 0px 40px 0 rgba(0, 0, 0, 0.5);
    box-shadow: 0 0px 40px 0 rgba(0, 0, 0, 0.5);

    .show-all-item {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      margin: 0.5rem 0rem;
      padding: 0rem 1rem;

      svg {
        path {
          fill: ${lightInactive};
        }
      }

      .searched-keyword {
        margin-bottom: 0.25rem !important;
        padding: 0rem 1rem;
      }

      :hover {
        background-color: ${studioFooterColor};
        cursor: pointer;
      }
    }

    .title {
      font-size: 16px;
      font-weight: 500;
      padding: 0rem 1rem;
      margin: 0.5rem 0rem 0rem 0rem !important;
      color: ${grey};
    }

    .template-search-suggestion-list {
      list-style-type: none;
      padding: unset !important;
      padding-top: 0.5rem !important;

      .list-item-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        padding: 0.25rem 1rem;
        width: 100%;

        img {
          width: 60px;
          height: 50px;
          object-fit: contain;
          margin-right: 1rem;
        }

        .template-search-suggestion-list-item {
          font-size: 16px;
          font-weight: 400;
          color: ${lightInactive};
          margin-right: 0.5rem;
          margin-left: 14px;
        }

        .template-search-suggestion-list-item_extra-data {
          margin-bottom: 0rem !important;
          font-size: 14px;
          color: ${grey};
          display: none;
        }

        :hover {
          cursor: pointer;
          background-color: ${studioFooterColor};

          .template-search-suggestion-list-item_extra-data {
            display: flex;
          }
        }
      }

      .tldr-hl {
        display: block;
        height: 1px;
        border: 0;
        border-top: 1px solid #ccc;
        margin: 0.25em 0;
        padding: 0;
        width: 100%;
        opacity: 0.3;
      }
    }
  }
`;

export const StyledTemplateViewAllSwiperButton = styled.div`
  /* Extra small devices (phones, 600px and below) */
  @media (max-width: 600px) {
    display: none;
  }

  color: ${white};
  position: absolute;
  top: 0px !important;
  z-index: 2;
  height: 100%;
  width: 96px;
  font-size: 28px;
  background: ${(props) =>
    props.variance === "right"
      ? `linear-gradient(90deg, rgba(30,30,30,0) 0%, ${primayColor} 100%)`
      : props.variance === "left"
      ? `linear-gradient(270deg, rgba(30,30,30,0) 0%, ${primayColor} 100%)`
      : ""};

  .swiper-button-inner-div {
    opacity: ${(props) =>
      props.variance === "right" && props.disabled
        ? 0
        : props.variance === "left" && props.disabled
        ? 0
        : 0.6};
    background-color: ${primayColor};
    border-radius: 50%;
    height: 55px;
    width: 55px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    ${(props) =>
      props.variance === "right" &&
      `
      right: 0;
    `};
    ${(props) =>
      props.variance === "left" &&
      `
      left: 0;
    `};

    ${(props) =>
      !props.disabled
        ? `
      :hover {
        opacity: 1;
      }
    `
        : ""};
  }

  ${(props) =>
    props.variance === "right" &&
    `
    right: 0;
  `};

  ${(props) =>
    props.variance === "right" &&
    props.isactionpanelopen === "true" &&
    `
    right: ${advancedPanelSliderWidth};
  `};

  ${(props) =>
    props.variance === "left" &&
    `
    left: 0;
  `};

  ${(props) =>
    props.variance === "left" &&
    props.slideropen === TO_OPEN_SLIDER &&
    `
    left: ${sidebarItemDetailSliderWidth};
  `};
  mix-blend-mode: difference;
  cursor: ${(props) =>
    props.variance === "right" && props.disabled
      ? "default"
      : props.variance === "left" && props.disabled
      ? "default"
      : "pointer"};
`;

export const StyledVideoResponsive = styled.div`
  overflow: hidden;
  padding-bottom: 56.25%;
  position: relative;
  height: 0;

  iframe {
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    position: absolute;
  }
`;

export const StyledMarketplaceTemplatesBreadcrumbRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 1024px) {
    flex-direction: column;
    align-items: flex-start;
  }

  .breadcrumb {
    padding: 0rem 0rem 0.25rem 0rem !important;
    margin-bottom: 0rem !important;
  }

  .breadcrumb__template-search-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: ${secondaryColor};
    border-radius: 8px;

    .tldr-vl {
      height: 28px;
    }

    @media (max-width: 762px) {
      display: none;
    }
  }
`;

export const StyledMarketplaceViewAllTemplatesBreadcrumbRow = styled.div`
  width: 100%;
  margin: 0.25rem 1rem 1rem 1.5rem;

  @media (max-width: 768px) {
    margin: unset;
  }
`;

export const StyledTemplateFormatsSwiperContainer = styled.div`
  margin: 1.25rem 0rem 0rem 0rem;
  transition: all 0.3s ease;

  &.visible {
    visibility: visible;
    opacity: 1;
    max-height: fit-content;
  }

  &.hidden {
    visibility: hidden;
    opacity: 0;
    max-height: 0;
    margin: 0rem !important;
  }
`;

export const StyledSectionTitleRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0rem;
  min-height: 36px;

  .view-all {
    text-decoration: none !important;
    margin-right: 8px;
    cursor: pointer;
    font-size: 14px;
    color: ${lightInactive};
    display: flex;
    align-items: center;
  }
`;

export const StyledSectionTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  -webkit-letter-spacing: 0;
  -moz-letter-spacing: 0;-
  -ms-letter-spacing: 0;
  letter-spacing: 0;
  line-height: 24px;
  color: ${lightInactive};
  @media (max-width: 768px) {
    font-size: 1rem !important;
  }
`;

export const StyledViewAllTemplatesInfiniteScrollGrid = styled.div`
  display: grid;
  grid-gap: 20px;
  ${(props) => `grid-template-columns: repeat(${props.templatesPerRow}, 1fr)`};

  /* Extra small devices (phones, 600px and below) */
  @media (max-width: 600px) {
    ${(props) =>
      props.templatesPerRow <= 4
        ? `grid-template-columns: repeat(1, 1fr)`
        : `grid-template-columns: repeat(2, 1fr)`};
  }
`;

export const StyledTrialPeriodEndedModalBody = styled(Modal.Body)`
  display: flex;
  flex-direction: row;
  overflow: hidden;
  height: 500px;
  background: radial-gradient(
    circle,
    rgba(0, 140, 211, 0.16) 1.22%,
    rgba(0, 140, 211, 0) 90%
  );

  .modal-content-column,
  .modal-img-column {
    display: flex;
    flex-direction: column;
  }

  .modal-content-column {
    flex: 2;
    margin-right: 80px;
    align-items: start;
    justify-content: center;
    padding: 50px 0 50px 50px;

    #logo {
      fill: ${accent};
    }

    .heading {
      font-size: 40px;
      font-weight: 500;
      line-height: 47px;
      margin: 1.5rem 0rem;
    }

    .message {
      font-size: 20px;
      line-height: 24px;
      margin-bottom: 2.25rem;
    }

    .modal-button {
      background-color: ${accent} !important;
      font-weight: 500;
      font-size: 1.25rem;
    }
  }

  .modal-img-column {
    flex: 1;

    img {
      transform: rotate(-10.1deg);
      margin: -60px -70px 0 0;
      max-height: 675px;
    }
  }
`;

export const StyledPaymentDetailsModalBody = styled(Modal.Body)`
  padding: 0rem 1rem 1rem 1rem !important;

  .plan-period-column {
    display: flex;
    flex-direction: column;
    color: ${lightInactive};

    .plan-period-title {
      font-size: 12px;
      text-transform: uppercase;
    }

    .period-start-end-dates,
    .payment-method-details {
      font-size: 16px;
    }
  }

  .payment-details-separator {
    border-bottom: 1px ${accentGrey} dotted;
    margin: 0.75rem 0rem;
  }

  .plan-details-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    font-size: 16px;
    color: ${lightInactive};

    .calculated-amount {
      margin-left: 0.5rem;
    }
  }

  .total-amount {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .buttons {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
`;

export const StyledPaymentStatusModalBody = styled(Modal.Body)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  .icon {
    font-size: 88px;
    display: flex;
    align-items: center;
    margin-bottom: 1rem !important;
    color: ${(props) =>
      props.status === "success"
        ? "#85DE55"
        : props.status === "error"
        ? "#c84b4b"
        : `${accent}`};
  }

  .title {
    font-size: 18px;
    font-weight: 500;
    color: ${(props) =>
      props.status === "success"
        ? "#85DE55"
        : props.status === "error"
        ? "#c84b4b"
        : `${accent}`};
  }

  .body-text {
    margin-bottom: unset !important;
  }
`;

export const StyledDashboardBannerRow = styled.div`
  min-height: 344px;
  width: 100%;
  border-radius: 8px;
  background: url(${DASHBOARD_BANNER}) rgba(0, 0, 0, 0.8);
  background-repeat: no-repeat;
  background-origin: content-box;
  background-size: cover;
  background-position: center;
  background-blend-mode: multiply;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;

  &.search-template-size {
    width: unset;
    margin: 2.5rem;
  }

  @media (max-width: 768px) {
    min-height: 200px;
  }
`;

export const StyledDashboardGetStartedBoxWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  width: 100%;
  justify-content: center;
`;

export const StyledDashboardGetStartedBox = styled.div`
  background-color: ${studioFooterColor};
  min-height: 188px;
  border-radius: 8px;
  :hover {
    box-shadow: 0px 0px 40px rgba(0, 0, 0, 0.5);
    transform: scale(1.02);
    cursor: pointer;
    .view-all,
    svg {
      color: ${accent};
    }
  }
  flex: 0.33;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 30px;
`;

export const StyledSimplifiedSpan = styled.span`
  color: ${primary};
`;

export const StyledGetStartedDetailWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledMarketplaceMasonryView = styled.div`
  height: 0;

  .item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    white-space: nowrap;
    overflow: hidden;
    transition: 0.3s transform cubic-bezier(0.155, 1.105, 0.295, 1.12),
      0.3s box-shadow,
      0.3s -webkit-transform cubic-bezier(0.155, 1.105, 0.295, 1.12);

    :hover {
      transform: scale(1.02);
      box-shadow: 0px 0px 40px #000000;
      -webkit-box-shadow: 0px 0px 40px #000000;
      -moz-box-shadow: 0px 0px 40px #000000;
      border: none;

      .overlay-info-container {
        display: flex;
      }
    }

    .thumbnail {
      min-width: -webkit-fill-available;
      max-height: inherit;
      overflow: hidden;
      border-radius: 8px;
      position: relative;

      img {
        object-fit: cover;
        width: 100%;
      }
    }

    .overlay-info-container {
      height: 100%;
      width: 100%;
      background: linear-gradient(to top, #000000 5%, transparent);
      position: absolute;
      display: none;

      .overlay-info {
        position: absolute;
        bottom: 10px;
        left: 10px;
        width: 90%;
        font-weight: 500;

        p {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          width: 100%;
          margin-bottom: unset !important;
        }
      }
    }
  }
`;

export const StyledTitleRowWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  min-height: 36px;
  margin: 0.75rem 0 0 0;

  .d-sm-search-container {
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: ${secondaryColor};
    border-radius: 8px;
    width: 100%;
  }
`;
