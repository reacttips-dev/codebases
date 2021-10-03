import React, { Component } from "react";

export default class TldrSettingsBase extends Component {
  render() {
    const { boxClassName, cardClassName } = this.props;

    return (
      <div className="settings-wrapper">
        <div className={`settings-box ${boxClassName}`}>
          <div className={`card settings-card-body ${cardClassName}`}>
            <div className="card-body">{this.props.children}</div>
          </div>
        </div>
      </div>
    );
  }
}

TldrSettingsBase.defaultProps = {
  className: "",
};
