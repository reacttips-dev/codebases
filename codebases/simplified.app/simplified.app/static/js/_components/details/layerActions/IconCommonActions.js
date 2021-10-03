import PropTypes from "prop-types";
import React, { Component } from "react";
import { SketchPicker } from "react-color";
import { connect } from "react-redux";
import { TldrCustomShapeColorAction } from "../../common/statelessView";
import TldrBrandkitColors from "../../common/TldrBrandkitColors";
import {
  StyledAdvEditorToolbarFormatGroup,
  StyledAdvEditorToolbarRow,
  StyledShapeColorsContainer,
} from "../../styled/details/stylesDetails";
import {
  StyledColorPickerCover,
  StyledColorPickerPopover,
} from "../../styled/details/stylesTextPanel";
import { DEFAULT_COLOR_PRESETS, FABRIC_SVG_ELEMENT } from "../constants";

class IconCommonActions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fillColor: "",
      selectedColor: "",
      showFillColorPopup: false,
    };
  }

  render() {
    const { activeElement, brandKit } = this.props;
    const { showFillColorPopup, fillColor, selectedColor } = this.state;

    const { palette, title } =
      brandKit.brandkitPayload.length > 0 && brandKit.brandkitPayload[0];
    let elementFormat = activeElement.format;

    let colorElement;
    if (elementFormat.type === FABRIC_SVG_ELEMENT) {
      let fillMapping = elementFormat?.fillMapping || [];

      colorElement = fillMapping.map((fillMap, index) => (
        <TldrCustomShapeColorAction
          color={fillMap?.replaceFill}
          key={index}
          callback={() => this.toggleFillColorPopup(fillMap)}
          isSelected={
            (selectedColor?.orignalFill || selectedColor) ===
            fillMap?.orignalFill
          }
        />
      ));
    } else {
      colorElement = (
        <TldrCustomShapeColorAction
          color={elementFormat.fill}
          callback={() => this.toggleFillColorPopup(elementFormat.fill)}
          isSelected={selectedColor === elementFormat.fill}
        />
      );
    }

    let circleColors = [];
    palette?.length > 0 &&
      palette[0].colors.forEach((color, index) => {
        if (color.rgb) circleColors.push(color.rgb);
      });

    return (
      <>
        <StyledAdvEditorToolbarRow>
          <StyledAdvEditorToolbarFormatGroup>
            <div className="title">Colors</div>
            <StyledShapeColorsContainer>
              {colorElement}
            </StyledShapeColorsContainer>
          </StyledAdvEditorToolbarFormatGroup>
        </StyledAdvEditorToolbarRow>

        {showFillColorPopup && (
          <StyledColorPickerPopover
            showBrandkitPaletteColors={brandKit.brandkitPayload.length > 0}
          >
            <StyledColorPickerCover
              onClick={this.closeColorPicker}
              style={{ width: "28px !important" }}
            />
            {brandKit.brandkitPayload.length > 0 && (
              <TldrBrandkitColors
                handleOnChangeComplete={({ rgb, hex }) =>
                  this.onChangeCompleteSelectedShapeColorHandler({ rgb, hex })
                }
              />
            )}
            <SketchPicker
              disableAlpha={true}
              presetColors={DEFAULT_COLOR_PRESETS}
              color={fillColor}
              onChangeComplete={this.onChangeCompleteSelectedShapeColorHandler}
            />
          </StyledColorPickerPopover>
        )}
      </>
    );
  }

  toggleFillColorPopup = (color) => {
    const { showFillColorPopup } = this.state;
    this.setState({
      ...this.state,
      selectedColor: color,
      fillColor: color?.replaceFill || color,
      showFillColorPopup: !showFillColorPopup,
    });
  };

  closeColorPicker = () => {
    this.setState({
      ...this.state,
      showFillColorPopup: false,
    });
  };

  onChangeCompleteSelectedShapeColorHandler = ({ hex, rgb }) => {
    if (this.state.fillColor === hex) return;

    const { activeElement } = this.props;
    this.setState({ fillColor: hex }, () => {
      if (activeElement.format.type === FABRIC_SVG_ELEMENT) {
        this.changeSelectedIconColor(hex);
      } else {
        this.changeFillColor(rgb);
      }
    });
  };

  changeFillColor = (rgb) => {
    const rgba = `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`;
    const activeObject = this.props.canvasRef.handler.canvas.getActiveObject();
    activeObject.set("fill", rgba);
    this.props.canvasRef.handler.set("objects", activeObject.objects);
    this.props.canvasRef.handler.canvas.renderAll();
  };

  changeSelectedIconColor = (hex) => {
    const { activeElement, canvasRef } = this.props;
    const activeObject = canvasRef.handler.canvas.getActiveObject();
    if (!activeObject) {
      return;
    }

    const { selectedColor } = this.state;

    let elementFormat = activeElement.format;

    // find and replace color in actual svg element
    let svg = elementFormat.svg;
    let objects = activeObject.getObjects();

    if (activeObject.updateFillMapping) {
      activeObject.updateFillMapping(selectedColor, hex);
    }

    objects.forEach((object, index) => {
      if (object?.orignalFill === selectedColor?.orignalFill) {
        object.set({ fill: hex });
      }
    });

    this.props.canvasRef.handler.set("objects", objects);
    this.props.canvasRef.handler.set("svg", svg);

    // this is to change same selected color multiple times
    this.setState({
      ...this.state,
      selectedColor: {
        orignalFill: this.state.selectedColor.orignalFill,
        replaceFill: hex,
      },
    });
  };
}

IconCommonActions.propTypes = {
  activeElement: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  activeElement: state.editor.activeElement,
  brandKit: state.brandKit,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(IconCommonActions);
