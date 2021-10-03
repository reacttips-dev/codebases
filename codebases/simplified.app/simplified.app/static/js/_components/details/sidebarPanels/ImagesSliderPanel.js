import _ from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { batch, connect } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchData,
  search,
  triggerDownload,
  closeSlider,
} from "../../../_actions/sidebarSliderActions";
import {
  ADD_MASK,
  REPLACE_BKG_IMAGE,
  REPLACE_META,
  UPDATE_BKG,
} from "../../../_actions/types";
import { wsAddLayer, wsUpdatePage } from "../../../_actions/webSocketAction";
import {
  getImageInfo,
  getUserMetaData,
  isMobileView,
  onClickSetAsBackground,
} from "../../../_utils/common";
import SearchForm from "../../common/SearchForm";
import {
  ImageItem,
  ImageProvierErrorsInfo,
  ShowCenterSpinner,
  ShowNoContent,
} from "../../common/statelessView";
import TLDRInfiniteGalleryGridLayout from "../../common/TLDRInfiniteGalleryGridLayout";
import { StyledButton } from "../../styled/styles";
import { showToast } from "../../../_actions/toastActions";

class ImagesSliderPanel extends Component {
  constructor(props) {
    super(props);
    this.timers = [];
    this.state = {
      imagesProcessingIds: [],
      visible: true,
    };
  }

  abortController = new AbortController();

  renderErrors = (error) => {
    return (
      <div>
        {error.messages &&
          error.messages.map((e) => <p className="error">{e}</p>)}
        <Link to={error.action}>
          <StyledButton>{error.buttonText}</StyledButton>
        </Link>
      </div>
    );
  };

  render() {
    const { imagesProcessingIds } = this.state;
    const { sidebarSlider, story, errors } = this.props;
    const { imageSource, loaded, payload, hasMore, imageProviderErrors } =
      sidebarSlider;
    const { error_message } = errors;

    const childElements = payload.map((image, index) => {
      const payload = this.preparePayload(
        imageSource,
        image,
        story.contentSize
      );

      const isProcessing =
        imagesProcessingIds.indexOf(index) >= 0 ? true : false;

      return (
        <div
          key={`${image.id}_${index}`}
          className="item"
          onClick={() => this.addLayerCallback(payload, index)}
          data-groupkey={image.groupKey}
          style={{
            pointerEvents: isProcessing ? "none" : "unset",
          }}
        >
          {isProcessing && (
            <div>
              <ShowCenterSpinner loaded={false}></ShowCenterSpinner>
              <div></div>
            </div>
          )}
          <ImageItem
            data={payload}
            key={`${image.id}_${Date.now()}`}
            url={payload.content.previewURL}
            alt={image.alt_description}
            width={payload.payload ? payload.payload.width : 200}
            height={payload.payload ? payload.payload.height : 200}
            source={imageSource}
            showOverlayInfo={true}
            isUsedInSwiper={false}
          />
        </div>
      );
    });

    return (
      <>
        <SearchForm
          signalToken={this.abortController.signal}
          autoFocus={true}
        />
        <hr className="tldr-hr" />

        {imageProviderErrors !== null ? (
          <ImageProvierErrorsInfo
            imageProviderErrors={imageProviderErrors}
            imageSource={imageSource}
          />
        ) : (
          <TLDRInfiniteGalleryGridLayout
            className="image-gallery"
            childElements={childElements}
            hasMore={hasMore}
            loadPage={this.loadPage}
            loaded={loaded}
          />
        )}

        {loaded && childElements.length === 0 && error_message === "" && (
          <ShowNoContent text="There is no image." />
        )}
      </>
    );
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (!_.isEqual(nextProps.sidebarSlider, this.props.sidebarSlider)) {
      return true;
    } else if (!_.isEqual(nextProps.errors, this.props.errors)) {
      return true;
    }
    if (nextProps.imageSource !== this.props.imageSource) {
      return true;
    }
    if (
      !_.isEqual(nextState.imagesProcessingIds, this.state.imagesProcessingIds)
    ) {
      return true;
    }
    return false;
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.sidebarSlider?.imageSource !==
      prevProps.sidebarSlider?.imageSource
    ) {
      //this.abortController.abort();
      this.setState({
        imagesProcessingIds: [],
      });
    }
    return null;
  }

  componentDidMount() {
    // Do nothing
  }

  componentWillUnmount() {
    this.abortController.abort();
    this.timers.forEach((timer) => {
      clearInterval(timer);
    });
  }

  loadPage = (groupKey) => {
    // There is no searchText then fetch general images and add into InfiniteGrid
    if (this.props.searchText === "") {
      this.props.fetchData(
        this.props.sidebarSlider.imageSource,
        { ...this.props, groupKey },
        this.abortController.signal
      );
      return;
    }
    this.props.search(
      this.props.sidebarSlider.imageSource,
      this.props.searchText,
      { ...this.props, groupKey },
      this.abortController.signal
    );
  };

  preparePayload = (imageSource, data, contentSize) => {
    let imageInfo = getImageInfo(imageSource, data);
    const message = {
      mime: "image",
      payload: {
        name: "New Image",
        src: imageInfo.url,
        type: "image",
        height: imageInfo.height,
        width: imageInfo.width,
        userProperty: {
          source_id: imageInfo.sourceData.source_id,
        },
      },
      content: {
        source: imageInfo.sourceData.source,
        source_url: imageInfo.sourceData.source_url,
        source_id: imageInfo.sourceData.source_id,
        url: imageInfo.url,
        meta: getUserMetaData(imageSource, data),
        previewURL: imageInfo.thumbURL,
      },
    };
    return message;
  };

  updatePage = (data) => {
    const pageId = this.props.editor.activePage.id;
    var message = {
      page: pageId,
      payload: {
        wallpaper: {
          mime: "image",
          url: data.content.url,
        },
      },
    };
    this.props.wsUpdatePage(message);
  };

  addToArtboard = (data, itemIdx) => {
    const { action } = this.props.sidebarSlider;
    const { canvasRef } = this.props;
    if (action === REPLACE_META) {
      const userPropery = {
        source_id: data?.content?.source_id,
      };
      canvasRef.handler.imageHandler.replaceImageSource(
        data.content.url,
        userPropery,
        { ...data?.content }
      );
    } else if (action === UPDATE_BKG) {
      this.updatePage(data);
    } else if (action === REPLACE_BKG_IMAGE) {
      onClickSetAsBackground(this.props.canvasRef, data.content.url);
    } else if (action === ADD_MASK) {
      const activeTextObj = canvasRef.handler.canvas.getActiveObject();
      canvasRef.handler.maskHandler.replaceMaskImage(
        activeTextObj,
        data,
        { offsetX: 0, offsetY: 0 },
        "push"
      );
    } else {
      batch(() => {
        this.props.wsAddLayer(this.props.editor.activePage.id, data);
        //TODO move this to backend
        this.props.triggerDownload(
          data.content.meta,
          this.abortController.signal
        );
      });
    }
    this.setState((prevState) => {
      return {
        imagesProcessingIds: prevState.imagesProcessingIds.filter(
          (id) => id !== itemIdx
        ),
      };
    });
  };

  addLayerCallback = (data, index) => {
    this.setState(
      (prevState) => ({
        imagesProcessingIds: [...prevState.imagesProcessingIds, index],
      }),
      async () => {
        this.addToArtboard(data, index);
        if (isMobileView()) {
          this.props.closeSlider();
        }
      }
    );
  };

  addShapeForImage = (data) => {
    this.props.wsAddLayer(this.props.editor.activePage.id, data);
  };
}

ImagesSliderPanel.propTypes = {
  editor: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  sidebarSlider: PropTypes.object.isRequired,
  panelType: PropTypes.string.isRequired,
  page: PropTypes.number.isRequired,
  searchText: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  sidebarSlider: state.sidebarSlider,
  errors: state.errors,
  editor: state.editor,
  panelType: state.sidebarSlider.sliderPanelType,
  page: state.sidebarSlider.page,
  searchText: state.sidebarSlider.searchText,
  story: state.story,
});

const mapDispatchToProps = (dispatch) => ({
  wsUpdatePage: (payload) => dispatch(wsUpdatePage(payload)),
  wsAddLayer: (activePageId, payload) =>
    dispatch(wsAddLayer(activePageId, payload)),
  fetchData: (imageSource, props, token) =>
    dispatch(fetchData(imageSource, props, token)),
  search: (imageSource, searchTerm, props, token) =>
    dispatch(search(imageSource, searchTerm, props, token)),
  showToast: (payload) => dispatch(showToast(payload)),
  triggerDownload: (meta, token) => dispatch(triggerDownload(meta, token)),
  closeSlider: () => dispatch(closeSlider()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ImagesSliderPanel);
