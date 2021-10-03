import { ADD_MORE_FONTS } from "../../../_utils/constants";

export const fontSelectStyle = {
  option: (provided, state) => {
    let moreFontCSS = {};

    if (state.data.label === ADD_MORE_FONTS) {
      moreFontCSS = {
        borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
        color: "#FFAC42",
        fontWeight: 500,
        textAlign: "center",
      };
    }

    return {
      ...provided,
      fontFamily: state.data.label || "Rubik",
      backgroundColor: "transparent",
      color: state.isSelected ? "#FFAC42" : "inherit",
      ...moreFontCSS,
      fontSize: "16px",
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
    // border: "1px solid #858585",
    border: "none",
    borderRadius: "8px",
    background: "rgba(0,0,0,0.16)",
    width: "150px",
    height: "32px",
    minHeight: "32px",
    boxShadow: "none",
    ":hover": {
      ...provided[":hover"],
      // border: "1px solid #858585",
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
  valueContainer: (provided, state) => ({
    ...provided,
    padding: "0px 8px",
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    height: "32px !important",
  }),
  indicatorContainer: (provided, state) => ({
    ...provided,
    color: "white",
    height: "32px !important",
    width: "32px important",
    ":hover": {
      ...provided[":hover"],
      color: "white",
    },
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: "white",
    fontFamily: state.data.label,
    position: "unset",
    top: "unset",
    transform: "unset",
    maxWidth: "calc(100% - 10px)",
    display: state.selectProps.menuIsOpen ? "none" : "block",
  }),
  groupHeading: (provided, state) => ({
    ...provided,
    color: "#888888",
    fontFamily: "Rubik",
    fontWeight: "bold",
    textTransform: "capitalize",
    fontSize: "12px",
  }),
  group: (provided, state) => ({
    ...provided,
    borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
  }),
};

export const fontWeightStyle = {
  option: (provided, state) => {
    return {
      ...provided,
      fontFamily: state.data.family || "Rubik",
      fontStyle: state.data.style,
      fontWeight: state.data.weight,
      backgroundColor: "transparent",
      color: state.isSelected ? "#FFAC42" : "inherit",
      ":hover": {
        ...provided[":hover"],
        color: "#FFAC42",
        backgroundColor: "transparent",
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
  control: (provided, state) => {
    return {
      ...provided,
      // border: "1px solid #858585",
      minHeight: "32px",
      borderRadius: "8px",
      background: "rgba(0,0,0,0.16)",
      border: "none",
      width: "150px",
      height: "32px",
      boxShadow: "none",
      cursor: state.isDisabled ? "not-allowed" : "default",
      ":hover": {
        ...provided[":hover"],
        // border: "1px solid #FFFFFF",
      },
    };
  },
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
      cursor: state.isDisabled ? "not-allowed" : "pointer !important",
    },
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    padding: "0px 8px",
  }),
  indicatorContainer: (provided, state) => ({
    ...provided,
    color: "white",
    height: "32px !important",
    width: "32px important",
    ":hover": {
      ...provided[":hover"],
      color: "white",
    },
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    height: "32px !important",
  }),
  singleValue: (provided, state) => ({
    ...provided,
    color: "white",
    fontFamily: state.data.family,
    fontStyle: state.data.style,
    fontWeight: state.data.weight,
    position: "unset",
    top: "unset",
    transform: "unset",
    maxWidth: "calc(100% - 10px)",
    display: state.selectProps.menuIsOpen ? "none" : "block",
  }),
  groupHeading: (provided, state) => ({
    ...provided,
    color: "#FFAC41",
    fontFamily: "Rubik",
    fontWeight: "bold",
  }),
  group: (provided, state) => ({
    ...provided,
    borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
  }),
  container: (provided, state) => ({
    ...provided,
    pointerEvents: state.isDisabled ? "all" : "auto",
  }),
};

export const animationOptionsStyle = {
  option: (provided, state) => {
    return {
      ...provided,
      backgroundColor: "transparent",
      color: state.isSelected ? "#FFAC42" : "inherit",
      ":hover": {
        ...provided[":hover"],
        color: "#FFAC42",
        backgroundColor: "transparent",
        cursor: "pointer",
      },
    };
  },
  input: (provided, state) => ({
    ...provided,
    color: "white",
    lineHeight: "13px",
    fontSize: "14px",
  }),
  menu: (provided, state) => ({
    ...provided,
    background: "#323232",
    color: "white",
    boxShadow: "0 8px 16px 0 rgba(0,0,0,0.5)",
    borderRadius: "8px",
    zIndex: 1000,
  }),
  menuList: (provided, state) => ({
    ...provided,
    maxHeight: "210px",
    "::-webkit-scrollbar": {
      ...provided["::-webkit-scrollbar"],
      display: "none",
    },
  }),
  control: (provided, state) => ({
    ...provided,
    // border: "1px solid #858585",
    border: "none",
    borderRadius: "8px",
    background: "rgba(0,0,0,0.16)",
    minHeight: "32px",
    width: "195px",
    height: "32px",
    boxShadow: "none",
    ":hover": {
      ...provided[":hover"],
      // border: "1px solid #858585",
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
  valueContainer: (provided, state) => ({
    ...provided,
    padding: "0px 8px",
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    height: "32px !important",
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
    position: "unset",
    top: "unset",
    transform: "unset",
    maxWidth: "calc(100% - 10px)",
    display: state.selectProps.menuIsOpen ? "none" : "block",
    lineHeight: "13px",
  }),
  groupHeading: (provided, state) => ({
    ...provided,
    color: "#FFAC41",
  }),
  group: (provided, state) => ({
    ...provided,
    borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
  }),
};

export const globalSearchStyle = {
  option: (provided, state) => {
    return {
      ...provided,
      backgroundColor: state.isFocused
        ? "rgba(255, 255, 255, 0.12)"
        : "transparent",
      color: state.isSelected || state.isFocused ? "#FFAC42" : "inherit",
      ":hover": {
        ...provided[":hover"],
        color: "#FFAC42",
        backgroundColor: "rgba(255, 255, 255, 0.12)",
        cursor: "pointer",
      },
    };
  },
  menu: (provided, state) => ({
    ...provided,
    background: "#323232",
    color: "white",
    boxShadow: "0 8px 16px 0 rgba(0,0,0,0.5)",
    borderRadius: "8px",
  }),
  menuList: (provided, state) => ({
    ...provided,
    maxHeight: "350px",
    "::-webkit-scrollbar": {
      ...provided["::-webkit-scrollbar"],
      display: "none",
    },
  }),
  control: (provided, state) => ({
    ...provided,
    border: "1px solid #858585",
    borderRadius: "4px",
    background: "transparent",
    width: "100%",
    height: "50px",
    boxShadow: "none",
    paddingLeft: "10px",
    ":hover": {
      ...provided[":hover"],
      border: "1px solid #858585",
      cursor: "text",
    },
  }),
  input: (provided, state) => ({
    ...provided,
    color: "white",
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
  clearIndicator: (provided, state) => ({
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
    position: "unset",
    top: "unset",
    transform: "unset",
    maxWidth: "calc(100% - 10px)",
    display: "block",
  }),
  groupHeading: (provided, state) => ({
    ...provided,
    color: "#FFAC41",
  }),
  group: (provided, state) => ({
    ...provided,
    borderBottom: "1px dashed rgba(255, 255, 255, 0.12)",
  }),
};

export const categoryOptionsStyle = {
  option: (provided, state) => {
    return {
      ...provided,
      backgroundColor: "transparent",
      color: state.isSelected ? "#FFAC42" : "inherit",
      ":hover": {
        ...provided[":hover"],
        color: "#FFAC42",
        backgroundColor: "transparent",
        cursor: "pointer",
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
    maxHeight: "210px",
    "::-webkit-scrollbar": {
      ...provided["::-webkit-scrollbar"],
      display: "none",
    },
  }),
  control: (provided, state) => ({
    ...provided,
    border: "1px solid #858585",
    borderRadius: "4px",
    background: "transparent",
    width: "100%",
    minHeight: "32px",
    boxShadow: "none",
    ":hover": {
      ...provided[":hover"],
      border: "1px solid #858585",
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
    position: "unset",
    top: "unset",
    transform: "unset",
    maxWidth: "calc(100% - 10px)",
    display: state.selectProps.menuIsOpen ? "none" : "block",
  }),
  groupHeading: (provided, state) => ({
    ...provided,
    color: "#FFAC41",
  }),
  group: (provided, state) => ({
    ...provided,
    borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
  }),
  clearIndicator: (provided, state) => ({
    ...provided,
    color: "white",
    ":hover": {
      ...provided[":hover"],
      color: "white",
      cursor: "pointer !important",
    },
  }),
  multiValue: (provided, state) => {
    return {
      ...provided,
      background: "#FFAC41",
      borderRadius: "30px",
      color: "#1E1E1E",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    };
  },
  multiValueLabel: (provided, state) => ({
    ...provided,
    marginLeft: "0.25rem",
  }),
  multiValueRemove: (provided, state) => ({
    ...provided,
    background: "#1E1E1E",
    color: "#D8D8D8",
    borderRadius: "50%",
    height: "20px",
    width: "20px",
    margin: "0rem 0.25rem",

    ":hover": {
      ...provided[":hover"],
      background: "#1E1E1E",
      color: "#D8D8D8",
      borderRadius: "50%",
      cursor: "pointer",
    },
  }),
};

export const brandkitOptionsStyle = {
  option: (provided, state) => {
    return {
      ...provided,
      backgroundColor: "transparent",
      color: state.isSelected ? "#FFAC42" : "inherit",
      ":hover": {
        ...provided[":hover"],
        color: "#FFAC42",
        backgroundColor: "transparent",
        cursor: "pointer",
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
    width: "100%",
    color: "white",
    boxShadow: "0 8px 16px 0 rgba(0,0,0,0.5)",
    borderRadius: "8px",
    marginTop: "0px",
  }),
  menuList: (provided, state) => ({
    ...provided,
    maxHeight: "210px",
    "::-webkit-scrollbar": {
      ...provided["::-webkit-scrollbar"],
      display: "none",
    },
  }),
  control: (provided, state) => ({
    ...provided,
    border: "none",
    background: "transparent",
    width: "100%",
    minHeight: "32px",
    boxShadow: "none",
    ":hover": {
      ...provided[":hover"],
      border: "none",
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
    svg: {
      height: "14px",
      width: "14px",
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
    position: "unset",
    top: "unset",
    transform: "unset",
    maxWidth: "calc(100% - 10px)",
    display: state.selectProps.menuIsOpen ? "none" : "block",
  }),
  clearIndicator: (provided, state) => ({
    ...provided,
    color: "white",
    ":hover": {
      ...provided[":hover"],
      color: "white",
      cursor: "pointer !important",
    },
  }),
  valueContainer: (provided, state) => ({
    ...provided,
    padding: "2px 8px 2px 0px",
  }),
};

export const templateFilterOptionsStyle = {
  option: (provided, state) => {
    return {
      ...provided,
      backgroundColor: "transparent",
      color: state.isSelected ? "#FFAC42" : "inherit",
      ":hover": {
        ...provided[":hover"],
        color: "#FFAC42",
        backgroundColor: "transparent",
        cursor: "pointer",
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
    width: "300px",
    color: "white",
    boxShadow: "0 8px 16px 0 rgba(0,0,0,0.5)",
    borderRadius: "8px",
    right: "0 !important",
  }),
  menuList: (provided, state) => ({
    ...provided,
    maxHeight: "210px",
    "::-webkit-scrollbar": {
      ...provided["::-webkit-scrollbar"],
      display: "none",
    },
  }),
  control: (provided, state) => ({
    ...provided,
    border: "none",
    background: "#323232",
    width: "207px",
    minHeight: "40px",
    boxShadow: "none",
    borderRadius: "8px",
    ":hover": {
      ...provided[":hover"],
      border: "none",
      cursor: "pointer",
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
    position: "unset",
    top: "unset",
    transform: "unset",
    maxWidth: "calc(100% - 10px)",
    display: state.selectProps.menuIsOpen ? "none" : "block",
  }),
  placeholder: (provided, state) => ({
    ...provided,
    color: "white",
  }),
};

export const sumoSelectWorkspaceOptionsStyle = {
  option: (provided, state) => {
    return {
      ...provided,
      backgroundColor: "transparent",
      color: state.isSelected ? "#FFAC42" : "inherit",
      ":hover": {
        ...provided[":hover"],
        color: "#FFAC42",
        backgroundColor: "transparent",
        cursor: "pointer",
      },
    };
  },
  input: (provided, state) => ({
    ...provided,
    color: "#D8D8D8",
    paddingLeft: "0.5rem",
  }),
  menu: (provided, state) => ({
    ...provided,
    background: "#323232",
    color: "white",
    boxShadow: "0 8px 16px 0 rgba(0,0,0,0.5)",
    borderRadius: "4px",
  }),
  menuList: (provided, state) => ({
    ...provided,
    maxHeight: "210px",
    "::-webkit-scrollbar": {
      ...provided["::-webkit-scrollbar"],
      display: "none",
    },
  }),
  control: (provided, state) => ({
    ...provided,
    border: "none",
    background: "rgba(0,0,0,0.25)",
    minHeight: "48px",
    boxShadow: "none",
    borderRadius: "4px",
    marginTop: "1rem",
    ":hover": {
      ...provided[":hover"],
      border: "none",
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
    position: "unset",
    top: "unset",
    transform: "unset",
    maxWidth: "calc(100% - 10px)",
    display: state.selectProps.menuIsOpen ? "none" : "block",
  }),
  placeholder: (provided, state) => ({
    ...provided,
    color: "#D8D8D8",
    fontSize: "1rem",
    paddingLeft: "0.5rem",
  }),
};
