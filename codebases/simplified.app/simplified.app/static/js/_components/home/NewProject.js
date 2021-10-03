import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { LAYOUTS } from "../../_utils/routes";
import {
  StyledNewProjectButton,
  StyledNewProjectCollapsed,
} from "../styled/styles";
import { MenuItem } from "react-pro-sidebar";
import { openSidebar, closeSidebar } from "../../_actions/sidebarSliderActions";
import { redirect } from "../../_actions/commonAction";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

function NewProject(props) {
  const isCollapsed = !props.sidebarSlider.isSidebarOpen;
  const hidePlusButton = props.sidebarSlider.isSidebarOpen;

  const toggle = () => {
    if (isCollapsed) {
      props.openSidebar();
    } else {
      props.closeSidebar();
    }
  };

  return (
    <MenuItem
      className="mt-4 quikc-start d-none d-sm-none d-md-block"
      icon={
        hidePlusButton ? null : (
          <OverlayTrigger overlay={<Tooltip>New project</Tooltip>}>
            <StyledNewProjectCollapsed variant="tprimary" onClick={toggle}>
              <FontAwesomeIcon icon="plus"></FontAwesomeIcon>
            </StyledNewProjectCollapsed>
          </OverlayTrigger>
        )
      }
    >
      {hidePlusButton ? (
        <StyledNewProjectButton
          className={"mr-2"}
          variant="tprimary"
          onClick={(e) => {
            e.stopPropagation();
            props.redirect(LAYOUTS, { ...props });
          }}
        >
          <FontAwesomeIcon icon="plus" className="mr-2"></FontAwesomeIcon>
          New Project
        </StyledNewProjectButton>
      ) : null}
    </MenuItem>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  sidebarSlider: state.sidebarSlider,
});

const mapDispatchToProps = (dispatch) => ({
  openSidebar: () => dispatch(openSidebar()),
  closeSidebar: () => dispatch(closeSidebar()),
  redirect: (location, props) => dispatch(redirect(location, props)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(NewProject));
