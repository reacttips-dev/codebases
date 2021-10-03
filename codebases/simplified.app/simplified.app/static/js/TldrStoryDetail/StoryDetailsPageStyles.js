import {
  primaryHover,
  white,
  secondaryColor,
  primary_00,
  primayColor,
  blackAlpha,
  grey,
  placeholderColor,
  lightGrey,
  previewNavbarHeight,
} from "../_components/styled/variable";
import styled from "styled-components";
import { Dropdown, Nav, NavItem } from "react-bootstrap";

export const NoScrollbar = styled.div`
  overflow: scroll;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  ::-webkit-scrollbar {
    display: none;
  }
`;

export const StyledTabbar = styled.div`
  overflow-x: scroll;
  overflow-y: hidden;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */

  ::-webkit-scrollbar {
    display: none;
  }

  .navbar {
    padding: 0px !important;
  }
`;

export const StyledNav = styled(Nav)`
  padding: 0px;
  border: none;
  background-color: #232323;
  flex-wrap: nowrap;
  transition: background 0.2s linear;
  position: relative;
`;

export const StyledTldrDropDown = styled.div`
  height: 60px;
  display: flex;
  flex-direction: row;
  align-items: center;

  .nav-item.dropdown > a {
    border: none;
    outline: none;
    background-color: transparent !important;
  }

  .dropdown-menu.show {
    background-color: #323232 !important;
  }

  .nav-item.dropdown.show > .dropdown-menu.show > a {
    color: white !important;
  }

  a:focus {
    border: none !important;
    border-width: 0px !important;
  }

  a:hover {
    border: none !important;
    border-width: 0px !important;
  }

  a::after {
    content: none;
  }
`;

export const StyledDropDown = styled(Dropdown)`
  align-self: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 48px;
  width: 20%;
  color: #fff;
  min-width: 60px;

  a {
    color: #fff;
  }

  .show {
    box-shadow: none;
    border:none & > .btn {
      transition: none;
    }
  }

  .show > .btn-primary.dropdown-toggle {
    background-color: transparent !important;
    box-shadow: none !important;
    border: none !important;
  }
  .dropdown-toggle:focus {
    background-color: transparent !important;
    box-shadow: none !important;
    border: none !important;
  }

  .btn-primary.focus,
  .btn-primary:focus {
    background-color: transparent;
    outline: none;
    box-shadow: none;
    border: none;
  }

  .btn-primary:focus {
    background-color: transparent;
    outline: none;
    box-shadow: none;
    border: none;
  }

  .btn-primary:hover {
    background-color: transparent;
    outline: none;
    box-shadow: none;
    border: none;
  }

  button {
    background-color: transparent;
    outline: none;
    box-shadow: none;
    border: none;
  }

  button.focus {
    background-color: transparent;
    outline: none;
    box-shadow: none;
    border: none;
  }

  button:focus {
    outline: none;
    box-shadow: none;
    border: none;
  }

  .dropdown-toggle::after {
    background-color: transparent;
    display: none;
    outline: none;
  }

  .custom-dd-item {
    color: #d8d8d8;
    padding: 0px;
  }

  .dropdown-item.active,
  .dropdown-item:active {
    color: #ffad00;
    background-color: transparent !important;
    padding: 0px;
  }

  .item-container {
    display: flex;
    flex-direction: row;
    padding: 10px 15px;
    align-items: center;
  }

  .item-label {
    padding: 0px;
    margin: 0px 0px 0px 12px;
  }
`;

export const StyledDropdownMenu = styled(Dropdown.Menu)`
  background-color: #323232;
  min-width: auto;
`;

export const StyledNavItem = styled(NavItem)`
  align-self: center;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: 60px;
  width: 64px;
  min-width: 64px;

  .item-container {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    height: 60px;
  }

  .item-icon {
    align-self: center;
  }

  .item-label {
    margin: 0px;
    font-size: 0.75rem;
    text-align: center;
  }
`;

export const SidebarStyleComponent = styled.div`
  .option-label {
    color: ${lightGrey};
  }
  .option-label:hover {
    color: ${primaryHover} !important;
  }

  .option-label:hover .custom-icon path:first-child {
    fill: ${primaryHover};
  }

  .active {
    color: ${primary_00} !important;
  }

  .custom-icon path:first-child {
    fill: ${white};
  }
  .active > svg > path {
    fill: ${primary_00} !important;
  }
  .pro-sidebar {
    width: 290px !important;
    height: calc(100vh - ${previewNavbarHeight}) !important;
    z-index: 100 !important;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.5);
    overflow: auto;
  }
  .pro-sidebar.collapsed {
    width: 88px !important;
  }
  .pro-sidebar.collapsed .pro-sidebar-header {
    border-bottom: 0px !important;
    height: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px 0px 0px 0px;
  }
  .pro-sidebar.collapsed .pro-sidebar-header :hover {
    cursor: pointer;
  }
  .pro-sidebar.collapsed .pro-sidebar-header svg {
    height: 46px;
    width: 46px;
  }
  .pro-sidebar.collapsed .section-heading {
    display: none;
  }
  .pro-sidebar.collapsed .pro-menu-item .pro-inner-item {
    padding: 8px 20px 8px 20px !important;
    flex-direction: column;
  }
  .pro-sidebar.collapsed .pro-menu-item .pro-inner-item .pro-icon-wrapper {
    background-color: transparent !important;
    margin-right: 0px !important;
  }
  .pro-sidebar.collapsed .pro-menu-item .pro-inner-item:hover {
    color: ${primaryHover} !important;
  }
  .pro-sidebar.collapsed .pro-menu-item.active .pro-inner-item {
    background-color: transparent !important;
  }
  .pro-sidebar.collapsed
    .pro-menu-item.active
    .pro-inner-item
    .pro-icon-wrapper {
    // background-color: ${blackAlpha} !important;
  }
  .pro-sidebar.collapsed .pro-menu-item.active .pro-inner-item:after {
    display: none;
  }
  .pro-sidebar.collapsed .popper-element {
    top: 60px !important;
  }
  .pro-sidebar.collapsed .popper-element hr {
    margin-left: 0;
  }
  .pro-sidebar .sidebar-toggler {
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0.65;
    cursor: pointer;
  }
  .pro-sidebar .sidebar-toggler svg {
    height: 24px;
    width: 19px;
    color: ${grey};
    font-size: 24px;
    letter-spacing: 0.2px;
    line-height: 24px;
  }
  .pro-sidebar .pro-menu-item .pro-inner-item {
    padding: 0px !important;
  }
  .pro-sidebar .pro-menu-item .pro-inner-item .sidebar-new-project {
    background-color: ${primary_00};
    border-radius: 8px;
    font-size: 15px;
    display: flex;
    align-items: center;
    color: ${primayColor};
    font-weight: 500;
    letter-spacing: 0;
  }
  .pro-sidebar .pro-menu-item .pro-inner-item .sidebar-new-project span {
    margin-left: 1.1rem;
  }
  .pro-sidebar .pro-menu-item .pro-inner-item .sidebar-new-project svg {
    margin-left: 0.2rem;
  }
  .pro-sidebar .pro-menu-item .pro-inner-item .pro-icon-wrapper {
    background-color: transparent !important;
  }
  .pro-sidebar .pro-menu-item .pro-inner-item .pro-icon-wrapper svg {
    height: 24px;
    width: 19px;
    font-size: 24px;
  }
  .pro-sidebar .pro-menu-item .pro-inner-item .pro-icon-wrapper .pro-icon {
    background-color: rgba(255, 255, 255, 0.08);
    border-radius: 50%;
  }
  .pro-sidebar .pro-menu-item .pro-inner-item:hover {
    color: ${primaryHover} !important;
  }
  .pro-sidebar .pro-menu-item .pro-inner-item:hover .email {
    color: ${primaryHover} !important;
  }
  .pro-sidebar .pro-menu-item.active .pro-inner-item {
    color: ${primary_00} !important;
    border-radius: 24px;
    background-color: ${blackAlpha};
    margin-left: 8px;
    margin-right: 8px;
  }
  .pro-sidebar .pro-menu-item.active .pro-inner-item:after {
    display: block;
    position: absolute;
    transform: translateY(-50%);
    transform: rotate(-90deg);
    content: "";
    border-top: 0.35em solid;
    border-right: 0.35em solid transparent;
    border-left: 0.35em solid transparent;
  }
  .pro-sidebar .pro-menu-item .pro-arrow {
    transform: rotate(45deg) !important;
  }
  .pro-sidebar .pro-menu-item.open .pro-arrow {
    transform: rotate(-135deg) !important;
  }
  .pro-sidebar .pro-sidebar-content {
    overflow-y: scroll;
    scrollbar-width: none;
    /* Firefox */
    -ms-overflow-style: none;
    /* Internet Explorer 10+ */
  }
  .pro-sidebar .pro-sidebar-content .section-heading {
    font-size: 12px;
    text-transform: uppercase;
    margin-bottom: 10px;
    color: ${placeholderColor};
  }
  .pro-sidebar
    .pro-sidebar-content
    .workspace-header
    > .pro-inner-item
    .pro-item-content
    > div {
    justify-content: flex-start;
  }
  .pro-sidebar
    .pro-sidebar-content
    .workspace-header
    > .pro-inner-item
    .pro-item-content
    > div
    .company {
    font-weight: 500;
  }
  .pro-sidebar
    .pro-sidebar-content
    .workspace-header
    > .pro-inner-item
    .pro-item-content
    > div
    .email {
    color: ${placeholderColor};
  }
  .pro-sidebar
    .pro-sidebar-content
    .workspace-header
    > .pro-inner-item
    .pro-icon-wrapper
    .picture
    img,
  .pro-sidebar
    .pro-sidebar-content
    .workspace-header
    > .pro-inner-item
    .pro-icon-wrapper
    .picture
    svg {
    height: 30px;
    width: 30px;
  }
  .pro-sidebar
    .pro-sidebar-content
    .workspace-header
    > .pro-inner-item
    .pro-icon-wrapper
    .organization-initials {
    background-color: black;
    border-radius: 50%;
    height: 35px;
    width: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .pro-sidebar
    .pro-sidebar-content
    .workspace-header
    .pro-inner-list-item
    .pro-inner-item:before {
    display: none !important;
  }
  .pro-sidebar
    .pro-sidebar-content
    .workspace-header
    .pro-inner-list-item
    .pro-inner-item
    .pro-icon-wrapper {
    display: inline-block !important;
    background-color: ${secondaryColor} !important;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  }
  .pro-sidebar
    .pro-sidebar-content
    .workspace-header
    .pro-inner-list-item
    .pro-inner-item
    .pro-item-content
    > div {
    justify-content: flex-start;
  }
  .pro-sidebar
    .pro-sidebar-content
    .workspace-header
    .pro-inner-list-item
    .pro-inner-item
    .pro-item-content
    > div
    .user {
    padding-left: 0px;
    margin-right: 0px;
  }
  .pro-sidebar
    .pro-sidebar-content
    .workspace-header
    .pro-inner-list-item
    .pro-inner-item
    .pro-item-content
    > div
    .user
    .email {
    color: ${placeholderColor};
  }
  .pro-sidebar .pro-sidebar-content .tldr-sidebar-hl {
    display: block;
    height: 1px;
    border: 0;
    border-top: 1px solid ${white};
    margin: 0 0 1em 0;
    padding: 0;
    width: 100%;
    opacity: 0.08;
  }
  .pro-sidebar .pro-sidebar-footer {
    border-top: 0px !important;
  }
  .pro-sidebar-content::-webkit-scrollbar {
    /* WebKit */
    width: 0;
    height: 0;
  }
`;
