import React, { Component } from "react";
import {
  ImageItem,
  RequestTemplateContent,
} from "../../../common/statelessView";
import axios from "axios";
import TLDRInfiniteGalleryGridLayout from "../../../common/TLDRInfiniteGalleryGridLayout";
import { fetchData } from "../../../../_actions/sidebarSliderActions";
import { connect } from "react-redux";
import _ from "lodash";
import { wsCopyFromTemplate } from "../../../../_actions/webSocketAction";
import { closeSlider } from "../../../../_actions/sidebarSliderActions";
import { isMobileView } from "../../../../_utils/common";

class TextBlockList extends Component {
  signal = axios.CancelToken.source();

  onTxtClick = (data) => {
    this.props.wsCopyFromTemplate(this.props.activePage.id, data);
    if (isMobileView()) {
      this.props.closeSlider();
    }
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (!_.isEqual(nextProps.sidebarSlider, this.props.sidebarSlider)) {
      return true;
    }
    return false;
  }

  render() {
    const { sidebarSlider } = this.props;
    const { loaded, payload, hasMore } = sidebarSlider;

    const childElements = payload.map((txtBlock, index) => {
      const payload = txtBlock.id;
      return (
        <div
          className="item item-textblock"
          onClick={() => this.onTxtClick(txtBlock.id)}
          key={`${txtBlock.id}_${index}`}
          data-groupkey={txtBlock.groupKey}
        >
          <ImageItem
            data={payload}
            key={`${txtBlock.id}_${Date.now()}`}
            url={txtBlock.image}
            alt={txtBlock.description}
            width={txtBlock.image_width}
            height={txtBlock.image_height}
            showOverlayInfo={false}
            isUsedInSwiper={false}
          />
        </div>
      );
    });

    return (
      <>
        <hr className="tldr-hr" />
        <TLDRInfiniteGalleryGridLayout
          childElements={childElements}
          hasMore={hasMore}
          loadPage={this.loadPage}
          loaded={loaded}
          className={"text-gallary"}
        />

        {loaded && childElements.length === 0 && (
          <RequestTemplateContent text="There are no font combinations" />
        )}
      </>
    );
  }

  componentWillUnmount() {
    this.signal.cancel("The user aborted a request.");
  }

  loadPage = (groupKey) => {
    // There is no searchText then fetch general images and add into InfiniteGrid
    this.props.fetchData(
      this.props.sidebarSlider.source,
      { ...this.props, groupKey },
      this.signal.token
    );
  };
}

const mapStateToProps = (state) => ({
  panelType: state.sidebarSlider.sliderPanelType,
  sidebarSlider: state.sidebarSlider,
  activePage: state.editor.activePage,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (source, props, token) =>
    dispatch(fetchData(source, props, token)),
  wsCopyFromTemplate: (activePageId, payload) =>
    dispatch(wsCopyFromTemplate(activePageId, payload)),
  closeSlider: () => dispatch(closeSlider()),
});

export default connect(mapStateToProps, mapDispatchToProps)(TextBlockList);
