import React, { Component } from "react";
import { batch, connect } from "react-redux";
import PropTypes from "prop-types";
import {
  StyledAdvancedToolbarText,
  StyledStudioEditorToolbarText,
} from "../../../styled/details/stylesDetails";
import { StyledAdvancedPanel } from "../../../styled/details/styleAdvancedPanel";
import { TldrAction } from "../../../common/statelessView";
import { closeAdvancedSettings } from "../../../../_actions/sidebarSliderActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  setActiveLayer,
  setActivePage,
  setCrop,
} from "../../../../_actions/textToolbarActions";
import {
  ADVANCED_EDITOR_CLIP,
  comboKey1,
  FABRIC_PHOTOTEXT_ELEMENT,
  KEYBOARD_SHORTCUTS_PANEL,
} from "../../constants";
import Drawer from "react-bottom-drawer";
import { StyledAdvancedDrawer } from "../../../styled/styles";

export class StudioBaseRightSideBar extends Component {
  constructor(props) {
    super(props);
    this.handleAction = this.handleAction.bind(this);
    this.state = { visible: true };
  }

  handleAction = (action) => {
    const { selectedTab } = this.props.rightsidebar;
    const { activeElement } = this.props.editor;

    if (selectedTab === ADVANCED_EDITOR_CLIP) {
      this.cancelCrop(activeElement.mime);
    }
    this.props.closeAdvancedSettings();
  };

  cancelCrop = (action) => {
    const { canvasRef } = this.props;
    canvasRef.handler.cropHandler.cancel(true);
    this.props.setCrop(false);
  };

  goBack = () => {
    const pageIndex = this.props.editor.activePage.pageIndex;
    const pageId = this.props.editor.activePage.id;
    batch(() => {
      this.props.canvasRef.handler.unselectActiveObject();
      this.props.setActiveLayer(null, null, null, null);
      this.props.setActivePage(pageId, pageIndex, true);
    });
  };

  render() {
    const { activeElement } = this.props.editor;
    const mime = activeElement.mime;
    const pageIndex = this.props.editor.activePage.pageIndex;
    const { sliderPanelType } = this.props.rightsidebar;
    const content = (
      <StyledAdvancedPanel>
        <div className="advanced-content">
          <div className="advanced-header">
            {mime && (
              <div className="back mr-2" onClick={this.goBack}>
                <FontAwesomeIcon icon="chevron-left" />
              </div>
            )}
            <div className="info">
              <StyledAdvancedToolbarText>
                {activeElement?.format?.type === FABRIC_PHOTOTEXT_ELEMENT
                  ? "Photo Text"
                  : mime
                  ? mime
                  : sliderPanelType === KEYBOARD_SHORTCUTS_PANEL
                  ? "Keyboard Shortcuts"
                  : `Artboard ${pageIndex + 1}`}
              </StyledAdvancedToolbarText>
              <StyledStudioEditorToolbarText>
                {sliderPanelType === KEYBOARD_SHORTCUTS_PANEL ? (
                  <>
                    Press <kbd>{comboKey1}</kbd> <kbd>/</kbd> to open this
                    panel.
                  </>
                ) : (
                  this.props.title
                )}
              </StyledStudioEditorToolbarText>
            </div>
            <TldrAction
              action="close"
              icon="times"
              title="Close"
              callback={this.handleAction}
            />
          </div>
          {this.props.children}
        </div>
      </StyledAdvancedPanel>
    );

    return (
      <>
        <div className="d-block d-sm-block d-md-none">
          <StyledAdvancedDrawer>
            <Drawer
              className="drawer"
              isVisible={this.state.visible}
              hideScrollbars="true"
              onClose={() => {
                this.setState({ visible: false });
                this.props.closeAdvancedSettings();
              }}
            >
              {content}
            </Drawer>
          </StyledAdvancedDrawer>
        </div>
        <div className="d-none d-sm-none d-md-block">{content}</div>
      </>
    );
  }
}

StudioBaseRightSideBar.propTypes = {
  rightsidebar: PropTypes.object.isRequired,
  editor: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  rightsidebar: state.rightsidebar,
  editor: state.editor,
});

const mapDispatchToProps = (dispatch) => ({
  closeAdvancedSettings: () => dispatch(closeAdvancedSettings()),
  setActiveLayer: (elementId, elementType, elementFormat, elementParentId) =>
    dispatch(
      setActiveLayer(elementId, elementType, elementFormat, elementParentId)
    ),
  setActivePage: (pageId, pageIndex, isSelected) =>
    dispatch(setActivePage(pageId, pageIndex, isSelected)),
  setCrop: (isEnable) => dispatch(setCrop(isEnable)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudioBaseRightSideBar);
