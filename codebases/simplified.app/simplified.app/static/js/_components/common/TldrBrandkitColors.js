import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Select from "react-select";
import { brandkitOptionsStyle } from "../styled/details/stylesSelect";
import { StyledBrandkitTitle } from "../styled/details/stylesTextPanel";
import { CirclePicker } from "react-color";
import { switchBrandkit } from "../../_actions/brandKitActions";

class TldrBrandkitColors extends Component {
  constructor(props) {
    super(props);

    this.state = {
      brandkitOptions: [],
      selectedBrandkit: null,
    };
  }

  componentDidMount() {
    const { brandKit } = this.props;
    let options = this.state.brandkitOptions;

    brandKit.brandkitPayload.forEach((bk) => {
      options.push({
        value: bk.id,
        label: bk.title,
        palette: bk.palette[0],
      });
    });

    const selectedBrandkit = options.find(
      (bk) => bk.value === brandKit.selectedBrandkit
    );
    this.setState({
      brandkitOptions: options,
      selectedBrandkit: selectedBrandkit ? selectedBrandkit : options[0],
    });
  }

  selectBrandkit = (selected) => {
    this.setState(
      {
        ...this.state,
        selectedBrandkit: selected,
      },
      () => {
        this.props.switchBrandkit(selected.value);
      }
    );
  };

  render() {
    const { brandkitOptions, selectedBrandkit } = this.state;
    let colorElement = [];
    selectedBrandkit?.palette?.colors.map((color) => {
      return color.rgb && colorElement.push(color.rgb);
    });

    return (
      <>
        <Select
          options={brandkitOptions}
          onChange={(selected) => this.selectBrandkit(selected)}
          isSearchable={true}
          isClearable={false}
          value={selectedBrandkit}
          styles={brandkitOptionsStyle}
        />

        {selectedBrandkit?.palette === undefined ? (
          <StyledBrandkitTitle>Add palette to get started</StyledBrandkitTitle>
        ) : (
          <CirclePicker
            colors={colorElement}
            className="brandkit-palette-circles"
            onChangeComplete={({ rgb, hex }) => {
              this.props.handleOnChangeComplete({ rgb, hex });
            }}
          />
        )}

        <hr className="tldr-hl" />
      </>
    );
  }
}

TldrBrandkitColors.propTypes = {
  handleOnChangeComplete: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  brandKit: state.brandKit,
});

const mapDispatchToProps = (dispatch) => ({
  switchBrandkit: (id) => dispatch(switchBrandkit(id)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TldrBrandkitColors);
