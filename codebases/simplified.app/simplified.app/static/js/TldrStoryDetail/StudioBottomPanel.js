import React, { Component } from "react";
import {
  StyledArtBoardPreviewAddAction,
  StyledArtBoardPreviewContainer,
  StyledArtboardPreviewDuration,
  StyledArtBoardPreviewStaticCanvasWrapper,
  StyledArtBoardPreviewTitle,
  StyledArtBoardPreviewWrapper,
  StyledEditorBottomPanel,
} from "../_components/styled/details/styleArtBoardEditor";
import TLDRSwiper from "../_components/common/TLDRSwiper";
import { connect } from "react-redux";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { setActivePage } from "../_actions/textToolbarActions";
import { isEqual } from "lodash";
import ArtBoardPreviewStaticCanvas from "./ArtBoardPreviewStaticCanvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faGripHorizontal,
  faPlus,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { wsAddPage } from "../_actions/webSocketAction";
import ArtBoardPreviewDropdownActions from "./ArtBoardPreviewDropdownActions";
import {
  StyledCloseActionButton,
  StyledZoomActionButton,
} from "../_components/styled/styles";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  closeBottomPanel,
  openBottomPanel,
} from "../_actions/bottomPanelActions";
import { BottomPanelViewTypes } from "../_utils/constants";

dayjs.extend(duration);

class StudioBottomPanel extends Component {
  constructor(props) {
    super(props);
    this.swiperRef = React.createRef();
  }

  onClickFullScreenPreview = () => {
    const { openBottomPanel } = this.props;
    openBottomPanel(BottomPanelViewTypes.ARTBOARDS_GRID_VIEW);
  };

  render() {
    const { pagestore, activePage, closeBottomPanel } = this.props;

    const { pages, pageIds } = pagestore;

    const swiperParams = {
      spaceBetween: 15,
      slidesPerView: "auto",
      shouldSwiperUpdate: true,
      runCallbacksOnInit: true,
      containerClass: "bottom-panel-artboard-preview-swiper-container",
      mousewheel: true,
      centeredSlides: true,
      on: {
        init: () => {
          if (
            this.swiperRef.current &&
            this.swiperRef.current.swiper &&
            activePage.id
          ) {
            this.swiperRef.current.swiper.slideTo(activePage.pageIndex);
          }
        },
      },
    };

    const previewArtBoards = pageIds.map((pageId, index) => {
      const duration = pages[pageId]?.payload?.animation?.duration;

      return (
        <StyledArtBoardPreviewWrapper key={index}>
          <StyledArtBoardPreviewContainer
            onClick={() => {
              this.props.setActivePage(pageId, index, true);
              this.swiperRef.current.swiper.slideTo(index);
            }}
          >
            <StyledArtBoardPreviewTitle location="preview-container">
              <p>{index + 1}</p>
            </StyledArtBoardPreviewTitle>
            {duration && (
              <StyledArtboardPreviewDuration>
                {dayjs.duration(duration, "seconds").format("mm:ss")}
              </StyledArtboardPreviewDuration>
            )}

            {pageId === activePage.id && (
              <ArtBoardPreviewDropdownActions pageId={pageId} />
            )}
            <StyledArtBoardPreviewStaticCanvasWrapper>
              <ArtBoardPreviewStaticCanvas page={pages[pageId]} />
            </StyledArtBoardPreviewStaticCanvasWrapper>
          </StyledArtBoardPreviewContainer>
          {index === pageIds.length - 1 && (
            <StyledArtBoardPreviewAddAction onClick={this.onClickAddArtBoard}>
              <FontAwesomeIcon icon={faPlus} color="white" />
            </StyledArtBoardPreviewAddAction>
          )}
        </StyledArtBoardPreviewWrapper>
      );
    });
    return (
      <StyledEditorBottomPanel>
        <div
          id="preview-title-bar"
          className="title-bar"
          onClick={(e) => {
            if (e.target.id === "preview-title-bar") closeBottomPanel();
          }}
        >
          <div className="title-display">
            <StyledZoomActionButton onClick={closeBottomPanel}>
              {previewArtBoards.length} Artboards
              <FontAwesomeIcon
                icon={faChevronDown}
                style={{ marginLeft: "12px" }}
              />
            </StyledZoomActionButton>
          </div>
          <div className="actions">
            <OverlayTrigger
              key={"grid-view"}
              placement="top"
              overlay={<Tooltip id={`tooltip-grid-view`}>Grid view</Tooltip>}
            >
              <StyledZoomActionButton onClick={this.onClickFullScreenPreview}>
                <FontAwesomeIcon icon={faGripHorizontal}></FontAwesomeIcon>
              </StyledZoomActionButton>
            </OverlayTrigger>
            <OverlayTrigger
              key={"close-view"}
              placement="top"
              overlay={<Tooltip id={`tooltip-close-view`}>Close panel</Tooltip>}
            >
              <StyledCloseActionButton onClick={closeBottomPanel}>
                <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
              </StyledCloseActionButton>
            </OverlayTrigger>
          </div>
        </div>
        <TLDRSwiper swiperParams={swiperParams} refs={this.swiperRef}>
          {previewArtBoards}
        </TLDRSwiper>
      </StyledEditorBottomPanel>
    );
  }

  onClickAddArtBoard = (event) => {
    this.props.wsAddPage();
  };

  componentDidUpdate(prevProps, prevState) {
    const { activePage } = this.props;

    if (!isEqual(prevProps.activePage, this.props.activePage)) {
      if (
        this.swiperRef.current &&
        this.swiperRef.current.swiper &&
        activePage.id
      ) {
        this.swiperRef.current.swiper.slideTo(activePage.pageIndex);
      }
    }
  }
}

StudioBottomPanel.propTypes = {};

const mapStateToProps = (state) => ({
  pagestore: state.pagestore,
  activePage: state.editor.activePage,
});

const mapDispatchToProps = (dispatch) => ({
  wsAddPage: () => dispatch(wsAddPage()),
  setActivePage: (pageId, pageIndex, isSelected) =>
    dispatch(setActivePage(pageId, pageIndex, isSelected)),
  closeBottomPanel: () => dispatch(closeBottomPanel()),
  openBottomPanel: (panelType) => dispatch(openBottomPanel(panelType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StudioBottomPanel);
