import React from "react";
import { ProSidebar } from "react-pro-sidebar";
import PropTypes from "prop-types";
import {
  SidebarFooter,
  SidebarContent,
  SubMenu,
  Menu,
  MenuItem,
  SidebarHeader,
} from "react-pro-sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const SidebarMenuDivider = (props) => {
  const { item } = props;
  return <hr className={item.classes} />;
};

const SidebarMenuItem = (props) => {
  const { item, tooltip } = props;
  let menuItem = (
    <MenuItem
      onClick={(event) => props.onItemClick(item)}
      active={props.isItemActive(item)}
      className={item.classes}
      icon={
        <FontAwesomeIcon
          className={item.iconClasses}
          icon={item.icon}
        ></FontAwesomeIcon>
      }
    >
      {item.label}
    </MenuItem>
  );

  return tooltip ? (
    <OverlayTrigger overlay={<Tooltip>{item.label}</Tooltip>}>
      {menuItem}
    </OverlayTrigger>
  ) : (
    menuItem
  );
};

const getMenuItems = (props) => {
  const { menu, onItemClick, isItemActive, tooltip } = props;

  let items = menu.map((item, itemIndex) => {
    return item.type === "subMenu" ? (
      <SubMenu
        key={itemIndex}
        title={item.title}
        icon={<FontAwesomeIcon icon={item.icon}></FontAwesomeIcon>}
      >
        {item.menu.map((subMenu, i) => {
          return (
            <SidebarMenuItem
              key={i}
              item={subMenu}
              onItemClick={onItemClick}
              isItemActive={isItemActive}
            />
          );
        })}
      </SubMenu>
    ) : item.type === "item" ? (
      <SidebarMenuItem
        key={itemIndex}
        item={item}
        tooltip={tooltip}
        onItemClick={onItemClick}
        isItemActive={isItemActive}
      />
    ) : item.type === "divider" ? (
      <SidebarMenuDivider key={itemIndex} item={item} />
    ) : item.type === "template" ? (
      <div key={itemIndex}>{item.template}</div>
    ) : (
      <></>
    );
  });

  return <Menu iconShape="circle">{items}</Menu>;
};

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hidePlusButton: true,
      collapsed: true,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.collapsed !== undefined) {
      this.setState({
        collapsed: !this.state.collapsed,
        hidePlusButton: !this.state.hidePlusButton,
      });
    }
  }

  render() {
    //Excluding un-necessary props
    const {
      header,
      footer,
      onItemClick,
      isItemActive,
      showSidebar,
      staticContext,
      resetFolders,
      resetAssets,
      sidebarSlider,
      openSidebar,
      closeSidebar,
      redirect,
      menu,
      history,
      location,
      auth,
      errors,
      match,
      ...requiredProps
    } = this.props;
    const SidebarStyles = this.props.styles;
    const menuItems = getMenuItems(this.props);
    return (
      <SidebarStyles>
        <ProSidebar collapsed={this.state.collapsed} {...requiredProps}>
          {header ? <SidebarHeader>{header}</SidebarHeader> : null}
          <SidebarContent>{menuItems}</SidebarContent>
          {footer ? <SidebarFooter>{footer}</SidebarFooter> : null}
        </ProSidebar>
      </SidebarStyles>
    );
  }
}

Sidebar.defaultProps = {
  collapsed: true,
  menu: [],
};

Sidebar.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  menu: PropTypes.array.isRequired,
  onItemClick: PropTypes.func.isRequired,
  isItemActive: PropTypes.func.isRequired,
};

export default Sidebar;
