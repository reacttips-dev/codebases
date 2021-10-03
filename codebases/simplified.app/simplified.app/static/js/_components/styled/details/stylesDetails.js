import styled from "styled-components";
import {
  white,
  primary,
  blackAlpha24,
  secondaryColor,
  primayColor,
  sidebarItemDetailSliderWidth,
  editorToolbarMinHeight,
  advancedPanelSliderWidth,
  filterGridItem,
  layoutGridItem,
  grey,
  accentGrey,
  accent,
  md,
  colorDisabled,
  lightInactive,
} from "../variable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TO_OPEN_SLIDER } from "../../../_reducers/sidebarSliderReducer";
import { Card, Popover } from "react-bootstrap";
import {
  StyledMarketplaceFrameSubtitle,
  StyledMarketplaceFrameTitle,
} from "../home/stylesHome";
import { RND_MIN_WIDTH } from "../../../_utils/constants";
import transparent from "../../../assets/icons/transparent.png";
import {
  RATIO_LANDSCAPE,
  RATIO_PORTRAIT,
  RATIO_SQUARE,
  RATIO_STORY,
  RATIO_WIDESCREEN,
} from "../../details/constants";

const CROP_RATIO_WIDTH = "65px";

export const StyledSliderContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  height: 100%;
  position: relative;
  justify-content: space-between;
`;

export const StyledSliderRowContainer = styled.div``;

export const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  color: ${white};
  opacity: ${(props) =>
    props.variance === "right" && props.disabled
      ? 0
      : props.variance === "left" && props.disabled
      ? 0
      : 0.65};
  position: absolute;
  z-index: 2;
  top: 50%;
  transform: translateY(-50%);

  ${(props) =>
    props.variance === "right" &&
    `
    right: 0;
    margin-right: 0.5rem;
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
    margin-left: 0.5rem;
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

  ${(props) =>
    !props.disabled
      ? `
    :hover {
      color: #ffac41;
      opacity: 1;
    }
  `
      : ""};
`;

export const StyledSlide = styled.div`
  height: ${(props) => props.artBoardHeight}%;
  width: ${(props) => props.artBoardWidth}%;
  background: #323232;
  border-radius: 0.5rem 0.5rem 0 0;
  // margin-top:10%;
`;

export const StyledLoaderSlide = styled.div`
  height: ${(props) => props.artboardSize.heightPercentage}%;
  width: ${(props) => props.artboardSize.widthPercentage}%;
  background: #323232;
  border-radius: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${primary};
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);

  :hover {
    border: 1px solid ${primary};
    cursor: pointer;
  }
`;

export const StyledSlideHeader = styled.div`
  width: 100%;
  height: 1.5rem;
  font-weight: 400;
  color: ${white};
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  padding: 0rem 0.75rem;
`;

export const StyledSlideInActive = styled.div`
  background-color: ${primayColor};
  opacity: 0.8;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: opacity 0.5s ease-out 0.5s;
  will-change: opacity;
  transition: all 1s;

  ${(props) =>
    props.active &&
    `
    opacity: 0;
  `}

  ${(props) =>
    !props.active &&
    `
    :hover {
      opacity: 0.45 !important;
      transition-property: opacity;
      transition-duration: 1s;
    } 
  `}
`;

export const StyledPageLayer = styled.div`
  position: absolute;
`;

export const StyledLayerComponent = styled.div`
  // width: 100%;
  // height: 100%;
  position: relative;
`;

export const StyledRNDElementWrapper = styled.div`
  min-width: ${RND_MIN_WIDTH};
  // width: 100%;
  width: ${(props) => `${props.size.width}px`};
  height: 100%;
  position: relative;

  ${(props) =>
    props.isSelecting &&
    `
    outline: ${primary} ${props.outlineSize} solid;
  `}

  :hover {
    ${(props) =>
      `
      // box-shadow: 0 0 0 ${props.outlineSize} ${primary};
      // -webkit-box-shadow: 0 0 0 ${props.outlineSize} ${primary};
      outline: ${primary} ${props.outlineSize} solid;
      `}
  }

  .ql-container {
    box-sizing: border-box;
    font-family: Roboto;
    height: auto;
    margin: 0px;
    font-size: 43.2px;
    line-height: normal;
    position: relative;
    mix-blend-mode: difference;
    color: #000000;
  }
`;

export const StyledStudioEditorToolbar = styled.div`
  margin-top: 0.5%;
  width: auto;
  background-color: #323232;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: ${editorToolbarMinHeight};
  border-radius: 8px;
  position: fixed;
  z-index: 1000;
  padding: 4px;
`;

export const StyledStudioEditorToolbarText = styled.div`
  color: white;
  font-size: 10px;
  margin-bottom: 4px;
  text-transform: uppercase;
`;

export const StyledAdvancedToolbarText = styled(StyledStudioEditorToolbarText)`
  font-size: 16px;
  flex-grow: 1;
  margin-bottom: 0px;
  font-weight: bold;
  letter-spacing: 0.13px;
  text-transform: capitalize;
`;

export const StyledStudioEditorToolbarContent = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-bottom: 4px;
`;

export const StyledTextEditorToolbarFormatGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 32px !important;

  & > div,
  > button {
    margin-right: 0.2rem;
    margin-left: 0.2rem;
  }
  & svg {
    height: 24px !important;
  }
`;

export const StyledAdvEditorToolbarRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: ${(props) =>
    props.isWithValue ? "space-between" : "unset"};
  align-items: ${(props) => (props.isWithValue ? "flex-end" : "unset")};
  margin: ${(props) => (props.margin ? props.margin : "0 0 16px 0")}
  // margin-bottom: 16px;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 0px;
  }
`;

export const StyledAdvEditorToolbarFormatGroup = styled.div`
  display: flex;
  flex-direction: column;
  flex: ${(props) => (props.isWithValue ? "0 0 71%" : "0 0 50%")};

  .title {
    opacity: 0.8;
    text-transform: uppercase;
    color: #ffffff;
    font-size: 12px;
    letter-spacing: 0;
    line-height: 14px;
    margin-bottom: 6px;
  }

  .actions {
    display: flex;
    justify-items: center;
    align-items: center;
    & > div,
    > button {
      margin-right: 0.2rem;
      margin-left: 0.2rem;
      padding: 0px;
    }
    & svg {
    }
  }

  .ml-0 > div {
    margin-left: 0px !important;
    margin-right: 12px !important;
  }

  .column-actions {
    display: flex;
    flex-direction: column;
    & > div,
    > button {
      margin: 0.2rem;
    }
    & svg {
      height: 24px !important;
    }
  }

  .button {
    height: auto;
    width: 100%;
  }
`;

export const StyledEditorRoundedGroup = styled(
  StyledTextEditorToolbarFormatGroup
)`
  border: 1px solid #888888;
  border-radius: 4px;
  height: 40px;
  & > div,
  > button {
    margin-right: 0.2rem;
    margin-left: 0.2rem;
  }
  & svg {
    margin-right: 0.75rem;
    margin-left: 0.75rem;
    height: 24px !important;
    cursor: pointer;
  }

  :hover,
  :focus {
    color: ${primary} !important;
    outline: none !important;
  }

  &.active {
    color: ${primary} !important;
  }
`;

export const StyledTextEditorToolbarFormatGroupPullRight = styled(
  StyledTextEditorToolbarFormatGroup
)`
  flex-grow: 1;
  justify-content: flex-end;
`;

export const StyledTextEditorActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  float: left;
  color: ${white};
  font-size: 1rem;
  line-height: 1.375rem;
  font-family: "Rubik" !important;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px !important;
  height: 32px !important;
  border-radius: 8px;
  margin: ${(props) => (props.margin ? props.margin : `0px !important;`)} 

  :hover:not([disabled]) {
    color: ${primary} !important;
    outline: none !important;
    background: ${(props) => (props.showHover ? "#858585" : "")};
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

  &.active > svg {
    color: ${primary};
  }

  .fa-light {
    color: ${(props) => (props.disabled ? colorDisabled : lightInactive)};
  }
`;

export const StyledColorPickerButton = styled(StyledTextEditorActionButton)`
  width: 32px !important;
  height: 32px !important;
  // border: 1px solid ${accentGrey} !important;
  // border-left: 0.5px solid ${accentGrey} !important;
  border-radius: 0px 8px 8px 0px !important;
  opacity: ${(props) => (props.disabled ? "0.3" : "1")};
  min-height: 32px !important;
`;

export const StyledColorPickerIconButton = styled(StyledTextEditorActionButton)`
  width: ${(props) =>
    props.width
      ? props.width
      : props.showColorCode
      ? "auto"
      : props.showValue
      ? "48px"
      : props.onlyInput
      ? "135px"
      : "32px"} !important;
  height: 32px !important;
  // border: 1px solid ${accentGrey} !important;
  // border-right: 0.5px solid ${accentGrey} !important;
  background-color: rgba(0, 0, 0, 0.16);
  border-radius: ${(props) =>
    props.isIconDisplayed
      ? "0px !important"
      : props.showValue || props.onlyInput
      ? "8px !important"
      : "8px 0px 0px 8px !important;"};
  min-height: 32px !important;
  font-size: 0.875rem;
`;

export const StyledSliderInputContainer = styled(StyledTextEditorActionButton)`
  width: ${(props) =>
    props.showValue ? "72px" : props.onlyInput ? "135px" : "32px"} !important;
  height: 32px !important;
  min-height: 32px !important;
  background-color: rgba(0, 0, 0, 0.16);
  margin-bottom: 4px !important;
  border-radius: ${(props) =>
    props.showValue || props.onlyInput
      ? "8px !important"
      : "8px 0px 0px 8px !important"};
`;

export const StyledHeadingButton = styled(StyledTextEditorActionButton)`
  font-weight: bold;
  font-size: 1.25rem;
  line-height: 1.5rem;
`;

export const StyledSubHeadingButton = styled(StyledTextEditorActionButton)`
  font-weight: 500;
`;

export const StyledBodyButton = styled(StyledTextEditorActionButton)`
  font-size: 1rem;
  line-height: 1.1875rem;
`;

export const StyledTextEditorCustomActionButton = styled(
  StyledTextEditorActionButton
)`
  // background-color: rgba(255, 255, 255, 0.12) !important;
  border-radius: 0.5rem;
  padding: 0px !important;
  margin: 0px !important;
  // margin-right: 8px !important;
  width: ${(props) =>
    props.isDropdown ? "50px !important" : "32px !important"};
  height: 32px !important;
  border: none !important;
  display: flex;
  align-items: center;
  justify-content: center;

  .fa-chevron-down,
  .fa-chevron-up {
    width: 12px !important;
    margin-left: 7px;

    path {
      fill: ${(props) => (props.iconFill ? "#ffac41" : "white")};
    }
  }

  .fa-image {
    path {
      fill: ${(props) => (props.iconFill ? "#ffac41" : "white")};
    }
  }

  .fa-layer-group {
    path {
      fill: ${(props) => (props.iconFill ? "#ffac41" : "white")};
    }
  }

  .fa-fill-drip {
    path {
      fill: ${(props) => (props.iconFill ? "#ffac41" : "white")};
    }
  }

  svg {
    float: none !important;
    height: 18px !important;
    width: 18px !important;

    :hover {
      fill: ${primary} !important;
      outline: none !important;
    }
    &.active {
      fill: ${primary} !important;
    }
  }

  .fa-16 {
    font-size: 1rem;
    width: 16px !important;
    height: 16px !important;
  }

  .mr-8 {
    margin-right: 8px !important;
  }
`;

export const StyledAnimationPlaybackActionButton = styled(
  StyledTextEditorActionButton
)`
  background-color: rgba(255, 255, 255, 0.12) !important;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 35px !important;
  width: 35px !important;
`;

export const StyledShapeColorsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 290px;
`;

export const StyledActionOnSection = styled(StyledTextEditorActionButton)`
  color: ${grey};
`;

export const StyledShapeColorsCustomActionButton = styled(
  StyledTextEditorActionButton
)`
  ${(props) =>
    props.bgColor === "transparent"
      ? `background-image: url(${transparent})`
      : `background-color: ${props.bgColor} !important`};
  border-radius: 0.5rem;
  padding: 2px !important;
  width: 30px !important;
  height: 30px !important;
  border: none !important;
  margin: 0.2rem;
  border: ${(props) =>
    props.isSelected ? "2px solid #ffac41 !important" : "0px"};
`;

export const StyledStorySliderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  position: relative;
  width: 100%;
  height: 100%;
  // align-items: center;
  // justify-content: center;
  // height: calc(100% - ${editorToolbarMinHeight} - 3rem);
  height: calc(100vh * 0.795);
  // margin-top: calc(${editorToolbarMinHeight} + 4rem);
  margin-top: calc(100vh * 0.1358);
  background: #ffac41;

  svg {
    top: 50%;
    transform: translateY(-50%);
  }
`;

export const StyledElementHandle = styled.div`
  border: 2px solid ${primary};
  background-color: ${primayColor};
  border-radius: 100%;
  position: absolute;
  top: 50%;
  width: 1.5rem;
  height: 1.5rem;
  cursor: move;
  // margin: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledCroppingElement = styled(StyledElementHandle)`
  cursor: pointer;
  margin: 0rem;
`;

export const StyledSetAsBackgroundHandle = styled(StyledElementHandle)`
  position: absolute;
  top: 1%;
  right: 1%;
  cursor: pointer;
  margin: unset !important;

  ${(props) => `
    transform: scale(${1 / props.scale}) translate(-50%, 50%);
  `}
`;

export const StyledElementHandlesWrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  flex-direction: row;
  position: absolute;
  z-index: 1;
  top: 100%;

  ${(props) => `
    height: calc(24px * ${1 / props.scale});
  `}
  margin-top: 1%;
`;

export const StyledRNDWrapper = styled.div``;

export const StyledActionCard = styled(Card)`
  background-color: #323232;
`;

export const StyledActionCardBody = styled(StyledActionCard.Body)`
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.5);
`;

export const StyledAddTextSlide = styled.div`
  font-size: 1rem;
  mix-blend-mode: difference;
  ${(props) => `
    transform: translate(-50%, -50%) scale(${1 / props.scale});
  `}
  position: absolute;
  z-index: 2000000000;
  top: 50%;
  text-align: center;
  left: 50%;
  color: ${grey};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledResizeHandler = styled.div`
  position: absolute;
  user-select: none;
  width: 12px !important;
  height: 12px !important;
  cursor: ne-resize;
  background: white !important;
  border-radius: 6px;
  box-shadow: 0 0 5px 1px rgba(57, 76, 96, 0.15),
    0 0 0 1px rgba(53, 71, 90, 0.2);

  ${(props) => `
  transform: scale(${props.scale});
  `}
`;

export const StyledCollectionItem = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 0.5rem;
  height: 100%;
  width: 100%;

  &:hover {
    border: 3px ${primary} solid;
    box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);
    -webkit-box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);
    -moz-box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);
  }

  &.active {
    border: 3px ${primary} solid;
    box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);
    -webkit-box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);
    -moz-box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);
  }
`;

export const StyledDropShadowCollectionItem = styled.div`
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid transparent;

  border-radius: 0.5rem;
  height: 60px;
  width: 60px;
  cursor: pointer;

  &:hover {
    color: rgba(255, 172, 65, 0.75);
    border: 2px solid rgba(255, 172, 65, 0.75);
  }

  &.active {
    color: rgba(255, 172, 65, 0.75);
    border: 2px solid rgba(255, 172, 65, 0.75);
  }
`;

export const StyledImageFilter = styled(StyledCollectionItem)`
  background: url("https://assets.simplified.co/images/apple.jpg") no-repeat
    center center;
  background-size: cover;
  ${(props) =>
    props.varient.filter &&
    `
    -webkit-filter: ${props.varient.filter}(${props.varient.value});
    filter: ${props.varient.filter}(${props.varient.value});
  `};

  :hover {
    cursor: pointer;
  }
`;

export const StyledAnimationOptions = styled.div`
  grid-column: 1 / -1;
  height: 150px;
  width: 100%;
  font-size: 30px;
  background-color: #323232;
  color: #ffffff;
  display: none;
`;

export const StyledAnimation = styled(StyledCollectionItem)`
  background: url("https://assets.simplified.co/images/apple.jpg") no-repeat
    center center;
  background-size: cover;
  text-align: center;
  overflow: hidden;
  ${(props) =>
    props.animation.image &&
    `
    background: url(${props.animation.image})
  `};

  video {
    width: 100%;
    height: 100%;
  }

  video::-webkit-media-controls {
    display: none !important;
  }

  :hover {
    cursor: pointer;
  }
`;

export const StyledDropShadowEffect = styled(StyledDropShadowCollectionItem)`
  background-color: rgba(255, 255, 255, 0.12);
  color: ${white};

  box-shadow: ${(props) =>
    props.effect === "soft"
      ? "5px 5px 10px #ffac41"
      : props.effect === "regular"
      ? "5px 5px 5px #ffac41"
      : props.effect === "retro"
      ? "5px 5px #ffac41"
      : "none"};
  -webkit-box-shadow: ${(props) =>
    props.effect === "soft"
      ? "5px 5px 10px #ffac41"
      : props.effect === "regular"
      ? "5px 5px 5px #ffac41"
      : props.effect === "retro"
      ? "5px 5px #ffac41"
      : "none"};
  -moz-box-shadow: ${(props) =>
    props.effect === "soft"
      ? "5px 5px 10px #ffac41"
      : props.effect === "regular"
      ? "5px 5px 5px #ffac41"
      : props.effect === "retro"
      ? "5px 5px #ffac41"
      : "none"};
`;

export const StyledAnimationSpeedEffect = styled(
  StyledDropShadowCollectionItem
)`
  background-color: rgba(255, 255, 255, 0.12);
  color: ${white};
`;

export const StyledFilterCollection = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(${filterGridItem}, ${filterGridItem})
  );
  grid-gap: 10px;
  grid-auto-rows: minmax(${filterGridItem}, auto);
  color: ${white};
  grid-auto-flow: row dense;
`;

export const StyledDropShadowCollection = styled.div`
  ${"" /* margin-bottom: 10px; */}
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const StyledSliderFilterCollection = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

export const StyledSideResizeHandler = styled.div`
  position: absolute;
  user-select: none;
  // width: 100%;
  // height: 100%;
  cursor: ne-resize;
  background: ${primary} !important;
  display: flex;
  align-items: center;
  align-content: center;
  justify-items: center;
  justify-content: center;
`;

export const StyledTopSideResizeHandler = styled(StyledSideResizeHandler)`
  width: 100%;
  ${(props) => `
  height: ${props.outlineSize} !important;
  top: calc(-1/2 * ${props.outlineSize});
  `}
`;

export const StyledBottomSideResizeHandler = styled(StyledSideResizeHandler)`
  width: 100%;
  ${(props) => `
  height: ${props.outlineSize} !important;
  // bottom: calc(-1 * ${props.outlineSize}/2);
  bottom: calc(-1/2 * ${props.outlineSize});
  `}
`;

export const StyledRightSideResizeHandler = styled(StyledSideResizeHandler)`
  height: 100%;
  ${(props) => `
  width: ${props.outlineSize} !important;
  // right: calc(-1 * ${props.outlineSize}/2);
  right: calc(-1/2 * ${props.outlineSize});
  `}
`;

export const StyledLeftSideResizeHandler = styled(StyledSideResizeHandler)`
  height: 100%;
  ${(props) => `
  width: ${props.outlineSize} !important;
  // left: calc(-1 * ${props.outlineSize}/2);
  left: calc(-1/2 * ${props.outlineSize});
  `}
`;

export const StyledVerticalSideMiddleResizeHandler = styled.div`
  position: absolute;
  height: 20%;

  width: 200%;
  background: ${primayColor};
  border-radius: 20%;
  box-shadow: 0px 0px 5px 1px ${accentGrey};
  ${(props) => `
    max-height: ${40 * props.scale}px;
    min-height: ${20 * props.scale}px;
  `}
`;

export const StyledHorizontalSideMiddleResizeHandler = styled.div`
  position: absolute;
  height: 200%;
  width: 20%;
  background: ${primayColor};
  border-radius: 20%;
  box-shadow: 0px 0px 5px 1px ${accentGrey};
  ${(props) => `
    max-width: ${40 * props.scale}px;
    min-width: ${20 * props.scale}px;
  `}
`;

export const StyledSlideLayout = styled(StyledCollectionItem)`
  background-color: #494949;
  display: flex;
  flex-direction: column;
  border: 3px transparent solid;
  padding: 7px;

  :hover {
    cursor: pointer;
  }

  .square {
    background-color: ${accentGrey};
    height: 80px;
    width: 80px;
    transform: scale(0.7);
    border-radius: 12px;
  }

  .circle {
    background-color: ${accentGrey};
    height: 80px;
    width: 75px;
    border-radius: 50%;
    transform: scale(0.8);
  }

  .triangle {
    height: 0px;
    width: 0px;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-bottom: 86.6px solid ${accentGrey}; /*You need to multiply the left/right border width by 1.732 to get the bottom border, ie, height of triangle*/
    transform: scale(0.65);
  }

  .ellipse {
    background-color: ${accentGrey};
    height: 150px;
    width: 115px;
    border-radius: 50%;
    transform: scale(0.6);
  }

  .trapezium {
    height: 0px;
    width: 100px;
    border-left: 25px solid transparent;
    border-right: 25px solid transparent;
    border-bottom: 110px solid ${accentGrey};
    transform: scale(0.6);
  }

  .star6 {
    position: relative;
    height: 0px;
    width: 0px;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-bottom: 86.6px solid ${accentGrey};
    margin-top: -15px;
    transform: scale(0.6);
  }
  .star6::after {
    position: absolute;
    content: "";
    height: 0px;
    width: 0px;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-top: 86.6px solid ${accentGrey};
    top: 25px;
    left: -50px;
  }

  .hexagon {
    position: relative;
    height: 0px;
    width: 111px;
    border-bottom: 45px solid ${accentGrey};
    border-left: 35px solid transparent;
    border-right: 35px solid transparent;
    margin-top: -25px;
    transform: scale(0.6);
  }
  .hexagon::after {
    position: absolute;
    content: "";
    height: 0px;
    width: 111px;
    border-top: 45px solid ${accentGrey};
    border-left: 35px solid transparent;
    border-right: 35px solid transparent;
    left: -35px;
    top: 45px;
  }

  .pentagon {
    position: relative;
    height: 0px;
    width: 0px;
    border-bottom: 45px solid ${accentGrey};
    border-left: 55px solid transparent;
    border-right: 55px solid transparent;
    margin-top: -35px;
    transform: scale(0.6);
  }
  .pentagon:after {
    position: absolute;
    content: "";
    height: 0px;
    width: 111px;
    border-top: 55px solid ${accentGrey};
    border-left: 30px solid transparent;
    border-right: 30px solid transparent;
    left: -55px;
    top: 45px;
  }

  .octagon {
    position: relative;
    height: 60px;
    width: 80px;
    background-color: ${accentGrey};
    transform: scale(0.6);
  }
  .octagon::before {
    position: absolute;
    content: "";
    height: 0px;
    width: 80px;
    border-bottom: 18.5px solid ${accentGrey};
    border-left: 20.5px solid transparent;
    border-right: 20.5px solid transparent;
    top: -18.5px;
  }
  .octagon::after {
    position: absolute;
    content: "";
    height: 0px;
    width: 80px;
    border-top: 18.5px solid ${accentGrey};
    border-left: 20.5px solid transparent;
    border-right: 20.5px solid transparent;
    top: 60px;
  }

  .heart {
    position: relative;
    width: 80px;
    height: 80px;
    margin-top: -10px;
    transform: scale(0.6);
  }
  .heart::before,
  .heart::after {
    position: absolute;
    content: "";
    left: 40px;
    top: 0;
    width: 50px;
    height: 90px;
    background-color: ${accentGrey};
    border-radius: 50px 50px 0 0;
    transform: rotate(-45deg);
    transform-origin: 0 100%;
  }
  .heart::after {
    left: -10px;
    transform: rotate(45deg);
    transform-origin: 100% 100%;
  }

  .diamond {
    position: relative;
    height: 0px;
    width: 120px;
    border-bottom: 30px solid ${accentGrey};
    border-left: 40px solid transparent;
    border-right: 40px solid transparent;
    margin-top: -35px;
    transform: scale(0.6);
  }
  .diamond::after {
    position: absolute;
    content: "";
    height: 0px;
    width: 0px;
    border-top: 60px solid ${accentGrey};
    border-left: 60px solid transparent;
    border-right: 60px solid transparent;
    left: -40px;
    top: 30px;
  }

  .kite {
    background-color: ${accentGrey};
    height: 80px;
    width: 70px;
    transform: scale(0.65) rotate(45deg);
  }

  .parallelogram {
    background-color: ${accentGrey};
    height: 80px;
    width: 80px;
    transform: scale(0.65) skew(-20deg);
  }

  .chevron {
    position: relative;
    height: 75px;
    width: 0px;
    transform: scale(0.6) rotate(90deg);
  }
  .chevron:before {
    content: "";
    position: absolute;
    top: -5px;
    left: 0;
    height: 100%;
    width: 50px;
    background: ${accentGrey};
    transform: skew(0deg, 25deg);
  }
  .chevron:after {
    content: "";
    position: absolute;
    top: -5px;
    right: 0;
    height: 100%;
    width: 50px;
    background: ${accentGrey};
    transform: skew(0deg, -25deg);
  }

  .cross {
    background: ${accentGrey};
      height: 50px;
      position: relative;
      width: 20px;
      transform: scale(1.1);
    }
  .cross:after {
      background: ${accentGrey};
      content: "";
      height: 20px;
      left: -15px;
      position: absolute;
      top: 15px;
      width: 50px;
    }
  }
`;

export const StyledSlideLayoutContent = styled.div`
  width: ${(props) =>
    props.ratio === RATIO_SQUARE
      ? CROP_RATIO_WIDTH
      : props.ratio === RATIO_STORY
      ? `calc(${CROP_RATIO_WIDTH}/ 1.778)`
      : props.ratio === RATIO_WIDESCREEN
      ? CROP_RATIO_WIDTH
      : props.ratio === RATIO_LANDSCAPE
      ? `calc(${CROP_RATIO_WIDTH}/ 1.333)`
      : props.ratio === RATIO_PORTRAIT
      ? CROP_RATIO_WIDTH
      : props.width
      ? `${props.width}px`
      : props.imageWidth
      ? `calc(${props.imageWidth}px * ${props.widthScaleFactor})`
      : "65px"};
  height: ${(props) =>
    props.ratio === RATIO_SQUARE
      ? CROP_RATIO_WIDTH
      : props.ratio === RATIO_STORY
      ? CROP_RATIO_WIDTH
      : props.ratio === RATIO_WIDESCREEN
      ? `calc(${CROP_RATIO_WIDTH}/ 1.778)`
      : props.ratio === RATIO_LANDSCAPE
      ? CROP_RATIO_WIDTH
      : props.ratio === RATIO_PORTRAIT
      ? `calc(${CROP_RATIO_WIDTH}/ 1.333)`
      : props.height
      ? `${props.height}px`
      : props.imageHeight
      ? `calc(${props.imageHeight}px * ${props.heightScaleFactor})`
      : "65px"};

  box-sizing: border-box;
  max-width: 124px;
  max-height: 100px;
  border: 2px dashed grey;
  border-radius: 4px;
  align-items: center;
  justify-content: center;
  display: flex;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  overflow-wrap: anywhere;
  padding-left: 5px;
  padding-right: 5px;

  svg {
    font-size: 18px;
  }
`;

export const StyledSlideTitle = styled(StyledMarketplaceFrameTitle)`
  text-align: center;
`;

export const StyledSlideSubtitle = styled(StyledMarketplaceFrameSubtitle)``;

export const StyledLayoutCollection = styled.div`
  display: grid;
  grid-template-columns: ${(props) =>
    props.location === "crop"
      ? `repeat(auto-fill, minmax(${layoutGridItem}, 130px))`
      : props.location === "clip"
      ? `repeat(auto-fill, minmax(0px, 92px))`
      : `repeat(auto-fill, minmax(${layoutGridItem}, 130px))`};
  grid-gap: 10px;
  grid-auto-rows: ${(props) =>
    props.location === "crop"
      ? `minmax(${layoutGridItem}, auto)`
      : props.location === "clip"
      ? "minmax(92px,92px)"
      : `minmax(${layoutGridItem}, auto)`};
  color: ${white};
`;

export const StyledGalleryTypeHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 0.25rem;
  .all {
    color: ${accentGrey};
    cursor: pointer;

    span {
      ${"" /* text-decoration: underline; */}
      font-size: 14px;
    }

    svg {
      margin-left: 0.5rem;
    }
  }
`;

export const StyledGalleryTypeHeaderTitle = styled.p`
  color: ${white};
  font-weight: bold;
  font-size: 1rem;
  letter-spacing: 0.13px;
  font-family: Rubik;
  margin: 0;
  text-transform: capitalize;
`;

export const StyledGalleryTypeHeaderActionMore = styled(FontAwesomeIcon)`
  cursor: pointer;
  color: white;
`;

export const StyledQuickPositionPopover = styled(Popover)`
  z-index: 9050;
  background-color: ${secondaryColor};
  color: ${white};
  border-radius: 8px;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.5);

  .title {
    font-size: 10px;
  }
`;

export const StyledPointer = styled.div`
  top: ${(props) => props.top}%;
  left: ${(props) => props.left}%;

  position: absolute;
  z-index: 9999999999999999;
  color: ${primary};
  transition-property: top left;
  transition-duration: 0.1s;
  transition-delay: 0s;
  transition-timing-function: linear;

  div {
    background: ${(props) => props.color};
    color: white;
    font-size: 12px;
    font-weight: 700;
    font-family: Rubik;
    padding: 5px;
    border-radius: 1px;
  }

  svg {
    width: 25px;
    height: 25px;

    path {
      fill: ${(props) => props.color};
    }
  }
`;

export const StyledUserLabel = styled.p`
  margin: 0px;
  font-size: 14px;
  mix-blend-mode: hard-light;
`;

export const StyledSlideBackgroundAction = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  ${(props) => `width: ${props.width}px`};
  ${(props) =>
    `margin: ${props.margin ? props.margin : `0.7rem 0rem 0.7rem 0rem`}`};

  .text-centered {
    display: flex;
    align-items: center;
    font-size: 1rem;
  }
`;

export const StyledSlideBackgroundLabel = styled.p`
  margin-bottom: 0px;
  color: ${white};
`;

export const StyledArrangeActionButton = styled.div`
  display: flex;
  width: 140px;
  align-items: center;
  cursor: pointer;

  :hover {
    color: ${primary} !important;
  }
  &.active {
    color: ${primary} !important;
  }
`;

export const StyledSliderBGReplaceImageButton = styled.div`
  background-color: rgba(255, 255, 255, 0.12);
  height: 32px;
  width: 130px;
  padding: 10px;
  align-items: center;
  justify-content: center;
  display: flex;
  border-radius: 0.5rem;
  color: ${white};

  :hover {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

export const StyledContextMenuDivider = styled.div`
  border-top-width: 0.5px;
  border-bottom-width: 0px;
  border-style: solid;
  border-color: ${white};
  width: 100%;
`;

export const StyledVideoProgressRow = styled.div`
  display: flex;
  flex-direction: row;
  margin: 2rem 0rem 1rem 0rem;
  width: 100%;
  justify-content: space-between;
`;

export const StyledGradientGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(90px, 89px));
  grid-gap: 10px;
  grid-auto-rows: minmax(90px, auto);
  color: #ffffff;
  grid-auto-flow: row dense;

  @media (max-width: ${md}) {
    justify-content: flex-start;
  }
`;

export const StyledGradientOptionInfoContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const StyledGradientOptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const StyledGradientColor = styled.div`
  ${(props) => `background-color: ${props.bgColor}`};
  height: 20px;
  width: 20px;
  border-radius: 50%;
  border: 2px solid #fff;
  margin: 0px 5px 0px 0px;

  :hover {
    cursor: pointer;
  }
`;

export const StyledGradientOptionInfo = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  :hover {
    cursor: pointer;
  }
`;

export const StyledGradientAngleAndColors = styled(
  StyledGradientOptionInfoContainer
)`
  width: 100% !important;
  font-size: 20px;

  div {
    #tldr-gradient-angle {
      ${(props) => `transform: rotate(${props.angle}deg)`};
    }

    :hover {
      cursor: pointer;
    }
  }

  .fa-plus-circle {
    cursor: pointer;
  }
`;

export const StyledGradientOption = styled.div`
  height: 90px;
  width: 90px;
  background-color: #ffffff;
  border-radius: 8px;
  ${(props) => `background-image: ${props.gradient}`};

  :hover {
    cursor: pointer;
  }
`;

export const StyledTriangle = styled.div`
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;

  border-bottom: 10px solid ${blackAlpha24};
`;

export const StyledGradientAddAndAdjust = styled.div`
  display: flex;
  justify-content: space-around;
  font-size: 20px;
  margin: 12px 0px 12px 8px;
  :hover {
    cursor: pointer;
  }
`;

export const StyledGradientSettingsPopup = styled.div`
  width: 270px;
  background-color: ${blackAlpha24};
  border-radius: 8px;
  ${(props) => `align-self: ${props.alignSelf}`};
  padding: 0px 15px;
`;

export const StyledGradientSettingsPopupCloseIcon = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;

  svg {
    :hover {
      cursor: pointer;
    }
  }
`;

export const StyledGradientAngleRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const StyledDetailsSectionGroup = styled.div`
  display: flex;
  flex-direction: column;

  .title {
    opacity: 0.8;
    text-transform: uppercase;
    color: #ffffff;
    font-size: 12px;
    letter-spacing: 0;
    line-height: 14px;
    margin-bottom: 6px;
  }
`;

export const StyledCustomStorySizeIcon = styled.div`
  width: 32px !important;
  height: 38px !important;
  border: 1px solid ${accentGrey} !important;
  border-radius: 4px 0px 0px 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledCustomStoryActions = styled.div`
  font-size: 20px;
  margin: 0rem 1rem;

  :hover {
    cursor: pointer;
  }
`;

export const StyledSidebarPanelCloseButton = styled.div`
  height: 35px;
  width: 35px;
  background-color: ${secondaryColor};
  position: absolute;
  right: -34px;
  top: 21px;
  border-radius: 0px 8px 8px 0px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;

  :hover {
    cursor: pointer;
  }
`;

export const StyledCommandKOptionRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const StyledCommandKPanelBox = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 13px;
  height: 80px;
  border: 1px solid ${accentGrey};
  border-radius: 4px;
  margin: 0px 5px;
  width: 100px;
  max-width: 100px;
  text-align: center;
  align-items: center;
  justify-content: space-evenly;
  color: ${white};
  position: relative;

  &.active {
    border: 1px solid ${primary};
    color: ${primary};
  }

  :hover {
    cursor: pointer;
    border: 1px solid ${primary};
    color: ${primary};
  }
`;

export const StyledMarketPlaceSwiperButton = styled.div`
  /* Extra small devices (phones, 600px and below) */
  @media (max-width: 600px) {
    display: none;
  }

  color: ${white};
  position: absolute;
  z-index: 2;
  width: 44px;
  height: 100%;
  font-size: 28px;
  background: ${(props) =>
    props.variance === "right"
      ? `linear-gradient(270deg, ${primayColor} 4%, rgba(0,0,0,0))`
      : props.variance === "left"
      ? `linear-gradient(90deg, ${primayColor} 4%, rgba(0,0,0,0))`
      : ""};
  display: flex;
  align-items: center;
  justify-content: ${(props) =>
    props.variance === "right"
      ? "flex-end"
      : props.variance === "left"
      ? "flex-start"
      : ""};

  .swiper-button-inner-div {
    opacity: ${(props) =>
      props.variance === "right" && props.disabled
        ? 0
        : props.variance === "left" && props.disabled
        ? 0
        : 0.7};
    background-color: rgba(255, 255, 255, 0.16);
    color: ${white};
    font-size: 18px;
    border-radius: 50%;
    height: 44px;
    width: 44px;
    display: flex;
    align-items: center;
    justify-content: center;

    ${(props) =>
      !props.disabled
        ? `
        :hover {
          opacity: 1;
          color: ${accent};
        }
      `
        : ""};
  }

  ${(props) =>
    props.variance === "right" &&
    `
    right: 0;
    margin-right: 0rem;
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
    margin-left: 0rem;
  `};

  ${(props) =>
    props.variance === "left" &&
    props.slideropen === TO_OPEN_SLIDER &&
    `
    left: ${sidebarItemDetailSliderWidth};
  `};
  cursor: ${(props) =>
    props.variance === "right" && props.disabled
      ? "default"
      : props.variance === "left" && props.disabled
      ? "default"
      : "pointer"};
`;
