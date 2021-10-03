import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TldrCollpasibleSection from "../../../common/TldrCollpasibleSection";
import IconCommonActions from "../../layerActions/IconCommonActions";
import { calculateIconColors } from "../../../../_utils/common";
import TldrGradientCollapsibleSection from "../../../common/tldrGradients/TldrGradientCollapsibleSection";
import { FABRIC_SVG_ELEMENT } from "../../constants";

export class AdvancedShapeEditorToolbar extends Component {
  constructor(props) {
    super(props);

    this.state = { collapse: false };
  }

  handleToggleChange = () => {
    this.setState({ collapse: !this.state.collapse });
  };

  render() {
    const { canvasRef, artBoardHandlers, editor } = this.props;
    const { activeElement, activeSelection } = editor;

    let noOfIconColors = calculateIconColors(
      activeElement ? activeElement : activeSelection
    );

    return activeElement.format.type === FABRIC_SVG_ELEMENT &&
      noOfIconColors <= 0 ? null : (
      <>
        <TldrCollpasibleSection
          title="Shape"
          collapse={this.state.collapse}
          onToggleCollapse={this.handleToggleChange}
        >
          <IconCommonActions
            artBoardHandlers={artBoardHandlers}
            canvasRef={canvasRef}
          />
        </TldrCollpasibleSection>
        {noOfIconColors === 1 && (
          <TldrGradientCollapsibleSection
            canvasRef={canvasRef}
            mime={activeElement.format.type}
          />
        )}
      </>
    );
  }
}

AdvancedShapeEditorToolbar.propTypes = {
  editor: PropTypes.object.isRequired,
  layerstore: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  editor: state.editor,
  layerstore: state.layerstore,
});

const mapDispatchToProps = () => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AdvancedShapeEditorToolbar);
