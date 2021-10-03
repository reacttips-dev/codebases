import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { createFilter } from "react-select";
import CreatableSelect from "react-select/creatable";
import { findIndex, orderBy } from "lodash";
import {
  StyledSelectMenuWithIncrementDecrementWrapper,
  tldrSelectMenuWithIncrementDecrementStyle,
  StyledOptionDecrementButton,
  StyledOptionIncrementButton,
} from "../styled/styleSelectMenuWithIncrementDecrement";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const TLDRSelectMenuWithIncrementDecrement = (props) => {
  const { placeholder, options: initialOptions } = props;
  let { value: initialValue } = props;

  if (typeof initialValue.value === "object" && initialValue.value.length > 0) {
    initialValue = {
      value: "",
      label: "",
    };
  }

  const [value, setValue] = useState(initialValue);
  const [options, setOptions] = useState(initialOptions);

  const valueIndex = findIndex(options, value);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  function onChange(selectedOption) {
    setValue(selectedOption);
    props.onValueChange(selectedOption.value);
  }

  function increment() {
    const { createOption, onValueChange, step } = props;
    let incrementedValue = createOption(parseFloat(value.label) + step);
    setValue(incrementedValue);
    onValueChange(incrementedValue.value);
  }

  function decrement() {
    const { createOption, onValueChange, step } = props;
    let decrementedValue = createOption(parseFloat(value.label) - step);
    setValue(decrementedValue);
    onValueChange(decrementedValue.value);
  }

  function onCreateOption(inputValue) {
    const { createOption, onValueChange } = props;

    const newOption = createOption(parseFloat(inputValue));
    setOptions(orderBy([...options, newOption], ["label"], ["asc"]));
    setValue(newOption);
    onValueChange(newOption.value);
  }

  return (
    <StyledSelectMenuWithIncrementDecrementWrapper>
      <OverlayTrigger
        placement="bottom"
        overlay={
          <Tooltip id={"tooltip-decrease"}>{"Decrease font size"}</Tooltip>
        }
      >
        <StyledOptionDecrementButton onClick={decrement}>
          <FontAwesomeIcon icon={faMinus} />
        </StyledOptionDecrementButton>
      </OverlayTrigger>
      <CreatableSelect
        filterOption={createFilter({
          matchFrom: "any",
          stringify: (option) => `${option.label}`,
        })}
        onChange={onChange}
        onCreateOption={onCreateOption}
        options={options}
        styles={tldrSelectMenuWithIncrementDecrementStyle}
        placeholder={placeholder}
        isSearchable
        formatCreateLabel={(inputValue) => {
          return parseFloat(inputValue);
        }}
        value={valueIndex > 0 ? options[valueIndex] : value}
      />
      <OverlayTrigger
        placement="bottom"
        overlay={
          <Tooltip id={"tooltip-increase"}>{"Increase font size"}</Tooltip>
        }
      >
        <StyledOptionIncrementButton onClick={increment}>
          <FontAwesomeIcon icon={faPlus} />
        </StyledOptionIncrementButton>
      </OverlayTrigger>
    </StyledSelectMenuWithIncrementDecrementWrapper>
  );
};

TLDRSelectMenuWithIncrementDecrement.propTypes = {
  options: PropTypes.array.isRequired,
  placeholder: PropTypes.string.isRequired,
  value: PropTypes.object.isRequired,
  onValueChange: PropTypes.func.isRequired,
  createOption: PropTypes.func.isRequired,
  step: PropTypes.number.isRequired,
};

TLDRSelectMenuWithIncrementDecrement.defaultProps = {
  options: [],
  placeholder: "Select",
  step: 1,
  value: {
    value: "",
    label: "",
  },
};

export default TLDRSelectMenuWithIncrementDecrement;
