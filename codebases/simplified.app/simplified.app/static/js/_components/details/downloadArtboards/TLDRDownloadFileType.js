import React, { Component } from "react";
import Select, { components } from "react-select";
import { findIndex } from "lodash";
import { StyledDropdownSectionHeader } from "../../styled/details/styleDownloadOptions";
import { StyldedTLDRBadge } from "../../styled/styles";

const Option = (props) => {
  return (
    <>
      <components.Option {...props}>
        {props.children}
        {props.data.isNew && (
          <StyldedTLDRBadge
            pill
            style={{ marginLeft: "0.5rem" }}
            isDisabled={props.data.isDisabled}
          >
            {"New"}
          </StyldedTLDRBadge>
        )}
        {props.data.isBeta && (
          <StyldedTLDRBadge
            style={{ marginLeft: "0.5rem" }}
            isDisabled={props.data.isDisabled}
          >
            {"BETA"}
          </StyldedTLDRBadge>
        )}
        <div style={{ opacity: 0.5 }}>{props.data.subtext}</div>
      </components.Option>
    </>
  );
};

class TLDRDownloadFileType extends Component {
  constructor(props) {
    super(props);
    this.fileTypes = [
      {
        value: "png",
        label: "PNG",
        subtext: "High quality image",
      },
      {
        value: "jpeg",
        label: "JPG",
        subtext: "Small file size image",
      },
      {
        value: "mp4",
        label: "Video",
        subtext: "Build a quick video",
        isNew: true,
      },
      {
        value: "svg",
        label: "SVG",
        subtext: "Sharp vector graphics at any size",
        isNew: true,
        isBeta: true,
        isDisabled: false,
      },
    ];
  }

  render() {
    const { fileType, isAnimatedStory } = this.props;
    let valueIndex = findIndex(this.fileTypes, {
      value: fileType,
    });

    const svgOptionIndex = findIndex(this.fileTypes, {
      value: "svg",
    });

    this.fileTypes[svgOptionIndex] = {
      ...this.fileTypes[svgOptionIndex],
      isDisabled: isAnimatedStory,
    };

    return (
      <>
        <StyledDropdownSectionHeader>Download as</StyledDropdownSectionHeader>
        <Select
          value={
            valueIndex > -1 ? this.fileTypes[valueIndex] : this.fileTypes[0]
          }
          defaultValue={this.fileTypes[0]}
          onChange={this.onChange}
          options={this.fileTypes}
          styles={fileTypeSelectStyle}
          placeholder="File Type"
          components={{ Option }}
        />
      </>
    );
  }

  onChange = (selectedValue) => {
    this.props.onFileTypeChange(selectedValue.value);
  };
}

TLDRDownloadFileType.propTypes = {};

export default TLDRDownloadFileType;

const fileTypeSelectStyle = {
  option: (provided, state) => {
    return {
      ...provided,
      fontFamily: "Rubik",
      backgroundColor: "transparent",
      color: state.isSelected
        ? "#FFAC42"
        : state.isDisabled
        ? "#888888"
        : "inherit",
      cursor: state.isDisabled ? "not-allowed" : "inherit",
      ":hover": {
        ...provided[":hover"],
        color: !state.isDisabled ? "#FFAC42" : "#888888",
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
    height: "32px",
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
