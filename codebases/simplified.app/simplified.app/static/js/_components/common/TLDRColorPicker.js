import React, { Component } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tooltip, OverlayTrigger } from "react-bootstrap";
import { SketchPicker } from "react-color";
import { getColorPickerButtonStyle } from "../../_utils/common";
import { DEFAULT_COLOR_PRESETS, HEX_COLOR_REGEX } from "../details/constants";
import {
  StyledColorPickerIconButton,
  StyledColorPickerButton,
} from "../styled/details/stylesDetails";
import {
  StyledColorPickerCover,
  StyledColorPickerPopover,
} from "../styled/details/stylesTextPanel";
import EditableLabel from "../common/EditableLabel";
import Format from "string-format";
import TldrBrandkitColors from "./TldrBrandkitColors";

class TLDRColorPicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayColorPicker: false,
    };

    this.handleFocus = this.handleFocus.bind(this);
    this.handleFocusOut = this.handleFocusOut.bind(this);
  }

  render() {
    const { displayColorPicker } = this.state;
    const {
      title,
      icon,
      color,
      property,
      action,
      callback,
      top,
      right,
      colorCode,
      showIcon,
      showBrandkitPaletteColors,
      gradientsColorPicker,
      inputWidth,
    } = this.props;

    return (
      <div className="tldr-color-picker mr-0">
        <OverlayTrigger
          key={property}
          placement="bottom"
          overlay={<Tooltip id={`tooltip-${property}`}>{title}</Tooltip>}
        >
          <>
            {showIcon && (
              <StyledColorPickerIconButton
                onClick={this.toggleColorPicker}
                showColorCode={colorCode ? true : false}
                width={"32px"}
              >
                <FontAwesomeIcon icon={icon} />
              </StyledColorPickerIconButton>
            )}
            {colorCode && (
              <StyledColorPickerIconButton
                showColorCode={colorCode ? true : false}
                isIconDisplayed={showIcon}
                width={inputWidth}
              >
                <EditableLabel
                  text={colorCode}
                  labelClassName="colorcodename"
                  inputClassName="colorcodeinput"
                  onFocus={(text) => this.handleFocus(text)}
                  onFocusOut={(text) => this.handleFocusOut(action, text)}
                  showIcon={false}
                  inputMaxLength={7}
                  labelPlaceHolder="try #f00"
                />
              </StyledColorPickerIconButton>
            )}
          </>
        </OverlayTrigger>

        {!gradientsColorPicker && (
          <StyledColorPickerButton
            onClick={this.toggleColorPicker}
            style={getColorPickerButtonStyle(color)}
          ></StyledColorPickerButton>
        )}

        {gradientsColorPicker && (
          <StyledColorPickerPopover
            top={top}
            right={right}
            showBrandkitPaletteColors={showBrandkitPaletteColors}
          >
            {showBrandkitPaletteColors && (
              <TldrBrandkitColors
                handleOnChangeComplete={({ rgb, hex }) => {
                  let bk = Format(
                    "rgba({},{},{},{})",
                    rgb.r,
                    rgb.g,
                    rgb.b,
                    rgb.a
                  );
                  callback(action, bk);
                }}
              />
            )}
            <SketchPicker
              disableAlpha={true}
              presetColors={DEFAULT_COLOR_PRESETS}
              color={color}
              onChangeComplete={({ rgb, hex }) => {
                const bk = `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`;
                callback(action, bk);
              }}
            />
          </StyledColorPickerPopover>
        )}

        {displayColorPicker && (
          <StyledColorPickerPopover
            top={top}
            right={right}
            showBrandkitPaletteColors={showBrandkitPaletteColors}
          >
            <StyledColorPickerCover
              onClick={this.closeColorPicker}
              style={{ width: "28px !important" }}
            />
            {showBrandkitPaletteColors && (
              <TldrBrandkitColors
                handleOnChangeComplete={({ rgb, hex }) => {
                  let bk = Format(
                    "rgba({},{},{},{})",
                    rgb.r,
                    rgb.g,
                    rgb.b,
                    rgb.a
                  );
                  callback(action, bk);
                }}
              />
            )}
            <SketchPicker
              disableAlpha={true}
              presetColors={DEFAULT_COLOR_PRESETS}
              color={color}
              onChangeComplete={({ rgb, hex }) => {
                const bk = `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`;
                callback(action, bk);
              }}
            />
          </StyledColorPickerPopover>
        )}
      </div>
    );
  }

  toggleColorPicker = () => {
    const { displayColorPicker } = this.state;
    this.setState({
      ...this.state,
      displayColorPicker: !displayColorPicker,
    });
  };

  closeColorPicker = () => {
    this.setState({
      ...this.state,
      displayColorPicker: false,
    });
  };

  handleFocus(text) {}

  handleFocusOut(action, text) {
    if (!text.includes("#")) {
      text = "#" + text;
    }

    if (text.match(HEX_COLOR_REGEX)) {
      this.props.callback(action, text);
    }
  }
}

TLDRColorPicker.propTypes = {
  callback: PropTypes.func.isRequired,
};

TLDRColorPicker.defaultProps = {
  title: "Color",
  icon: "palette",
  color: "transparent",
  property: "color",
  top: 0,
  right: 0,
};

export default TLDRColorPicker;
