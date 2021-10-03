import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import TldrCommentPanel from "../comment/TldrCommentPanel";
import TldrKeyboardShortcutsList from "../common/TldrKeyboardShortcutsList";
import StudioAnimationSidebar from "./advanced/animations/StudioAnimationSidebar";
import StudioBaseRightSideBar from "./advanced/common/StudioBaseRightSideBar";
import StudioAdvancedSidebar from "./advanced/StudioAdvancedSidebar";
import {
  ADVANCED_ANIMATION_PANEL,
  ADVANCED_COMMENTS_PANEL,
  ADVANCED_EDITOR_PANEL,
  KEYBOARD_SHORTCUTS_PANEL,
} from "./constants";

export const StudioRightSidePanel = (props) => {
  const { isActionPanelOpen, sliderPanelType } = props.rightsidebar;
  return (
    <>
      {isActionPanelOpen && (
        <StudioBaseRightSideBar
          title={sliderPanelType}
          canvasRef={props.canvasRef}
        >
          {sliderPanelType === ADVANCED_ANIMATION_PANEL ? (
            <StudioAnimationSidebar
              canvasRef={props.canvasRef}
            ></StudioAnimationSidebar>
          ) : sliderPanelType === ADVANCED_COMMENTS_PANEL ? (
            <TldrCommentPanel></TldrCommentPanel>
          ) : sliderPanelType === ADVANCED_EDITOR_PANEL ? (
            <StudioAdvancedSidebar
              artBoardHandler={props.artBoardHandler}
              canvasRef={props.canvasRef}
            ></StudioAdvancedSidebar>
          ) : sliderPanelType === KEYBOARD_SHORTCUTS_PANEL ? (
            <TldrKeyboardShortcutsList></TldrKeyboardShortcutsList>
          ) : (
            <></>
          )}
        </StudioBaseRightSideBar>
      )}
    </>
  );
};

StudioRightSidePanel.propTypes = {
  rightsidebar: PropTypes.object.isRequired,
  canvasRef: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  rightsidebar: state.rightsidebar,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudioRightSidePanel);
