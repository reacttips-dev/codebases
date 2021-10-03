import React, { Component } from "react";
import { batch, connect } from "react-redux";
import {
  setActiveLayer,
  setCrop,
} from "../../../../_actions/textToolbarActions";
import { ADVANCED_EDITOR_CLIP } from "../../constants";
import TldrImageClipShapes from "./TldrImageClipShapes";
import TldrImageCropRatios from "./TldrImageCropRatios";

class AdvancedCropAndClipPanel extends Component {
  render() {
    const { canvasRef } = this.props;

    return (
      <div>
        <TldrImageCropRatios canvasRef={canvasRef} />
        <TldrImageClipShapes canvasRef={canvasRef} />
      </div>
    );
  }

  componentDidMount() {
    this.crop(this.props.editor.activeElement.mime);
  }

  crop = (action) => {
    const { canvasRef } = this.props;
    canvasRef.handler.cropHandler.start();

    let cropObject = canvasRef.handler.cropHandler.cropObject;
    batch(() => {
      this.props.setActiveLayer(
        cropObject.id,
        cropObject.type,
        cropObject,
        null,
        ADVANCED_EDITOR_CLIP
      );
      this.props.setCrop(true);
    });
  };
}

AdvancedCropAndClipPanel.propTypes = {};

const mapStateToProps = (state) => ({
  editor: state.editor,
});

const mapDispatchToProps = (dispatch) => ({
  setActiveLayer: (
    elementId,
    elementType,
    layerId,
    elementParentId,
    selectedTab
  ) =>
    dispatch(
      setActiveLayer(
        elementId,
        elementType,
        layerId,
        elementParentId,
        selectedTab
      )
    ),
  setCrop: (isEnable) => dispatch(setCrop(isEnable)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdvancedCropAndClipPanel);
