import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StyledPaletteColorRow } from "../../_components/styled/settings/stylesSettings";
import { DEFAULT_COLOR_PRESETS } from "../../_components/details/constants";
import {
  StyledColorPickerCover,
  StyledColorPickerPopover,
} from "../../_components/styled/details/stylesTextPanel";
import { SketchPicker } from "react-color";
import Format from "string-format";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

class BrandKitPalettes extends Component {
  constructor(props) {
    super(props);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);

    this.state = {
      color: props.colorInfo.rgb,
      isHovering: false,
      showFillColorPopup: false,
    };
  }

  handleMouseEnter() {
    this.setState({
      isHovering: true,
    });
  }

  handleMouseLeave() {
    this.setState({
      isHovering: false,
    });
  }

  toggleFillColorPopup = () => {
    const { showFillColorPopup } = this.state;

    this.setState({
      ...this.state,
      showFillColorPopup: !showFillColorPopup,
    });
  };

  closeColorPicker = () => {
    this.setState({
      ...this.state,
      showFillColorPopup: false,
    });
  };

  render() {
    const { colorInfo, isColorEmpty } = this.props;
    const { isHovering, showFillColorPopup } = this.state;

    return (
      <>
        <StyledPaletteColorRow color={colorInfo.rgb}>
          {!isColorEmpty && (
            <div style={{ position: "relative" }}>
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id="add-palette">{colorInfo.rgb}</Tooltip>}
              >
                <div
                  className="color-container"
                  onMouseEnter={this.handleMouseEnter}
                  onMouseLeave={this.handleMouseLeave}
                  onClick={this.toggleFillColorPopup}
                >
                  {isHovering && !showFillColorPopup && (
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip id="heart">Delete color</Tooltip>}
                    >
                      <div
                        className="delete-color-container"
                        onClick={(e) => {
                          e.stopPropagation();
                          this.deleteColor();
                        }}
                      >
                        <FontAwesomeIcon icon="times" />
                      </div>
                    </OverlayTrigger>
                  )}
                </div>
              </OverlayTrigger>

              {showFillColorPopup && (
                <StyledColorPickerPopover
                  showBrandkitPaletteColors={false}
                  bottom={25}
                  right={-190}
                >
                  <StyledColorPickerCover
                    onClick={this.closeColorPicker}
                    style={{ width: "28px !important" }}
                  />
                  <SketchPicker
                    disableAlpha={true}
                    presetColors={DEFAULT_COLOR_PRESETS}
                    color={colorInfo.rgb}
                    onChangeComplete={this.updateColor}
                  />
                </StyledColorPickerPopover>
              )}
            </div>
          )}
        </StyledPaletteColorRow>
      </>
    );
  }

  updateColor = ({ rgb, hex }) => {
    const { paletteId, colorInfo } = this.props;

    let newColor = Format("rgba({},{},{},{})", rgb.r, rgb.g, rgb.b, rgb.a);

    this.props.updateSelectedColor(
      "updateColor",
      paletteId,
      colorInfo,
      newColor
    );
  };

  deleteColor = () => {
    const { paletteId, colorInfo } = this.props;
    this.props.updateSelectedColor("delete", paletteId, colorInfo);
  };
}

BrandKitPalettes.propTypes = {};

export default BrandKitPalettes;
