import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  StyledStudioEditorToolbar,
  StyledTextEditorToolbarFormatGroup,
  StyledStudioEditorToolbarText,
  StyledStudioEditorToolbarContent,
  StyledQuickPositionPopover,
  StyledTextEditorCustomActionButton,
} from "../../../styled/details/stylesDetails";
import { connect } from "react-redux";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { openAdvancedSettings } from "../../../../_actions/sidebarSliderActions";
import StudioCommonActions from "../../StudioCommonActions";
import {
  TldrAction,
  TldrBadge,
  TldrCustomIconAction,
} from "../../../common/statelessView";
import TextEditorToolbar from "../textEditorToolbar/TextEditorToolbar";
import { setActiveLayer } from "../../../../_actions/textToolbarActions";
import { v4 } from "uuid";
import {
  defaultTextItem,
  INTERACTION_PREVIEW,
  MASK_INTERACTION,
} from "../../../canvas/constants/defaults";
import ArtBoardHandler from "../../../common/artBoardHandlers/ArtBoardHandler";
import VideoEditorToolbar from "../videoEditorToolbar/VideoEditorToolbar";
import { findIndex } from "lodash";
import ImageEditorToolbar from "../imageEditorToolbar/ImageEditorToolbar";
import QuickCommonLayerActions from "../../layerActions/QuickCommonLayerActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  ADVANCED_ANIMATION_PANEL,
  ADVANCED_EDITOR_EDIT,
  ADVANCED_EDITOR_PANEL,
  ADVANCED_EDITOR_RESIZE,
  FABRIC_PHOTOTEXT_ELEMENT,
} from "../../constants";
import { ReactComponent as IconMotion } from "../../../../assets/icons/motion.svg";
import { white } from "../../../styled/variable";
import PhotoTextEditorToolbar from "../textEditorToolbar/PhotoTextEditorToolbar";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { BottomPanelViewTypes } from "../../../../_utils/constants";

class StudioEditorToolbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showArrangeActionsOverlay: false,
    };
  }

  advancedSettings = () => {
    this.props.openAdvancedSettings(
      ADVANCED_EDITOR_PANEL,
      ADVANCED_EDITOR_EDIT
    );
  };

  openResizeArtboardTab = () => {
    this.props.openAdvancedSettings(
      ADVANCED_EDITOR_PANEL,
      ADVANCED_EDITOR_RESIZE
    );
  };

  showMotionsPanel = () => {
    this.props.openAdvancedSettings(
      ADVANCED_ANIMATION_PANEL,
      ADVANCED_EDITOR_EDIT
    );
  };

  render() {
    const { editor, canvasRef, rightsidebar, bottomPanel } = this.props;
    const { activeElement, activePage, activeSelection } = editor;
    const { isActionPanelOpen } = rightsidebar;
    const { viewType: bottomPanelViewType } = bottomPanel;

    const hideView =
      !(activeElement.id || activePage.isSelected || activeSelection.mime) ||
      bottomPanelViewType === BottomPanelViewTypes.ARTBOARDS_GRID_VIEW ||
      isActionPanelOpen;

    let pageIndex = findIndex(this.props.pagestore.pageIds, (pageId) => {
      return pageId === this.props.editor.activePage.id;
    });

    const arrangePopover = (
      <StyledQuickPositionPopover id="popover-basic">
        <Popover.Content>
          <QuickCommonLayerActions
            canvasRef={canvasRef}
            isPositionSidebar={false}
            showOrderOptions={true}
            showFlipOptions={true}
          ></QuickCommonLayerActions>
        </Popover.Content>
      </StyledQuickPositionPopover>
    );

    if (canvasRef?.handler?.interactionMode === INTERACTION_PREVIEW) {
      return null;
    }

    return (
      <>
        <StyledStudioEditorToolbar id="tldr-toolbar" hidden={hideView}>
          <StyledStudioEditorToolbarText>
            {canvasRef?.handler?.interactionMode === MASK_INTERACTION
              ? "Text Mask"
              : activeElement.format?.type === FABRIC_PHOTOTEXT_ELEMENT
              ? "Photo Text"
              : activeElement.mime
              ? activeElement.mime
              : activeSelection.mime
              ? activeSelection.mime
              : activePage
              ? `Artboard ${pageIndex + 1}`
              : ""}
          </StyledStudioEditorToolbarText>
          <StyledStudioEditorToolbarContent>
            <StudioCommonActions
              artBoardHandlers={this.props.artBoardHandler}
              canvasRef={canvasRef}
            >
              {activeElement.mime === "text" &&
              activeElement.format?.type === FABRIC_PHOTOTEXT_ELEMENT ? (
                <PhotoTextEditorToolbar canvasRef={canvasRef} />
              ) : activeElement.mime === "text" ? (
                <TextEditorToolbar canvasRef={canvasRef} />
              ) : null}

              {activeElement.mime === "image" && (
                <ImageEditorToolbar canvasRef={canvasRef} />
              )}

              {activeElement.mime === "video" && (
                <VideoEditorToolbar canvasRef={canvasRef} />
              )}
            </StudioCommonActions>

            <StyledTextEditorToolbarFormatGroup>
              {activeSelection.mime === "selection" ? (
                <></>
              ) : (
                !activeElement.mime &&
                canvasRef?.handler?.interactionMode === "selection" && (
                  <TldrAction
                    action={{}}
                    icon="magic"
                    title="Resize artboard"
                    callback={this.openResizeArtboardTab}
                  />
                )
              )}

              {activeSelection.mime === "selection" ? (
                <></>
              ) : activeElement.mime !== "selection" &&
                canvasRef?.handler?.interactionMode === "selection" ? (
                <TldrBadge badgeText="New">
                  <TldrCustomIconAction
                    title="Animate"
                    action={activeElement.mime}
                    icon={<IconMotion fill={white} />}
                    callback={this.showMotionsPanel}
                  />
                </TldrBadge>
              ) : (
                <></>
              )}
            </StyledTextEditorToolbarFormatGroup>

            {activeElement.mime && !activeElement.cropEnable && (
              <>
                <div className="tldr-vl" />
                <StyledTextEditorToolbarFormatGroup>
                  <OverlayTrigger
                    trigger="click"
                    placement="bottom"
                    rootClose
                    overlay={arrangePopover}
                    onEnter={() =>
                      this.setState({ showArrangeActionsOverlay: true })
                    }
                    onExit={() =>
                      this.setState({ showArrangeActionsOverlay: false })
                    }
                  >
                    <StyledTextEditorCustomActionButton
                      isDropdown={true}
                      iconFill={this.state.showArrangeActionsOverlay}
                    >
                      <FontAwesomeIcon icon="layer-group"></FontAwesomeIcon>
                      {this.state.showArrangeActionsOverlay ? (
                        <FontAwesomeIcon icon="chevron-up"></FontAwesomeIcon>
                      ) : (
                        <FontAwesomeIcon icon="chevron-down"></FontAwesomeIcon>
                      )}
                    </StyledTextEditorCustomActionButton>
                  </OverlayTrigger>
                </StyledTextEditorToolbarFormatGroup>
                <div className="tldr-vl" />
              </>
            )}

            {!activeSelection.mime &&
              !activeElement.cropEnable &&
              canvasRef?.handler?.interactionMode === "selection" && (
                <StyledTextEditorToolbarFormatGroup>
                  <TldrAction
                    action="advanced"
                    icon="ellipsis-h"
                    title="More"
                    callback={this.advancedSettings}
                  />
                </StyledTextEditorToolbarFormatGroup>
              )}

            {!activeSelection.mime &&
              canvasRef?.handler?.interactionMode === MASK_INTERACTION && (
                <StyledTextEditorToolbarFormatGroup>
                  <TldrAction
                    action={{}}
                    icon={faCheck}
                    title="Apply Mask"
                    callback={this.applyMask}
                  />

                  <TldrAction
                    action={{}}
                    icon={faTimes}
                    title="Cancel Mask"
                    callback={this.cancelMask}
                  />
                  <div className="tldr-vl" />

                  <TldrAction
                    action="delete"
                    icon="trash"
                    title="Remove Mask"
                    callback={this.removeMask}
                  />
                </StyledTextEditorToolbarFormatGroup>
              )}
          </StyledStudioEditorToolbarContent>
        </StyledStudioEditorToolbar>
      </>
    );
  }

  applyMask = () => {
    this.props.canvasRef.handler.maskHandler.finish();
  };

  cancelMask = () => {
    this.props.canvasRef.handler.maskHandler.cancel();
  };

  removeMask = () => {
    this.props.canvasRef.handler.maskHandler.delete();
  };

  componentDidMount() {
    if (this.props.canvasRef) {
      this.artBoardHandlers = new ArtBoardHandler(this.props.canvasRef.handler);
    }
  }

  addText = () => {
    this.handlers.onAddItem(defaultTextItem, true);
  };

  handlers = {
    onAddItem: (item, centered) => {
      const { canvasRef } = this.props;
      if (canvasRef.handler.interactionMode === "polygon") {
        // message.info('Already drawing');
        return;
      }
      const id = v4();
      const option = Object.assign({}, item.option, { id });
      // if (item.option.superType === "svg" && item.type === "default") {
      //   this.handlers.onSVGModalVisible(item.option);
      //   return;
      // }
      canvasRef.handler.add(option, centered);
    },
  };
}

StudioEditorToolbar.propTypes = {
  editor: PropTypes.object.isRequired,
  openAdvancedSettings: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  editor: state.editor,
  layers: state.layerstore.layers,
  pagestore: state.pagestore,
  rightsidebar: state.rightsidebar,
  bottomPanel: state.bottomPanel,
});

const mapDispatchToProps = (dispatch) => ({
  openAdvancedSettings: (panel, selectedTab) =>
    dispatch(openAdvancedSettings(panel, selectedTab)),
  setActiveLayer: (elementId, elementType, elementFormat, elementParentId) =>
    dispatch(
      setActiveLayer(elementId, elementType, elementFormat, elementParentId)
    ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudioEditorToolbar);
