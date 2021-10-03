import React, { Component } from "react";
import { connect } from "react-redux";
import {
  closeAdvancedSettings,
  setOrUpdateStyles,
} from "../../../../_actions/sidebarSliderActions";
import { ADD_MASK } from "../../../../_actions/types";
import { TldrBadge } from "../../../common/statelessView";
import { IMAGES_SLIDER_PANEL } from "../../constants";
import {
  StyledSlideBackgroundAction,
  StyledSlideBackgroundLabel,
  StyledSliderBGReplaceImageButton,
  StyledTextEditorToolbarFormatGroup,
} from "./../../../styled/details/stylesDetails";
import {
  Dropdown,
  OverlayTrigger,
  SplitButton,
  Tooltip,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class TLDRTextMask extends Component {
  render() {
    const { location } = this.props;

    return (
      <>
        <div className="tldr-vl" />
        <StyledTextEditorToolbarFormatGroup
          className={location === "sidebar" ? "" : ""}
        >
          <TldrBadge badgeText="New">
            <SplitButton
              id="dropdown-split-photo-text-options"
              title={
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>Replace Mask</Tooltip>}
                >
                  <FontAwesomeIcon icon="image" />
                </OverlayTrigger>
              }
              onClick={() => this.replaceMaskImage(ADD_MASK)}
              className="photo-text-options-dropdown"
              alignRight
            >
              <Dropdown.Item className="photo-text-dropdown-item" eventKey="1">
                <StyledSlideBackgroundAction>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FontAwesomeIcon
                      icon="image"
                      size="lg"
                      className="mr-2"
                      color="white"
                    ></FontAwesomeIcon>
                    <StyledSlideBackgroundLabel>
                      Replace
                    </StyledSlideBackgroundLabel>
                  </div>
                  <StyledSliderBGReplaceImageButton
                    onClick={() => this.replaceMaskImage(ADD_MASK)}
                  >
                    Replace Mask
                  </StyledSliderBGReplaceImageButton>
                </StyledSlideBackgroundAction>
                <StyledSlideBackgroundAction>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <FontAwesomeIcon
                      icon="crop-alt"
                      size="lg"
                      className="mr-2"
                      color="white"
                    ></FontAwesomeIcon>
                    <StyledSlideBackgroundLabel>
                      Mask
                    </StyledSlideBackgroundLabel>
                  </div>
                  <StyledSliderBGReplaceImageButton onClick={this.adjustMask}>
                    Adjust Mask
                  </StyledSliderBGReplaceImageButton>
                </StyledSlideBackgroundAction>
              </Dropdown.Item>
            </SplitButton>
          </TldrBadge>
        </StyledTextEditorToolbarFormatGroup>
      </>
    );
  }

  replaceMaskImage = (action) => {
    this.props.setOrUpdateStyles(action, IMAGES_SLIDER_PANEL);
  };

  adjustMask = (action) => {
    if (this.props.rightsidebar.isActionPanelOpen) {
      this.props.closeAdvancedSettings();
    }
    this.props.canvasRef.handler.maskHandler.start();
  };
}

TLDRTextMask.propTypes = {};

const mapStateToProps = (state) => ({
  rightsidebar: state.rightsidebar,
});

const mapDispatchToProps = (dispatch) => ({
  setOrUpdateStyles: (action, destination) =>
    dispatch(setOrUpdateStyles(action, destination)),
  closeAdvancedSettings: () => dispatch(closeAdvancedSettings()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TLDRTextMask);
