import axios from "axios";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { batch, connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { closeSlider, fetchData } from "../../../_actions/sidebarSliderActions";
import {
  setCounter,
  updateStoryMusic,
  uploadFile,
} from "../../../_actions/storiesActions";
import {
  ADD_MASK,
  REPLACE_BKG_IMAGE,
  REPLACE_META,
} from "../../../_actions/types";
import { wsAddLayer, wsUpdateStory } from "../../../_actions/webSocketAction";
import {
  analyticsTrackEvent,
  getFabricTypeFromMime,
  getMusicPayload,
  isMobileView,
  onClickSetAsBackground,
  prepareIconPayload,
} from "../../../_utils/common";
import {
  DEFAULT_ARTBOARD_DURATION,
  StoryTypes,
} from "../../../_utils/constants";
import { ImageItem, ShowNoContent } from "../../common/statelessView";
import TldrDropzone from "../../common/TldrDropzone";
import TLDRInfiniteGalleryGridLayout from "../../common/TLDRInfiniteGalleryGridLayout";
import TldrUpgradeSubscriptionModal from "../../../TldrSettings/TldrBillingAndPayments/Modals/TldrUpgradeSubscriptionModal";
import TldrMediaTrimmingModal from "../../common/TldrMediaTrimmingModal";

class AssetsSliderPanel extends Component {
  signal = axios.CancelToken.source();

  constructor(props) {
    super(props);
    this.addLayerCallback = this.addLayerCallback.bind(this);

    this.state = {
      showUpgradeSubscriptionModal: false,
      mediaTrimmingData: {
        show: false,
        data: null,
        maxTrim: null,
      },
      visible: true,
    };
  }

  render() {
    const { mediaTrimmingData } = this.state;
    const { sidebarSlider } = this.props;
    const { loaded, payload, hasMore, counter } = sidebarSlider;

    const childElements = payload.map((asset, index) => {
      const payload = this.preparePayload(asset);
      return (
        <div
          key={`${asset.id}_${index}`}
          className="item item-asset"
          onClick={() => this.addLayerCallback(payload)}
          data-groupkey={asset.groupKey || 1}
        >
          <ImageItem
            data={payload}
            key={`${asset.id}_${Date.now()}`}
            url={
              asset.thumbnail_cover_image
                ? asset.thumbnail_cover_image
                : asset.thumbnail
            }
            alt={"asset"}
            width={asset.cover_image_width || 200}
            height={asset.cover_image_height || 200}
            source={"TLDR"}
            hasAction={true}
            type={"asset"}
            modalFor={"asset"}
            showOverlayInfo={false}
            isUsedInSwiper={false}
          />
        </div>
      );
    });

    return (
      <>
        <div className="subtitle-s">My Assets</div>
        <hr className="tldr-hr" />
        <TldrDropzone
          isUploading={counter > 0}
          hideTitle={false}
          btnTitle="Upload Assets"
          buttonWidth={100}
          onDrop={this.onAssetsDrop}
          className="tldr-assets-dropzone"
        />
        <TLDRInfiniteGalleryGridLayout
          childElements={childElements}
          hasMore={hasMore}
          loadPage={this.loadPage}
          className={"asset-gallary"}
          loaded={loaded}
        />
        {loaded && childElements.length === 0 ? (
          <ShowNoContent text="Upload and manage your assets." />
        ) : (
          <></>
        )}
        <TldrUpgradeSubscriptionModal
          show={this.state.showUpgradeSubscriptionModal}
          onHide={() => {
            this.setState({
              ...this.state,
              showUpgradeSubscriptionModal: false,
            });
          }}
        />
        {mediaTrimmingData && (
          <TldrMediaTrimmingModal
            show={mediaTrimmingData.show}
            onHide={this.resetTrimmingData}
            onSubmit={this.onSubmitTrim}
            data={mediaTrimmingData.data}
            mediaType={"Video"}
            maxTrimPercentage={mediaTrimmingData.maxTrim}
            defaultTrimPercentage={mediaTrimmingData.maxTrim}
          />
        )}
      </>
    );
  }

  componentWillUnmount() {
    this.signal.cancel("The user aborted a request.");
  }

  resetTrimmingData = () => {
    this.setState({
      mediaTrimmingData: {
        show: false,
        data: null,
        maxTrim: null,
      },
    });
  };

  getPageDuration = () => {
    const {
      editor: { activePage: { id } = {} },
      pages,
    } = this.props;
    const page = pages[id];
    if (page) {
      return page?.payload?.animation?.duration ?? DEFAULT_ARTBOARD_DURATION;
    }
    return DEFAULT_ARTBOARD_DURATION;
  };

  onAssetsDrop = (droppedFiles) => {
    if (droppedFiles.length > 0) {
      this.props.setCounter(droppedFiles.length);
    }
    droppedFiles.forEach((file) => {
      this.props.uploadFile(file, { ...this.props }, this.signal);
    });
    analyticsTrackEvent("dragNDropAssets");
  };

  loadPage = (groupKey) => {
    // There is no searchText then fetch general images and add into InfiniteGrid
    this.props.fetchData(
      this.props.sidebarSlider.source,
      { ...this.props, groupKey },
      this.signal.token
    );
  };

  onSubmitTrim = (startTime, endTime) => {
    const {
      mediaTrimmingData: { data },
    } = this.state;
    const updatedVideoData = {
      ...data,
      payload: {
        ...data.payload,
        startTime: startTime,
        endTime: endTime,
      },
    };
    this.resetTrimmingData();
    this.props.wsAddLayer(this.props.activePage.id, updatedVideoData);
  };

  addLayerCallback = async (item) => {
    const { story: { payload: { story_type } = {} } = {} } = this.props;
    const { action } = this.props.sidebarSlider;
    const { canvasRef } = this.props;
    if (action === REPLACE_META) {
      canvasRef.handler.imageHandler.replaceImageSource(
        item.content.url,
        {
          source_id: null,
        },
        item?.content
      );
    } else if (action === REPLACE_BKG_IMAGE) {
      onClickSetAsBackground(canvasRef, item.content.url);
    } else if (action === ADD_MASK) {
      const activeTextObj = canvasRef.handler.canvas.getActiveObject();
      canvasRef.handler.maskHandler.replaceMaskImage(
        activeTextObj,
        item,
        { offsetX: 0, offsetY: 0 },
        "push"
      );
    } else {
      if (item.mime === "shape") {
        if (item.type === "icon") {
          let payload = await prepareIconPayload(item.content.url);
          if (payload === null) {
            return;
          }
          this.props.wsAddLayer(this.props.activePage.id, payload);
        } else {
          this.props.wsCopyFromTemplate(
            this.props.activePage.id,
            item.content.id
          );
        }
      } else if (item.mime === "audio") {
        const { story } = this.props;
        const musicPayload = getMusicPayload(null, item);

        const payload = {
          ...musicPayload,
          action: "add",
        };

        batch(() => {
          this.props.wsUpdateStory({
            ...story?.payload?.payload,
            music: payload,
          });
          this.props.closeSlider(); // close slider once music added
          this.props.updateStoryMusic(payload);
        });
      } else if (item.mime === "video") {
        const pageDuration = this.getPageDuration();
        const videoDuration = item.content.meta?.duration;
        if (
          story_type === StoryTypes.ANIMATED &&
          pageDuration &&
          videoDuration &&
          pageDuration < videoDuration
        ) {
          const maxTrimPercentage = (pageDuration / videoDuration) * 100;
          this.setState({
            mediaTrimmingData: {
              show: true,
              data: item,
              maxTrim: maxTrimPercentage,
            },
          });
        } else {
          this.props.wsAddLayer(this.props.activePage.id, item);
        }
      } else if (item.content) {
        this.props.wsAddLayer(this.props.activePage.id, item);
      } else {
        this.props.wsCopyFromTemplate(this.props.activePage.id, item);
      }
    }
    if (isMobileView()) {
      this.props.closeSlider();
    }
  };

  preparePayload = (asset) => {
    asset.thumbnail_width = asset.thumbnail_width || 200;
    asset.thumbnail_height = asset.thumbnail_height || 200;

    const message = {
      mime: asset.asset_type,
      type: asset.asset_type === "shape" ? "icon" : asset.asset_type,
      payload: {
        name: asset.asset_key || "New Asset",
        src: asset.thumbnail,
        type: getFabricTypeFromMime(asset.asset_type),
        height: asset.thumbnail_height,
        width: asset.thumbnail_width,
      },
      content: {
        meta: asset,
        url: asset.thumbnail,
      },
    };

    if (asset.asset_type === "video") {
      message.content.meta.duration = asset.payload?.duration;
    }
    return message;
  };
}

AssetsSliderPanel.propTypes = {
  panelType: PropTypes.string.isRequired,
  fetchData: PropTypes.func.isRequired,
  sidebarSlider: PropTypes.object.isRequired,
  editor: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  panelType: state.sidebarSlider.sliderPanelType,
  sidebarSlider: state.sidebarSlider,
  editor: state.editor,
  page: state.sidebarSlider.page,
  activePage: state.editor.activePage,
  story: state.story,
  auth: state.auth,
  subscription: state.subscription,
  pages: state.pagestore?.pages,
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: (source, props, token) =>
    dispatch(fetchData(source, props, token)),
  wsAddLayer: (activePageId, payload) =>
    dispatch(wsAddLayer(activePageId, payload)),
  uploadFile: (file, props, signalToken) =>
    dispatch(uploadFile(file, props, signalToken)),
  setCounter: (counter) => dispatch(setCounter(counter)),
  wsUpdateStory: (payload) => dispatch(wsUpdateStory(payload)),
  updateStoryMusic: (musicData) => dispatch(updateStoryMusic(musicData)),
  closeSlider: () => dispatch(closeSlider()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AssetsSliderPanel));
