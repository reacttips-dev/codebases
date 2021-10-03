import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import StudioAnimationCollection from "./StudioAnimationCollection";
import StudioLayerAnimationControls from "./StudioLayerAnimationControls";
import { StyledAdvEditorToolbarFormatGroup } from "../../../styled/details/stylesDetails";
import { ENTER_ANIMATION } from "../../../../_actions/types";
import { STILL } from "../../constants";
import { updateLayerAnimation } from "../../../../_utils/common";

export class StudioLayerAnimations extends Component {
  onClick = (adjustment) => {
    const { editor, layers, pages, canvasRef } = this.props;

    // if (adjustment.id === "none") {
    //   canvasRef.handler.removeKey("animation");
    //   return;
    // }
    const currentPageAnimation = pages[editor.activePage.id].payload.animation;
    let defaultDuration = currentPageAnimation["duration"];
    let totalDuration = defaultDuration * 1000;

    const currentPayload = layers[editor.activeElement.id].payload;
    const currentLayerAnimations = currentPayload.animation;

    const updatedAnimations = updateLayerAnimation(
      totalDuration,
      currentLayerAnimations,
      adjustment
    );

    if (adjustment.id === "none") {
      canvasRef.handler.set("animation", updatedAnimations);
    } else {
      canvasRef.handler.animationHandler.previewAndUpdate(
        editor.activeElement,
        updatedAnimations
      );
    }
  };

  render() {
    const { editor, layers, canvasRef } = this.props;
    const currentAnimations =
      layers[editor?.activeElement?.id]?.payload?.animation;
    const currentAnimationType =
      currentAnimations?.[0] && currentAnimations?.[0].type !== "still"
        ? currentAnimations[0].type
        : "none";

    const effects =
      currentAnimations &&
      currentAnimations.map((animation, index) => {
        return (
          <div key={index}>
            {animation.type !== STILL && (
              <StudioLayerAnimationControls
                index={index}
                animation={animation}
                title={animation.motion}
                subtitle={animation.type}
                canvasRef={canvasRef}
              ></StudioLayerAnimationControls>
            )}
          </div>
        );
      });

    return (
      <>
        <StyledAdvEditorToolbarFormatGroup>
          <div className="title">Select motion</div>

          <StudioAnimationCollection
            type={ENTER_ANIMATION}
            current={currentAnimationType}
            onClick={this.onClick}
            source="layer"
            objectType={editor.activeElement.mime}
          />
          <hr className="tldr-hl mt-12 mb-12" />
          {currentAnimations && <>{effects}</>}
        </StyledAdvEditorToolbarFormatGroup>
      </>
    );
  }
}

StudioLayerAnimations.propTypes = {
  editor: PropTypes.object.isRequired,
  layers: PropTypes.object.isRequired,
  pages: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  editor: state.editor,
  layers: state.layerstore.layers,
  pages: state.pagestore.pages,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudioLayerAnimations);
