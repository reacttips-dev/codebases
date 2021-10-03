import React, { Component } from "react";
import PropTypes from "prop-types";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { findIndex } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { StyledZoomActionButton } from "../_components/styled/styles";
import {
  StyledFooterButtonGroup,
  StyledTooltipWithKBDShortcut,
  StyledVerticalSeparater,
} from "../_components/styled/details/styleArtBoardEditor";
import {
  faCaretLeft,
  faCaretRight,
  faChevronDown,
  faChevronUp,
} from "@fortawesome/free-solid-svg-icons";
import { TldrConfirmActionModal } from "../_components/common/statelessView";
import { batch, connect } from "react-redux";
import { setActivePage } from "../_actions/textToolbarActions";
import { TimelineContext } from "../_utils/timeline";
import DurationIndicator from "./TimelineEditor/DurationIndicator";
import {
  closeBottomPanel,
  openBottomPanel,
} from "../_actions/bottomPanelActions";
import { BottomPanelViewTypes } from "../_utils/constants";

class ArtBoardsLeftFooter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showConfirmation: false,
    };
  }

  static contextType = TimelineContext;

  render() {
    const { shouldRenderTimeline, duration, currentTime } = this.context;
    const { isBottomPanelOpen, bottomPanelViewType } = this.props;
    let activePageId = this.props.activePage.id;
    let totalArtBoards = this.props.pagestore.pageIds.length;

    let pageIndex = findIndex(this.props.pagestore.pageIds, (pageId) => {
      return pageId === activePageId;
    });
    return (
      <div
        className="my-auto"
        style={{ cursor: "pointer", flex: "1 1" }}
        data-click
      >
        <StyledFooterButtonGroup className="align-items-center">
          {/* Render timeline ? */}
          {shouldRenderTimeline ? (
            <>
              <OverlayTrigger
                key={"timeline-editor"}
                placement="top"
                overlay={
                  <Tooltip id={`tooltip-fit`}>
                    <StyledTooltipWithKBDShortcut>
                      Open timeline editor
                    </StyledTooltipWithKBDShortcut>
                  </Tooltip>
                }
              >
                <StyledZoomActionButton
                  hidehover="true"
                  onClick={this.onClickOpenTimelineEditor}
                >
                  Timeline view
                  <FontAwesomeIcon
                    icon={isBottomPanelOpen ? faChevronDown : faChevronUp}
                    style={{ marginLeft: "12px" }}
                  />
                </StyledZoomActionButton>
              </OverlayTrigger>
              <StyledVerticalSeparater margin="0 8px 0 0" />
              <DurationIndicator total={duration} current={currentTime} />
            </>
          ) : (
            <OverlayTrigger
              key={"artboards"}
              placement="top"
              overlay={
                <Tooltip id={`tooltip-fit`}>
                  <StyledTooltipWithKBDShortcut>
                    Change Artboard
                    <div className="hotkeys">
                      <kbd>
                        <FontAwesomeIcon icon={faCaretLeft} />
                      </kbd>{" "}
                      /{" "}
                      <kbd>
                        <FontAwesomeIcon icon={faCaretRight} />
                      </kbd>
                    </div>
                  </StyledTooltipWithKBDShortcut>
                </Tooltip>
              }
            >
              <StyledZoomActionButton onClick={this.onSwitchArtBoardClick}>
                Artboards
                {bottomPanelViewType !==
                  BottomPanelViewTypes.ARTBOARDS_GRID_VIEW && (
                  <FontAwesomeIcon
                    icon={isBottomPanelOpen ? faChevronDown : faChevronUp}
                    style={{ marginLeft: "12px" }}
                  />
                )}
              </StyledZoomActionButton>
            </OverlayTrigger>
          )}

          {bottomPanelViewType === BottomPanelViewTypes.ARTBOARDS_GRID_VIEW && (
            <>
              <StyledZoomActionButton onClick={this.onExpandPreviewClick}>
                Collapse
              </StyledZoomActionButton>
              <StyledVerticalSeparater />
            </>
          )}
        </StyledFooterButtonGroup>
        <TldrConfirmActionModal
          show={this.state.showConfirmation}
          onYes={() => {
            batch(() => {
              this.setState({ showConfirmation: false });
              this.onClickDeleteCurrentArtBoard();
            });
          }}
          onHide={() => this.setState({ showConfirmation: false })}
        ></TldrConfirmActionModal>
      </div>
    );
  }

  onSwitchArtBoardClick = (event) => {
    const { isBottomPanelOpen, bottomPanelViewType } = this.props;
    if (isBottomPanelOpen) {
      this.props.closeBottomPanel();
    } else if (
      bottomPanelViewType !== BottomPanelViewTypes.ARTBOARDS_GRID_VIEW
    ) {
      this.props.openBottomPanel();
    }
  };

  onClickOpenTimelineEditor = () => {
    const { openBottomPanel } = this.props;
    openBottomPanel();
  };

  onExpandPreviewClick = (event) => {
    const { bottomPanelViewType } = this.props;
    if (bottomPanelViewType === BottomPanelViewTypes.ARTBOARDS_GRID_VIEW) {
      batch(() => {
        this.props.openBottomPanel(BottomPanelViewTypes.PREVIEW_ARTBOARDS);
      });
    } else {
      batch(() => {
        this.props.openBottomPanel(BottomPanelViewTypes.ARTBOARDS_GRID_VIEW);
      });
    }
  };

  onClickPreviousArtBoard = (event) => {
    const { activePage, pagestore } = this.props;
    let currentArtBoardId = activePage.id;
    let currentArtBoardIndex = findIndex(pagestore.pageIds, (id) => {
      return id === currentArtBoardId;
    });

    if (currentArtBoardIndex > -1) {
      this.props.setActivePage(
        pagestore.pageIds[currentArtBoardIndex - 1],
        currentArtBoardIndex - 1,
        true
      );
    }
  };

  onClickNextArtBoard = (event) => {
    const { activePage, pagestore } = this.props;
    let currentArtBoardId = activePage.id;
    let currentArtBoardIndex = findIndex(pagestore.pageIds, (id) => {
      return id === currentArtBoardId;
    });

    if (currentArtBoardIndex < pagestore.pageIds.length) {
      this.props.setActivePage(
        pagestore.pageIds[currentArtBoardIndex + 1],
        currentArtBoardIndex + 1,
        true
      );
    }
  };
}

ArtBoardsLeftFooter.propTypes = {
  canvasRef: PropTypes.any,
  isBottomPanelOpen: PropTypes.bool,
  bottomPanelViewType: PropTypes.string,
};

const mapStateToProps = (state) => ({
  activePage: state.editor.activePage,
  pagestore: state.pagestore,
});

const mapDispatchToProps = (dispatch) => ({
  setActivePage: (pageId, pageIndex, isSelected) =>
    dispatch(setActivePage(pageId, pageIndex, isSelected)),
  closeBottomPanel: () => dispatch(closeBottomPanel()),
  openBottomPanel: (panelType) => dispatch(openBottomPanel(panelType)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ArtBoardsLeftFooter);
