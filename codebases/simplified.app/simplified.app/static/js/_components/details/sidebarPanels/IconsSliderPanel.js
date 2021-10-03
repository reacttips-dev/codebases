import React, { Component } from "react";
import { connect } from "react-redux";
import Templates from "./common/Templates";
import { closeSlider } from "../../../_actions/sidebarSliderActions";

class IconsSliderPanel extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: true };
  }

  render() {
    const { artBoardHandler } = this.props;

    return (
      <>
        <Templates panelType={"icons"} artBoardHandler={artBoardHandler} />
      </>
    );
  }
}

IconsSliderPanel.propTypes = {};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch) => ({
  closeSlider: () => dispatch(closeSlider()),
});

export default connect(mapStateToProps, mapDispatchToProps)(IconsSliderPanel);
