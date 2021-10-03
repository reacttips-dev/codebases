import Textfit from "react-textfit/lib/Textfit";
import styled from "styled-components";

export const StyledTextElementWrapper = styled.div`
  max-width: 100%;
  width: 100%;
  height: 100%;
  -webkit-user-drag: none;
  position: relative;
  z-index: 1;

  ${(props) => props.opacity && `opacity: ${props.opacity};`}

  ${(props) =>
    props.varients &&
    `
    -webkit-filter: ${props.varients};
    filter: ${props.varients};
  `};

  ${(props) =>
    props.border &&
    `
      border-radius: ${props.border.radius}%;
      border: ${props.border.size}px ${props.border.type} ${props.border.color} ;
  `};

  ${(props) =>
    props.transform &&
    `
    transform: ${props.transform};
  `};
`;

export const StyledTextFit = styled(Textfit)`
  width: 100%;
  height: 100%;
  color: white;
  padding: 0.25rem;
  > div {
    text-align: center;
  }
  ${(props) => props.family && `font-family: ${props.family}`};
`;
