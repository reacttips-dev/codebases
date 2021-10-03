import styled from "styled-components";
import { black, blackAlpha, white } from "../variable";
import transparent from "./../../../assets/icons/transparent_small.png";

export const StyledBasicTextList = styled.div`
  cursor: pointer;
  div {
    margin-bottom: 1.5rem;
  }
`;

export const StyledColorPickerCover = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

export const StyledColorPickerPopover = styled.div`
  position: absolute;
  z-index: 3;
  ${(props) => `top: ${props.top}px`};
  ${(props) => `right: ${props.right}px`};
  ${(props) => `bottom: ${props.bottom}px`};
  ${(props) =>
    props.showBrandkitPaletteColors &&
    `background-color: ${blackAlpha};
    padding: 10px;
    border-radius: 4px;`}

  div[class="saturation-white"],
  div[class="hue-horizontal"] {
    cursor: pointer;
  }

  div[title="TRANSPARENT"] {
    background-image: url(${transparent}) !important;
    background-repeat: no-repeat !important;
    background-size: 16px 16px !important;
  }

  input {
    color: ${black};
    font-family: "Rubik";
  }
`;

export const StyledBrandkitTitle = styled.div`
  font-size: 12px;
  color: ${white};
  text-transform: capitalize;
  text-align: center;
`;
