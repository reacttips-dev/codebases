import styled from "styled-components";
import {
  previewArtboardPageIndicatorHeight,
  previewNavbarHeight,
} from "../variable";

export const StyledWhoIsOnline = styled.div`
  padding: 10px 0px 10px 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledPreviewFrame = styled.div`
  ${(props) => props.show && `border: 5px solid #FFAC41;`}
  height: 100vh;
  width: 100vw;
  position: relative;
`;

export const StyledPreviewArea = styled.div`
  width: 100%;
  // height: calc(
  //   100% - ${previewNavbarHeight} - ${previewArtboardPageIndicatorHeight}
  // );
  height: calc(100% - ${previewNavbarHeight});
  top: ${previewNavbarHeight};
  position: relative;
`;

export const StyledPreviewArtboardIndicators = styled.div`
  width: 100%;
  height: ${previewArtboardPageIndicatorHeight};
  position: absolute;
  bottom: 0;
  border-top: 1px solid rgb(255 255 255 / 50%);
`;
