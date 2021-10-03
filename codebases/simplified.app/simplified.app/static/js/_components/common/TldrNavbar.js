import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  USER_HOME,
  QUICK_START,
  PROJECTS,
  MY_ASSETS,
  MY_TEMPLATES,
  MY_COMPONENTS,
  STORY,
  MY_FOLDERS,
  ROOT,
} from "../../_utils/routes";
import { Nav, OverlayTrigger, Tooltip } from "react-bootstrap";
import { StyledNavbar, StyledNavbarButton } from "../styled/styles";
import { withRouter } from "react-router-dom";
import TldrNavDropdown from "./TldrNavDropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import TldrShare from "./TldrShare";
import TldrOrgDropdown from "./TldrOrgDropdown";

export class TldrNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: props.match.path,
      showConfirmation: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props !== prevProps) {
      this.setState({ selected: this.props.match.path });
    }
  }

  share = () => {
    this.setState({
      showConfirmation: true,
    });
  };

  homeRoutes = [
    ROOT,
    QUICK_START,
    USER_HOME,
    PROJECTS,
    MY_ASSETS,
    MY_TEMPLATES,
    MY_COMPONENTS,
    STORY,
    MY_FOLDERS,
  ];

  render() {
    const { selectedOrg } = this.props.auth.payload;
    const content = (
      <StyledNavbar
        expand="lg"
        iscompact="false"
        location="dashboard"
        className="d-none d-sm-none d-md-flex"
      >
        <TldrOrgDropdown></TldrOrgDropdown>
        <Nav className="mr-auto"></Nav>

        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip id="heart">Add members to your workspace</Tooltip>}
        >
          <StyledNavbarButton onClick={this.share}>
            <FontAwesomeIcon
              icon="user-plus"
              className="mr-1"
            ></FontAwesomeIcon>
            Add members
          </StyledNavbarButton>
        </OverlayTrigger>
        <TldrNavDropdown variant="full"></TldrNavDropdown>

        {this.state.showConfirmation && (
          <TldrShare
            org={selectedOrg}
            onHide={() => {
              this.setState({
                ...this.state,
                showConfirmation: false,
              });
            }}
          />
        )}
      </StyledNavbar>
    );

    return <>{content}</>;
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

TldrNavbar.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TldrNavbar));
