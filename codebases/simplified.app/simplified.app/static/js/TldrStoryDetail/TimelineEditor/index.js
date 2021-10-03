import React, { useContext, useRef } from "react";
import { connect } from "react-redux";
import { StyledTimelinePanelWrapper } from "./styled";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  faCompress,
  faExpand,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { StyledZoomActionButton } from "../../_components/styled/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { openAdvancedSettings } from "../../_actions/sidebarSliderActions";
import { TimelineContext } from "../../_utils/timeline";
import TimelineComponent from "./TimelineComponent";
import PlaybackButtons from "./PlaybackButtons";
import DurationIndicator from "./DurationIndicator";
import { DURATION_PIXEL_RATIO } from "../../_components/styled/variable";

import { ReactComponent as MotionIcon } from "../../assets/icons/motion.svg";
import {
  ADVANCED_ANIMATION_PANEL,
  ADVANCED_EDITOR_EDIT,
} from "../../_components/details/constants";
import { closeBottomPanel } from "../../_actions/bottomPanelActions";

const TimelineEditor = (props) => {
  const { closeBottomPanel, openAdvancedSettings } = props;
  const { duration, currentTime, changeTimescale, timescale } =
    useContext(TimelineContext);
  const titlebarRef = useRef(null);

  const closeTimelinePanel = () => {
    closeBottomPanel();
  };

  const toggleTimelineView = () => {
    if (titlebarRef.current) {
      if (timescale === 1) {
        const barWidth = titlebarRef.current.offsetWidth;
        const expectedRatio =
          (barWidth - 16) / (duration * DURATION_PIXEL_RATIO);
        changeTimescale(expectedRatio);
      } else {
        changeTimescale(1);
      }
    }
  };

  const openAnimationPanel = () => {
    openAdvancedSettings(ADVANCED_ANIMATION_PANEL, ADVANCED_EDITOR_EDIT);
  };

  return (
    <StyledTimelinePanelWrapper>
      <div
        id="timeline-titlebar"
        className="title-bar"
        data-click
        ref={titlebarRef}
        onClick={(e) => {
          if (e.target.id === "timeline-titlebar") closeTimelinePanel();
        }}
      >
        <div className="left-actions">
          <DurationIndicator total={duration} current={currentTime} />
        </div>
        <PlaybackButtons></PlaybackButtons>
        <div className="right-actions">
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tooltip-grid-view`}>
                {timescale === 1 ? "Fit timeline view" : "Reset view"}
              </Tooltip>
            }
          >
            <StyledZoomActionButton
              className="d-none d-md-flex"
              onClick={toggleTimelineView}
            >
              <FontAwesomeIcon
                icon={timescale === 1 ? faExpand : faCompress}
              ></FontAwesomeIcon>
            </StyledZoomActionButton>
          </OverlayTrigger>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tooltip-grid-view`}>Open animations</Tooltip>
            }
          >
            <StyledZoomActionButton onClick={openAnimationPanel}>
              <MotionIcon></MotionIcon>
            </StyledZoomActionButton>
          </OverlayTrigger>
          <OverlayTrigger
            placement="top"
            overlay={
              <Tooltip id={`tooltip-grid-view`}>Close editor panel</Tooltip>
            }
          >
            <StyledZoomActionButton
              className="ml-4 ml-md-0"
              onClick={closeTimelinePanel}
            >
              <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
            </StyledZoomActionButton>
          </OverlayTrigger>
        </div>
      </div>
      <TimelineComponent></TimelineComponent>
    </StyledTimelinePanelWrapper>
  );
};

TimelineEditor.propTypes = {};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  closeBottomPanel: () => dispatch(closeBottomPanel()),
  openAdvancedSettings: (panel, selectedTab) =>
    dispatch(openAdvancedSettings(panel, selectedTab)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TimelineEditor);
