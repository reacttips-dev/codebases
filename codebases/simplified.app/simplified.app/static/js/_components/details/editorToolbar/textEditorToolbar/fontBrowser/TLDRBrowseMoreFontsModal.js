import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";
import MyFontList from "./MyFontList";
import GoogleFontList from "./GoogleFontList";
import {
  StyledFontBrowserModalBody,
  StyledFontBrowserModal,
  StyledFontBrowserModalFooter,
} from "../../../../styled/styleFontBrowser";
import { connect } from "react-redux";
import _ from "lodash";
import { FONT_CACHE } from "../../../constants";

class TLDRBrowseMoreFontsModal extends Component {
  render() {
    const { show, onHide, canvasRef } = this.props;

    return (
      <StyledFontBrowserModal
        show={show}
        centered
        onHide={onHide}
        backdrop="static"
        size="lg"
        scrollable={true}
      >
        <Modal.Header>
          <Modal.Title>Fonts</Modal.Title>
        </Modal.Header>

        <StyledFontBrowserModalBody>
          <GoogleFontList canvasRef={canvasRef} />
          <MyFontList />
        </StyledFontBrowserModalBody>

        <StyledFontBrowserModalFooter>
          <Button onClick={this.onCancelClick} variant="outline-warning">
            Cancel
          </Button>
          <Button onClick={this.onFinishClick} variant="warning">
            Finish
          </Button>
        </StyledFontBrowserModalFooter>
      </StyledFontBrowserModal>
    );
  }

  onCancelClick = (event) => {
    event.stopPropagation();
    this.removeLoadedButNotInUseFontStyle();
    this.props.onHide();
  };

  onFinishClick = (event) => {
    event.stopPropagation();
    this.removeLoadedButNotInUseFontStyle();
    this.props.onHide();
  };

  removeLoadedButNotInUseFontStyle = async () => {
    for (let fontFamilyKey in FONT_CACHE) {
      let isFontInList =
        _.findIndex(this.props.fonts, { family: fontFamilyKey }) > -1;

      // If font isn't in list then remove from the cache and head styling
      // Do not delete Rubik font as it is being used in Appication wide
      if (!isFontInList && fontFamilyKey !== "Rubik") {
        delete FONT_CACHE[fontFamilyKey];
        let fontFamilyTag = document.getElementById(fontFamilyKey);
        if (fontFamilyTag) {
          fontFamilyTag.remove();
        }
        // document.getElementById(fontFamilyKey).remove();
      }
    }
  };
}

TLDRBrowseMoreFontsModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};

TLDRBrowseMoreFontsModal.defaultProps = {
  show: false,
};

const mapStateToProps = (state) => ({
  fonts: state.app.fonts,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TLDRBrowseMoreFontsModal);
