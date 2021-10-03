import React, { Component } from "react";
import { Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import axios from "axios";
import { openAdvancedSettings } from "../../_actions/sidebarSliderActions";
import { ADVANCED_COMMENTS_PANEL } from "../details/constants";
import { StyledCommentButton, StyledNavbarButton } from "../styled/styles";
import { lightInactive } from "../styled/variable";

class TldrCommentDropdown extends Component {
  signal = axios.CancelToken.source();

  constructor(props) {
    super(props);

    this.state = {
      isDropdownOpen: false,
    };
  }

  toggleDropdown = () => {
    this.props.openAdvancedSettings(ADVANCED_COMMENTS_PANEL);
  };

  render() {
    const { isActionPanelOpen, sliderPanelType } = this.props.rightsidebar;

    let commentCount =
      isActionPanelOpen &&
      sliderPanelType === ADVANCED_COMMENTS_PANEL &&
      this.props.commentCount
        ? this.props.commentCount
        : "...";

    return (
      <>
        <div className="d-none d-sm-none d-md-block">
          <OverlayTrigger
            placement="bottom"
            overlay={<Tooltip id="heart">Open comments history</Tooltip>}
          >
            <StyledNavbarButton
              onClick={this.toggleDropdown}
              transparentbg="true"
            >
              <FontAwesomeIcon icon={faComment}></FontAwesomeIcon>
              <Badge className="comment-nav-badge" variant="light">
                {commentCount}
              </Badge>
            </StyledNavbarButton>
          </OverlayTrigger>
        </div>

        <div className="d-block d-sm-block d-md-none">
          <StyledCommentButton
            onClick={this.toggleDropdown}
            transparentbg="true"
          >
            <FontAwesomeIcon
              className="icon"
              color={lightInactive}
              icon={faComment}
            ></FontAwesomeIcon>
            <span className="label">Comments</span>
          </StyledCommentButton>
        </div>
      </>
    );
  }
}

TldrCommentDropdown.propTypes = {};

const mapStateToProps = (state) => ({
  auth: state.auth,
  activePage: state.editor.activePage,
  activeElement: state.editor.activeElement,
  pagestore: state.pagestore,
  layerstore: state.layerstore,
  commentCount: state.comment.commentCount,
  rightsidebar: state.rightsidebar,
});

const mapDispatchToProps = (dispatch) => ({
  openAdvancedSettings: (panel, selectedTab) =>
    dispatch(openAdvancedSettings(panel, selectedTab)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TldrCommentDropdown);
