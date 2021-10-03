import styled from "styled-components";
import { white, accent, accentGrey } from "./variable";

export const StyledSelectMenuWithIncrementDecrementWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 8px !important;
`;

export const StyledOptionChangeButton = styled.button`
  background: none !important;
  cursor: pointer;
  display: inline-block;
  float: left;
  cursor: pointer;
  color: ${white};
  width: 28px;
  height: 38px;
  border: 1px solid ${accentGrey} !important;
  align-items: stretch;
  // padding: 6px !important;
  :hover,
  :focus {
    color: ${accent} !important;
    outline: none;
  }
`;

export const StyledOptionDecrementButton = styled(StyledOptionChangeButton)`
  border-radius: 8px 0px 0px 8px !important;
  border: none !important;
  background-color: rgba(0, 0, 0, 0.16) !important;
  min-height: 32px;
  height: 32px !important;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledOptionIncrementButton = styled(StyledOptionChangeButton)`
  border-radius: 0px 8px 8px 0px !important;
  border: none !important;
  background-color: rgba(0, 0, 0, 0.16) !important;
  min-height: 32px;
  height: 32px !important;
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const tldrSelectMenuWithIncrementDecrementStyle = {
  option: (provided, state) => ({
    ...provided,
    fontFamily: "Rubik",
    backgroundColor: "transparent",
    color: state.isSelected ? "#FFAC42" : "inherit",
    ":hover": {
      ...provided[":hover"],
      color: "#FFAC42",
      backgroundColor: "transparent",
    },
  }),
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
    // border: "1px solid #858585",
    borderRadius: "0px",
    background: "rgba(0,0,0,0.16)",
    width: "64px",
    height: "32px",
    minHeight: "32px",
    boxShadow: "none",
    border: "none",
    ":hover": {
      ...provided[":hover"],
      // border: "1px solid #858585",
      cursor: "text",
    },
    ">div": {
      padding: "0px 8px",
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
    },
    display: "none",
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
    fontFamily: state.data.value,
    position: "unset",
    top: "unset",
    transform: "unset",
    maxWidth: "calc(100% - 10px)",
    display: state.selectProps.menuIsOpen ? "none" : "block",
  }),
};
