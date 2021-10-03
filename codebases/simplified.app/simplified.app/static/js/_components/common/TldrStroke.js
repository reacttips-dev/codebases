import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TldrCollpasibleSection from "./TldrCollpasibleSection";
import {
  StyledAdvEditorToolbarFormatGroup,
  StyledAdvEditorToolbarRow,
} from "../styled/details/stylesDetails";
import TldrSlider from "./TldrSlider";
import TLDRColorPicker from "./TLDRColorPicker";
import {
  checkInputboxValueRangeForSlider,
  rgbaTohex,
} from "../../_utils/common";
import Switch from "react-switch";
import { accent, white, accentGrey } from "../styled/variable";
import {
  DOMAIN_0_TO_20,
  FABRIC_ITEXT_ELEMENT,
  SLIDER_VALUE_REGEX,
} from "../details/constants";
import { isEmpty } from "lodash";

class TldrStroke extends Component {
  constructor(props) {
    super(props);
    const { strokeWidth, stroke } = props.editor.activeElement?.format || {};

    this.state = {
      collapse: true,
      strokeWidth: strokeWidth || 0,
      strokeColor: props.editor.activeElement.format?.stroke || "rgba(0,0,0,0)",
      checked: stroke ? true : false,
    };
  }

  handleToggleChange = () => {
    if (this.state.collapse && this.state.checked === false) {
      this.setState({ collapse: !this.state.collapse }, () => {
        this.onSwitchChange(true);
      });
    } else {
      this.setState({ collapse: !this.state.collapse });
    }
  };

  onUpdateStrokeWidth = (value) => {
    if (typeof value === "object") {
      const { strokeWidth } = this.state;
      if (
        strokeWidth === Number(Number(value[0]).toFixed(1)) ||
        strokeWidth === Number(Number(value).toFixed(1))
      )
        return;

      this.setState(
        {
          ...this.state,
          strokeWidth: value[0],
        },
        () => {
          this.onStrokeWidthChange(value[0]);
        }
      );
    } else if (typeof value === "string") {
    }
  };

  onStrokeWidthChange = (value) => {
    this.props.canvasRef.handler.objectHandler.strokeWidth(
      value,
      this.props.editor.activeElement
    );
  };

  onChangeStrokeWidth = (value) => {
    if (typeof value === "object") {
    } else if (typeof value === "string") {
      this.handleStrokeWidthFocusOut(value);
    }
  };

  handleStrokeWidthFocusOut = (text) => {
    let strokeWidthValue = null;
    if (
      text.match(SLIDER_VALUE_REGEX) &&
      checkInputboxValueRangeForSlider(text, DOMAIN_0_TO_20)
    ) {
      const { strokeWidth } = this.state;

      if (strokeWidth === Number(text)) return;
      strokeWidthValue = text;
    }

    this.setState(
      {
        strokeWidth: strokeWidthValue,
      },
      () => {
        this.onStrokeWidthChange(strokeWidthValue);
      }
    );
  };

  onChangeCompleteStrokeColorHandler = (action, hex) => {
    if (this.state.strokeColor === hex) return;

    this.setState({ strokeColor: hex }, () => {
      this.fillElementStrokeColor(hex);
    });
  };

  fillElementStrokeColor = (hex) => {
    const { canvasRef } = this.props;

    if (!hex) return;

    if (!hex.startsWith("rgba")) {
      if (!hex.includes("#")) {
        hex = "#" + hex;
      }
    }

    canvasRef.handler.objectHandler.strokeColor(
      hex,
      this.props.editor.activeElement
    );
  };

  renderSwitch = () => {
    return (
      <Switch
        onChange={this.onSwitchChange}
        checked={this.state.checked}
        offColor={white}
        onColor={accent}
        offHandleColor={accentGrey}
        checkedIcon={false}
        uncheckedIcon={false}
        height={15}
        width={40}
      />
    );
  };

  onSwitchChange = (checked, event, id) => {
    this.setState(
      {
        checked: checked,
        collapse: checked ? this.state.collapse : true,
        strokeColor: checked ? "rgba(245, 166, 35, 1)" : "rgba(0,0,0,0)",
        strokeWidth: checked ? 6 : 0,
      },
      () => {
        this.fillElementStrokeColor(
          checked ? "rgba(245, 166, 35, 1)" : "rgba(0,0,0,0)"
        );
        this.onStrokeWidthChange(checked ? 6 : 0);
      }
    );
  };

  render() {
    const { brandKit, canvasRef, activeElement } = this.props;
    if (activeElement?.id) {
      return <></>;
    }
    const { strokeColor, strokeWidth } = this.state;

    const { title, palette } =
      brandKit.brandkitPayload.length > 0 && brandKit.brandkitPayload[0];

    let activeObj = canvasRef.handler.canvas.getActiveObject();
    let activeSelectionStyle;
    if (activeObj && activeObj?.type === FABRIC_ITEXT_ELEMENT) {
      activeSelectionStyle =
        canvasRef.handler.textHandler.getStyleOfTextSelection()[0];
    }

    return (
      <>
        <TldrCollpasibleSection
          title="Stroke"
          collapse={this.state.collapse}
          toggleButton={this.renderSwitch()}
          onToggleCollapse={this.handleToggleChange}
        >
          <div className="actions mb-2">
            <TldrSlider
              hideIndicator={true}
              domain={DOMAIN_0_TO_20}
              onUpdate={this.onUpdateStrokeWidth}
              onChange={this.onChangeStrokeWidth}
              values={
                activeSelectionStyle?.strokeWidth
                  ? [activeSelectionStyle.strokeWidth]
                  : [strokeWidth]
              }
              showDecimals={true}
              title="Width"
              maxLength={4}
              handleFocus={this.onUpdateStrokeWidth}
              handleFocusOut={this.onChangeStrokeWidth}
              showInputbox={true}
              step={0.1}
            ></TldrSlider>
          </div>

          <StyledAdvEditorToolbarRow>
            <StyledAdvEditorToolbarFormatGroup>
              <div className="title">Color</div>
              <TLDRColorPicker
                colorCode={rgbaTohex(
                  activeSelectionStyle?.strokeColor
                    ? activeSelectionStyle.strokeColor
                    : strokeColor
                )}
                color={
                  activeSelectionStyle?.strokeColor
                    ? activeSelectionStyle.strokeColor
                    : strokeColor
                }
                callback={this.onChangeCompleteStrokeColorHandler}
                top={
                  brandKit.brandkitPayload.length > 0
                    ? isEmpty(palette)
                      ? -390
                      : -420
                    : -305
                }
                right={brandKit.brandkitPayload.length > 0 ? -87 : -74}
                showBrandkitPaletteColors={brandKit.brandkitPayload.length > 0}
              />
            </StyledAdvEditorToolbarFormatGroup>
          </StyledAdvEditorToolbarRow>
        </TldrCollpasibleSection>
      </>
    );
  }
}

TldrStroke.propTypes = {
  editor: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  editor: state.editor,
  brandKit: state.brandKit,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TldrStroke);
