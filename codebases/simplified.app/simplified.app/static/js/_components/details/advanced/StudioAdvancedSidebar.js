import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  StyledAdvancedTabNav,
  StyledAdvancedTab,
} from "../../styled/details/styleAdvancedPanel";
import { connect } from "react-redux";
import { Tab, Nav } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Effects from "./Effects";
import StudioAdvancedEditor from "../editorToolbar/commonEditorToolbar/StudioAdvancedEditor";
import { openAdvancedSettings } from "../../../_actions/sidebarSliderActions";
import {
  ADVANCED_EDITOR_LAYERS,
  ADVANCED_EDITOR_EFFECTS,
  ADVANCED_EDITOR_EDIT,
  ADVANCED_EDITOR_PANEL,
  ADVANCED_EDITOR_RESIZE,
  ADVANCED_EDITOR_CLIP,
} from "../constants";
import SlideLayers from "./slideLayers/SlideLayers";
import SlidePresets from "./SlidePresets";
import AdvancedCropAndClipPanel from "./croppingAndClipping/AdvancedCropAndClipPanel";

export class StudioAdvancedSidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: props.rightsidebar.selectedTab,
    };
  }

  onSelectTab = (tab) => {
    this.props.openAdvancedSettings(ADVANCED_EDITOR_PANEL, tab);
  };

  render() {
    const { canvasRef, artBoardHandler, rightsidebar, editor } = this.props;
    const mime = editor.activeElement.mime;
    const selectedTab = rightsidebar.selectedTab;

    return (
      <>
        <StyledAdvancedTab id="advanced-sidebar-tab" activeKey={selectedTab}>
          <Tab.Content>
            <Nav className="flex-row mb-3 mb-12">
              <Nav.Item>
                <StyledAdvancedTabNav
                  onSelect={(k) => this.onSelectTab(k)}
                  eventKey={ADVANCED_EDITOR_EDIT}
                  tldrbtn={selectedTab === "edit" ? "primary" : ""}
                >
                  <FontAwesomeIcon icon="cog" />
                </StyledAdvancedTabNav>
                {selectedTab === "edit" && (
                  <div className="nav-item-active-indicator" />
                )}
              </Nav.Item>

              {/* Show 'Resize' for 'Artboard' only */}
              {!mime && (
                <Nav.Item>
                  <StyledAdvancedTabNav
                    onSelect={(k) => this.onSelectTab(k)}
                    eventKey={ADVANCED_EDITOR_RESIZE}
                    tldrbtn={
                      selectedTab === ADVANCED_EDITOR_RESIZE ? "primary" : ""
                    }
                  >
                    <FontAwesomeIcon icon="magic" />
                  </StyledAdvancedTabNav>
                  {selectedTab === ADVANCED_EDITOR_RESIZE && (
                    <div className="nav-item-active-indicator" />
                  )}
                </Nav.Item>
              )}

              {/* Show 'Filters' for images only */}
              {(mime === "image" || mime === "text") && (
                <Nav.Item>
                  <StyledAdvancedTabNav
                    onSelect={(k) => this.onSelectTab(k)}
                    eventKey={ADVANCED_EDITOR_EFFECTS}
                    tldrbtn={
                      selectedTab === ADVANCED_EDITOR_EFFECTS ? "primary" : ""
                    }
                  >
                    <FontAwesomeIcon icon="magic" />
                  </StyledAdvancedTabNav>
                  {selectedTab === ADVANCED_EDITOR_EFFECTS && (
                    <div className="nav-item-active-indicator" />
                  )}
                </Nav.Item>
              )}

              {/* Show 'Crop & Clip' for images only */}
              {mime === "image" && (
                <Nav.Item>
                  <StyledAdvancedTabNav
                    onSelect={(k) => this.onSelectTab(k)}
                    eventKey={ADVANCED_EDITOR_CLIP}
                    tldrbtn={
                      selectedTab === ADVANCED_EDITOR_CLIP ? "primary" : ""
                    }
                  >
                    <FontAwesomeIcon icon="crop-alt" />
                  </StyledAdvancedTabNav>
                  {selectedTab === ADVANCED_EDITOR_CLIP && (
                    <div className="nav-item-active-indicator" />
                  )}
                </Nav.Item>
              )}

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
              <div className="advanced-sidebar-separator" />
            </Nav>

            {selectedTab === ADVANCED_EDITOR_EDIT && (
              <Tab.Pane eventKey={ADVANCED_EDITOR_EDIT}>
                <StudioAdvancedEditor
                  canvasRef={canvasRef}
                  artBoardHandler={artBoardHandler}
                />
              </Tab.Pane>
            )}

            {selectedTab === ADVANCED_EDITOR_RESIZE && (
              <Tab.Pane eventKey={ADVANCED_EDITOR_RESIZE}>
                <SlidePresets canvasRef={canvasRef}></SlidePresets>
              </Tab.Pane>
            )}

            {selectedTab === ADVANCED_EDITOR_EFFECTS && (
              <Tab.Pane eventKey={ADVANCED_EDITOR_EFFECTS}>
                <Effects canvasRef={canvasRef} />
              </Tab.Pane>
            )}

            {selectedTab === ADVANCED_EDITOR_CLIP && (
              <Tab.Pane eventKey={ADVANCED_EDITOR_CLIP}>
                <AdvancedCropAndClipPanel canvasRef={canvasRef} />
              </Tab.Pane>
            )}

            {!mime && selectedTab === ADVANCED_EDITOR_LAYERS && (
              <Tab.Pane eventKey={ADVANCED_EDITOR_LAYERS}>
                <SlideLayers canvasRef={canvasRef} />
              </Tab.Pane>
            )}
          </Tab.Content>
        </StyledAdvancedTab>
      </>
    );
  }
}

StudioAdvancedSidebar.propTypes = {
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
)(StudioAdvancedSidebar);
