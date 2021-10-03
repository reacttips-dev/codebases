import {
  primaryHover,
  blackAlpha,
  grey,
  primary_00,
  greyBlack,
  placeholderColor,
  greyDark,
  white,
  md,
} from "../_components/styled/variable";
import styled from "styled-components";

export const StyledSidebar = styled.div`
  .pro-sidebar {
    width: 220px !important;
    height: 100% !important;
    min-width: 80px;
    z-index: 1001 !important;
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.5);
    overflow: auto;
  }
  .pro-sidebar.collapsed {
    width: 80px !important;
  }
  .pro-sidebar.collapsed .pro-sidebar-header {
    border-bottom: 0px !important;
    height: 44px;
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
    margin-left: -5px;
  }
  .pro-sidebar.collapsed .section-heading {
    display: none;
  }
  .pro-sidebar.collapsed .pro-menu-item .pro-inner-item {
    padding: 8px 20px 8px 20px !important;
  }
  .pro-sidebar.collapsed .pro-menu-item .pro-inner-item .pro-icon-wrapper {
    background-color: transparent !important;
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
    background-color: ${blackAlpha} !important;
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
    padding: 8px 20px 8px 20px !important;
  }
  .pro-sidebar .pro-menu-item .pro-inner-item .sidebar-new-project {
    background-color: ${primary_00};
    border-radius: 8px;
    padding: 10px;
    font-size: 15px;
    display: flex;
    align-items: center;
    color: ${greyBlack};
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
    padding-left: 12px !important;
  }
  .pro-sidebar .pro-menu-item.active .pro-inner-item:after {
    display: block;
    position: absolute;
    right: 10px;
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
    .pro-icon-wrapper {
    margin-right: 5px !important;
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
    background-color: ${greyDark} !important;
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
  .pro-sidebar-header {
    border-bottom: 0px !important;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px 0px 0px 0px;
  }
  .pro-sidebar-header :hover {
    cursor: pointer;
  }

  @media (max-width: ${md}) {
    .pro-sidebar {
      position: absolute !important;
      width: 245px !important;
      // min-width: 0px !important;

      &.collapsed {
        width: 0px !important;
        min-width: 0px !important;
      }
    }
  }
`;

export const FloatingButton = styled.div`
  background-color: ${primary_00};
  height: 48px;
  width: 48px;
  border-radius: 25px;
  font-size: 1.5rem !important;
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: absolute;
  top: 100%;
  left: 100%;
  margin-left: -72px;
  margin-top: -128px;
  z-index: ${(props) => (props.zIndex ? props.zIndex : "99")};

  .floating-add-product-icon {
    height: 16px;
    width: 21px;
  }
`;

export const StyledInterComWrapper = styled.div`
  position: fixed;
  bottom: 12px;
  right: 12px;
  z-index: 101;
`;

export const StyledDashboardContent = styled.div`
  flex: 1 1 auto;
  align-self: stretch;
  width: calc(100% - 220px);
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
  }
`;
