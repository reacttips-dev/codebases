import React, { Component } from "react";
import { ShowNoContent } from "../../common/statelessView";

class ActionsSliderPanel extends Component {
  render() {
    return (
      <div>
        <ShowNoContent text="There is no action." />
      </div>
    );
  }
}

ActionsSliderPanel.propTypes = {};

export default ActionsSliderPanel;
