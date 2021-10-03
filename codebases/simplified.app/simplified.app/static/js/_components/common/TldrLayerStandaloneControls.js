import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import _ from "lodash";
import TldrSlider from "./TldrSlider";
import { DOMAIN_NEG50_TO_50, SLIDER_VALUE_REGEX } from "../details/constants";
import { checkInputboxValueRangeForSlider } from "../../_utils/common";

class TldrLayerStandaloneControls extends Component {
  constructor(props) {
    super(props);

    const editorFormat = props.editor.activeElement.format;
    const layerId = props.editor.activeElement.id;
    const layer = props.layerstore.layers[layerId];

    this.state = {
      layerId: layerId,
      lastUpdated: layer?.last_updated,
      skewX: editorFormat && editorFormat.skewX,
      skewY: editorFormat && editorFormat.skewY,
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
        skewX: layer?.payload.skewX,
        skewY: layer?.payload.skewY,
      };
    }
    return null;
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.state, nextState);
  }

  onSkewXUpdate = (value) => {
    if (typeof value === "object") {
      const { skewX } = this.state;

      if (skewX === Number(value[0])) return;

      this.setState(
        {
          skewX: value[0],
        },
        () => {
          this.onSkewChanged("skewX", value[0], "commit");
        }
      );
    } else if (typeof value === "string") {
    }
  };

  onSkewXChange = (value) => {
    if (typeof value === "object") {
      this.onSkewChanged("skewX", value[0], "push");
    } else if (typeof value === "string") {
      this.handleSkewXFocusOut(value);
    }
  };

  handleSkewXFocusOut = (text) => {
    let skewXValue = null;
    if (
      text.match(SLIDER_VALUE_REGEX) &&
      checkInputboxValueRangeForSlider(text, DOMAIN_NEG50_TO_50)
    ) {
      const { skewX } = this.state;

      if (skewX === Number(text)) return;
      skewXValue = text;
    }

    this.setState(
      {
        skewX: skewXValue,
      },
      () => {
        this.onSkewChanged("skewX", text, "push");
      }
    );
  };

  onSkewYUpdate = (value) => {
    if (typeof value === "object") {
      const { skewY } = this.state;

      if (skewY === Number(value[0])) return;

      this.setState(
        {
          skewY: value[0],
        },
        () => {
          this.onSkewChanged("skewY", value[0], "commit");
        }
      );
    } else if (typeof value === "string") {
    }
  };

  onSkewYChange = (value) => {
    if (typeof value === "object") {
      this.onSkewChanged("skewY", value[0], "push");
    } else if (typeof value === "string") {
      this.handleSkewYFocusOut(value);
    }
  };

  handleSkewYFocusOut = (text) => {
    let skewYValue = null;

    if (
      text.match(SLIDER_VALUE_REGEX) &&
      checkInputboxValueRangeForSlider(text, DOMAIN_NEG50_TO_50)
    ) {
      const { skewY } = this.state;

      if (skewY === Number(text)) return;
      skewYValue = text;
    }

    this.setState(
      {
        skewY: skewYValue,
      },
      () => {
        this.onSkewChanged("skewY", text, "push");
      }
    );
  };

  onSkewChanged = (skewType, value, method) => {
    const { handler } = this.props.canvasRef;

    handler.objectHandler.skew(skewType, value, method);
  };

  render() {
    const { skewX, skewY } = this.state;
    return (
      <>
        <div className="actions mb-2">
          <TldrSlider
            hideIndicator={true}
            domain={DOMAIN_NEG50_TO_50}
            onUpdate={this.onSkewXUpdate}
            onChange={this.onSkewXChange}
            values={[skewX]}
            showDecimals={false}
            title="Skew X"
            maxLength={3}
            handleFocus={this.onSkewXUpdate}
            handleFocusOut={this.onSkewXChange}
            showInputbox={true}
          ></TldrSlider>
        </div>

        <div className="actions mb-2">
          <TldrSlider
            hideIndicator={true}
            domain={DOMAIN_NEG50_TO_50}
            onUpdate={this.onSkewYUpdate}
            onChange={this.onSkewYChange}
            values={[skewY]}
            showDecimals={false}
            title="Skew Y"
            maxLength={3}
            handleFocus={this.onSkewYUpdate}
            handleFocusOut={this.onSkewYChange}
            showInputbox={true}
          ></TldrSlider>
        </div>
      </>
    );
  }
}

TldrLayerStandaloneControls.propTypes = {
  editor: PropTypes.object.isRequired,
  layerstore: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  editor: state.editor,
  layerstore: state.layerstore,
  brandKit: state.brandKit,
});

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TldrLayerStandaloneControls);
