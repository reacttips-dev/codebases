import React, { Component } from "react";

export default class TldrAiBase extends Component {
  render() {
    const { className, cardBodyClassName } = this.props;

    return (
      <div
        className={
          this.props.toggleVisibility
            ? `${className} hidden`
            : `${className} visible`
        }
      >
        <div className="card settings-card-body">
          <div className={`card-body ${cardBodyClassName}`}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}
