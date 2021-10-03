import React, { Component } from "react";
import { connect } from "react-redux";
import Templates from "./common/Templates";
import { closeSlider } from "../../../_actions/sidebarSliderActions";

class TemplateSliderPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: true };
  }

  render() {
    return (
      <>
        <Templates
          panelType={"templates"}
          filterBy={this.props.story.payload.template}
        />
      </>
    );
  }
}

TemplateSliderPanel.propTypes = {};

const mapStateToProps = (state) => ({
  story: state.story,
});

const mapDispatchToProps = (dispatch) => ({
  closeSlider: () => dispatch(closeSlider()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TemplateSliderPanel);
