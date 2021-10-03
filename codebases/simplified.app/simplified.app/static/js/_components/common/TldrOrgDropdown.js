import React, { Component } from "react";
import PropTypes from "prop-types";
import { batch, connect } from "react-redux";
import { NavDropdown } from "react-bootstrap";
import {
  StyledExpandableNavbarUserInfo,
  StyledExpandableNavbar,
  StyledNavbarUserInfo,
  StyledUserOrgsContainer,
} from "../styled/styles";
import { withRouter } from "react-router-dom";
import { CREATE_WORKSPACE, MY_WORKSPACE } from "../../_utils/routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faAngleUp,
  faCog,
  faPlus,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { switchTeam } from "../../_actions/authActions";
import { redirect } from "../../_actions/commonAction";
import { Collapse } from "react-bootstrap";

export class TldrNavDropdown extends Component {
  constructor(props) {
    super(props);

    this.state = {
      collapsed: false,
    };
  }

  onCreateWorkspace = () => {
    this.props.redirect(CREATE_WORKSPACE, this.props);
  };

  onSwitchTeam = (currentOrg, selectedOrg) => {
    if (currentOrg !== selectedOrg) {
      batch(() => {
        this.props.switchTeam(selectedOrg, { ...this.props });
      });
    }
  };

  handleToggleUserInfo = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  render() {
    const { type } = this.props;
    const { user, orgs, selectedOrg } = this.props.auth.payload;
    const { full_name, username } = user;
    const selectedOrgObj = orgs.find((item) => item.id === Number(selectedOrg));
    let workspace_name = selectedOrgObj?.name;
    const orgsJsx = orgs.map((org) => {
      return org.id !== Number(selectedOrg) ? (
        type === "expandable" ? (
          <StyledExpandableNavbarUserInfo key={org.id}>
            <div
              className={"container"}
              onClick={() => {
                this.onSwitchTeam(selectedOrg, org.id);
              }}
            >
              <StyledNavbarUserInfo>
                <div className="pro-icon">
                  <div className="organization-initials">
                    {org.name.charAt(0)}
                  </div>
                </div>
                <div className="user">
                  <div className="company">{org.name}</div>
                  <div className="email">
                    {full_name ? full_name : username}
                  </div>
                </div>
              </StyledNavbarUserInfo>
            </div>
            <div className={"divider"} />
          </StyledExpandableNavbarUserInfo>
        ) : (
          <div key={org.id}>
            <NavDropdown.Item
              onClick={() => this.onSwitchTeam(selectedOrg, org.id)}
            >
              <StyledNavbarUserInfo
                subscriptionColor={
                  org?.subscription?.name === "Simplified Trial"
                    ? "#ffac41"
                    : org?.subscription?.plan?.product?.name === "Small Teams"
                    ? "#68D5FF"
                    : org?.subscription?.plan?.product?.name === "Business"
                    ? "#85DE55"
                    : "#d8d8d8"
                }
              >
                <div className="pro-icon">
                  <div className="organization-initials">
                    {org.name.charAt(0)}
                  </div>
                </div>
                <div className="user">
                  <div className="company">{org.name}</div>
                  <div className="subscription">
                    {org?.subscription?.plan
                      ? org?.subscription?.plan?.product?.name
                      : org?.subscription?.trial_remaining_days < 0
                      ? "Free trial (ended)-"
                      : org?.subscription?.trial_remaining_days === 0
                      ? "Free trial (ends today)-"
                      : org?.subscription?.trial_remaining_days === 1
                      ? `Free trial (${org?.subscription?.trial_remaining_days} day)-`
                      : org?.subscription?.trial_remaining_days > 1
                      ? `Free trial (${org?.subscription?.trial_remaining_days} days)-`
                      : null}{" "}
                    {`${org?.members_count ? org?.members_count : 1}`}{" "}
                    {org?.members_count === 1 ? "member" : "members"}
                  </div>
                </div>
              </StyledNavbarUserInfo>
            </NavDropdown.Item>
            <NavDropdown.Divider />
          </div>
        )
      ) : null;
    });

    return type === "expandable" ? (
      <StyledExpandableNavbar onClick={this.handleToggleUserInfo}>
        <div className="container">
          <StyledNavbarUserInfo>
            <div className="pro-icon">
              <div className="organization-initials">
                {selectedOrgObj?.name.charAt(0)}
              </div>
            </div>
            <div className="user">
              <div className="company">{workspace_name}</div>
            </div>
            {this.state.collapsed ? (
              <FontAwesomeIcon
                icon={faAngleUp}
                className="mr-4 position-absolute angle"
              ></FontAwesomeIcon>
            ) : (
              <FontAwesomeIcon
                icon={faAngleDown}
                className="mr-4 position-absolute angle"
              ></FontAwesomeIcon>
            )}
          </StyledNavbarUserInfo>
        </div>
        <Collapse in={this.state.collapsed}>
          <div className="expanded-content-container">
            <div className="divider" />
            <div>
              <StyledUserOrgsContainer>{orgsJsx}</StyledUserOrgsContainer>
            </div>
            <div
              className="item-container"
              onClick={() => this.props.history.push(MY_WORKSPACE)}
            >
              <div>
                <FontAwesomeIcon
                  icon={faUserPlus}
                  className="mr-2"
                ></FontAwesomeIcon>
                Invite members
              </div>
            </div>
            <div className="divider" />
            <div
              className="item-container"
              onClick={() => this.props.history.push(MY_WORKSPACE)}
            >
              <div>
                <FontAwesomeIcon
                  icon={faCog}
                  className="mr-2"
                ></FontAwesomeIcon>
                Workspace settings
              </div>
            </div>
            <div className="divider" />
            <div
              className="item-container"
              onClick={() => {
                this.onCreateWorkspace();
              }}
            >
              <div>
                <FontAwesomeIcon
                  icon={faPlus}
                  className="mr-2"
                ></FontAwesomeIcon>
                Create new workspace
              </div>
            </div>
          </div>
        </Collapse>
      </StyledExpandableNavbar>
    ) : (
      <NavDropdown
        className={"dropdown"}
        title={
          <StyledNavbarUserInfo
            subscriptionColor={
              selectedOrgObj?.subscription?.name === "Simplified Trial"
                ? "#ffac41"
                : selectedOrgObj?.subscription?.plan?.product?.name ===
                  "Small Teams"
                ? "#68D5FF"
                : selectedOrgObj?.subscription?.plan?.product?.name ===
                  "Business"
                ? "#85DE55"
                : "#d8d8d8"
            }
          >
            <div className="pro-icon">
              <div className="organization-initials">
                {selectedOrgObj?.name.charAt(0)}
              </div>
            </div>
            <div className="user">
              <div className="company">{workspace_name}</div>
              <div className="email navbar-header-item">
                <div className="subscription navbar-header-item">
                  {selectedOrgObj?.subscription?.plan
                    ? selectedOrgObj?.subscription?.plan?.product?.name
                    : selectedOrgObj?.subscription?.trial_remaining_days < 0
                    ? "Free trial (ended)-"
                    : selectedOrgObj?.subscription?.trial_remaining_days === 0
                    ? "Free trial (ends today)-"
                    : selectedOrgObj?.subscription?.trial_remaining_days === 1
                    ? `Free trial (${selectedOrgObj?.subscription?.trial_remaining_days} day)-`
                    : selectedOrgObj?.subscription?.trial_remaining_days > 1
                    ? `Free trial (${selectedOrgObj?.subscription?.trial_remaining_days} days)`
                    : null}{" "}
                  {`${
                    selectedOrgObj?.members_count
                      ? selectedOrgObj.members_count === 1
                        ? "1 member"
                        : selectedOrgObj.members_count + " members"
                      : "1 member"
                  }`}
                </div>
              </div>
            </div>
            {this.state.collapsed ? (
              <FontAwesomeIcon icon={faAngleUp}></FontAwesomeIcon>
            ) : (
              <FontAwesomeIcon icon={faAngleDown}></FontAwesomeIcon>
            )}
          </StyledNavbarUserInfo>
        }
        id="basic-org-dropdown"
        onClick={this.handleToggleUserInfo}
      >
        <StyledUserOrgsContainer>{orgsJsx}</StyledUserOrgsContainer>
        <NavDropdown.Item onClick={() => this.props.history.push(MY_WORKSPACE)}>
          <div>
            <FontAwesomeIcon
              icon={faUserPlus}
              className="mr-2"
            ></FontAwesomeIcon>
            Invite members
          </div>
        </NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item onClick={() => this.props.history.push(MY_WORKSPACE)}>
          <div>
            <FontAwesomeIcon icon={faCog} className="mr-2"></FontAwesomeIcon>
            Workspace settings
          </div>
        </NavDropdown.Item>
        <NavDropdown.Divider />
        <NavDropdown.Item
          onClick={() => {
            this.onCreateWorkspace();
          }}
        >
          <div>
            <FontAwesomeIcon icon={faPlus} className="mr-2"></FontAwesomeIcon>
            Create new workspace
          </div>
        </NavDropdown.Item>
      </NavDropdown>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

TldrNavDropdown.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  switchTeam: (orgId, props) => dispatch(switchTeam(orgId, props)),
  redirect: (location, props) => dispatch(redirect(location, props)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TldrNavDropdown));
