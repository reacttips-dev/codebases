import React, { Component } from "react";
import { StyledAdvancedSectionHeader } from "../styled/details/styleAdvancedPanel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class TldrCollpasibleSectionSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      collapse: props.collapse,
    };
  }

  toggleCollpase = () => {
    this.setState({
      collapse: !this.state.collapse,
    });
  };

  render() {
    const { title, subtitle, className } = this.props;
    const { collapse } = this.state;
    return (
      <div className="mb-2">
        <StyledAdvancedSectionHeader
          className={className}
          onClick={this.toggleCollpase}
        >
          <div
            style={{ display: "flex", width: "90%", flexDirection: "column" }}
          >
            <div>{title}</div>
            {subtitle && <div className="subtitle">{subtitle}</div>}
          </div>
          <div className="m-1">
            {collapse ? (
              <FontAwesomeIcon icon="angle-down"></FontAwesomeIcon>
            ) : (
              <FontAwesomeIcon icon="angle-up"></FontAwesomeIcon>
            )}
          </div>
        </StyledAdvancedSectionHeader>
        {!collapse && this.props.children}
      </div>
    );
  }
}

TldrCollpasibleSectionSettings.defaultProps = {
  className: "",
};

TldrCollpasibleSectionSettings.propTypes = {};

export default TldrCollpasibleSectionSettings;
