import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import _ from "lodash";
import { updateLayerPayload } from "../../_actions/webSocketAction";
import TldrCollpasibleSection from "../common/TldrCollpasibleSection";
import QuickCommonLayerActions from "./layerActions/QuickCommonLayerActions";

export class CommonLayerActions extends Component {
  constructor(props) {
    super(props);

    const layerId = this.props.editor.activeElement.id;
    const layer = this.props.layerstore.layers[layerId];

    this.state = {
      layerId: layerId,
      lastUpdated: layer?.last_updated ? layer.last_updated : 0,
      collapse: true,
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

  handleToggleChange = () => {
    const { collapse } = this.state;

    this.setState({ collapse: !collapse });
  };

  render() {
    const { canvasRef } = this.props;
    return (
      <>
        <TldrCollpasibleSection
          title="Position"
          collapse={this.state.collapse}
          onToggleCollapse={this.handleToggleChange}
        >
          <QuickCommonLayerActions
            canvasRef={canvasRef}
            isPositionSidebar={true}
            showOrderOptions={true}
            showFlipOptions={true}
          ></QuickCommonLayerActions>
        </TldrCollpasibleSection>
      </>
    );
  }
}

CommonLayerActions.propTypes = {
  editor: PropTypes.object.isRequired,
  layerstore: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  editor: state.editor,
  layerstore: state.layerstore,
});

const mapDispatchToProps = (dispatch) => ({
  updateLayerPayload: (payload) => dispatch(updateLayerPayload(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(CommonLayerActions);
