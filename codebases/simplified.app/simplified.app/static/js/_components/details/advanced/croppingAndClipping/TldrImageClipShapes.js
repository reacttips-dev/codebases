import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import React, { Component } from "react";
import { connect } from "react-redux";
import { setCrop } from "../../../../_actions/textToolbarActions";
import { TldrCollapsableAction } from "../../../common/statelessView";
import TldrCollpasibleSection from "../../../common/TldrCollpasibleSection";
import {
  StyledLayoutCollection,
  StyledSlideLayout,
} from "../../../styled/details/stylesDetails";
import { white } from "../../../styled/variable";
import { AVAILABLE_SHAPES_FOR_CLIP } from "../../constants";

class TldrImageClipShapes extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapse: false,
      localShape: "",
    };
  }

  render() {
    const { collapse, localShape } = this.state;
    const { activeElement } = this.props.editor;
    const availableShapes = AVAILABLE_SHAPES_FOR_CLIP.map((shape, index) => {
      return (
        <StyledSlideLayout
          key={index}
          onClick={() => this.onChangeClipShape(shape)}
          className={localShape === shape ? "active" : ""}
        >
          <div className={`${shape}`} />
        </StyledSlideLayout>
      );
    });
    const actionsView = (
      <>
        <TldrCollapsableAction
          icon={faCheck}
          action={activeElement.mime}
          callback={this.applyClip}
          title="Clip Image"
          iconColor={white}
          disabled={!this.props.canvasRef.handler.clipHandler.clipRect}
        ></TldrCollapsableAction>
        <TldrCollapsableAction
          icon={faTimes}
          action={activeElement.mime}
          callback={this.cancelClip}
          title="Cancel Clip"
          iconColor={white}
          disabled={!this.props.canvasRef.handler.clipHandler.clipRect}
        ></TldrCollapsableAction>
      </>
    );

    return (
      <TldrCollpasibleSection
        title="Clipping Shapes"
        collapse={collapse}
        onToggleCollapse={this.handleToggleChange}
        toggleButton={actionsView}
      >
        <StyledLayoutCollection location="clip">
          {availableShapes}
        </StyledLayoutCollection>
      </TldrCollpasibleSection>
    );
  }

  onChangeClipShape = (shape) => {
    const { canvasRef } = this.props;
    const { clipHandler } = canvasRef.handler;

    this.setState({ localShape: shape });
    clipHandler.start(shape);
  };

  handleToggleChange = () => {
    this.setState({ collapse: !this.state.collapse });
  };

  applyClip = (action) => {
    const { canvasRef } = this.props;
    const { clipHandler } = canvasRef.handler;

    clipHandler.finish();
    this.props.setCrop(false);
  };

  cancelClip = (action) => {
    const { canvasRef } = this.props;
    const { clipHandler } = canvasRef.handler;

    clipHandler.cancel(false);
    this.props.setCrop(false);
  };
}

TldrImageClipShapes.propTypes = {};

const mapStateToProps = (state) => ({
  editor: state.editor,
});

const mapDispatchToProps = (dispatch) => ({
  setCrop: (isEnable) => dispatch(setCrop(isEnable)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TldrImageClipShapes);
