import React, { Component } from "react";
import PropTypes from "prop-types";
import { batch, connect } from "react-redux";
import StudioAnimationCollection from "./StudioAnimationCollection";
import TldrCollpasibleSection from "../../../common/TldrCollpasibleSection";
import {
  wsUpdateLayers,
  wsUpdateStory,
} from "../../../../_actions/webSocketAction";
import { wsUpdateAnimation } from "../../../../_actions/webSocketAction";
import {
  zoomPreset,
  fadeNeonPreset,
  baselinePreset,
  popPreset,
  dashPreset,
  locomotionPreset,
  textPopPreset,
  breathePreset,
  textBlockPreset,
  textBaselinePreset,
  panRisePreset,
  shouldWeAnimateThisLayer,
  depthOffset,
} from "./presetHelper";

export class StudioArtboardTransitions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: false,
    };
  }

  handleToggleChange = () => {
    this.setState({ collapse: !this.state.collapse });
  };

  onClick = (adjustment) => {
    const { editor, canvasRef, pages } = this.props;
    let currentPageAnimation = pages[editor.activePage.id]
      ? pages[editor.activePage.id].payload.animation
      : {};

    let preset = null;
    if (adjustment.id !== "none") {
      preset = adjustment;
    }
    let artboardDuration = currentPageAnimation.duration
      ? currentPageAnimation.duration
      : 6;
    // Apply preset to all layers
    this.applyPresetToLayers(preset, artboardDuration);

    // Apply preset to artboard
    canvasRef.handler?.workarea.set({
      animation: {
        ...currentPageAnimation,
        preset: preset,
      },
    });

    if (preset) {
      canvasRef.handler.animationHandler.previewCurrentArtboard(
        artboardDuration,
        () => {
          this.updatePreset(currentPageAnimation, preset);
        },
        false,
        true
      );
    } else {
      this.updatePreset(currentPageAnimation, preset);
    }
  };

  updatePreset = (currentPageAnimation, preset) => {
    batch(() => {
      const { editor, pages, canvasRef } = this.props;

      let objectPayload = pages[editor.activePage.id].payload;
      objectPayload = {
        ...objectPayload,
        animation: {
          ...currentPageAnimation,
          preset: preset,
        },
      };

      let message = {
        page: pages[editor.activePage.id].id,
        payload: objectPayload,
      };
      const allLayers = canvasRef.handler.getLayersPayload();
      this.props.wsUpdateAnimation(message);
      this.props.wsUpdateLayers(allLayers, editor.activePage.id);
    });
  };

  applyPresetToLayers = (adjustment, artboardDuration) => {
    const { canvasRef } = this.props;
    const layersInCanvas = canvasRef.handler.getObjects();
    artboardDuration = artboardDuration * 1000;
    if (layersInCanvas?.length === 0) {
      return;
    }

    // None
    if (!adjustment || adjustment.id === "none") {
      layersInCanvas.forEach((layer) => {
        layer.set("animation", null);
      });
      return;
    }

    let local_start_time = 100;
    let local_delay = 500;

    let totalTimeForEntryAnimations = Math.min(1400, artboardDuration / 4);
    let canvasWidth = layersInCanvas[0].canvas.clipPath.width;
    let canvasHeight = layersInCanvas[0].canvas.clipPath.height;
    let numberOfLayersToAnimate = 0;

    let canvasTopLeft = [
      canvasRef.handler.workarea.top,
      canvasRef.handler.workarea.left,
    ];

    let list_of_presets = [
      "fade",
      "pop",
      "baseline",
      "zoom",
      "neon",
      "dash",
      "locomotion",
      "pan",
      "rise",
      "breathe_preset",
      "textPop",
      "textBaseline",
    ];

    layersInCanvas.forEach((layer) => {
      if (
        shouldWeAnimateThisLayer(
          layer,
          canvasTopLeft,
          canvasWidth,
          canvasHeight
        )
      ) {
        numberOfLayersToAnimate += 1;
      }
    });

    let canvasSize = canvasWidth * canvasHeight;
    layersInCanvas.sort((a, b) =>
      a.top * canvasWidth +
        a.left +
        depthOffset(layersInCanvas, a, canvasSize) >=
      b.top * canvasWidth + b.left + depthOffset(layersInCanvas, b, canvasSize)
        ? 1
        : -1
    ); // sort in ascending order

    if (adjustment.id === "text_block") {
      let no_of_text_layers = layersInCanvas.filter(
        (obj) => obj.type === "textbox"
      ).length;
      local_delay = Math.min(
        local_delay,
        totalTimeForEntryAnimations / no_of_text_layers
      );
    } else if (list_of_presets.includes(adjustment.id)) {
      local_delay = Math.min(
        local_delay,
        totalTimeForEntryAnimations / numberOfLayersToAnimate
      );
    }

    if (adjustment.id === "pop") {
      popPreset(
        adjustment,
        layersInCanvas,
        local_start_time,
        local_delay,
        artboardDuration,
        canvasTopLeft,
        canvasWidth,
        canvasHeight
      );
    }
    if (adjustment.id === "baseline") {
      baselinePreset(
        adjustment,
        layersInCanvas,
        local_start_time,
        local_delay,
        artboardDuration,
        canvasTopLeft,
        canvasWidth,
        canvasHeight
      );
    }
    if (adjustment.id === "text_block") {
      textBlockPreset(
        adjustment,
        layersInCanvas,
        local_start_time,
        local_delay,
        artboardDuration
      );
    }
    if (adjustment.id === "zoom") {
      zoomPreset(
        adjustment,
        layersInCanvas,
        local_start_time,
        local_delay,
        artboardDuration,
        canvasTopLeft,
        canvasWidth,
        canvasHeight
      );
    }
    if (adjustment.id === "fade" || adjustment.id === "neon") {
      fadeNeonPreset(
        adjustment,
        layersInCanvas,
        local_start_time,
        local_delay,
        artboardDuration,
        canvasTopLeft,
        canvasWidth,
        canvasHeight
      );
    }

    if (adjustment.id === "dash") {
      dashPreset(
        adjustment,
        layersInCanvas,
        local_start_time,
        local_delay,
        artboardDuration,
        canvasTopLeft,
        canvasWidth,
        canvasHeight
      );
    }
    if (adjustment.id === "locomotion") {
      locomotionPreset(
        adjustment,
        layersInCanvas,
        local_start_time,
        local_delay,
        artboardDuration,
        canvasTopLeft,
        canvasWidth,
        canvasHeight
      );
    }
    if (adjustment.id === "pan" || adjustment.id === "rise") {
      panRisePreset(
        adjustment,
        layersInCanvas,
        local_start_time,
        local_delay,
        artboardDuration,
        canvasTopLeft,
        canvasWidth,
        canvasHeight
      );
    }
    if (adjustment.id === "breathe_preset") {
      breathePreset(
        adjustment,
        layersInCanvas,
        local_start_time,
        local_delay,
        artboardDuration,
        canvasTopLeft,
        canvasWidth,
        canvasHeight
      );
    }
    if (adjustment.id === "textPop") {
      textPopPreset(
        adjustment,
        layersInCanvas,
        local_start_time,
        local_delay,
        artboardDuration
      );
    }
    if (adjustment.id === "textBaseline") {
      textBaselinePreset(
        adjustment,
        layersInCanvas,
        local_start_time,
        local_delay,
        artboardDuration
      );
    }
  };

  render() {
    const { editor, pages } = this.props;
    const currentAnimation = pages[editor.activePage.id].payload.animation;
    const currentAnimationType = currentAnimation["preset"]
      ? currentAnimation["preset"]["id"]
      : "none";
    return (
      <>
        <hr className="tldr-hl" />
        <TldrCollpasibleSection
          title="Quick presets"
          subtitle="Animate artboard with readymade presets."
          collapse={this.state.collapse}
          onToggleCollapse={this.handleToggleChange}
        >
          <StudioAnimationCollection
            source="page"
            current={currentAnimationType}
            onClick={this.onClick}
          />
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
  wsUpdateAnimation: (payload) => dispatch(wsUpdateAnimation(payload)),
  wsUpdateLayers: (layers, pageId) => dispatch(wsUpdateLayers(layers, pageId)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudioArtboardTransitions);
