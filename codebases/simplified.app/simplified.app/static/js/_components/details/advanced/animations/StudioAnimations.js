import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "styled-components";
import StudioLayerAnimations from "./StudioLayerAnimations";
import StudioArtboardTransitions from "./StudioArtboardTransitions";
import StudioAnimationPlayer from "./StudioAnimationPlayer";
import { StyledButton } from "../../../styled/styles";
import StudioPagePresets from "./StudioPagePresets";
import { wsUpdateStory } from "../../../../_actions/webSocketAction";
import { StoryTypes } from "../../../../_utils/constants";
import { ReactComponent as IconMotion } from "../../../../assets/icons/motion.svg";
import { grey, lightInactive, primary, white } from "../../../styled/variable";

const StyledGetStartedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-grow: 1;

  .icon {
    width: 40px;
    height: 40px;
    fill: ${white};
    margin-bottom: 16px;
  }

  .title-text {
    font-size: 20px;
    font-weight: 500;
    color: ${lightInactive};
    & > span {
      color: ${primary};
    }
    margin-bottom: 4px;
  }

  .description {
    font-size: 16px;
    color: ${grey};
    text-align: center;
    margin-bottom: 16px;
  }

  button {
    align-self: stretch;
  }
`;

export class StudioAnimations extends Component {
  addAnimation = () => {
    const { wsUpdateStory } = this.props;

    wsUpdateStory({
      story_type: StoryTypes.ANIMATED,
    });
  };

  render() {
    const { editor, canvasRef, pages } = this.props;
    const currentPageAnimation = pages[editor.activePage.id]
      ? pages[editor.activePage.id].payload.animation
      : {};
    return (
      <>
        {currentPageAnimation ? (
          <>
            <StudioAnimationPlayer
              canvasRef={canvasRef}
            ></StudioAnimationPlayer>
            {editor.activeElement.id ? (
              <>
                <hr className="tldr-hl mt-12 mb-12" />
                <StudioLayerAnimations
                  canvasRef={canvasRef}
                ></StudioLayerAnimations>
              </>
            ) : (
              <>
                <StudioPagePresets canvasRef={canvasRef}></StudioPagePresets>
                <StudioArtboardTransitions
                  canvasRef={canvasRef}
                ></StudioArtboardTransitions>
              </>
            )}
          </>
        ) : (
          <StyledGetStartedContainer>
            <IconMotion className="icon" />
            <div className="title-text">
              Animation <span className="highlight">Simplified</span>
            </div>
            <div className="description">
              Make your artboards come to life in <br />
              just a minute.
            </div>
            <StyledButton tldrbtn="primary" onClick={this.addAnimation}>
              Get started
            </StyledButton>
          </StyledGetStartedContainer>
        )}
      </>
    );
  }
}

StudioAnimations.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(StudioAnimations);
