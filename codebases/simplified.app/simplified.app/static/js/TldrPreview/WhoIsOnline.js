import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  OverlayTrigger,
  Tooltip,
  Dropdown,
  ButtonGroup,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  StyledDropdownToggle,
  StyledNavbarUserInfo,
} from "../_components/styled/styles";
import { StyledWhoIsOnline } from "../_components/styled/present/stylePresent";
import { followMe, unfollowMe } from "../_actions/followActions";
import { NUMBER_OF_USERS_TO_DISPLAY } from "../_utils/constants";

export class WhoIsOnline extends Component {
  static propTypes = {
    session: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
  };

  follow = (selectedUser, e) => {
    e.stopPropagation();

    const following = this.props.actionstore.user;
    if (selectedUser.pk === following.pk) {
      this.props.unfollowMe(selectedUser);
    } else {
      this.props.followMe(selectedUser);
    }
  };

  getRingColor = (user) => {
    const hex = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];
    if ("colorApplied" in user === false) {
      let ringColor = "#";

      for (let i = 0; i < 6; i++) {
        ringColor += hex[Math.floor(Math.random() * hex.length)];
      }

      user["colorApplied"] = ringColor;
    }
  };

  render() {
    const { user } = this.props.auth.payload;
    const usersOnline = this.props.session.users;
    const following = this.props.actionstore.user;
    var arrayOfOtherUsers = [];
    Object.keys(usersOnline).forEach((key) => {
      if (user.pk !== usersOnline[key].pk) {
        this.getRingColor(usersOnline[key]);
        arrayOfOtherUsers.push(usersOnline[key]);
      }
    });
    var arrayOfUsersToDisplay = arrayOfOtherUsers.splice(
      0,
      NUMBER_OF_USERS_TO_DISPLAY
    );
    const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
      <StyledDropdownToggle
        ref={ref}
        onClick={(e) => {
          e.preventDefault();
          onClick(e);
        }}
      >
        {children}
      </StyledDropdownToggle>
    ));

    const onlineUsers = arrayOfUsersToDisplay.map(
      (userObj, index) =>
        user.pk !== userObj.pk && (
          <OverlayTrigger
            key={index}
            placement="bottom"
            overlay={
              <Tooltip id={`o` + index}>
                {following.pk === userObj.pk ? "You are now observing " : ""}
                {userObj.full_name}
              </Tooltip>
            }
          >
            <StyledNavbarUserInfo
              selected={following.pk === userObj.pk}
              className="mr-2"
              onClick={(e) => this.follow(userObj, e)}
              bgColor={userObj.colorApplied ? userObj.colorApplied : "#888888"}
            >
              <div className="picture">
                {userObj.profile_picture ? (
                  <img src={userObj.profile_picture} alt="profile"></img>
                ) : (
                  <FontAwesomeIcon icon="user-circle"></FontAwesomeIcon>
                )}
              </div>
            </StyledNavbarUserInfo>
          </OverlayTrigger>
        )
    );

    return Array.isArray(usersOnline) &&
      usersOnline.length > NUMBER_OF_USERS_TO_DISPLAY + 1 ? (
      <Dropdown as={ButtonGroup} className="mr-2">
        <StyledWhoIsOnline>{onlineUsers}</StyledWhoIsOnline>

        <Dropdown.Toggle as={CustomToggle} id="dropdown-split-basic">
          <FontAwesomeIcon icon="ellipsis-h"></FontAwesomeIcon>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {arrayOfOtherUsers.map((userObj, index) => (
            <>
              <OverlayTrigger
                key={index}
                placement="bottom"
                overlay={
                  <Tooltip id={`o` + index}>
                    {following.pk === userObj.pk
                      ? "You are now observing "
                      : ""}
                    {userObj.full_name}
                  </Tooltip>
                }
              >
                <Dropdown.Item>
                  <StyledNavbarUserInfo
                    selected={following.pk === userObj.pk}
                    className="mr-2"
                    onClick={(e) => this.follow(userObj, e)}
                    bgColor={
                      userObj.colorApplied ? userObj.colorApplied : "#888888"
                    }
                  >
                    <div className="picture">
                      {userObj.profile_picture ? (
                        <img src={userObj.profile_picture} alt="profile"></img>
                      ) : (
                        <FontAwesomeIcon icon="user-circle"></FontAwesomeIcon>
                      )}
                    </div>
                    <div className="ml-2">{userObj.full_name}</div>
                  </StyledNavbarUserInfo>
                </Dropdown.Item>
              </OverlayTrigger>
            </>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    ) : (
      <StyledWhoIsOnline className="mr-2">{onlineUsers}</StyledWhoIsOnline>
    );
  }
}

const mapStateToProps = (state) => ({
  session: state.session,
  auth: state.auth,
  actionstore: state.actionstore,
});

const mapDispatchToProps = (dispatch) => ({
  followMe: (user) => dispatch(followMe(user)),
  unfollowMe: (user) => dispatch(unfollowMe(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WhoIsOnline);
