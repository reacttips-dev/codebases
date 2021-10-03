import React, { Component } from "react";
import Select from "react-select";
import { fontWeightStyle } from "../../../styled/details/stylesSelect";
import { FONT_WEIGHTS } from "../../../../_utils/constants";
import { findIndex } from "lodash";

class TLDRFontWeight extends Component {
  render() {
    let { variants, font, fontWeight } = this.props;

    // Filter variant which doesn't have italic
    variants = variants.filter(
      (variant, index) => !variant.toString().includes("italic")
    );

    let fontWeightOptions = variants.map((variant, index) => {
      return {
        value: variant,
        label:
          FONT_WEIGHTS[variant]?.label ||
          `${FONT_WEIGHTS[variant]?.fontWeight || fontWeight}`,
        family: font,
        weight: FONT_WEIGHTS[variant]?.fontWeight || fontWeight,
      };
    });

    let valueIndex = findIndex(fontWeightOptions, {
      weight: Number(fontWeight),
    });

    return (
      <>
        <Select
          value={
            valueIndex > -1
              ? fontWeightOptions[valueIndex]
              : { label: "Font weight" }
          }
          onChange={this.onChange}
          options={fontWeightOptions}
          styles={fontWeightStyle}
          placeholder="Font Weight"
          isDisabled={variants.length === 0 || !variants}
        />
      </>
    );
  }

  onChange = (selected) => {
    this.props.onFontWeightChange(selected.weight);
  };
}

TLDRFontWeight.propTypes = {};

TLDRFontWeight.defaultProps = {
  fontWeight: 400,
};

export default TLDRFontWeight;
