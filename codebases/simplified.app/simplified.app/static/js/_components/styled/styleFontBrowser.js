import styled from "styled-components";
import { ListGroup, Modal } from "react-bootstrap";
import { primary, headerHeight, sideBarWidth } from "./variable";
import { ADD_MORE_FONTS } from "../../_utils/constants";

export const StyledListGroupFontItem = styled(ListGroup.Item)`
  font-family: ${(props) => props.family};
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

export const StyledListUserListItem = styled(StyledListGroupFontItem)`
  padding: 0.75rem 0.25rem;
`;

export const StyledListGroupGoogleFont = styled(ListGroup)`
  flex-grow: 1;
  margin-right: 0.5rem;
  // height: 100%;
  overflow-y: auto;

  border: 1px solid rgba(255, 255, 255, 0.12);

  div {
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const StyledListGroupMyFont = styled(ListGroup)`
  overflow-y: auto;
  // border: 1px solid rgba(255, 255, 255, 0.12);
  height: calc(calc(100vh * 0.6) - 30px);
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const StyledMyFontListWrapper = styled.div`
  width: 30%;
  border-left: 1px solid rgba(255, 255, 255, 0.12);
  padding-left: 0.25rem;
`;

export const StyledListGroupGoogleFontItem = styled(StyledListGroupFontItem)`
  justify-content: unset;
  cursor: pointer;

  svg {
    // margin-right: 1rem;
    path {
      fill: ${primary};
    }
  }
`;

export const StyledFontBrowserModalBody = styled(Modal.Body)`
  display: flex;
  max-height: calc(
    100vh * 0.6
  ); // It should be configurable according to screen size
  padding: unset;
  margin: 1rem;
  overflow-y: hidden;
`;

export const StyledFontBrowserModal = styled(Modal)`
  top: ${headerHeight};
  left: ${sideBarWidth};
  width: calc(100% - ${sideBarWidth});
  height: calc(100% - ${headerHeight});
  z-index: 9050;
`;

export const StyledFontBrowserModalFooter = styled(Modal.Footer)`
  border-top: 1px solid rgba(255, 255, 255, 0.12);
`;

export const StyledGoogleFontItemName = styled.div`
  margin-left: 2rem;
  ${(props) =>
    props.isSelected &&
    `
    color: ${primary};
    margin-left: 1rem;
    `}
`;

export const StyledMyFontTitle = styled.div`
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

export const StyledGoogleFontFiltersWrapper = styled.div`
  display: flex;
  margin-bottom: 0.5rem;
  flex-direction: row;
`;

export const StyledGoogleFontListWrapper = styled.div`
  // flex-grow: 0.5;
  width: 70%;
`;

export const sortSelectStyle = {
  option: (provided, state) => {
    let moreFontCSS = {};

    if (state.data.label === ADD_MORE_FONTS) {
      moreFontCSS = {
        borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
      };
    }

    return {
      ...provided,
      fontFamily: "Rubik",
      backgroundColor: "transparent",
      color: state.isSelected ? "#FFAC42" : "inherit",
      ...moreFontCSS,
      ":hover": {
        ...provided[":hover"],
        color: "#FFAC42",
        backgroundColor: "transparent",
        cursor: state.data.label === ADD_MORE_FONTS ? "pointer" : "inherit",
      },
    };
  },
  input: (provided, state) => ({
    ...provided,
    color: "white",
  }),
  menu: (provided, state) => ({
    ...provided,
    background: "#323232",
    color: "white",
    boxShadow: "0 8px 16px 0 rgba(0,0,0,0.5)",
    borderRadius: "8px",
  }),
  menuList: (provided, state) => ({
    ...provided,
    maxHeight: "500px",
    "::-webkit-scrollbar": {
      ...provided["::-webkit-scrollbar"],
      display: "none",
    },
  }),
  control: (provided, state) => ({
    ...provided,
    border: "1px solid #FFFFFF",
    borderRadius: "8px",
    background: "transparent",
    width: "150px",
    height: "32px",
    boxShadow: "none",
    marginLeft: "0.5rem",
    ":hover": {
      ...provided[":hover"],
      border: "1px solid #FFFFFF",
      cursor: "text",
    },
  }),
  indicatorSeparator: (provided, state) => ({
    ...provided,
    display: "none",
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    color: "white",
    ":hover": {
      ...provided[":hover"],
      color: "white",
      cursor: "pointer !important",
    },
  }),
  indicatorContainer: (provided, state) => ({
    ...provided,
    color: "white",
    ":hover": {
      ...provided[":hover"],
      color: "white",
    },
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: "white",
    fontFamily: "Rubik",
    position: "unset",
    top: "unset",
    transform: "unset",
    maxWidth: "calc(100% - 10px)",
    display: state.selectProps.menuIsOpen ? "none" : "block",
  }),
};
