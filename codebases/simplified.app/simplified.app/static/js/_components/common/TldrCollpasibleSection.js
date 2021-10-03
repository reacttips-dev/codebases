import React, { Component } from "react";
import {
  StyledAdvancedSectionHeader,
  StyledAdvancedSectionHeaderWithToggle,
  StyledColumnFlex,
} from "../styled/details/styleAdvancedPanel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class TldrCollpasibleSection extends Component {
  toggleCollapse = () => {
    this.props.onToggleCollapse();
  };

  render() {
    const { title, toggleButton, collapse, subtitle } = this.props;
    return (
      <StyledColumnFlex>
        <StyledAdvancedSectionHeaderWithToggle>
          <StyledAdvancedSectionHeader onClick={this.toggleCollapse}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              {collapse ? (
                <FontAwesomeIcon icon="angle-right"></FontAwesomeIcon>
              ) : (
                <FontAwesomeIcon icon="angle-down"></FontAwesomeIcon>
              )}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div>{title}</div>
                {subtitle && <div className="subtitle">{subtitle}</div>}
              </div>
            </div>
          </StyledAdvancedSectionHeader>
          {toggleButton}
        </StyledAdvancedSectionHeaderWithToggle>
        {!collapse && <div className={"mt-12"}>{this.props.children}</div>}
        <hr className="tldr-hl mv-12" />
      </StyledColumnFlex>
    );
  }
}

TldrCollpasibleSection.propTypes = {};
export default TldrCollpasibleSection;
