import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  StyledArtBoardFooter,
  StyledArtBoardFooterWithBottomPanel,
} from "../_components/styled/details/styleArtBoardEditor";
import ArtBoardRearrangePanel from "./ArtBoardRearrangePanel";
import ArtBoardsLeftFooter from "./ArtBoardsLeftFooter";
import ArtBoardsMiddleFooter from "./ArtBoardsMiddleFooter";
import ArtBoardsRightFooter from "./ArtBoardsRightFooter";
import StudioBottomPanel from "./StudioBottomPanel";
import TimelineEditor from "./TimelineEditor";
import { TimelineContext } from "../_utils/timeline";
import { BottomPanelViewTypes, StoryTypes } from "../_utils/constants";
import ExpandedMusicPlayerTimeline from "./ExpandedMusicPlayerTimeline";
import { openBottomPanel } from "../_actions/bottomPanelActions";

class ArtBoardFooter extends Component {
  static contextType = TimelineContext;

  onClickBottombar = (e) => {
    const { openBottomPanel } = this.props;
    if (e.target?.dataset?.click) {
      openBottomPanel(BottomPanelViewTypes.PREVIEW_ARTBOARDS);
    }
  };

  render() {
    const {
      isActionPanelOpen,
      isSliderOpen,
      isBottomPanelOpen,
      canvasRef,
      zoomRatio,
      isStoryAnimated,
      bottomPanelViewType,
      openBottomPanel,
    } = this.props;

    let renderBottomPanel = null;
    if (isBottomPanelOpen) {
      switch (bottomPanelViewType) {
        // If the bottom panel is preview artboards
        case BottomPanelViewTypes.PREVIEW_ARTBOARDS:
          renderBottomPanel = isStoryAnimated ? (
            <TimelineEditor />
          ) : (
            <StudioBottomPanel />
          );
          break;

        // Fullscreen preview
        case BottomPanelViewTypes.ARTBOARDS_GRID_VIEW:
          renderBottomPanel = <ArtBoardRearrangePanel />;
          break;

        // Trim story music
        case BottomPanelViewTypes.TRIM_STORY_MUSIC:
          renderBottomPanel = (
            <ExpandedMusicPlayerTimeline
              isSliderOpen={isSliderOpen === "open"}
              onClose={() => {
                openBottomPanel(BottomPanelViewTypes.PREVIEW_ARTBOARDS);
              }}
            ></ExpandedMusicPlayerTimeline>
          );
          break;
        default:
          renderBottomPanel = null;
      }
    }

    return (
      <StyledArtBoardFooterWithBottomPanel
        isActionPanelOpen={isActionPanelOpen}
        isSliderOpen={isSliderOpen}
        isBottomPanelOpen={isBottomPanelOpen}
      >
        {!isBottomPanelOpen && (
          <StyledArtBoardFooter
            className={"tldr-editor-footer"}
            isActionPanelOpen={isActionPanelOpen}
            isSliderOpen={isSliderOpen}
            isBottomPanelOpen={isBottomPanelOpen}
            onClick={this.onClickBottombar}
            data-click
          >
            <ArtBoardsLeftFooter
              canvasRef={canvasRef}
              zoomRatio={zoomRatio}
              isBottomPanelOpen={isBottomPanelOpen}
              bottomPanelViewType={bottomPanelViewType}
            ></ArtBoardsLeftFooter>
            <div className="d-none d-sm-none d-md-flex">
              <ArtBoardsMiddleFooter
                canvasRef={canvasRef}
              ></ArtBoardsMiddleFooter>
            </div>
            <div
              className="d-none d-sm-none d-md-flex"
              style={{ flex: "1 1 0%" }}
            >
              <ArtBoardsRightFooter
                canvasRef={canvasRef}
                zoomRatio={zoomRatio}
              ></ArtBoardsRightFooter>
            </div>
          </StyledArtBoardFooter>
        )}

        {renderBottomPanel}
      </StyledArtBoardFooterWithBottomPanel>
    );
  }
}

ArtBoardFooter.propTypes = {
  story: PropTypes.object,
  isBottomPanelOpen: PropTypes.bool,
  bottomPanelViewType: PropTypes.string,
};

const mapStateToProps = (state) => ({
  isStoryAnimated: state.story?.payload?.story_type === StoryTypes.ANIMATED,
});

const mapDispatchToProps = (dispatch) => ({
  openBottomPanel: (panelType) => dispatch(openBottomPanel(panelType)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ArtBoardFooter);
