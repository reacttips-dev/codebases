import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TldrCollpasibleSection from "./TldrCollpasibleSection";
import {
  StyledAdvEditorToolbarFormatGroup,
  StyledSlideBackgroundAction,
} from "../styled/details/stylesDetails";
import TLDRColorPicker from "./TLDRColorPicker";
import {
  checkInputboxValueRangeForSlider,
  rgbaTohex,
} from "../../_utils/common";
import { faFillDrip } from "@fortawesome/free-solid-svg-icons";
import {
  DOMAIN_0_TO_100,
  DOMAIN_0_TO_360,
  SLIDER_VALUE_REGEX,
} from "../details/constants";
import TldrSlider from "./TldrSlider";
import _ from "lodash";
import TldrLayerStandaloneControls from "./TldrLayerStandaloneControls";

class TldrLayerStyle extends Component {
  constructor(props) {
    super(props);

    const editorFormat = props.editor.activeElement.format;
    const layerId = props.editor.activeElement.id;
    const layer = props.layerstore.layers[layerId];

    this.state = {
      layerId: layerId,
      lastUpdated: layer?.last_updated,
      collapse: true,
      fillColor: props.editor.activeElement.format?.backgroundColor || "",
      opacity: editorFormat && editorFormat.opacity * 100,
      rotation: editorFormat && editorFormat.angle,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const layerId = nextProps.editor.activeElement.id;
    const layer = nextProps.layerstore.layers[layerId];
    if (
      layerId !== prevState.layerId ||
      layer?.last_updated > prevState.lastUpdated
    ) {
      return {
        layerId: layerId,
        opacity: layer?.payload.opacity * 100,
        lastUpdated: layer?.last_updated,
        rotation: layer?.payload.angle,
        skewX: layer?.payload.skewX,
      };
    }
    return null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.state, nextState);
  }

  handleToggleChange = () => {
    const { collapse } = this.state;

    this.setState({ collapse: !collapse });
  };

  onChangeCompleteFillColorHandler = (action, hex) => {
    if (this.state.fillColor === hex) return;

    this.setState({ fillColor: hex }, () => {
      this.fillElementColor(hex);
    });
  };

  fillElementColor = (hex) => {
    const { canvasRef } = this.props;

    if (!hex.startsWith("rgba")) {
      if (!hex.includes("#")) {
        hex = "#" + hex;
      }
    }

    canvasRef.handler.objectHandler.backgroundColor(hex);
  };

  onOpacityUpdate = (value) => {
    if (typeof value === "object") {
      const { opacity } = this.state;
      if (opacity === Number(value[0])) return;
      this.setState(
        {
          opacity: value[0],
        },
        () => {
          this.updateOpacity("commit");
        }
      );
    } else if (typeof value === "string") {
    }
  };

  onOpacityChange = (value) => {
    if (typeof value === "object") {
      this.updateOpacity("push");
    } else if (typeof value === "string") {
      this.handleOpacityFocusOut(value);
    }
  };

  handleOpacityFocusOut = (text) => {
    let opacityValue = null;
    if (
      text.match(SLIDER_VALUE_REGEX) &&
      checkInputboxValueRangeForSlider(text, DOMAIN_0_TO_100)
    ) {
      const { opacity } = this.state;

      if (opacity === Number(text)) return;
      opacityValue = text;
    }
    this.setState(
      {
        opacity: opacityValue,
      },
      () => {
        this.updateOpacity("push");
      }
    );
  };

  updateOpacity = (method) => {
    const { opacity } = this.state;
    this.props.canvasRef.handler.objectHandler.opacity(opacity / 100, method);
  };

  onRotationUpdate = (value) => {
    if (typeof value === "object") {
      const { rotation } = this.state;

      if (rotation === Number(value[0])) return;

      this.setState(
        {
          rotation: value[0],
        },
        () => {
          this.onRotation("commit");
        }
      );
    } else if (typeof value === "string") {
    }
  };

  onRotationChange = (value) => {
    if (typeof value === "object") {
      this.onRotation("push");
    } else if (typeof value === "string") {
      this.handleRotationFocusOut(value);
    }
  };

  handleRotationFocusOut = (text) => {
    let rotationValue = null;
    if (
      text.match(SLIDER_VALUE_REGEX) &&
      checkInputboxValueRangeForSlider(text, DOMAIN_0_TO_360)
    ) {
      const { rotation } = this.state;

      if (rotation === Number(text)) return;

      rotationValue = text;
    }

    this.setState(
      {
        rotation: rotationValue,
      },
      () => {
        this.onRotation("push");
      }
    );
  };

  onRotation = (method) => {
    const { rotation } = this.state;
    this.props.canvasRef.handler.objectHandler.rotation(rotation, method);
  };

  render() {
    const { right, width, brandKit, canvasRef } = this.props;
    const { fillColor, opacity, rotation } = this.state;

    return (
      <>
        <TldrCollpasibleSection
          title="Appearance"
          collapse={this.state.collapse}
          onToggleCollapse={this.handleToggleChange}
        >
          <StyledAdvEditorToolbarFormatGroup>
            <div className="title">Background Color</div>
            <StyledSlideBackgroundAction margin={"0px 0px 12px 0px"}>
              <TLDRColorPicker
                colorCode={rgbaTohex(fillColor)}
                color={fillColor}
                callback={this.onChangeCompleteFillColorHandler}
                top={43}
                right={brandKit.brandkitPayload.length > 0 ? -87 : right}
                width={width}
                showIcon={true}
                icon={faFillDrip}
                showBrandkitPaletteColors={brandKit.brandkitPayload.length > 0}
              />
            </StyledSlideBackgroundAction>
          </StyledAdvEditorToolbarFormatGroup>

          <div className="actions mb-2">
            <TldrSlider
              hideIndicator={true}
              domain={DOMAIN_0_TO_100}
              onUpdate={this.onOpacityUpdate}
              onChange={this.onOpacityChange}
              values={[opacity]}
              showDecimals={false}
              title="Opacity"
              maxLength={3}
              handleFocus={this.onOpacityUpdate}
              handleFocusOut={this.onOpacityChange}
              showInputbox={true}
            ></TldrSlider>
          </div>

          <div className="actions mb-2">
            <TldrSlider
              hideIndicator={true}
              domain={DOMAIN_0_TO_360}
              onUpdate={this.onRotationUpdate}
              onChange={this.onRotationChange}
              values={[rotation]}
              showDecimals={false}
              title="Rotate Angle"
              maxLength={3}
              handleFocus={this.onRotationUpdate}
              handleFocusOut={this.onRotationChange}
              showInputbox={true}
            ></TldrSlider>
          </div>

          <TldrLayerStandaloneControls canvasRef={canvasRef} />
        </TldrCollpasibleSection>
      </>
    );
  }
}

TldrLayerStyle.propTypes = {
  editor: PropTypes.object.isRequired,
  layerstore: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  editor: state.editor,
  layerstore: state.layerstore,
  brandKit: state.brandKit,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(TldrLayerStyle);
