import { faCut, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { TldrAction } from "../../../common/statelessView";
import TldrMediaTrimmingModal from "../../../common/TldrMediaTrimmingModal";
import { StyledTextEditorToolbarFormatGroup } from "../../../styled/details/stylesDetails";
import { batch } from "react-redux";
import {
  setActiveLayer,
  setCrop,
  setVideoPlayingStatus,
} from "../../../../_actions/textToolbarActions";
import VideoEventHandler from "../../../canvas/handlers/VideoEventHandler";

class VideoEditorToolbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showTrimmingModal: false,
    };
  }

  render() {
    const { activeElement, canvasRef } = this.props;
    if (!activeElement.id) {
      return <></>;
    }
    const { showTrimmingModal } = this.state;
    let target = canvasRef.handler.canvas.getActiveObject();

    return (
      <>
        <div className="tldr-vl" />
        <StyledTextEditorToolbarFormatGroup>
          <TldrAction
            action={{}}
            icon={activeElement?.isVideoPlaying ? faPause : faPlay}
            title={activeElement?.isVideoPlaying ? "Pause" : "Play"}
            userAction={{}}
            callback={this.playPause}
          />

          {/* <TldrAction
            action={activeElement.mime}
            icon={faCropAlt}
            title="Crop"
            callback={this.crop}
            disabled={activeElement.cropEnable}
          /> */}

          <TldrAction
            icon={faCut}
            title="Trim"
            callback={this.showTrimmingModal}
            disabled={activeElement.mime !== "video"}
          />
        </StyledTextEditorToolbarFormatGroup>

        {target && (
          <TldrMediaTrimmingModal
            show={showTrimmingModal}
            onHide={() => {
              this.setState({
                ...this.state,
                showTrimmingModal: false,
              });
            }}
            onSubmit={this.onTrimClick}
            mediaType={"Video"}
          />
        )}
      </>
    );
  }

  playPause = () => {
    const { canvasRef } = this.props;
    let video = this.selectedVideo();
    video.load();

    if (video.paused) {
      try {
        video.play();
      } catch (error) {
        console.error(`Error while playing video: ${error}`);
      }
    } else {
      video.pause();
    }
  };

  onTrimClick = (startTime, endTime) => {
    this.setState({
      ...this.state,
      showTrimmingModal: false,
    });

    const { canvasRef } = this.props;
    const target = canvasRef.handler.canvas.getActiveObject();

    target.setVideoPlaybackRange(startTime, endTime);
    new VideoEventHandler(target, canvasRef.handler);
    canvasRef.handler.canvas.fire("object:modified", {
      target: target,
    });
    canvasRef.handler.canvas.renderAll();
  };

  crop = (action) => {
    const { canvasRef } = this.props;
    canvasRef.handler.cropHandler.start();

    let cropObject = canvasRef.handler.cropHandler.cropObject;
    batch(() => {
      this.props.setActiveLayer(
        cropObject.id,
        cropObject.type,
        cropObject,
        null
      );
      this.props.setCrop(true);
    });
  };

  selectedVideo = () => {
    const { canvasRef } = this.props;
    const target = canvasRef.handler.canvas.getActiveObject();

    if (!target || !target.element) {
      return;
    }

    return target.element;
  };

  showTrimmingModal = () => {
    this.setState({
      showTrimmingModal: true,
    });
  };
}

VideoEditorToolbar.propTypes = {
  activeElement: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  activeElement: state.editor.activeElement,
});

const mapDispatchToProps = (dispatch) => ({
  setActiveLayer: (elementId, elementType, layerId, elementParentId) =>
    dispatch(setActiveLayer(elementId, elementType, layerId, elementParentId)),
  setCrop: (isEnable) => dispatch(setCrop(isEnable)),
  setVideoPlayingStatus: (isPlaying) =>
    dispatch(setVideoPlayingStatus(isPlaying)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoEditorToolbar);
