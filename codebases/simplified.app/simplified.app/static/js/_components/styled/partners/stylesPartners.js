import { Modal } from "react-bootstrap";
import styled from "styled-components";
import {
  filterGridItem,
  greyDark,
  white,
  headerHeight,
  sideBarWidth,
} from "../variable";

export const StyledPartnerCard = styled.div`
  display: flex;
  flex-direction: row;
  overflow: hidden;
  align-items: center;
  img {
    flex-shrink: 0;
    width: 50px;
    height: 50px;
    border-radius: 8px;
    margin-right: 12px;
    background-color: ${greyDark};
  }

  .partner-logo {
    flex-shrink: 0;
    width: 50px;
    height: 50px;
    border-radius: 8px;
    margin-right: 12px;
    fill: currentColor;
  }

  .partner {
    display: flex;
    flex-direction: column;
    .title {
      font-weight: 500;
      margin-top: 5px;
      width: 100%;
      color: #ffffff;
      font-size: 14px;
      word-wrap: break-word;
      word-break: break-all;
    }

    .desc {
      font-weight: normal;
      color: #888888;
      font-size: 12px;
      letter-spacing: 0;
    }
  }
`;

export const StyledModal = styled(Modal)`
  top: ${headerHeight};
  left: ${sideBarWidth};
  width: calc(100% - ${sideBarWidth});
  height: calc(100% - ${headerHeight});
  z-index: 9050;
`;

export const StyledModalHeader = styled(Modal.Header)``;

export const StyledModalTitle = styled(Modal.Title)``;

export const StyledModalBody = styled(Modal.Body)`
  ::-webkit-scrollbar {
    display: none;
  }
`;

export const StyledModalFooter = styled(Modal.Footer)``;

export const StyledProductCollection = styled.div`
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

export const StyledProductCardsWrapper = styled.div`
  overflow-y: "auto";
  height: calc(100% - 36px); // 36px is height of search box
  ::-webkit-scrollbar {
    display: none;
  }
`;
