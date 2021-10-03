import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import StudioAnimationCollection from "./StudioAnimationCollection";
import StudioPageAnimationControls from "./StudioPageAnimationControls";
import TldrCollpasibleSection from "../../../common/TldrCollpasibleSection";
import { StyledAdvEditorToolbarFormatGroup } from "../../../styled/details/stylesDetails";
import { StyledButton } from "../../../styled/styles";
import { wsUpdateStory } from "../../../../_actions/webSocketAction";

export class StudioArtboardTransitions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: true,
    };
  }

  handleToggleChange = () => {
    this.setState({ collapse: !this.state.collapse });
  };

  onClick = (adjustment) => {
    const { editor, canvasRef, pages } = this.props;

    let currentAnimation = pages[editor.activePage.id]
      ? pages[editor.activePage.id].payload.animation
      : {};
    let currentDuration = currentAnimation["duration"],
      currentTransition = currentAnimation["transition"];

    if (adjustment.id === "none") {
      canvasRef.handler.animationHandler.addOrRemoveTransition({
        duration: currentDuration,
        preset: currentAnimation["preset"],
      });
      return;
    }
    const entryAnimation = adjustment.variants[0].enter;

    if (!currentTransition || currentTransition.type !== entryAnimation.type) {
      canvasRef.handler.animationHandler.updateArtboardAnimation({
        duration: currentDuration,
        transition: entryAnimation,
      });
    }
  };

  applyToAll = (current) => {
    this.props.wsUpdateStory({
      transition: current["transition"],
    });
  };

  render() {
    const { editor, pages, canvasRef } = this.props;
    const currentAnimation =
      pages[editor.activePage.id]?.payload?.animation || {};
    const currentAnimationType = currentAnimation["transition"]
      ? currentAnimation["transition"]["type"]
      : "none";

    return (
      <>
        <TldrCollpasibleSection
          title="Transitions"
          subtitle="Choose how to transition between your artboards."
          collapse={this.state.collapse}
          onToggleCollapse={this.handleToggleChange}
        >
          <StudioAnimationCollection
            source="transitions"
            current={currentAnimationType}
            onClick={this.onClick}
          />
          <hr className="tldr-hl" />
          {currentAnimation && currentAnimation.transition && (
            <>
              <StudioPageAnimationControls
                canvasRef={canvasRef}
              ></StudioPageAnimationControls>
              <hr className="tldr-hl" />
            </>
          )}
          <StyledAdvEditorToolbarFormatGroup>
            <StyledButton onClick={() => this.applyToAll(currentAnimation)}>
              Apply to all
            </StyledButton>
          </StyledAdvEditorToolbarFormatGroup>
        </TldrCollpasibleSection>
      </>
    );
  }
}

StudioArtboardTransitions.propTypes = {
  editor: PropTypes.object.isRequired,
  pages: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  editor: state.editor,
  pages: state.pagestore.pages,
});

const mapDispatchToProps = (dispatch) => ({
  wsUpdateStory: (payload) => dispatch(wsUpdateStory(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudioArtboardTransitions);
