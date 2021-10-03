import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { NavDropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { StyledNavbarUserInfo } from "../styled/styles";
import { logoutUser } from "../../_actions/authActions";
import { withRouter } from "react-router-dom";
import { SETTINGS } from "../../_utils/routes";

export class TldrNavDropdown extends Component {
  constructor(props) {
    super(props);
    this.onLogoutClick = this.onLogoutClick.bind(this);
  }

  onLogoutClick = (e) => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { user } = this.props.auth.payload;
    const { email, full_name, profile_picture, username } = user;

    return (
      <NavDropdown
        title={
          <StyledNavbarUserInfo>
            <div className="picture medium-size">
              {profile_picture ? (
                <img src={profile_picture} alt="profile"></img>
              ) : (
                <FontAwesomeIcon
                  icon="user-circle"
                  color="#888"
                ></FontAwesomeIcon>
              )}
            </div>
          </StyledNavbarUserInfo>
        }
        id="basic-nav-dropdown"
        alignRight={true}
      >
        <NavDropdown.Item bsPrefix="dropdown-item read-only-dropdown-item">
          <OverlayTrigger
            placement="bottom"
            overlay={
              <Tooltip id="heart">
                {full_name ? full_name : username} {"\n"} {email}
              </Tooltip>
            }
          >
            <StyledNavbarUserInfo>
              <div className="picture" key={"p" + user.id}>
                {profile_picture ? (
                  <img src={profile_picture} alt="profile"></img>
                ) : (
                  <FontAwesomeIcon icon="user-circle"></FontAwesomeIcon>
                )}
              </div>
              <div className="user ml-1 p-0" key={"u" + user.id}>
                <div key={"e" + user.id} className="email">
                  {full_name ? full_name : username}
                </div>
                <div key={"c" + user.id} className="company">
                  {email}
                </div>
              </div>
            </StyledNavbarUserInfo>
          </OverlayTrigger>
        </NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item
          href="#"
          onClick={() => this.props.history.push(SETTINGS)}
        >
          Manage your account
        </NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item href="#" onClick={this.onLogoutClick}>
          Log out
        </NavDropdown.Item>
      </NavDropdown>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

TldrNavDropdown.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  logoutUser: () => dispatch(logoutUser()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TldrNavDropdown));
