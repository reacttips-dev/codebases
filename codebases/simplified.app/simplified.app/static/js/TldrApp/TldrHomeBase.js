import React, { useEffect, useState } from "react";
import TldrNavbar from "../_components/common/TldrNavbar";
import { useHistory } from "react-router-dom";
import Sidebar from "../_components/home/Sidebar";
import {
  BOTTOM_BAR,
  DASHBOARD_SIDEBAR_MENU,
  MAIN_CONTAINER_SCROLLABLE_TARGET_ID,
  TOP_BAR,
  SIMPLIFIED_ACADEMY_LINK,
  SIMPLIFIED_HELP_CENTRE_LINK,
  SIMPLIFIED_OFFICIAL_COMMUNITY_LINK,
} from "../_utils/constants";
import { IntercomCustomIcon } from "../_components/styled/home/statelessView";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  USER_HOME,
  QUICK_START,
  MY_FOLDERS,
  LAYOUTS,
  MY_WORKSPACE,
  BILLING_AND_PAYMENT,
  MY_APPS,
  BRANDKIT,
  ROOT,
} from "../_utils/routes";
import { BrandLogo, BrandTextLogo } from "../_components/common/statelessView";
import {
  StyledSidebar,
  FloatingButton,
  StyledInterComWrapper,
  StyledDashboardContent,
} from "./TldrHomeBaseStyles";
import {
  analyticsTrackEvent,
  showBottomMenuBar,
  showCreatePresetFloatingButton,
} from "../_utils/common";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { resetStories } from "../_actions/storiesActions";
import { resetFolders } from "../_actions/folderActions";
import { BACK_FROM_STUDIO } from "../_actions/types";
import { closeSidebar, openSidebar } from "../_actions/sidebarSliderActions";
import { redirect } from "../_actions/commonAction";
import { md, studioFooterColor } from "../_components/styled/variable";
import Tabbar from "../TldrStoryDetail/Tabbar";

function TldrHomeBase(props) {
  const history = useHistory();
  const isCollapsed = !props.sidebarSlider.isSidebarOpen;
  const path = useState(props.match.path);
  const [navBackgroundColor, setNavBackgroundColor] = useState(
    `${
      props.match.path === QUICK_START || props.match.path === ROOT
        ? "transparent"
        : studioFooterColor
    }`
  );

  const isMobileView = () => {
    if (window.innerWidth <= parseInt(md)) {
      return true;
    }
    return false;
  };

  const toggle = () => {
    if (isCollapsed) {
      props.openSidebar();
    } else {
      props.closeSidebar();
    }
  };

  const isItemActive = (item) => {
    if (!item?.extraData?.path) {
      return;
    }
    if (Array.isArray(item?.extraData?.path)) {
      return item?.extraData?.path.some((panelPath) => {
        return (
          panelPath === props?.match?.path ||
          panelPath === props?.location?.pathname
        );
      });
    } else {
      return (
        item?.extraData?.path === props?.match?.path ||
        item?.extraData?.path === props?.location?.pathname ||
        item?.extraData?.altPath === props?.location?.pathname
      );
    }
  };

  const onTopbarItemClick = (item) => {
    switch (item?.extraData?.action) {
      case "Toggle":
        toggle();
        break;
      case "Dashboard":
        if (path !== QUICK_START && path !== USER_HOME) {
          props.resetStories();
          history.push(QUICK_START);
          props.closeSidebar();
        }
        break;
      default:
      // Do nothing
    }
  };

  const onMenuItemClick = (item, from) => {
    switch (item.label) {
      case "Dashboard":
        if (path !== QUICK_START && path !== USER_HOME) {
          props.resetStories();
          history.push(QUICK_START);
        }
        break;
      case "Templates":
      case "Projects":
      case "AI Assistant":
      case "AI":
        if (path !== item?.extraData?.path) {
          props.resetStories();
          history.push(item?.extraData?.path);
        }

        if (item?.extraData?.analyticsTrackLabel) {
          analyticsTrackEvent(item?.extraData?.analyticsTrackLabel, {
            location: "sidebar",
          });
        }
        break;
      case "Folders":
        if (path !== MY_FOLDERS) {
          props.resetFolders();
          history.push(MY_FOLDERS);
        }
        break;
      case "My Assets":
      case "Team Templates":
      case "Components":
        if (path !== item?.extraData?.path) {
          props.resetAssets();
          history.push(item?.extraData?.path);
        }
        break;
      case "Brandkit":
        if (path !== BRANDKIT) {
          history.push(BRANDKIT);
        }
        break;
      case "Workspace":
        if (path !== MY_WORKSPACE) {
          history.push(MY_WORKSPACE);
        }
        break;
      case "Billing":
        if (path !== BILLING_AND_PAYMENT) {
          history.push(BILLING_AND_PAYMENT);
        }
        break;
      case "Connected Apps":
        if (path !== MY_APPS) {
          history.push(MY_APPS);
        }
        break;
      case "Academy":
        window.open(SIMPLIFIED_ACADEMY_LINK, "_blank");
        break;
      case "Join Community":
        window.open(SIMPLIFIED_OFFICIAL_COMMUNITY_LINK, "_blank");
        break;
      case "Get Help":
        window.open(SIMPLIFIED_HELP_CENTRE_LINK, "_blank");
        break;
      default:
      // Do nothing
    }
    if (isMobileView()) {
      props.closeSidebar();
    }
  };

  const sidebarFooter = (
    <div className="sidebar-toggler" onClick={toggle}>
      <FontAwesomeIcon
        icon={!isCollapsed ? "angle-double-left" : "angle-double-right"}
      ></FontAwesomeIcon>
    </div>
  );

  const sidebarHeader = (
    <div onClick={toggle}>
      {isCollapsed ? <BrandLogo /> : <BrandTextLogo height={40} width={160} />}
    </div>
  );

  const handleScroll = (event) => {
    const isTransparent = event.target.scrollTop <= 50;
    if (isTransparent) {
      setNavBackgroundColor("transparent");
    } else {
      setNavBackgroundColor(studioFooterColor);
    }
  };

  useEffect(() => {
    if (
      isMobileView() &&
      (props.match.path === QUICK_START || props.match.path === ROOT)
    ) {
      setNavBackgroundColor("transparent");
      document
        .querySelector(".tldr-dashboard-content")
        .addEventListener("scroll", handleScroll);
    } else {
      setNavBackgroundColor(studioFooterColor);
      document
        .querySelector(".tldr-dashboard-content")
        .removeEventListener("scroll", handleScroll);
    }
    return () => {
      document
        .querySelector(".tldr-dashboard-content")
        .removeEventListener("scroll", handleScroll);
    };
  }, [props.match.path]);

  return (
    <div className="tldr-wrapper tldr-wrapper-md-row tldr-wrapper-sm-col">
      <Sidebar
        collapsed={isCollapsed}
        footer={sidebarFooter}
        header={sidebarHeader}
        menu={DASHBOARD_SIDEBAR_MENU}
        onItemClick={onMenuItemClick}
        isItemActive={isItemActive}
        tooltip="true"
        styles={StyledSidebar}
        {...props}
      />

      <div
        className="d-block d-sm-block d-md-none"
        style={{
          position: "sticky",
          width: "100%",
          flexDirection: "row",
          zIndex: 5,
        }}
      >
        <Tabbar
          tabs={TOP_BAR}
          onItemClick={onTopbarItemClick}
          isItemActive={isItemActive}
          justifyContent="space-between"
          {...props}
          style={{ background: navBackgroundColor }}
        ></Tabbar>
      </div>
      <StyledDashboardContent
        className={"tldr-dashboard-content"}
        id={MAIN_CONTAINER_SCROLLABLE_TARGET_ID}
      >
        <TldrNavbar
          onTabChange={(tab) => {
            history.push(tab);
          }}
        />
        {props.children}
        {showBottomMenuBar(props.match.path) && (
          <div
            className="d-block d-sm-block d-md-none"
            style={{ position: "sticky", bottom: 0, zIndex: 5, width: "100%" }}
          >
            <Tabbar
              tabs={BOTTOM_BAR}
              onItemClick={onMenuItemClick}
              isItemActive={isItemActive}
              justifyContent="space-between"
              showLabels="true"
              {...props}
            ></Tabbar>
          </div>
        )}

        <StyledInterComWrapper className="d-none d-sm-none d-md-block">
          <IntercomCustomIcon />
        </StyledInterComWrapper>
        {showCreatePresetFloatingButton(props.match.path) && (
          <FloatingButton
            className="d-flex d-sm-flex d-md-none"
            onClick={(e) => {
              e.stopPropagation();
              props.redirect(LAYOUTS, { ...props });
            }}
          >
            <FontAwesomeIcon
              className={"floating-add-product-icon align-self-center"}
              icon={faPlus}
              fill="black"
              color={"black"}
            />
          </FloatingButton>
        )}
      </StyledDashboardContent>
    </div>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  sidebarSlider: state.sidebarSlider,
});

const mapDispatchToProps = (dispatch) => ({
  redirect: (location, props) => dispatch(redirect(location, props)),
  resetStories: () => dispatch(resetStories()),
  resetFolders: () => dispatch(resetFolders()),
  resetAssets: () =>
    dispatch({
      type: BACK_FROM_STUDIO,
    }),
  openSidebar: () => dispatch(openSidebar()),
  closeSidebar: () => dispatch(closeSidebar()),
});

TldrHomeBase.propTypes = {
  auth: PropTypes.object.isRequired,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TldrHomeBase));
