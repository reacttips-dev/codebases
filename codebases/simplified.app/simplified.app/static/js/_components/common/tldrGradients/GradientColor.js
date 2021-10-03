import React, { Component } from "react";
import { connect } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { StyledGradientColor } from "../../styled/details/stylesDetails";
import TLDRColorPicker from "../TLDRColorPicker";

export class GradientColor extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showColorPicker: false,
      color: props.color,
    };
  }

  render() {
    const { showColorPicker, color } = this.state;
    const { top, right, brandKit } = this.props;

    return (
      <>
        {showColorPicker && (
          <TLDRColorPicker
            color={color}
            top={top}
            right={right}
            callback={(action, bk) => this.onColorChangeComplete(action, bk)}
            showBrandkitPaletteColors={brandKit.brandkitPayload.length > 0}
            gradientsColorPicker={true}
          />
        )}

        <OverlayTrigger
          trigger={["hover", "focus"]}
          placement="top"
          overlay={<Tooltip id="tldr-gradient-color-tooltip">{color}</Tooltip>}
        >
          <StyledGradientColor
            bgColor={color}
            onClick={(e) => {
              this.setState({
                showColorPicker: !showColorPicker,
              });
            }}
          />
        </OverlayTrigger>
      </>
    );
  }

  onColorChangeComplete = (action, bk) => {
    const { color } = this.state;
    if (color === bk) return;

    this.setState(
      {
        ...this.state,
        color: bk,
      },
      () => {
        this.props.changeSelectedColor(bk, color);
        this.props.applyGradient("push");
      }
    );
  };
}

GradientColor.propTypes = {};

const mapStateToProps = (state) => ({
  brandKit: state.brandKit,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(GradientColor);
