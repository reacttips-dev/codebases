import React, { Component } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { deleteFont } from "../../../../_actions/appActions";
import { connect } from "react-redux";
import { Spinner } from "react-bootstrap";
import { fetchBrandKits } from "../../../../_actions/brandKitActions";
import { StyledTextFit } from "../../../styled/details/stylesTextElement";
import { wsAddLayer } from "../../../../_actions/webSocketAction";
import { defaultBodyTextItem } from "../../../canvas/constants/defaults";
import { closeSlider } from "../../../../_actions/sidebarSliderActions";
import { isMobileView } from "../../../../_utils/common";

class TextMyFont extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDeleting: false,
    };
  }

  render() {
    const { brandKitId, font } = this.props;
    const { payload, id } = font;
    const { isDeleting } = this.state;

    return (
      <div
        className={`item my-fonts-item ${brandKitId && "brand-fonts-item"}`}
        onClick={() => this.onTextClick()}
      >
        <StyledTextFit family={payload.family}>{payload.family}</StyledTextFit>
        <div className="font-actions">
          {isDeleting ? (
            <Spinner
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
              variant="warning"
            />
          ) : (
            <FontAwesomeIcon
              icon="trash"
              onClick={(event) => this.onClickDeleteFont(event, id)}
            />
          )}
        </div>
      </div>
    );
  }

  onTextClick = () => {
    if (!this.props.brandKitId) {
      this.addTextElement();
    }
  };

  addTextElement = () => {
    const { font, activePage } = this.props;
    if (!activePage) {
      // If there is no active page, Don't add text element
      return;
    }
    const { family, payload: fontPayload, id: fontId } = font;
    const { payload, id: activePageId } = activePage;

    const minSize = Math.min(payload.height, payload.width);

    let textPayload = Object.assign({}, defaultBodyTextItem);
    textPayload.payload.fontSize = minSize * 0.05;
    textPayload.payload.text = family;
    textPayload.payload.fontFamily = family;
    textPayload.payload.fontId = fontId;

    // Filter variant which doesn't have italic
    let variants = fontPayload.variants.filter(
      (variant, index) => !variant.toString().includes("italic")
    );

    if (variants?.length > 0) {
      textPayload.payload.fontWeight =
        variants[0] === "regular" ? 400 : Number(variants[0]);
    }

    this.props.wsAddLayer(activePageId, textPayload);
    if (isMobileView()) {
      this.props.closeSlider();
    }
  };

  onClickDeleteFont = (event, fontId) => {
    event.stopPropagation();

    this.setState(
      {
        ...this.state,
        isDeleting: true,
      },
      () => {
        this.props.deleteFont(fontId).then(() => {
          if (this.props.brandKitId) {
            this.props.fetchBrandKits();
          }
          this.setState({
            ...this.state,
            isDeleting: false,
          });
        });
      }
    );
  };
}

TextMyFont.propTypes = {
  activePage: PropTypes.object.isRequired,
};

TextMyFont.defaultProps = {
  brandKitId: null,
};

const mapStateToProps = (state) => ({
  activePage: state.pagestore.pages[state.editor.activePage?.id],
});

const mapDispatchToProps = (dispatch) => ({
  deleteFont: (fontId, props) => dispatch(deleteFont(fontId, props)),
  fetchBrandKits: () => dispatch(fetchBrandKits()),
  wsAddLayer: (pageId, message) => dispatch(wsAddLayer(pageId, message)),
  closeSlider: () => dispatch(closeSlider()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TextMyFont);
