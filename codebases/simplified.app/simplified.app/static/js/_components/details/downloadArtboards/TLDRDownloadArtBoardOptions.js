import React, { Component } from "react";
import Select from "react-select";
import { StyledDropdownSectionHeader } from "../../styled/details/styleDownloadOptions";
import { grey, greyBlack } from "../../styled/variable";

class TLDRDownloadArtBoardOptions extends Component {
  render() {
    const { selectedArtBoards, artboardsList } = this.props;

    return (
      <>
        <StyledDropdownSectionHeader>
          Select artboards
        </StyledDropdownSectionHeader>
        <Select
          value={selectedArtBoards}
          defaultValue={artboardsList.slice(1)}
          onChange={this.onChange}
          options={artboardsList}
          styles={fileTypeSelectStyle}
          placeholder="Art Boards"
          isMulti
          // closeMenuOnSelect={false}
          components={
            {
              // MultiValue,
              // ValueContainer,
            }
          }
        />
      </>
    );
  }

  onChange = (selected) => {
    if (selected && selected.length > 0) {
      const first = selected[0];
      const last = selected[selected.length - 1];
      if (first.id === "all") {
        // User selected anything beside all artboards
        this.props.onArtBoardsSelectionChange(selected.slice(1));
        return;
      } else if (last.id === "all") {
        this.props.onArtBoardsSelectionChange([last]);
        return;
      }
    }
    this.props.onArtBoardsSelectionChange(selected);
  };

  getOptionValue = (option, index) => {
    return option.value;
  };
}

TLDRDownloadArtBoardOptions.propTypes = {};

export default TLDRDownloadArtBoardOptions;

const fileTypeSelectStyle = {
  option: (provided, state) => {
    return {
      ...provided,
      fontFamily: "Rubik",
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
    lineHeight: "13px",
    fontSize: "14px",
  }),
  menu: (provided, state) => ({
    ...provided,
    background: "#323232",
    color: "white",
    boxShadow: "0 8px 16px 0 rgba(0,0,0,0.5)",
    borderRadius: "8px",
    width: "300px",
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
    border: "none",
    borderRadius: "8px",
    background: "rgba(0,0,0,0.16)",
    minHeight: "32px",
    width: "100%",
    height: "auto",
    boxShadow: "none",
    ":hover": {
      ...provided[":hover"],
      // border: "1px solid #FFFFFF",
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
    fontFamily: "Rubik",
    position: "unset",
    top: "unset",
    transform: "unset",
    maxWidth: "calc(100% - 10px)",
    display: state.selectProps.menuIsOpen ? "none" : "block",
    lineHeight: "13px",
    fontSize: "14px",
  }),
  multiValue: (provided, state) => ({
    ...provided,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    color: "white",
  }),
  multiValueLabel: (provided, state) => ({
    ...provided,
    color: "white",
  }),
  multiValueRemove: (provided, state) => ({
    ...provided,
    ":hover": {
      ...provided[":hover"],
      backgroundColor: grey,
      color: greyBlack,
      cursor: "pointer",
    },
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
    padding: "0rem 1.5rem 0.25rem 1.5rem",
  }),
};
