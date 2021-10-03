import styled from "styled-components";
import {
  blackAlpha,
  secondaryColor,
  primary,
  lightInactive,
} from "../variable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InlineSVG from "svg-inline-react";

export const StyledLayerItem = styled.div`
  background-color: ${blackAlpha};
  width: 100%;
  min-height: 56px;
  display: flex;
  flex-direction: row;
  padding: 0.25rem;
  align-items: center;
  margin-bottom: 0.5rem;
  color: ${lightInactive};
  cursor: pointer;

  :hover,
  &.active {
    outline: 3px ${primary} solid;
    box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);
    -webkit-box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);
    -moz-box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);
  }
`;

export const StyledLayerItemIcon = styled.div`
  background-color: ${secondaryColor};
  width: 48px;
  height: 48px;
  margin-right: 0.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${lightInactive};
`;

export const StyledLayerItemDescription = styled.div`
  color: ${lightInactive};
  font-size: ${(props) => (props.location === "edit" ? "16px" : "13px")};
  font-weight: ${(props) => (props.location === "edit" ? "500" : "normal")};
  letter-spacing: 0.13px;
  line-height: ${(props) => (props.location === "edit" ? "22px" : "normal")};
  font-family: Rubik;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
  overflow: hidden;
  width: 80%;
`;

export const StyledLayerItemDragGrip = styled(FontAwesomeIcon)`
  font-size: 1.5rem;
  cursor: pointer;
`;

export const StyledLayerTextIcon = styled.p`
  color: ${lightInactive};
`;

export const StyledLayerImageIcon = styled.img`
  max-width: 100%;
  max-height: 100%;
  height: 80%;
`;

export const StyledLayerSVGIcon = styled(InlineSVG)`
  max-width: 100%;
  max-height: 100%;
  color: ${lightInactive};
  fill: ${lightInactive};
  height: 80%;

  svg {
    height: 100%;
    width: 35px !important;
    max-width: 35px !important;
  }
`;

export const StyledSlideAnimationItem = styled.div`
  background-color: ${blackAlpha};
  width: 100%;
  min-height: 56px;
  display: flex;
  flex-direction: row;
  padding: 0.25rem 1rem;
  align-items: center;
  margin-bottom: 0.5rem;
  color: ${lightInactive};
  cursor: pointer;

  :hover,
  &.active {
    outline: 3px ${primary} solid;
    box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);
    -webkit-box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);
    -moz-box-shadow: 0px 0px 10px 1px rgba(255, 172, 65, 0.75);
  }
`;

export const StyledSlideAnimationDescription = styled.div`
  color: ${lightInactive};
  font-size: 16px;
  font-family: Rubik;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  overflow: hidden;
  width: 100%;
  text-transform: capitalize;
  align-items: center;
`;

export const StyledAnimationTimeContainer = styled.div`
  color: ${lightInactive};
  background-color: rgba(0, 0, 0, 0.2);
  padding: 0.25rem 0.5rem;
`;

export const StyledAppliedAnimationsListContainer = styled(
  StyledLayerItemDescription
)`
  display: flex;
  flex-direction: row;
`;

export const StyledLayerHeaderAndAnimationContainer = styled.div`
  width: 69%;
`;

export const StyledLayerItemColumn = styled.div`
  width: 75%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .layer-title {
    margin-bottom: 0px !important;
    font-size: 14px;
    color: rgba(255, 255, 255, 0.8);
  }
`;
