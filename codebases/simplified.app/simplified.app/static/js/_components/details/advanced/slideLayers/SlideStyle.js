import React, { Component } from "react";
import { connect } from "react-redux";
import TldrCollpasibleSection from "../../../common/TldrCollpasibleSection";
import SlideCommonActions from "../../layerActions/SlideCommonActions";

class SlideStyle extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapse: Array(1).fill(false),
    };
  }

  handleToggleChange = (i) => {
    const { collapse } = this.state;
    const collapseArray = collapse;
    collapseArray[i] = !collapseArray[i];
    this.setState({ collapse: collapseArray });
  };

  render() {
    const { canvasRef } = this.props;
    return (
      <>
        <TldrCollpasibleSection
          title="Background"
          collapse={this.state.collapse[0]}
          onToggleCollapse={() => this.handleToggleChange(0)}
        >
          <SlideCommonActions
            canvasRef={canvasRef}
            right={0}
            width={306}
            isPositionSidebar={true}
          ></SlideCommonActions>
        </TldrCollpasibleSection>
      </>
    );
  }
}

SlideStyle.propTypes = {};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SlideStyle);
