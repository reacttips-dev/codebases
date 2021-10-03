import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TldrCollpasibleSection from "./TldrCollpasibleSection";
import _ from "lodash";
import { SLIDER_VALUE_REGEX } from "../details/constants";
import { checkInputboxValueRangeForSlider } from "../../_utils/common";
import { StyledDetailsSectionGroup } from "../styled/details/stylesDetails";
import EditableLabel from "./EditableLabel";
import { wsUpdateLayer } from "../../_actions/webSocketAction";

class TldrDetails extends Component {
  constructor(props) {
    super(props);

    const editorFormat = props.editor.activeElement.format;
    const layerId = props.editor.activeElement.id;
    const layer = props.layerstore.layers[layerId];

    this.state = {
      layerId: layerId,
      lastUpdated: layer?.last_updated,
      collapse: true,
      top: editorFormat && editorFormat.top,
      left: editorFormat && editorFormat.left,
      height: editorFormat && editorFormat.height,
      width: editorFormat && editorFormat.width,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const layerId = nextProps.editor.activeElement.id;
    const layer = nextProps.layerstore.layers[layerId];
    if (
      layerId !== prevState.layerId ||
      layer?.last_updated > prevState.lastUpdated
    ) {
      return {
        layerId: layerId,
        lastUpdated: layer?.last_updated,
      };
    }
    return null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.state, nextState);
  }

  render() {
    const { collapse } = this.state;
    const { editor, layerstore } = this.props;
    const layerId = editor.activeElement.id;
    const layer = layerstore.layers[layerId];

    return (
      <>
        <TldrCollpasibleSection
          title="Layer"
          collapse={collapse}
          onToggleCollapse={this.handleToggleChange}
        >
          <StyledDetailsSectionGroup>
            <div className="title">Layer Name</div>
            <EditableLabel
              text={layer?.title ? layer.title : ""}
              labelClassName="layernamevaluename"
              inputClassName="layernamevalueinput"
              onFocus={this.handleLayerNameFocus}
              onFocusOut={this.handleLayerNameFocusOut}
              showIcon={true}
              inputMaxLength={50}
              labelPlaceHolder={
                layer?.title ? layer.title : "Name of the Layer"
              }
            />
          </StyledDetailsSectionGroup>
        </TldrCollpasibleSection>
      </>
    );
  }

  handleToggleChange = () => {
    const { collapse } = this.state;

    this.setState({ collapse: !collapse });
  };

  onTopUpdate = (value) => {
    if (typeof value === "object") {
      const { top } = this.state;

      if (top === value[0]) return;

      this.setState(
        {
          ...this.state,
          top: value[0],
        },
        () => {
          this.applySelectedProperty({ top: value[0] }, "commit");
        }
      );
    } else if (typeof value === "string") {
    }
  };

  onTopChange = (value) => {
    const { workarea } = this.props.canvasRef.handler;
    let activeObj = this.props.canvasRef.handler.canvas.getActiveObject();

    if (typeof value === "object") {
      this.applySelectedProperty({ top: value[0] }, "push");
    } else if (typeof value === "string") {
      this.handleFocusOut(value, "top", [
        workarea.top,
        workarea.top + (workarea.height - activeObj.height * activeObj.scaleY),
      ]);
    }
  };

  onLeftUpdate = (value) => {
    if (typeof value === "object") {
      const { left } = this.state;

      if (left === value[0]) return;

      this.setState(
        {
          ...this.state,
          left: value[0],
        },
        () => {
          this.applySelectedProperty({ left: value[0] }, "commit");
        }
      );
    } else if (typeof value === "string") {
    }
  };

  onLeftChange = (value) => {
    const { workarea } = this.props.canvasRef.handler;
    let activeObj = this.props.canvasRef.handler.canvas.getActiveObject();

    if (typeof value === "object") {
      this.applySelectedProperty({ left: value[0] }, "push");
    } else if (typeof value === "string") {
      this.handleFocusOut(value, "left", [
        workarea.left,
        workarea.left + (-activeObj.width * activeObj.scaleX + workarea.width),
      ]);
    }
  };

  applySelectedProperty = (style, method = "commit") => {
    const { canvasRef } = this.props;
    let activeObj = canvasRef.handler.canvas.getActiveObject();

    if (!activeObj) {
      return;
    }

    _.forOwn(style, (value, key) => {
      activeObj.set(key, value);
    });
    canvasRef.handler.canvas.requestRenderAll();
    if (method === "push") {
      canvasRef.handler.canvas.fire("object:modified", { target: activeObj });
    }
  };

  handleFocusOut = (value, key, range) => {
    if (
      value.match(SLIDER_VALUE_REGEX) &&
      checkInputboxValueRangeForSlider(value, range)
    ) {
      this.setState(
        {
          ...this.state,
          [key]: value,
        },
        () => {
          this.applySelectedProperty({ [key]: parseInt(value) }, "push");
        }
      );
    }
  };

  handleLayerNameFocus = (text) => {};

  handleLayerNameFocusOut = (text) => {
    const { editor } = this.props;
    const layerId = editor.activeElement.id;

    const message = {
      layer: layerId,
      title: text,
    };
    this.props.wsUpdateLayer(message);
  };
}

TldrDetails.propTypes = {
  editor: PropTypes.object.isRequired,
  layerstore: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  editor: state.editor,
  layerstore: state.layerstore,
});

const mapDispatchToProps = (dispatch) => ({
  wsUpdateLayer: (payload) => dispatch(wsUpdateLayer(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TldrDetails);
