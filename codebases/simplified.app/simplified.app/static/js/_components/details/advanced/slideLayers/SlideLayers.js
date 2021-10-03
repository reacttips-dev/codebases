import React, { Component } from "react";
import { connect } from "react-redux";
import TldrCollpasibleSection from "../../../common/TldrCollpasibleSection";
import SlideLayerItem from "./SlideLayerItem";
import { TldrUnlockWarningDialog } from "../../../common/statelessView";

class SlideLayers extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapse: Array(1).fill(false),
      showUnlockDialog: false,
      selectedLayer: null,
    };
  }

  handleToggleChange = (i) => {
    const { collapse } = this.state;
    const collapseArray = collapse;
    collapseArray[i] = !collapseArray[i];

    this.setState({ collapse: collapseArray });
  };

  onSelect = (layerId, action) => {
    if (action === "unlock") {
      this.setState({
        ...this.state,
        selectedLayer: layerId,
        showUnlockDialog: true,
      });
    } else if (action === "select") {
      this.props.canvasRef.handler.searchAndSelect(layerId);
    }
  };

  render() {
    let layerItemList = this.getLayerItemList();

    return (
      <>
        <TldrCollpasibleSection
          title="Layers"
          collapse={this.state.collapse[1]}
          onToggleCollapse={() => this.handleToggleChange(0)}
        >
          {layerItemList}
        </TldrCollpasibleSection>

        <TldrUnlockWarningDialog
          show={this.state.showUnlockDialog}
          onHide={() => {
            this.setState({
              ...this.state,
              showUnlockDialog: false,
            });
          }}
          onYes={() => {
            this.setState({
              ...this.state,
              showUnlockDialog: false,
            });

            this.props.canvasRef.handler.unlockThisLayer(
              this.state.selectedLayer
            );
          }}
        ></TldrUnlockWarningDialog>
      </>
    );
  }

  getLayerItemList = () => {
    const { canvasRef, layerstore } = this.props;

    let currentPageLayers = canvasRef.handler.getObjects();

    let layerItemList = currentPageLayers
      .map((layer, index) => {
        const layerId = layer.id;
        const layerstoreLayer = layerstore.layers[layerId];

        return (
          <SlideLayerItem
            onSelect={this.onSelect}
            key={index}
            layer={layer}
            canvasRef={canvasRef}
            location="edit"
            layerTitle={layerstoreLayer ? layerstoreLayer.title : ""}
          />
        );
      })
      .reverse();

    return layerItemList;
  };
}

SlideLayers.propTypes = {};

const mapStateToProps = (state) => ({
  layerstore: state.layerstore,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SlideLayers);
