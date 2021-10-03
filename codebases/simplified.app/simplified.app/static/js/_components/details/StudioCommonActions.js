import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  StyledTextEditorToolbarFormatGroup,
  StyledTextEditorCustomActionButton,
  StyledQuickPositionPopover,
} from "../styled/details/stylesDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect, batch } from "react-redux";
import { Tooltip, OverlayTrigger, Popover } from "react-bootstrap";
import {
  wsAddLayer,
  wsCloneLayers,
  wsDeleteLayers,
  wsAddPage,
  wsDeletePage,
  wsClonePage,
  wsUpdatePage,
  wsSaveAsTemplate,
  updateLayerPayload,
  wsGroup,
  wsUnGroup,
} from "../../_actions/webSocketAction";
import {
  setActiveLayer,
  setActivePage,
  setCrop,
  setVideoPlayingStatus,
} from "../../_actions/textToolbarActions";
import {
  openAdvancedSettings,
  resetSliders,
  setOrUpdateStyles,
  openSlider,
  closeAdvancedSettings,
} from "../../_actions/sidebarSliderActions";
import {
  StyledColorPickerPopover,
  StyledColorPickerCover,
} from "../styled/details/stylesTextPanel";
import { SketchPicker } from "react-color";
import { TldrAction } from "../common/statelessView";
import {
  DEFAULT_COLOR_PRESETS,
  IMAGES_SLIDER_PANEL,
  GIPHY_SLIDER_PANEL,
  VIDEO_SLIDER_PANEL,
  ELEMENTS_SLIDER_PANEL,
  ADVANCED_EDITOR_PANEL,
  ADVANCED_EDITOR_EFFECTS,
  FABRIC_SVG_ELEMENT,
  comboKey1,
} from "./constants";
import { REPLACE_META, UPDATE_BKG } from "../../_actions/types";
import {
  faObjectGroup,
  faObjectUngroup,
  faPalette,
  faPause,
  faStop,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { wsStatusMessage } from "../../_middleware/middleware";
import {
  defaultBodyTextItem,
  INTERACTION_SELECTION,
} from "../canvas/constants/defaults";
import IconCommonActions from "./layerActions/IconCommonActions";
import SlideCommonActions from "./layerActions/SlideCommonActions";
import { analyticsTrackEvent, calculateIconColors } from "../../_utils/common";
import TldrCreateComponent from "../common/TldrCreateComponent";
import QuickCommonLayerActions from "./layerActions/QuickCommonLayerActions";
import TldrBrandkitColors from "../common/TldrBrandkitColors";

class StudioCommonActions extends Component {
  signal = axios.CancelToken.source();

  constructor(props) {
    super(props);
    this.state = {
      showFillColorPopup: false,
      fillColor: "transparent",
      showConfirmation: false,
      showSlidebackgroundActionsOverlay: false,
      showAlignActionsOverlay: false,
      showFlipActionsOverlay: false,
      showArrangeActionsOverlay: false,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { editor, pagestore } = nextProps;

    if (!pagestore.pageIds) {
      return null;
    }
    const { activeElement } = editor;

    if (activeElement) {
      let currentElementStyle = activeElement.format || {};

      if (currentElementStyle.backgroundColor !== prevState.fillColor) {
        return {
          ...prevState,
          fillColor: currentElementStyle.backgroundColor || "transparent",
        };
      }
      return null;
    }

    let currentPagePayload = pagestore.pages[editor.activePage.id];
    if (!currentPagePayload) {
      return null;
    }
    let currentPageStyle = currentPagePayload.payload || {};

    if (currentPageStyle.backgroundColor !== prevState.fillColor) {
      return {
        ...prevState,
        fillColor: currentPageStyle.backgroundColor || "transparent",
      };
    }

    return null;
  }

  delete = () => {
    const { activePage, activeElement, activeSelection } = this.props.editor;
    batch(() => {
      // Delete current page
      if (activeSelection.mime === "selection") {
        // Delete selected layer
        this.props.wsDeleteLayers(
          activeSelection.selectedElements,
          activePage.id
        );
      } else if (activePage.isSelected) {
        let totalPages = this.props.pagestore.pageIds.length;
        this.props.wsDeletePage(activePage.id);
        if (totalPages === 1) {
          this.props.closeAdvancedSettings();
        }
      } else {
        // Delete selected layer
        if (activeElement.id) {
          this.props.wsDeleteLayers([activeElement.id], activePage.id);
        }

        // If video get deleted
        if (activeElement.mime === "video") {
          this.props.canvasRef.handler.stopRequestAnimFrame();
        }
      }
      this.props.setActiveLayer(null, null, null, null);
      this.props.resetSliders();
    });
  };

  lock = () => {
    this.props.canvasRef.handler.lockLayer();
  };

  clone = () => {
    const { activePage, activeElement, activeSelection } = this.props.editor;

    if (activeSelection.mime === "selection") {
      // close selected layer
      this.props.wsCloneLayers(activeSelection.selectedElements, activePage.id);
    } else if (activePage.isSelected) {
      // Clone selected page
      this.props.wsClonePage(activePage.id);
    } else {
      // Clone selected/active layer
      this.props.wsCloneLayers([activeElement.id], activePage.id);
    }
  };

  fillElementColor = (hex) => {
    this.props.canvasRef.handler.objectHandler.backgroundColor(hex);
  };

  toggleFillColorPopup = () => {
    this.setState({ showFillColorPopup: !this.state.showFillColorPopup });
  };

  closeColorPicker = () => {
    this.setState({
      ...this.state,
      showFillColorPopup: false,
    });
  };

  getCurrentActivePage = () => {
    const { editor, pagestore } = this.props;
    const { pages } = pagestore;
    let currentPagePayload = pages[editor.activePage.id];
    return currentPagePayload;
  };

  onChangeCompleteFillColorHandler = ({ rgb, hex }) => {
    if (this.state.fillColor === hex) return;

    this.setState({ fillColor: hex }, () => {
      this.fillElementColor(hex);
    });
  };

  replace = (action, userAction) => {
    let destination;
    if (!action) {
      // This is coming from slide
      this.props.setOrUpdateStyles(UPDATE_BKG, IMAGES_SLIDER_PANEL);
      return;
    }
    if (action === "image") {
      destination = IMAGES_SLIDER_PANEL;
    } else if (action === "video") {
      destination = VIDEO_SLIDER_PANEL;
    } else if (action === "giphy") {
      destination = GIPHY_SLIDER_PANEL;
    }
    this.props.setOrUpdateStyles(userAction, destination);
  };

  updatePage = (url, style) => {
    const pageId = this.props.editor.activePage.id;

    var message = {
      page: pageId,
      payload: {
        wallpaper: {
          mime: "image",
          url: url,
          filters: style && style.filters ? style.filters : {},
          opacity: style && style.opacity ? style.opacity : 1,
        },
      },
    };
    this.props.wsUpdatePage(message);
  };

  onPauseClick = () => {
    const { canvasRef } = this.props;
    let video = canvasRef.handler.canvas.getActiveObject().getElement();
    video.pause();
    canvasRef.handler.stopRequestAnimFrame();
    this.props.setVideoPlayingStatus(false);
  };

  showFiltersPanel = () => {
    this.props.openAdvancedSettings(
      ADVANCED_EDITOR_PANEL,
      ADVANCED_EDITOR_EFFECTS
    );
    analyticsTrackEvent("openEffectPanel");
  };

  export = () => {
    this.props.canvasRef.handler.saveImage();
  };

  render() {
    const { editor, location, canvasRef, brandKit } = this.props;
    const { activePage, activeElement, activeSelection } = editor;
    const { palette } =
      brandKit.brandkitPayload.length > 0 && brandKit.brandkitPayload[0];
    let colorElement = [];

    palette &&
      palette.length > 0 &&
      palette[0].colors.map((color) => {
        return colorElement.push(color.rgb);
      });

    if (activeElement.mime === "video" && activeElement.isVideoPlaying) {
      return (
        <>
          <StyledTextEditorToolbarFormatGroup>
            <TldrAction
              action={{}}
              icon={faPause}
              title={"Pause"}
              userAction={{}}
              callback={this.onPauseClick}
            />

            <TldrAction
              action={{}}
              icon={faStop}
              title="Stop"
              callback={this.onStopClick}
              disabled={!activeElement?.isVideoPlaying}
            />
          </StyledTextEditorToolbarFormatGroup>
        </>
      );
    }

    const { showFillColorPopup, fillColor, showArrangeActionsOverlay } =
      this.state;

    const isGroupingEnabled = activeSelection.mime === "selection";
    const isUngroupingEnabled = activeElement.mime === "group";

    let iconPrefix = this.getElementTypeBasedOnMimeType(
      activeElement.mime ? activeElement.mime : activeSelection.mime
    );
    let noOfIconColors = calculateIconColors(
      activeElement ? activeElement : activeSelection
    );
    const colorPopover = (
      <StyledQuickPositionPopover id="popover-basic">
        <Popover.Content>
          <IconCommonActions canvasRef={canvasRef}></IconCommonActions>
        </Popover.Content>
      </StyledQuickPositionPopover>
    );

    const slideBackgroundPopover = (
      <StyledQuickPositionPopover id="popover-basic">
        <Popover.Content>
          <SlideCommonActions
            canvasRef={canvasRef}
            right={-90}
            width={250}
            isPositionSidebar={false}
            showGradientModal={() =>
              this.setState(
                {
                  showSlidebackgroundActionsOverlay: false,
                  gradientEffectsModal: true,
                },
                () => {
                  this.props.openAdvancedSettings();
                  analyticsTrackEvent("applyGradient");
                }
              )
            }
          ></SlideCommonActions>
        </Popover.Content>
      </StyledQuickPositionPopover>
    );

    const arrangePopover = (
      <StyledQuickPositionPopover id="popover-basic">
        <Popover.Content>
          <QuickCommonLayerActions
            canvasRef={canvasRef}
            isPositionSidebar={false}
            showOrderOptions={false}
            showFlipOptions={false}
          ></QuickCommonLayerActions>
        </Popover.Content>
      </StyledQuickPositionPopover>
    );

    return (
      <>
        {!activeSelection.mime &&
          canvasRef?.handler?.interactionMode === INTERACTION_SELECTION && (
            <StyledTextEditorToolbarFormatGroup>
              <TldrAction
                action="add"
                icon="plus"
                title={`Add ${iconPrefix}`}
                callback={this.add}
              />
            </StyledTextEditorToolbarFormatGroup>
          )}
        {location === "sidebar" && activeElement.mime && (
          <StyledTextEditorToolbarFormatGroup>
            <TldrAction
              action="save"
              icon="shapes"
              title="Save as component"
              callback={this.createComponent}
            />
          </StyledTextEditorToolbarFormatGroup>
        )}

        {!activeSelection.mime &&
          canvasRef?.handler?.interactionMode === INTERACTION_SELECTION && (
            <div className="tldr-vl" />
          )}
        <StyledTextEditorToolbarFormatGroup>
          {canvasRef?.handler?.interactionMode === INTERACTION_SELECTION && (
            <>
              <TldrAction
                action="delete"
                icon="trash"
                title={`Delete ${iconPrefix}`}
                shortcutKeys={["Del"]}
                callback={this.delete}
              />
              <TldrAction
                action="clone"
                icon="copy"
                title={`Clone ${iconPrefix}`}
                callback={this.clone}
                shortcutKeys={[comboKey1, "D"]}
              />
            </>
          )}

          {location === "sidebar" && activeElement.mime && (
            <>
              <TldrAction
                action="lock"
                icon="unlock"
                title={`Lock ${iconPrefix} layer`}
                callback={this.lock}
                shortcutKeys={[comboKey1, "Shift", "L"]}
              />

              <TldrAction
                action="download"
                icon="file-download"
                title={`Export ${iconPrefix} layer`}
                callback={this.export}
              />
            </>
          )}

          {(isGroupingEnabled || isUngroupingEnabled) && (
            <TldrAction
              action={
                isGroupingEnabled
                  ? "group"
                  : isUngroupingEnabled
                  ? "ungroup"
                  : ""
              }
              icon={
                isGroupingEnabled
                  ? faObjectGroup
                  : isUngroupingEnabled
                  ? faObjectUngroup
                  : "none"
              }
              title={`${
                isGroupingEnabled
                  ? "Group"
                  : isUngroupingEnabled
                  ? "Ungroup"
                  : ""
              } Elements`}
              disabled={!(isGroupingEnabled || isUngroupingEnabled)}
              hidden={!(isGroupingEnabled || isUngroupingEnabled)}
              callback={this.group}
              shortcutKeys={
                isGroupingEnabled
                  ? [comboKey1, "G"]
                  : isUngroupingEnabled
                  ? [comboKey1, "Shift", "G"]
                  : [""]
              }
            />
          )}
        </StyledTextEditorToolbarFormatGroup>

        {activeSelection.mime === "selection" && (
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
                  iconFill={showArrangeActionsOverlay}
                >
                  <FontAwesomeIcon icon="layer-group"></FontAwesomeIcon>
                  {showArrangeActionsOverlay ? (
                    <FontAwesomeIcon icon="chevron-up"></FontAwesomeIcon>
                  ) : (
                    <FontAwesomeIcon icon="chevron-down"></FontAwesomeIcon>
                  )}
                </StyledTextEditorCustomActionButton>
              </OverlayTrigger>
            </StyledTextEditorToolbarFormatGroup>
          </>
        )}

        {this.props.children}

        {activeElement.mime === "text" && location !== "sidebar" ? (
          <>
            <StyledTextEditorToolbarFormatGroup>
              <div className="tldr-color-picker">
                <OverlayTrigger
                  key="color"
                  placement="bottom"
                  overlay={
                    <Tooltip id={`tooltip-fill-color`}>
                      Background color
                    </Tooltip>
                  }
                >
                  <StyledTextEditorCustomActionButton
                    onClick={() =>
                      this.setState({
                        ...this.state,
                        showFillColorPopup: !showFillColorPopup,
                      })
                    }
                  >
                    <FontAwesomeIcon
                      icon="fill-drip"
                      style={{
                        color:
                          fillColor === "transparent" ? "white" : fillColor,
                      }}
                    ></FontAwesomeIcon>
                  </StyledTextEditorCustomActionButton>
                </OverlayTrigger>
                {showFillColorPopup && (
                  <StyledColorPickerPopover
                    top={40}
                    right={-100}
                    showBrandkitPaletteColors={
                      brandKit.brandkitPayload.length > 0
                    }
                  >
                    <StyledColorPickerCover
                      onClick={this.closeColorPicker}
                      style={{ width: "28px !important" }}
                    />
                    {brandKit.brandkitPayload.length > 0 && (
                      <TldrBrandkitColors
                        handleOnChangeComplete={({ rgb, hex }) =>
                          this.onChangeCompleteFillColorHandler({ rgb, hex })
                        }
                      />
                    )}
                    <SketchPicker
                      disableAlpha={true}
                      presetColors={DEFAULT_COLOR_PRESETS}
                      color={fillColor}
                      onChangeComplete={this.onChangeCompleteFillColorHandler}
                    />
                  </StyledColorPickerPopover>
                )}
              </div>
            </StyledTextEditorToolbarFormatGroup>
            <div className="tldr-vl" />
          </>
        ) : activeElement.mime === "shape" ? (
          <>
            {location !== "sidebar" &&
              (activeElement.format.type === FABRIC_SVG_ELEMENT &&
              noOfIconColors <= 0 ? null : (
                <>
                  <div className="tldr-vl" />
                  <StyledTextEditorToolbarFormatGroup>
                    <OverlayTrigger
                      OverlayTrigger
                      trigger="click"
                      placement="bottom"
                      rootClose
                      overlay={colorPopover}
                    >
                      <StyledTextEditorCustomActionButton>
                        <FontAwesomeIcon icon={faPalette}></FontAwesomeIcon>
                      </StyledTextEditorCustomActionButton>
                    </OverlayTrigger>
                  </StyledTextEditorToolbarFormatGroup>
                  <div className="tldr-vl" />
                </>
              ))}
          </>
        ) : activeElement.mime === "video" ||
          activeElement.mime === "giphy" ||
          activeElement.mime === "image" ? (
          <>
            <StyledTextEditorToolbarFormatGroup>
              <TldrAction
                className="active"
                action={activeElement.mime}
                icon={activeElement.mime === "video" ? "play-circle" : "image"}
                title={
                  activeElement.mime
                    ? `Replace ${activeElement.mime}`
                    : "Update Background"
                }
                userAction={REPLACE_META}
                callback={this.replace}
              />
            </StyledTextEditorToolbarFormatGroup>
          </>
        ) : activePage.isSelected &&
          location !== "sidebar" &&
          !activeSelection.mime &&
          canvasRef?.handler?.interactionMode === "selection" ? (
          <>
            <StyledTextEditorToolbarFormatGroup>
              <div className="tldr-color-picker">
                <OverlayTrigger
                  OverlayTrigger
                  trigger="click"
                  placement="bottom"
                  rootClose
                  overlay={
                    this.state.showSlidebackgroundActionsOverlay ? (
                      slideBackgroundPopover
                    ) : (
                      <div></div>
                    )
                  }
                  onEnter={() =>
                    this.setState({ showSlidebackgroundActionsOverlay: true })
                  }
                  onExit={() =>
                    this.setState({ showSlidebackgroundActionsOverlay: false })
                  }
                >
                  <StyledTextEditorCustomActionButton
                    isDropdown={true}
                    iconFill={this.state.showSlidebackgroundActionsOverlay}
                  >
                    {canvasRef.handler?.workarea.backgroundColor === null &&
                    canvasRef.handler?.workarea?.fill?.type !== "linear" ? (
                      <FontAwesomeIcon
                        icon="image"
                        style={{ color: "white" }}
                      ></FontAwesomeIcon>
                    ) : canvasRef.handler?.workarea.backgroundColor === null &&
                      canvasRef.handler?.workarea?.fill?.type === "linear" ? (
                      <FontAwesomeIcon
                        icon="adjust"
                        style={{
                          color:
                            fillColor === "transparent" ? "white" : fillColor,
                        }}
                      ></FontAwesomeIcon>
                    ) : (
                      <FontAwesomeIcon
                        icon="fill-drip"
                        style={{
                          color:
                            fillColor === "transparent" ? "white" : fillColor,
                        }}
                      ></FontAwesomeIcon>
                    )}
                    {this.state.showSlidebackgroundActionsOverlay ? (
                      <FontAwesomeIcon icon="chevron-up"></FontAwesomeIcon>
                    ) : (
                      <FontAwesomeIcon icon="chevron-down"></FontAwesomeIcon>
                    )}
                  </StyledTextEditorCustomActionButton>
                </OverlayTrigger>
              </div>
            </StyledTextEditorToolbarFormatGroup>
            <div className="tldr-vl" />
          </>
        ) : (
          <></>
        )}

        {activeElement.mime === "image" || activeElement.mime === "video" ? (
          <>
            <StyledTextEditorToolbarFormatGroup>
              {location !== "sidebar" && (
                <TldrAction
                  action={activeElement.mime}
                  icon="magic"
                  title="Apply Filters"
                  callback={this.showFiltersPanel}
                />
              )}
            </StyledTextEditorToolbarFormatGroup>
            {/* <div className="tldr-vl" /> */}
          </>
        ) : (
          <></>
        )}

        <TldrCreateComponent
          canvasRef={this.props.canvasRef}
          show={this.state.showConfirmation}
          onHide={() => {
            this.setState({
              ...this.state,
              showConfirmation: false,
            });
          }}
        />
      </>
    );
  }

  componentWillUnmount() {
    this.signal.cancel("The user aborted a request.");
  }

  onStopClick = () => {
    const { canvasRef } = this.props;
    const target = canvasRef.handler.canvas.getActiveObject();
    if (!target) {
      return;
    }

    target.stop();
    canvasRef.handler.stopRequestAnimFrame();
    this.props.setVideoPlayingStatus(false);
  };

  add = () => {
    const { editor, story } = this.props;
    // Add New Page
    if (editor.activePage.isSelected) {
      this.props.wsAddPage();
      return;
    }
    if (editor.activeElement.mime === "text") {
      let minSize = Math.min(
        story.payload.image_width,
        story.payload.image_height
      );
      defaultBodyTextItem.payload.fontSize = minSize * 0.05;
      this.props.wsAddLayer(
        this.props.editor.activePage.id,
        defaultBodyTextItem
      );
    } else if (editor.activeElement.mime === "image") {
      this.props.openSlider(IMAGES_SLIDER_PANEL);
    } else if (editor.activeElement.mime === "giphy") {
      this.props.openSlider(GIPHY_SLIDER_PANEL);
    } else if (editor.activeElement.mime === "shape") {
      this.props.openSlider(ELEMENTS_SLIDER_PANEL);
    } else if (editor.activeElement.mime === "video") {
      this.props.openSlider(VIDEO_SLIDER_PANEL);
    }
  };

  createComponent = () => {
    this.setState({
      showConfirmation: true,
    });
  };

  group = (action) => {
    const { canvasRef } = this.props;
    let activeObj = canvasRef.handler.canvas.getActiveObject();
    if (!activeObj) {
      return;
    }
    switch (action) {
      case "group":
        //this.props.wsGroup(activePage.id, activeSelection.selectedElements)
        canvasRef.handler.toGroup();
        break;
      case "ungroup":
        canvasRef.handler.toActiveSelection();
        break;
      default:
        return;
    }
  };

  getElementTypeBasedOnMimeType = (mime) => {
    switch (mime) {
      case "text":
        return "Text";
      case "image":
        return "Image";
      case "shape":
        return "Shape";
      case "selection":
        return "Selection";
      case "group":
        return "Group";
      case "giphy":
        return "giphy";
      case "video":
        return "Video";
      default:
        return "Artboard";
    }
  };

  advancedSettings = (selectedTab) => {
    this.props.openAdvancedSettings(ADVANCED_EDITOR_PANEL, selectedTab);
  };
}

StudioCommonActions.propTypes = {
  pagestore: PropTypes.object.isRequired,
  layerstore: PropTypes.object.isRequired,
  editor: PropTypes.object.isRequired,
  story: PropTypes.object.isRequired,
  wsCloneLayers: PropTypes.func.isRequired,
  wsDeleteLayers: PropTypes.func.isRequired,
  wsAddLayer: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  editor: state.editor,
  pagestore: state.pagestore,
  layerstore: state.layerstore,
  story: state.story,
  brandKit: state.brandKit,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  wsAddLayer: (pageId, payload) => dispatch(wsAddLayer(pageId, payload)),
  wsDeletePage: (pageId) => dispatch(wsDeletePage(pageId)),
  wsClonePage: (pageId) => dispatch(wsClonePage(pageId)),
  wsDeleteLayers: (layerIds, pageId) =>
    dispatch(wsDeleteLayers(layerIds, pageId)),
  wsCloneLayers: (layerIds, pageId) =>
    dispatch(wsCloneLayers(layerIds, pageId)),
  wsAddPage: () => dispatch(wsAddPage()),
  setActiveLayer: (elementId, elementType, layerId, elementParentId) =>
    dispatch(setActiveLayer(elementId, elementType, layerId, elementParentId)),
  setActivePage: (pageId, pageIndex, isSelected) =>
    dispatch(setActivePage(pageId, pageIndex, isSelected)),
  openAdvancedSettings: (panelName, selectedTab) =>
    dispatch(openAdvancedSettings(panelName, selectedTab)),
  wsUpdatePage: (payload) => dispatch(wsUpdatePage(payload)),
  wsSaveAsTemplate: (pageId) => dispatch(wsSaveAsTemplate(pageId)),
  resetSliders: () => dispatch(resetSliders()),
  setOrUpdateStyles: (action, destination) =>
    dispatch(setOrUpdateStyles(action, destination)),
  setCrop: (isEnable) => dispatch(setCrop(isEnable)),
  updateLayerPayload: (payload) => dispatch(updateLayerPayload(payload)),
  wsStatusMessage: (message) => dispatch(wsStatusMessage(message)),
  openSlider: (panel) => dispatch(openSlider(panel)),
  wsGroup: (pageId, layers) => dispatch(wsGroup(pageId, layers)),
  wsUnGroup: (layerId) => dispatch(wsUnGroup(layerId)),
  setVideoPlayingStatus: (isPlaying) =>
    dispatch(setVideoPlayingStatus(isPlaying)),
  closeAdvancedSettings: () => dispatch(closeAdvancedSettings()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(StudioCommonActions);
