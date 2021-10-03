import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  closeAdvancedSettings,
  openAdvancedSettings,
} from "../../_actions/sidebarSliderActions";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { faKeyboard } from "@fortawesome/free-solid-svg-icons";
import {
  ADVANCED_EDITOR_EDIT,
  KEYBOARD_SHORTCUTS_PANEL,
} from "../details/constants";
import { StyledSidebarFooter } from "../styled/styles";

function StorySidebarFooter(props) {
  const isKeyboardSettingOpen =
    props?.rightsidebar?.isActionPanelOpen &&
    props?.rightsidebar?.sliderPanelType === "keyboard";

  const toggleKeyboardShortcutsPanel = () => {
    if (isKeyboardSettingOpen) {
      props.closeAdvancedSettings();
    } else {
      props.openAdvancedSettings(
        KEYBOARD_SHORTCUTS_PANEL,
        ADVANCED_EDITOR_EDIT
      );
    }
  };

  return (
    <StyledSidebarFooter>
      <hr className="tldr-studio-sidebar-hl divider" />
      <div
        className={`tldr-nav-item menu-item text-center menu-item-label container`}
        onClick={toggleKeyboardShortcutsPanel}
      >
        <div className="icon-wrapper">
          <FontAwesomeIcon
            className={`menu-icon ${isKeyboardSettingOpen ? "active" : ""}`}
            icon={faKeyboard}
          />
        </div>
        <span className={`label ${isKeyboardSettingOpen ? "active" : ""}`}>
          Hotkeys
        </span>
      </div>
    </StyledSidebarFooter>
  );
}

const mapStateToProps = (state) => ({
  rightsidebar: state.rightsidebar,
});

const mapDispatchToProps = (dispatch) => ({
  openAdvancedSettings: (panel, selectedTab) =>
    dispatch(openAdvancedSettings(panel, selectedTab)),
  closeAdvancedSettings: () => dispatch(closeAdvancedSettings()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(StorySidebarFooter));
