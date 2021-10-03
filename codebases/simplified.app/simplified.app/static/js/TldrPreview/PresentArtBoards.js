import React, { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect, batch } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import { ShowCenterSpinner } from "../_components/common/statelessView";
import {
  StyledFontAwesomeIcon,
  StyledLoaderSlide,
} from "../_components/styled/details/stylesDetails";
import { setActivePage } from "../_actions/textToolbarActions";
import { updateStory } from "../_actions/storiesActions";
import { wsBroadcast } from "../_actions/webSocketAction";
import TLDRSwiper from "../_components/common/TLDRSwiper";
import { StyledStoryPageWrapper } from "../_components/styled/styles";
import { REMOTE_COLLOBORATION_BROADCAST_ACTION } from "../_components/details/constants";
import { TO_CLOSE_SLIDER } from "../_reducers/sidebarSliderReducer";
import PresentArtBoard from "./PresentArtBoard";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { getArtBoardSizeToFitAvailableArea } from "../_utils/common";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { primary } from "../_components/styled/variable";
import { PREVIEW } from "../_utils/routes";
import { cloneStory } from "../_actions/storiesActions";

const format = require("string-format");

function ArtboardLoader(props) {
  const { loaded, previewAreaSize } = props;

  let artboardSize = getArtBoardSizeToFitAvailableArea(
    {
      height: 1280,
      width: 720,
    },
    previewAreaSize
  );

  return (
    <StyledLoaderSlide artboardSize={artboardSize}>
      <ShowCenterSpinner loaded={loaded} />
    </StyledLoaderSlide>
  );
}

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <Link
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick(e);
    }}
    style={{ paddingLeft: "10px" }}
  >
    <FontAwesomeIcon icon={faEllipsisV} size="lg" color={primary} />
  </Link>
));

export class PresentArtBoards extends Component {
  signal = axios.CancelToken.source();
  constructor(props) {
    super(props);
    this.state = {
      activeStoryPage: 0,
      shareLink: "",
      isCopied: false,
      isSharingEnabled: false,
    };
    this.swiperRef = React.createRef();
    this.cloneProject = this.cloneProject.bind(this);
    this.onHandleSwitch = this.onHandleSwitch.bind(this);
    this.getPreviewUrl = this.getPreviewUrl.bind(this);
  }

  componentDidMount() {
    this.setState({
      shareLink: window.location.origin + encodeURI(this.getPreviewUrl()),
      isSharingEnabled: this.props.story.payload.access === 2 ? true : false,
    });
  }

  onHandleSwitch = (e, isEnabled) => {
    //e.stopPropagation();
    this.setState({
      isSharingEnabled: !this.state.isSharingEnabled,
    });

    const storyId = this.props.story.payload.id;

    this.props.updateStory(
      storyId,
      {
        access: isEnabled ? 1 : 2,
      },
      this.signal,
      { ...this.props }
    );
  };

  onSetCopy = () => {
    this.setState({
      isCopied: true,
    });
  };

  getPreviewUrl = () => {
    const previewUrl = format(
      PREVIEW,
      this.props.auth.payload.selectedOrg,
      this.props.story.payload.id,
      encodeURIComponent(this.props.story.payload.title)
    );
    return previewUrl;
  };

  cloneProject = (storyID) => {
    this.props.cloneStory(storyID, this.signal, this.props);
  };

  render() {
    const { activeStoryPage } = this.state;
    const {
      pagestore,
      previewAreaSize,
      queryString,
      artboardIndexesToRender = [],
    } = this.props;
    const { pages, loaded, pageIds } = pagestore;
    let pagesElement = [];

    if (loaded && pageIds.length > 0) {
      pagesElement = pageIds.map((pageId, index) => {
        const { width, height } = pages[pageId].payload;

        const pageOrder = pages[pageId]?.order;
        if (
          artboardIndexesToRender.length > 0 &&
          !artboardIndexesToRender.includes(pageOrder)
        ) {
          return <React.Fragment key={index}></React.Fragment>;
        }

        const artboardSize = getArtBoardSizeToFitAvailableArea(
          { width, height },
          previewAreaSize
        );
        // TODO: Bug fix: Change index for onClick, Change active condition for index === activeStoryPage
        return (
          <StyledStoryPageWrapper
            key={pageId}
            artboardSize={artboardSize}
            onClick={() => this.swiperRef.current.swiper.slideTo(index)}
          >
            <PresentArtBoard
              artBoardSize={{
                width: width,
                height: height,
              }}
              key={pageId}
              page={pages[pageId]}
              active={index === activeStoryPage}
              artboardSize={artboardSize}
              queryString={queryString}
            />
          </StyledStoryPageWrapper>
        );
      });
    }

    const swiperParams = {
      containerClass: "artboard-swiper-container",
      centeredSlides: true,
      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      slidesPerView: "auto",
      shouldSwiperUpdate: true,
      runCallbacksOnInit: true,
      noSwiping: false,
      on: {
        slideChangeTransitionStart: () => {
          if (this.swiperRef.current && this.swiperRef.current.swiper) {
            this.setState({
              activeStoryPage: this.swiperRef.current.swiper.activeIndex,
            });
            this.setActivePageId(this.swiperRef.current.swiper.activeIndex);
          }
        },
        click: (event) => {
          // Clear all the selection
          if (event.target === event.srcElement) {
            batch(() => {
              this.props.setActivePage(this.props.activePageId, false);
            });
          }
        },
      },
    };

    return (
      <>
        {/* <WhoIsOnline></WhoIsOnline> */}
        {loaded && pageIds.length > 0 ? (
          <>
            <StyledFontAwesomeIcon
              icon="chevron-circle-left"
              size="3x"
              variance="left"
              onClick={this.goPrev}
              slideropen={TO_CLOSE_SLIDER}
              disabled={
                (this.swiperRef.current &&
                  this.swiperRef.current.swiper &&
                  this.swiperRef.current.swiper.isBeginning) ||
                pageIds.length < 2
              }
              className={"artboard-changer"}
            />
            <TLDRSwiper
              swiperParams={swiperParams}
              refs={this.swiperRef}
              enableKeyboard={true}
            >
              {pagesElement}
            </TLDRSwiper>
            <StyledFontAwesomeIcon
              icon="chevron-circle-right"
              size="3x"
              variance="right"
              onClick={this.goNext}
              isactionpanelopen={"false"}
              disabled={
                (this.swiperRef.current &&
                  this.swiperRef.current.swiper &&
                  this.swiperRef.current.swiper.isEnd) ||
                pageIds.length < 2
              }
              className={"artboard-changer"}
            />
          </>
        ) : !loaded ? (
          <ArtboardLoader loaded={loaded} previewAreaSize={previewAreaSize} />
        ) : (
          <></>
        )}
      </>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    const { activeStoryPage } = this.state;
    const prevPagesLength = (prevProps.pagestore.pageIds || []).length;
    const pagesLength = (this.props.pagestore.pageIds || []).length;
    // Set initial activePageId in store
    if (prevPagesLength !== pagesLength && activeStoryPage === 0) {
      const pageIds = this.props.pagestore.pageIds || [];
      pageIds.length > 0 && this.props.setActivePage(pageIds[0], false);
    }
    const event = this.props.actionstore.event;
    if (
      this.swiperRef.current &&
      this.swiperRef.current.swiper &&
      event.data &&
      this.swiperRef.current.swiper.activeIndex !== event.data.to
    ) {
      this.swiperRef.current.swiper.slideTo(event.data.to);
    }
  }

  goNext = () => {
    if (this.swiperRef.current && this.swiperRef.current.swiper) {
      this.swiperRef.current.swiper.slideNext();
      this.broadcastEvent(this.swiperRef.current.swiper.activeIndex);
    }
  };

  broadcastEvent = (activeIndex) => {
    this.props.wsBroadcast({
      type: REMOTE_COLLOBORATION_BROADCAST_ACTION,
      data: {
        event: { name: "change_slide", data: { to: activeIndex } },
        user: this.props.auth.payload.user,
      },
    });
  };

  goPrev = () => {
    if (this.swiperRef.current && this.swiperRef.current.swiper) {
      this.swiperRef.current.swiper.slidePrev();
      this.broadcastEvent(this.swiperRef.current.swiper.activeIndex);
    }
  };

  setActivePageId = (activeStoryPage) => {
    const pageIds = this.props.pagestore.pageIds || [];
    pageIds.forEach((pageId, index) => {
      index === activeStoryPage && this.props.setActivePage(pageId, false);
    });
  };
}

PresentArtBoards.propTypes = {
  pagestore: PropTypes.object.isRequired,
  sockets: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  pagestore: state.pagestore,
  sockets: state.websockets,
  activePageId: state.editor.activePage.id,
  auth: state.auth,
  actionstore: state.actionstore,
  story: state.story,
});

const mapDispatchToProps = (dispatch) => ({
  setActivePage: (pageId, isSelected) =>
    dispatch(setActivePage(pageId, isSelected)),
  wsBroadcast: (payload) => dispatch(wsBroadcast(payload)),
  cloneStory: (storyID, signal, props) =>
    dispatch(cloneStory(storyID, signal, props)),
  updateStory: (storyId, data, signal, props) =>
    dispatch(updateStory(storyId, data, signal, props)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PresentArtBoards));
