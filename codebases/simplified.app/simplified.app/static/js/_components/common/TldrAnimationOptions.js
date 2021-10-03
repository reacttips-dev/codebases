import React, { Component } from "react";
import Select from "react-select";
import { animationOptionsStyle } from "../styled/details/stylesSelect";
import _ from "lodash";
import { connect } from "react-redux";

class TldrAnimationOptions extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { options, value } = this.props;
    let valueIndex = _.findIndex(options, function (option) {
      return option.value === value;
    });

    return (
      <>
        <Select
          value={
            valueIndex > 0
              ? options[valueIndex]
              : {
                  value: typeof value === "string" ? value : value.value,
                  label: typeof value === "string" ? value : value.title,
                }
          }
          onChange={this.onChange}
          options={options}
          styles={animationOptionsStyle}
        />
      </>
    );
  }

  onChange = (selected) => {
    this.props.onChange(selected);
  };
}

TldrAnimationOptions.propTypes = {};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (state) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TldrAnimationOptions);
