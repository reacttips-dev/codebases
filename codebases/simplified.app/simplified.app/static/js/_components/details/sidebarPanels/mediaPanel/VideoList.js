import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { wsAddLayer } from "../../../../_actions/webSocketAction";
import { ImageItem, ShowNoContent } from "../../../common/statelessView";
import { REPLACE_META } from "../../../../_actions/types";
import TLDRInfiniteGalleryGridLayout from "../../../common/TLDRInfiniteGalleryGridLayout";
import {
  fetchData,
  search,
  closeSlider,
} from "../../../../_actions/sidebarSliderActions";
import {
  getAlignPosition,
  getVideoDetails,
  isMobileView,
} from "../../../../_utils/common";
import TldrMediaTrimmingModal from "../../../common/TldrMediaTrimmingModal";
import SearchForm from "../../../common/SearchForm";
import { FABRIC_VIDEO_ELEMENT } from "../../constants";
import {
  DEFAULT_ARTBOARD_DURATION,
  StoryTypes,
} from "../../../../_utils/constants";

class VideoList extends Component {
  abortController = new AbortController();

  constructor(props) {
    super(props);
    this.addLayerCallback = this.addLayerCallback.bind(this);

    this.state = {
      showTrimmingModal: false,
      videoData: null,
      maxTrimPercentage: null,
    };
  }

  render() {
    const { sidebarSlider, story } = this.props;
    const { showTrimmingModal, videoData, maxTrimPercentage } = this.state;
    const { videoSource, loaded, payload, hasMore } = sidebarSlider;

    const childElements = payload.map((video, index) => {
      const payload = this.preparePayload(
        videoSource,
        video,
        story.contentSize
      );

      return (
        <div
          key={`${video.id}_${index}`}
          className="item"
          onClick={() => this.addLayerCallback(payload)}
          data-groupkey={video.groupKey}
        >
          <ImageItem
            data={payload}
            key={`${video.id}_${Date.now()}`}
            url={payload.content.url}
            alt={video.tags}
            width={200}
            height={150}
            source={videoSource}
            showOverlayInfo={true}
            isUsedInSwiper={false}
          />
        </div>
      );
    });
    return (
      <>
        <SearchForm
          type="Videos"
          signalToken={this.abortController.signal}
          autoFocus={true}
        />
        <hr className="tldr-hr" />
        <TLDRInfiniteGalleryGridLayout
          childElements={childElements}
          hasMore={hasMore}
          loadPage={this.loadPage}
          loaded={loaded}
          className={"video-gallary"}
        />

        {loaded && childElements.length === 0 && (
          <ShowNoContent text="There is no video." />
        )}

        {videoData && (
          <TldrMediaTrimmingModal
            show={showTrimmingModal}
            onHide={() => {
              this.setState({
                ...this.state,
                showTrimmingModal: false,
                videoData: null,
                maxTrimPercentage: null,
              });
            }}
            onSubmit={this.onSubmitTrim}
            data={videoData}
            mediaType={"Video"}
            maxTrimPercentage={maxTrimPercentage}
            defaultTrimPercentage={maxTrimPercentage}
          />
        )}
      </>
    );
  }

  componentDidMount() {
    // Do nothing
  }

  componentWillUnmount() {
    this.abortController.abort();
  }

  loadPage = (groupKey) => {
    // There is no searchText then fetch general images and add into InfiniteGrid
    if (this.props.searchText === "") {
      this.props.fetchData(
        this.props.sidebarSlider.videoSource,
        { ...this.props, groupKey },
        this.abortController.signal
      );
      return;
    }
    this.props.search(
      this.props.sidebarSlider.videoSource,
      this.props.searchText,
      { ...this.props, groupKey },
      this.abortController.signal
    );
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

  preparePayload = (videoSource, video, contentSize) => {
    let videoDetails = getVideoDetails(videoSource, video);

    if (!videoDetails) {
      return;
    }

    const height = videoDetails.height;
    const width = videoDetails.width;
    const videoCoverUrl = videoDetails.videoCoverUrl;

    const elementSize = { width, height };
    const message = {
      mime: "video",
      payload: {
        superType: "image",
        type: FABRIC_VIDEO_ELEMENT,
        width: elementSize.width,
        height: elementSize.height,
        name: "New video",
        autoplay: false,
        muted: false,
        loop: false,
        src: videoDetails.url || "",
        size: elementSize,
        position: getAlignPosition(
          elementSize,
          { x: 0, y: 0 },
          "middle-center",
          contentSize
        ),
        container: this.props.editor.activePage.id,
        cover: videoCoverUrl,
        startTime: 0,
        endTime: videoDetails.duration,
        userProperty: {
          source_id: videoDetails.sourceData.source_id,
        },
      },
      content: {
        source: videoDetails.sourceData.source,
        source_id: videoDetails.sourceData.source_id,
        source_url: videoDetails.sourceData.source_url,
        url: videoCoverUrl,
        meta: { video, duration: videoDetails.duration },
      },
    };
    return message;
  };

  addLayer = (data) => {
    var updatedVideoPayload = data ? data : this.state.videoData;
    this.props.wsAddLayer(this.props.editor.activePage.id, updatedVideoPayload);
  };

  onSubmitTrim = (startTime, endTime) => {
    const { videoData } = this.state;
    const updatedVideoData = {
      ...videoData,
      payload: {
        ...videoData.payload,
        startTime: startTime,
        endTime: endTime,
      },
    };
    this.setState(
      {
        showTrimmingModal: false,
        videoData: null,
      },
      () => this.addLayer(updatedVideoData)
    );
  };

  updateLayer = (data) => {
    const { canvasRef } = this.props;

    let target = canvasRef.handler.findById(this.props.editor.activeElement.id);

    if (!target) {
      return;
    }

    canvasRef.handler.elementHandler.setById(
      this.props.editor.activeElement.id,
      data.payload.src
    );

    canvasRef.handler.elementHandler.setCoverById(
      this.props.editor.activeElement.id,
      data.content.url
    );

    if (data?.content?.source_id) {
      target.userProperty = {
        ...target.userProperty,
        source_id: data.content.source_id,
      };
    }
    canvasRef.handler.canvas.fire("object:modified", {
      target,
      message: { content: data.content },
    });
  };

  addLayerCallback = (data) => {
    const { story: { payload: { story_type } = {} } = {} } = this.props;
    const { action } = this.props.sidebarSlider;
    if (action === REPLACE_META) {
      this.updateLayer(data);
    } else {
      if (story_type === StoryTypes.ANIMATED) {
        const pageDuration = this.getPageDuration();
        const videoDuration = data.content.meta?.duration;
        if (pageDuration && videoDuration && pageDuration < videoDuration) {
          // const maxTrimPercentage = (pageDuration / videoDuration) * 100;
          // this.setState({
          //   showTrimmingModal: true,
          //   videoData: data,
          //   maxTrimPercentage: maxTrimPercentage,
          // });
          this.addLayer(data);
        } else {
          this.addLayer(data);
        }
      } else {
        this.addLayer(data);
      }
    }
    if (isMobileView()) {
      this.props.closeSlider();
    }
  };
}

VideoList.propTypes = {
  editor: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  sidebarSlider: PropTypes.object.isRequired,
  panelType: PropTypes.string.isRequired,
  searchText: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  sidebarSlider: state.sidebarSlider,
  errors: state.errors,
  editor: state.editor,
  pages: state.pagestore?.pages,
  panelType: state.sidebarSlider.sliderPanelType,
  searchText: state.sidebarSlider.searchText,
  story: state.story,
  page: state.sidebarSlider.page,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  wsAddLayer: (activePageId, payload) =>
    dispatch(wsAddLayer(activePageId, payload)),
  fetchData: (videoSource, props, token) =>
    dispatch(fetchData(videoSource, props, token)),
  search: (videoSource, searchTerm, props, token) =>
    dispatch(search(videoSource, searchTerm, props, token)),
  closeSlider: () => dispatch(closeSlider()),
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoList);
