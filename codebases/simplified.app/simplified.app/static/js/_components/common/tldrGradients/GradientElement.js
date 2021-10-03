import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactComponent as GradientAngleIcon } from "../../../assets/icons/gradient-angle.svg";
import {
  FABRIC_CIRCLE_ELEMENT,
  FABRIC_ELLIPSE_ELEMENT,
  FABRIC_ITEXT_ELEMENT,
  FABRIC_POLYGON_ELEMENT,
  FABRIC_RECT_ELEMENT,
  FABRIC_SVG_ELEMENT,
  FABRIC_TEXTBOX_ELEMENT,
  FABRIC_TEXT_ELEMENT,
  FABRIC_TRIANGLE_ELEMENT,
} from "../../details/constants";
import {
  StyledGradientAddAndAdjust,
  StyledGradientAngleAndColors,
  StyledGradientAngleRow,
  StyledGradientOption,
  StyledGradientOptionContainer,
  StyledGradientOptionInfoContainer,
  StyledGradientSettingsPopup,
  StyledGradientSettingsPopupCloseIcon,
  StyledTriangle,
} from "../../styled/details/stylesDetails";
import TldrSlider from "../TldrSlider";
import { GradientColor } from "./GradientColor";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

export class GradientElement extends Component {
  constructor(props) {
    super(props);

    this.state = {
      colorPercentage: 0,
      angle: props.gradientData.degree,
      values: [],
      isAdjustingColors: false,
      isRotatingAngle: false,
      showSettings: false,
    };
  }

  render() {
    const { angle, isAdjustingColors, isRotatingAngle } = this.state;
    const {
      gradientData,
      showSettings,
      changeSelectedColor,
      top,
      right,
      alignSelf,
      gradientTitle,
      eventKey,
    } = this.props;
    var offsetData = [];
    var gradColors = gradientData.colorStops.map((color, index) => {
      offsetData.push(color.offset);
      return (
        <GradientColor
          key={index}
          color={color.color}
          top={top}
          right={right}
          changeSelectedColor={(newColor, selectedColor) =>
            changeSelectedColor(newColor, selectedColor)
          }
          applyGradient={(method) => this.applyGradient(method, false)}
          brandKit={this.props.brandKit}
        />
      );
    });

    return (
      <>
        <StyledGradientOptionContainer>
          <StyledGradientOption
            gradient={this.createCSS(gradientData)}
            onClick={() => this.applyGradient("push", true)}
          />

          {showSettings && (
            <>
              <StyledTriangle />
              <StyledGradientSettingsPopup alignSelf={alignSelf}>
                <StyledGradientSettingsPopupCloseIcon>
                  {gradientTitle}
                  <FontAwesomeIcon
                    icon={"times"}
                    onClick={() => {
                      this.props.onToggleSettings(eventKey);
                    }}
                  />
                </StyledGradientSettingsPopupCloseIcon>
                <StyledGradientOptionInfoContainer>
                  {isAdjustingColors ? (
                    <StyledGradientAngleAndColors>
                      <TldrSlider
                        hideIndicator={true}
                        domain={[0, 100]}
                        values={offsetData}
                        mode={2}
                        showInputbox={false}
                        showDecimals={false}
                        classNames="tldr-gradient-color-adjustment-slider"
                        tracksClassNames="slider-gradient-track"
                        onUpdate={this.onUpdateColorAdjustment}
                        onChange={this.onChangeColorAdjustment}
                      />
                    </StyledGradientAngleAndColors>
                  ) : isRotatingAngle ? (
                    <StyledGradientAngleAndColors
                      angle={gradientData.degree}
                      isRotatingAngle={true}
                    >
                      <div
                        onClick={() =>
                          this.setState({
                            ...this.state,
                            isRotatingAngle: !this.state.isRotatingAngle,
                          })
                        }
                      >
                        <GradientAngleIcon
                          className="mr-1"
                          id="tldr-gradient-angle"
                        />
                        {gradientData.degree}
                      </div>
                      <TldrSlider
                        hideIndicator={true}
                        values={[angle]}
                        domain={[0, 360]}
                        showInputbox={false}
                        showDecimals={false}
                        classNames="tldr-gradient-angle-slider"
                        onUpdate={this.onUpdateAngle}
                        onChange={this.onChangeAngle}
                      ></TldrSlider>
                    </StyledGradientAngleAndColors>
                  ) : (
                    <StyledGradientAngleAndColors angle={gradientData.degree}>
                      <StyledGradientAngleRow
                        onClick={() =>
                          this.setState({
                            ...this.state,
                            isRotatingAngle: !this.state.isRotatingAngle,
                          })
                        }
                      >
                        <GradientAngleIcon
                          className="mr-1"
                          id="tldr-gradient-angle"
                        />
                        {gradientData.degree}
                      </StyledGradientAngleRow>
                      <div style={{ display: "flex", flexDirection: "row" }}>
                        {gradColors}
                        {gradientData.colorStops.length < 4 && (
                          <OverlayTrigger
                            trigger={["hover", "focus"]}
                            placement="bottom"
                            overlay={
                              <Tooltip id="tldr-gradient-color-tooltip">
                                Add color
                              </Tooltip>
                            }
                          >
                            <FontAwesomeIcon
                              icon="plus-circle"
                              size="1x"
                              onClick={this.addNewColor}
                            />
                          </OverlayTrigger>
                        )}
                      </div>
                    </StyledGradientAngleAndColors>
                  )}
                  {!isRotatingAngle && (
                    <StyledGradientAddAndAdjust>
                      <OverlayTrigger
                        trigger={["hover", "focus"]}
                        placement="bottom"
                        overlay={
                          <Tooltip id="tldr-gradient-color-tooltip">
                            Adjust colors
                          </Tooltip>
                        }
                      >
                        <FontAwesomeIcon
                          icon="sliders-h"
                          size="1x"
                          onClick={() => this.showColorAdjustment(gradientData)}
                        />
                      </OverlayTrigger>
                    </StyledGradientAddAndAdjust>
                  )}
                </StyledGradientOptionInfoContainer>
              </StyledGradientSettingsPopup>
            </>
          )}
        </StyledGradientOptionContainer>
      </>
    );
  }

  createCSS = (grad) => {
    var linearGradient = `linear-gradient(${grad.degree}deg, `;
    grad.colorStops.forEach((colorStop, index) => {
      linearGradient += `${colorStop.color} ${colorStop.offset}%`;

      if (index < grad.colorStops.length - 1) {
        linearGradient += ", ";
      } else {
        linearGradient += ")";
      }
    });

    return linearGradient;
  };

  applyGradient = (method, closeSettings) => {
    const { canvasRef, eventKey, gradientData, mime } = this.props;
    const { objectHandler, textHandler, workareaHandler } = canvasRef.handler;

    if (closeSettings) {
      this.props.onToggleSettings(eventKey);
    }

    switch (mime) {
      case FABRIC_TEXT_ELEMENT:
      case FABRIC_ITEXT_ELEMENT:
      case FABRIC_TEXTBOX_ELEMENT:
        textHandler.textGradientColor(gradientData, method);
        break;
      case FABRIC_RECT_ELEMENT:
      case FABRIC_TRIANGLE_ELEMENT:
      case FABRIC_CIRCLE_ELEMENT:
      case FABRIC_ELLIPSE_ELEMENT:
      case FABRIC_POLYGON_ELEMENT:
        objectHandler.componentGradientColor(gradientData, method);
        break;
      case FABRIC_SVG_ELEMENT:
        this.applyGradientToSVG();
        break;
      default:
        workareaHandler.backgroundGradientColor(gradientData, method, true);
        break;
    }
  };

  applyGradientToSVG = () => {
    const { activeElement, canvasRef, gradientData } = this.props;
    const { objectHandler } = canvasRef.handler;
    const activeObject = canvasRef.handler.canvas.getActiveObject();

    if (!activeObject || activeObject.type !== FABRIC_SVG_ELEMENT) {
      return;
    }

    let elementFormat = activeElement.format;
    let fillMapping = elementFormat?.fillMapping || [];

    // find and replace color in actual svg element
    let svg = elementFormat.svg;
    let objects = activeObject.getObjects();

    var tldrGradient = objectHandler.componentGradientColor(
      gradientData,
      "commit"
    );

    if (activeObject.updateFillMapping) {
      activeObject.updateFillMapping(
        fillMapping[0]?.orignalFill,
        "rgba(0, 0, 0, 0)"
      );
    }

    objects.forEach((object) => {
      if (object?.orignalFill === fillMapping[0]?.orignalFill) {
        object.set({ fill: tldrGradient });
      }
    });

    canvasRef.handler.set("objects", objects);
    canvasRef.handler.set("svg", svg);
  };

  showColorAdjustment = () => {
    this.setState({
      ...this.state,
      isAdjustingColors: !this.state.isAdjustingColors,
    });
  };

  onUpdateAngle = (value) => {
    this.setState(
      {
        ...this.state,
        angle: value[0],
      },
      () => {
        this.props.rotateGradientAngle(value[0]);
        this.applyGradient("commit", false);
      }
    );
  };

  onChangeAngle = (value) => {
    this.setState(
      {
        ...this.state,
        angle: value[0],
      },
      () => this.applyGradient("push", false)
    );
  };

  onUpdateColorAdjustment = (values) => {
    if (values === this.state.values) return;

    this.setState({ values }, () => {
      this.props.adjustColors(values);
      this.applyGradient("commit", false);
    });
  };

  onChangeColorAdjustment = (values) => {
    if (values === this.state.values) return;

    this.setState({ values }, () => this.applyGradient("push", false));
  };

  addNewColor = () => {
    this.props.addNewColor();
    this.applyGradient("push", false);
  };
}

GradientElement.propTypes = {
  activeElement: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  activeElement: state.editor.activeElement,
  brandKit: state.brandKit,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(GradientElement);
