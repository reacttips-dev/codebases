import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { closeSlider } from "../../_actions/sidebarSliderActions";
import { StyledSidebarPanelCloseButton } from "../styled/details/stylesDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class TldrSidebarCloseAnchor extends Component {
  handleClick = () => {
    this.props.closeSlider();
  };

  render() {
    return (
      <div className="d-none d-sm-none d-md-block">
        <StyledSidebarPanelCloseButton onClick={this.handleClick}>
          <FontAwesomeIcon icon="times" />
        </StyledSidebarPanelCloseButton>
      </div>
    );
  }
}

TldrSidebarCloseAnchor.propTypes = {
  closeSlider: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = { closeSlider };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TldrSidebarCloseAnchor);
