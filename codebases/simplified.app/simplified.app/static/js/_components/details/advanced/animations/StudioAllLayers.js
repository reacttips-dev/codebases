import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import SlideLayerItem from "../slideLayers/SlideLayerItem";
import TldrCollpasibleSection from "../../../common/TldrCollpasibleSection";

export const StudioAllLayers = (props) => {
  const { activePage } = props.editor;
  const activeLayers = props.pages[activePage.id]?.layers;
  const [collapse, setCollapse] = useState(false);

  function handleToggleChange(e) {
    setCollapse(!collapse);
  }

  function onSelect(targetId, action) {
    props.canvasRef.handler.searchAndSelect(targetId);
  }

  let layerItemList =
    activeLayers &&
    activeLayers.map((layerId, index) => {
      const layer = props.layers[layerId];
      return (
        <div key={index}>
          {layer.payload.animation && (
            <SlideLayerItem
              onSelect={onSelect}
              key={index}
              layer={layer.payload}
              location="edit"
              layerTitle={layer.title}
            />
          )}
        </div>
      );
    });

  return (
    <TldrCollpasibleSection
      title="Motion"
      subtitle="Select a layer to add /edit motion."
      collapse={collapse}
      onToggleCollapse={handleToggleChange}
    >
      {layerItemList}
    </TldrCollpasibleSection>
  );
};

StudioAllLayers.propTypes = {
  layers: PropTypes.object.isRequired,
  editor: PropTypes.object.isRequired,
};

function mapStateToProps(state) {
  return {
    layers: state.layerstore.layers,
    editor: state.editor,
    pages: state.pagestore.pages,
  };
}

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(StudioAllLayers);
