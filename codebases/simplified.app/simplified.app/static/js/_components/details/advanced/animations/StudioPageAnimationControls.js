import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  StyledAdvEditorToolbarFormatGroup,
  StyledAdvEditorToolbarRow,
} from "../../../styled/details/stylesDetails";
import { slideTransitions, predefinedSpeeds } from "./defaultSlideTransitions";
import {
  StyledSpeedActionButton,
  StyledAnimationButtonGroup,
} from "../../../styled/styles";

export class StudioPageAnimationControls extends Component {
  onOptionChange = (adjustment) => {
    const { pages, editor, canvasRef } = this.props;
    let entryAnimation = adjustment.enter;
    const currentTransition =
      pages[editor.activePage.id].payload?.animation["transition"];

    canvasRef.handler.animationHandler.updateArtboardAnimation({
      transition: {
        ...entryAnimation,
        trans_duration: currentTransition["trans_duration"],
        start_time: currentTransition["start_time"],
        end_time: currentTransition["end_time"],
      },
    });
  };

  onSpeedChange = (speed) => {
    const { pages, editor, canvasRef } = this.props;
    const entryAnimation =
      pages[editor.activePage.id].payload?.animation["transition"];
    if (!entryAnimation) {
      return;
    }
    entryAnimation["trans_duration"] = speed.value;
    entryAnimation["end_time"] =
      entryAnimation["start_time"] + entryAnimation["trans_duration"];
    canvasRef.handler.animationHandler.updateArtboardAnimation({
      transition: entryAnimation,
    });
  };

  render() {
    const { editor, pages } = this.props;
    const currentAnimation = pages[editor.activePage.id].payload.animation;
    const current =
      currentAnimation && currentAnimation.transition
        ? currentAnimation.transition
        : "none";
    const selectedAnimations = slideTransitions.filter(function (adjustment) {
      return current.type.includes(adjustment.id);
    });

    const variants =
      selectedAnimations[0].variants.length > 1
        ? selectedAnimations[0].variants.map((dir, index) => {
            return (
              <StyledSpeedActionButton
                key={index}
                className={
                  current.type.includes(dir.enter.type) ? "active" : ""
                }
                onClick={() => this.onOptionChange(dir)}
              >
                {dir.title}
              </StyledSpeedActionButton>
            );
          })
        : null;

    const presetOptions = predefinedSpeeds.map((speed, index) => {
      return (
        <StyledSpeedActionButton
          key={index}
          className={current.trans_duration === speed.value ? "active" : ""}
          onClick={() => this.onSpeedChange(speed)}
        >
          {speed.title}
        </StyledSpeedActionButton>
      );
    });

    return (
      <>
        {variants && (
          <StyledAdvEditorToolbarRow>
            <StyledAdvEditorToolbarFormatGroup className="mb-3">
              <div className="title">Options</div>
              <StyledAnimationButtonGroup>
                {variants}
              </StyledAnimationButtonGroup>
            </StyledAdvEditorToolbarFormatGroup>
          </StyledAdvEditorToolbarRow>
        )}

        <StyledAdvEditorToolbarRow>
          <StyledAdvEditorToolbarFormatGroup className="mb-3">
            <div className="title">Speed</div>
            <StyledAnimationButtonGroup>
              {presetOptions}
            </StyledAnimationButtonGroup>
          </StyledAdvEditorToolbarFormatGroup>
        </StyledAdvEditorToolbarRow>
      </>
    );
  }
}

StudioPageAnimationControls.propTypes = {
  editor: PropTypes.object.isRequired,
  pages: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  editor: state.editor,
  pages: state.pagestore.pages,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudioPageAnimationControls);
