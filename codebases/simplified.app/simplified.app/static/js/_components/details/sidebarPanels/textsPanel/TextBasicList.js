import React, { Component } from "react";
import { StyledBasicTextList } from "../../../styled/details/stylesTextPanel";
import { TextItem, TldrBadge } from "../../../common/statelessView";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  defaultHeaderTextItem,
  defaultSubHeadingTextItem,
  defaultBodyTextItem,
  defaultPhotoTextItem,
} from "../../../canvas/constants/defaults";
import { wsAddLayer } from "../../../../_actions/webSocketAction";
import { closeSlider } from "../../../../_actions/sidebarSliderActions";
import { isMobileView } from "../../../../_utils/common";

class TextBasicList extends Component {
  render() {
    const { activePage } = this.props;
    const { payload } = activePage ? activePage : {};
    const minSize = Math.min(payload?.width, payload?.height);

    return (
      <>
        <div className="subtitle-s">Basics</div>
        <hr className="tldr-hr" />
        <StyledBasicTextList>
          <TextItem
            data={defaultHeaderTextItem}
            onClick={() => {
              defaultHeaderTextItem.payload.fontSize = minSize * 0.09;
              this.onTxtClick(defaultHeaderTextItem);
            }}
            className="h5 heading-text"
          >
            ADD HEADING TEXT
          </TextItem>

          <TextItem
            data={defaultSubHeadingTextItem}
            onClick={() => {
              defaultSubHeadingTextItem.payload.fontSize = minSize * 0.06;
              this.onTxtClick(defaultSubHeadingTextItem);
            }}
            className="h5"
          >
            Add subheading text
          </TextItem>

          <TextItem
            data={defaultBodyTextItem}
            onClick={() => {
              defaultBodyTextItem.payload.fontSize = minSize * 0.05;
              this.onTxtClick(defaultBodyTextItem);
            }}
            className="body-text"
          >
            Add body text
          </TextItem>

          <TldrBadge badgeText="New">
          <TextItem
            data={defaultPhotoTextItem}
            onClick={() => {
              defaultPhotoTextItem.payload.fontSize = minSize * 0.09;
              this.onTxtClick(defaultPhotoTextItem);
            }}
            className="h5 photo-text"
          >
            ADD PHOTO TEXT
          </TextItem>
          </TldrBadge>
        </StyledBasicTextList>
      </>
    );
  }

  onTxtClick = (data) => {
    const activePageId = this.props.activePage?.id;
    this.props.wsAddLayer(activePageId, data);
    if (isMobileView()) {
      this.props.closeSlider();
    }
  };
}

TextBasicList.propTypes = {
  activePage: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  activePage: state.pagestore.pages[state.editor.activePage?.id],
});

const mapDispatchToProps = (dispatch) => ({
  wsAddLayer: (pageId, message) => dispatch(wsAddLayer(pageId, message)),
  closeSlider: () => dispatch(closeSlider()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TextBasicList);
