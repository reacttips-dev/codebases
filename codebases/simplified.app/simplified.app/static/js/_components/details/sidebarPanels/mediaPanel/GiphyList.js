import _ from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
  fetchData,
  search,
  closeSlider,
} from "../../../../_actions/sidebarSliderActions";
import { REPLACE_META, SourceTypes } from "../../../../_actions/types";
import {
  wsAddLayer,
  wsUpdateLayer,
} from "../../../../_actions/webSocketAction";
import { isMobileView } from "../../../../_utils/common";
import SearchForm from "../../../common/SearchForm";
import { ImageItem, ShowNoContent } from "../../../common/statelessView";
import TLDRInfiniteGalleryGridLayout from "../../../common/TLDRInfiniteGalleryGridLayout";

class GiphyList extends Component {
  abortController = new AbortController();

  render() {
    const { sidebarSlider, story } = this.props;
    const { source, loaded, payload, hasMore } = sidebarSlider;

    const childElements = payload.map((giphy, index) => {
      if (!giphy?.images?.preview_gif?.url) {
        return null;
      }
      const payload = this.preparePayload(source, giphy, story.contentSize);
      return (
        <div
          key={`${giphy.id}_${index}`}
          className="item"
          onClick={() => this.addLayerCallback(payload)}
          data-groupkey={giphy.groupKey}
        >
          <ImageItem
            data={payload}
            key={`${giphy.id}_${Date.now()}`}
            url={giphy.images.preview_gif.url}
            alt={giphy.title}
            width={giphy.images.preview_gif.width}
            height={giphy.images.preview_gif.height}
            source={"Giphy"}
            showOverlayInfo={true}
            isUsedInSwiper={false}
          />
        </div>
      );
    });
    return (
      <>
        <SearchForm
          type="Giphys"
          signalToken={this.abortController.signal}
          autoFocus={true}
        />
        <hr className="tldr-hr" />
        <TLDRInfiniteGalleryGridLayout
          childElements={childElements}
          hasMore={hasMore}
          loadPage={this.loadPage}
          loaded={loaded}
          className={"giphy-gallary"}
        />

        {loaded && childElements.length === 0 && (
          <ShowNoContent text="There is no GIPHY." />
        )}
      </>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!_.isEqual(nextProps.sidebarSlider, this.props.sidebarSlider)) {
      return true;
    }
    return false;
  }

  componentDidMount() {
    // DO NOTHING
  }

  componentWillUnmount() {
    this.abortController.abort();
  }

  loadPage = (groupKey) => {
    // There is no searchText then fetch general images and add into InfiniteGrid
    if (this.props.searchText === "") {
      this.props.fetchData(
        this.props.sidebarSlider.source,
        { ...this.props, groupKey },
        this.abortController.signal
      );
      return;
    }
    this.props.search(
      this.props.sidebarSlider.source,
      this.props.searchText,
      { ...this.props, groupKey },
      this.abortController.signal
    );
  };

  preparePayload = (source, giphy, contentSize) => {
    const { url, height, width, title } = giphy.images.original;

    const message = {
      mime: "giphy",
      payload: {
        name: title,
        src: url,
        type: "gif",
        height: Number(height),
        width: Number(width),
        userProperty: {
          source_id: giphy?.id,
        },
      },
      content: {
        source: SourceTypes.GIPHY,
        source_id: giphy?.id,
        source_url: url,
        url: url,
        meta: giphy,
      },
    };
    return message;
  };

  addLayer = (data) => {
    this.props.wsAddLayer(this.props.editor.activePage.id, data);
  };

  updateLayer = (data) => {
    const sourceUrl = data.payload.src;
    const layerId = this.props.editor.activeElement.id;

    const message = {
      layer: layerId,
      content: data.content,
      payload: {
        ...data.payload,
        src: sourceUrl,
        userProperty: data?.payload?.userProperty,
      },
    };
    this.props.wsUpdateLayer(message);
  };

  addLayerCallback = (data) => {
    const { action } = this.props.sidebarSlider;
    if (action === REPLACE_META) {
      this.updateLayer(data);
    } /*else if (action === UPDATE_BKG) {
      this.updatePage(data);
    }*/ else {
      this.addLayer(data);
    }
    if (isMobileView()) {
      this.props.closeSlider();
    }
  };
}

GiphyList.propTypes = {
  editor: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  sidebarSlider: PropTypes.object.isRequired,
  pagestore: PropTypes.object.isRequired,
  layerstore: PropTypes.object.isRequired,
  panelType: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  searchText: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  sidebarSlider: state.sidebarSlider,
  errors: state.errors,
  editor: state.editor,
  pagestore: state.pagestore,
  layerstore: state.layerstore,
  panelType: state.sidebarSlider.sliderPanelType,
  page: state.sidebarSlider.page,
  searchText: state.sidebarSlider.searchText,
  story: state.story,
});

const mapDispatchToProps = (dispatch) => ({
  wsAddLayer: (activePageId, payload) =>
    dispatch(wsAddLayer(activePageId, payload)),
  wsUpdateLayer: (payload) => dispatch(wsUpdateLayer(payload)),
  fetchData: (source, props, token) =>
    dispatch(fetchData(source, props, token)),
  search: (source, searchTerm, props, token) =>
    dispatch(search(source, searchTerm, props, token)),
  closeSlider: () => dispatch(closeSlider()),
});

export default connect(mapStateToProps, mapDispatchToProps)(GiphyList);
