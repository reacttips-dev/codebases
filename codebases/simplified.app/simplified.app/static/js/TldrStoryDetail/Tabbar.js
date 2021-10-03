import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { primary_00, white } from "../_components/styled/variable";
import Dropdown from "react-bootstrap/Dropdown";
import Tab from "react-bootstrap/Tab";
import TldrNavDropdown from "../_components/common/TldrNavDropdown";
import {
  StyledNav,
  StyledDropDown,
  StyledDropdownMenu,
  StyledTldrDropDown,
  StyledNavItem,
} from "./StoryDetailsPageStyles";

function Tabbar(props) {
  const getTabs = (props) => {
    return (
      <StyledNav
        variant="tabs"
        className={props?.className}
        style={{
          width: props.fitContent ? "fit-content" : "auto",
          justifyContent: props?.justifyContent,
          ...props?.style,
          minWidth: props.minWidth ? props.minWidth : "auto",
        }}
      >
        {props?.tabs?.map((tab, i) => {
          return tab.type === "tldrDropdown" ? (
            <StyledTldrDropDown key={i}>
              <TldrNavDropdown {...props} />
            </StyledTldrDropDown>
          ) : tab.type === "dropdown" ? (
            <StyledDropDown key={i}>
              <Dropdown.Toggle id="dropdown-custom-components">
                <FontAwesomeIcon icon={tab.icon}></FontAwesomeIcon>
              </Dropdown.Toggle>
              <StyledDropdownMenu>
                {tab?.options?.map((option, index) => {
                  return (
                    <Dropdown.Item
                      key={index}
                      eventKey={index}
                      className="custom-dd-item"
                    >
                      <div className="item-container">
                        <FontAwesomeIcon icon={option.icon}></FontAwesomeIcon>
                        <p className="item-label">{option.label}</p>
                      </div>
                    </Dropdown.Item>
                  );
                })}
              </StyledDropdownMenu>
            </StyledDropDown>
          ) : (
            <StyledNavItem
              key={i}
              className={tab.classes}
              onClick={() => {
                props.onItemClick(tab);
              }}
              style={{ color: props.isItemActive(tab) ? primary_00 : white }}
            >
              {tab.type === "fa" ? (
                <div
                  className={
                    tab?.iconWrap
                      ? tab?.iconWrap + " item-container"
                      : "" + "item-container"
                  }
                >
                  <FontAwesomeIcon
                    className={tab.iconClasses}
                    icon={tab.icon}
                  />
                  {props.showLabels && (
                    <p className="item-label">{tab.label}</p>
                  )}
                </div>
              ) : (
                <tab.icon className={tab.iconClasses} {...props} />
              )}
            </StyledNavItem>
          );
        })}
      </StyledNav>
    );
  };
  return <Tab.Container>{getTabs(props)}</Tab.Container>;
}

export default Tabbar;
