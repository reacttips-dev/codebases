import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TLDRColorPicker from "../../common/TLDRColorPicker";
import {
  StyledSlideBackgroundAction,
  StyledSlideBackgroundLabel,
  StyledStudioEditorToolbarText,
  StyledSliderBGReplaceImageButton,
} from "../../styled/details/stylesDetails";
import { IMAGES_SLIDER_PANEL, VIDEO_SLIDER_PANEL } from "../constants";
import {
  openSlider,
  setOrUpdateStyles,
} from "../../../_actions/sidebarSliderActions";
import { REPLACE_BKG_IMAGE } from "../../../_actions/types";
import { rgbaTohex } from "../../../_utils/common";

class SlideCommonActions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fillColor: props.canvasRef?.handler?.workarea
        ? props.canvasRef.handler.workarea.backgroundColor
        : "",
    };
  }

  onChangeCompleteFillColorHandler = (action, hex) => {
    if (this.state.fillColor === hex) return;

    const { activePage } = this.props.editor;
    this.setState({ fillColor: hex }, () => {
      if (activePage.isSelected) {
        this.fillSlideColor(hex);
        return;
      }
    });
  };

  fillSlideColor = (hex) => {
    if (hex && !hex.startsWith("rgba") && !hex.includes("#")) {
      hex = `#${hex}`;
    }
    this.props.canvasRef.handler.workareaHandler.backgroundColor(hex);
  };

  handleClick = (backgroundType) => {
    if (backgroundType === "image")
      this.props.setOrUpdateStyles(REPLACE_BKG_IMAGE, IMAGES_SLIDER_PANEL);
    else if (backgroundType === "video")
      this.props.openSlider(VIDEO_SLIDER_PANEL);
    else if (backgroundType === "workarea") {
      this.props.showGradientModal();
    }
  };

  render() {
    const { right, width, isPositionSidebar, brandKit } = this.props;
    const { fillColor } = this.state;

    let backgroundOptions = [
      {
        title: "Color",
        type: "color",
        icon: "fill-drip",
        colorPicker: true,
      },
      {
        title: "Image",
        type: "image",
        icon: "image",
        button: true,
        buttonTitle: "Replace Image",
      },
    ];

    if (!isPositionSidebar) {
      backgroundOptions.push({
        title: "Gradient",
        button: true,
        type: "workarea",
        buttonTitle: "Apply",
      });
    }

    return (
      <>
        {!isPositionSidebar && (
          <StyledStudioEditorToolbarText style={{ textAlign: "center" }}>
            Background
          </StyledStudioEditorToolbarText>
        )}
        {backgroundOptions.map((option, index) => (
          <StyledSlideBackgroundAction
            width={width}
            cursor={option?.colorPicker?.toString()}
            key={index}
          >
            <div className="text-centered">
              <FontAwesomeIcon
                icon={option.icon}
                className="mr-2"
                color="white"
              ></FontAwesomeIcon>
              <StyledSlideBackgroundLabel>
                {option.title}
              </StyledSlideBackgroundLabel>
            </div>
            {option.colorPicker && (
              <TLDRColorPicker
                colorCode={rgbaTohex(fillColor)}
                color={fillColor ? fillColor : "000"}
                callback={this.onChangeCompleteFillColorHandler}
                top={40}
                right={right}
                inputWidth="100px"
                showBrandkitPaletteColors={brandKit.brandkitPayload.length > 0}
              />
            )}
            {option.button && (
              <StyledSliderBGReplaceImageButton
                onClick={() => this.handleClick(option.type)}
              >
                {option.buttonTitle ? option.buttonTitle : ""}
              </StyledSliderBGReplaceImageButton>
            )}
          </StyledSlideBackgroundAction>
        ))}
      </>
    );
  }
}

SlideCommonActions.propTypes = {
  editor: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  editor: state.editor,
  brandKit: state.brandKit,
});

const mapDispatchToProps = (dispatch) => ({
  openSlider: (panelType) => dispatch(openSlider(panelType)),
  setOrUpdateStyles: (action, destination) =>
    dispatch(setOrUpdateStyles(action, destination)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SlideCommonActions);
