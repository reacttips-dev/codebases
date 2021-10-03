import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { Tab, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  StyledAdvancedTab,
  StyledAdvancedTabNav,
} from "../../../styled/details/styleAdvancedPanel";
import { openAdvancedSettings } from "../../../../_actions/sidebarSliderActions";
import {
  ADVANCED_ANIMATION_PANEL,
  ADVANCED_EDITOR_EDIT,
  ADVANCED_EDITOR_LAYERS,
} from "../../constants";
import { ReactComponent as IconMotion } from "../../../../assets/icons/motion.svg";
import { white } from "../../../styled/variable";
import StudioAnimations from "./StudioAnimations";
import StudioAllLayers from "./StudioAllLayers";

export class StudioAnimationSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: props.rightsidebar.selectedTab,
    };
  }

  onSelectTab = (tab) => {
    this.props.openAdvancedSettings(ADVANCED_ANIMATION_PANEL, tab);
  };

  render() {
    const { canvasRef, rightsidebar, editor } = this.props;
    const mime = editor.activeElement.mime;
    const selectedTab = rightsidebar.selectedTab;
    return (
      <>
        <StyledAdvancedTab id="advanced-sidebar-tab" activeKey={selectedTab}>
          <Tab.Content className="d-flex flex-column">
            <Nav className="flex-row">
              <Nav.Item>
                <StyledAdvancedTabNav
                  onSelect={(k) => this.onSelectTab(k)}
                  eventKey={ADVANCED_EDITOR_EDIT}
                  tldrbtn={
                    selectedTab === ADVANCED_EDITOR_EDIT ? "primary" : ""
                  }
                >
                  {<IconMotion className="fa-16" fill={white} />}
                </StyledAdvancedTabNav>
                {selectedTab === ADVANCED_EDITOR_EDIT && (
                  <div className="nav-item-active-indicator" />
                )}
              </Nav.Item>
              {/* Show 'Layers' for 'Artboard' only */}
              {!mime && (
                <Nav.Item>
                  <StyledAdvancedTabNav
                    onSelect={(k) => this.onSelectTab(k)}
                    eventKey={ADVANCED_EDITOR_LAYERS}
                    tldrbtn={
                      selectedTab === ADVANCED_EDITOR_LAYERS ? "primary" : ""
                    }
                  >
                    <FontAwesomeIcon icon="layer-group" />
                  </StyledAdvancedTabNav>
                  {selectedTab === ADVANCED_EDITOR_LAYERS && (
                    <div className="nav-item-active-indicator" />
                  )}
                </Nav.Item>
              )}
            </Nav>
            <div className="advanced-sidebar-separator mb-10" />

            {selectedTab === ADVANCED_EDITOR_EDIT && (
              <Tab.Pane
                className="d-flex flex-grow-1 flex-column"
                eventKey={ADVANCED_EDITOR_EDIT}
              >
                <StudioAnimations canvasRef={canvasRef}></StudioAnimations>
              </Tab.Pane>
            )}

            {!mime && selectedTab === ADVANCED_EDITOR_LAYERS && (
              <Tab.Pane eventKey={ADVANCED_EDITOR_LAYERS}>
                <StudioAllLayers canvasRef={canvasRef}></StudioAllLayers>
              </Tab.Pane>
            )}
          </Tab.Content>
        </StyledAdvancedTab>
      </>
    );
  }
}

StudioAnimationSidebar.propTypes = {
  rightsidebar: PropTypes.object.isRequired,
  editor: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  rightsidebar: state.rightsidebar,
  editor: state.editor,
});

const mapDispatchToProps = (dispatch) => ({
  openAdvancedSettings: (panel, selectedTab) =>
    dispatch(openAdvancedSettings(panel, selectedTab)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudioAnimationSidebar);
