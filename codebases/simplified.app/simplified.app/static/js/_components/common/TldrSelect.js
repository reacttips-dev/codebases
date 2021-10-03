import React from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {
  trInputBackground,
  primaryHover,
  lightInactive,
} from "../styled/variable";
import { InputGroup } from "react-bootstrap";

export const customStyles = {
  option: (provided, state) => ({
    ...provided,
    backgroundColor: "transparent",
    ":hover": {
      ...provided[":hover"],
      color: primaryHover,
    },

    ":active": {
      ...provided[":active"],
      backgroundColor: "transparent",
    },
  }),
  input: (provided, state) => ({
    ...provided,
    color: lightInactive,
    ":focus": {
      outline: "none",
    },
  }),
  menu: (provided, state) => ({
    ...provided,
    background: "#323232",
    color: lightInactive,
    boxShadow: "0 8px 16px 0 rgba(0,0,0,0.5)",
    borderRadius: "8px",
  }),
  menuList: (provided, state) => ({
    ...provided,
    fontSize: "14px",
  }),
  control: (provided, state) => ({
    ...provided,
    height: "40px",
    width: "240px",
    background: trInputBackground,
    color: "white",
    borderRadius: "8px",
    border: "none",
    ":hover": {
      ...provided[":hover"],
      border: "1px solid " + primaryHover,
    },
  }),
  clearIndicator: (provided, state) => ({
    ...provided,
    ":hover": {
      color: primaryHover,
    },
  }),
  indicatorSeparator: (provided, state) => ({
    ...provided,
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    ":hover": {
      color: primaryHover,
    },
  }),
  indicatorContainer: (provided, state) => ({
    ...provided,
  }),
  singleValue: (provided, state) => ({
    ...provided,
    height: "24px",
    borderRadius: "4px",
    color: lightInactive,
  }),
  multiValue: (provided, state) => ({
    ...provided,
    height: "24px",
    backgroundColor: "#FFAC41",
    borderRadius: "4px",
  }),
  multiValueLabel: (provided, state) => ({
    ...provided,
    color: "#000000",
    fontWeight: "500",
  }),
  multiValueRemove: (provided, state) => ({
    ...provided,
    color: "#000000",
    ":hover": {
      borderRadius: "8px",
      backgroundColor: "#FFAC41",
      color: lightInactive,
    },
  }),
};

function TldrSelect(props) {
  const options = [
    { value: "en", label: "🇺🇸  English" },
    { value: "es", label: "🇪🇸  Spanish" },
    { value: "ms", label: "🇲🇾  Malay" },
    { value: "pt", label: "🇵🇹  Portuguese" },
    { value: "fr", label: "🇫🇷  French" },
    { value: "de", label: "🇩🇪  German"},
  ];
  const selectedLanguage = props.selectedLanguage;
  const selectedOption = selectedLanguage
    ? options.filter(function (option) {
        return option.value === selectedLanguage;
      })
    : [options[0]];
  const animatedComponents = makeAnimated();

  return (
    <>
      <InputGroup className="search-box">
        <Select
          onChange={props.onSelect}
          isLoading={false}
          styles={customStyles}
          components={animatedComponents}
          defaultValue={selectedOption}
          name="colors"
          options={options}
          className="basic-multi-select"
          classNamePrefix="select"
        />
      </InputGroup>
    </>
  );
}

TldrSelect.propTypes = {};

export default TldrSelect;
