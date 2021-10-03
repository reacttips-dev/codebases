import styled from "styled-components";
import { Card, Tab, Nav } from "react-bootstrap";
import {
  greyDark,
  primaryHover,
  primary,
  greyBlack,
  blackAlpha12,
  blackAlpha24,
  colorDisabled,
  advancedPanelSliderWidth,
  lightInactive,
  md,
  accent,
  primayColor,
} from "../variable";

/// TLDR Advanced panel
export const StyledAdvancedPanel = styled.div`
  -webkit-box-shadow: -8px 0 16px 0 rgba(0, 0, 0, 0.5);
  -moz-box-shadow: -8px 0 16px 0 rgba(0, 0, 0, 0.5);
  box-shadow: -8px 0 16px 0 rgba(0, 0, 0, 0.5);
  position: fixed;
  z-index: 1;
  transition: width 0.75s ease;
  right: 0;
  width: ${advancedPanelSliderWidth};
  height: calc(100% - 55px);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background-color: ${greyDark};
  padding: 27px 27px 27px 27px;
  overflow-y: auto;

  .ql-toolbar,
  .ql-snow {
    padding: 0px;
  }

  .back {
    height: 100%;
    color: ${lightInactive};
    display: flex;
    align-items: center;

    :hover {
      color: ${primaryHover};
    }
  }

  .advanced-content {
    // margin-bottom: 4rem;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .advanced-header {
    display: flex;
    align-items: center;
    flex-direction: row;
    margin-bottom: 10px;

    .info {
      flex-grow: 1;
    }
  }

  @media (max-width: ${md}) {
    width: 100%;
    position: static;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    box-shadow: none;
    height: auto;
  }
`;

export const StyledAdvancedTab = styled(Tab.Container)`
  max-height: 100%;
`;

export const StyledSidebarTabNav = styled(Nav)`
  display: flex;
  justify-content: space-evenly;
`;

export const StyledSidebarTabNavLink = styled(Nav.Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${(props) =>
    props.tldrbtn === "primary"
      ? primary
      : props.tldrbtn === "secondary"
      ? primary
      : lightInactive};
  text-transform: capitalize;
  font-size: 14px;

  ${(props) =>
    props.tldrbtn === "primary" &&
    `
    border-bottom: 3px solid ${primary};
    margin-bottom: -3px;
  `}

  :hover {
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

export const StyledAdvancedTabNav = styled(Nav.Link)`
  padding: 0.5rem;
  margin-right: 0.1rem;
  background: transparent !important;
  font-weight: 500;
  color: ${(props) =>
    props.tldrbtn === "primary"
      ? primary
      : props.tldrbtn === "secondary"
      ? primary
      : lightInactive};
  text-transform: capitalize;
  height: 38.5px;
  width: 38.5px;
  display: flex;
  align-items: center;
  justify-content: center;

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
        ? primary
        : props.tldrbtn === "secondary"
        ? primaryHover
        : primary};
    outline: none;
    box-shadow: none !important;
  }
`;

export const StyledAdvancedColumnFormat = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledAdvancedRowFormat = styled.div`
  display: flex;
  flex-direction: row;
`;

export const StyledActionCard = styled(Card)`
  width: calc(${advancedPanelSliderWidth} - 27px * 2);
  background-color: transparent;
  border: 0px;
`;

export const StyledActionCardBody = styled(StyledActionCard.Body)`
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.2);
  background-color: ${greyDark};
`;

export const StyledActionCardHeader = styled(StyledActionCard.Header)`
  font-weight: 600;
  font-size: 16px;
  padding: 0.75rem 0rem;
  background-color: transparent;

  display: flex;
  align-items: center;
  justify-content: start;

  .header {
    flex-grow: 1;
  }

  :hover {
    color: ${primaryHover};
  }
`;

export const StyledAdvancedSectionHeader = styled.div`
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 0.13px;
  line-height: 19px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: ${lightInactive};
  width: 100%;

  :hover {
    cursor: pointer;
  }

  div {
    svg {
      margin-right: 0.5rem;
    }
  }

  .subtitle {
    opacity: 0.7;
    text-transform: uppercase;
    color: #ffffff;
    font-size: 10px;
    letter-spacing: 0;
    line-height: 12px;
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &.stripe-payment-history-title {
    font-size: 20px;

    svg {
      font-size: 16px;
    }
  }
`;

export const StyledSelectedAnimationHeader = styled.div`
  font-size: 2rem;
  text-transform: capitalize;
`;

export const StyledColumnFlex = styled.div`
  display: flex;
  flex-direction: column;
`;

export const StyledAdvancedSectionHeaderWithToggle = styled.div`
  display: flex;
  flex-direction: row;
`;

export const StyledTextEffectTitle = styled.div`
  text-align: center;
  // margin: 1rem;
  font-size: 1rem;
  letter-spacing: 0.1px;
  color: #888888;
  margin-top: 0rem;
`;

export const StyledCollapsibleSectionIconsRow = styled.div`
  display: flex;
  flex-direction: row;
`;

export const StyledMotionPanelHeader = styled.div`
  font-size: 13px;
  letter-spacing: 0.13px;
  line-height: 19px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  color: ${lightInactive};
  width: 100%;
  margin-bottom: 1rem;
  text-transform: uppercase;
`;

export const StyledTldrBadgeWrapper = styled.div`
  position: relative;

  .badge.new-feature-badge {
    position: absolute;
    top: -10px;
    left: -10px;
    background-color: ${accent};
    color: ${primayColor};
    border-radius: 8px;
  }
`;
