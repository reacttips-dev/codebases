import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "antd/dist/antd.css";
import axios from "axios";
import { debounce, isEqual, findIndex, throttle } from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Dropzone from "react-dropzone";
import { batch, connect } from "react-redux";
import Format from "string-format";
import { ReactComponent as TldrPointer } from "../assets/icons/pointer.svg";
import { fetchFonts, fetchStoryFonts } from "../_actions/appActions";
import { checkAssetStatus } from "../_actions/assetAction";
import { switchTeamNow, syncWorkSpaces } from "../_actions/authActions";
import { fetchBrandKits } from "../_actions/brandKitActions";
import {
  hideCommandKSearch,
  showCommandKSearch,
} from "../_actions/commandKActions";
import { WEBSOCKETS_ENDPOINT } from "../_actions/endpoints";
import {
  closeSlider,
  openAdvancedSettings,
  openSlider,
} from "../_actions/sidebarSliderActions";
import {
  fetchStoryDetail,
  fetchStoryPages,
  setCounter,
  uploadFile,
  uploadImageAndAddLayer,
  updateStoryMusic,
} from "../_actions/storiesActions";
import {
  setActiveLayer,
  setActivePage,
  setClonedItems,
  setCrop,
  setElementFormat,
  setGroupSelection,
  setVideoPlayingStatus,
} from "../_actions/textToolbarActions";
import { showToast } from "../_actions/toastActions";
import { GROUP, ImageAppSources, UNGROUP } from "../_actions/types";
import {
  wsAddLayer,
  wsAddPage,
  wsBroadcast,
  wsCloneLayers,
  wsClonePage,
  wsConnect,
  wsCopyFromTemplate,
  wsDeleteLayers,
  wsDeletePage,
  wsDisconnect,
  wsGroup,
  wsMoveLayer,
  wsRedo,
  wsUndo,
  wsUnGroup,
  wsUpdateLayer,
  wsUpdateLayers,
  wsUpdatePage,
  wsUpdateStory,
} from "../_actions/webSocketAction";
import {
  CROP_INTERACTION,
  defaultMusicPayload,
  defaultOption,
} from "../_components/canvas/constants/defaults";
import ArtBoardHandler from "../_components/common/artBoardHandlers/ArtBoardHandler";
import {
  Dropable,
  ShowCenterSpinner,
} from "../_components/common/statelessView";
import TldrCommandK from "../_components/common/tldrCommandK/TldrCommandK";
import TldrContextMenu from "../_components/common/TldrContextMenu";
import {
  ACTIVE_SELECTION,
  ADVANCED_EDITOR_EDIT,
  KEYBOARD_SHORTCUTS_PANEL,
  PASTED_URL_SUFFIXES,
  REMOTE_COLLOBORATION_BROADCAST_MOUSE_POINTER,
  EDITOR_SIDEBAR_MENU,
  IMAGE_URL_SUFFIXES,
  MUSIC_URL_SUFFIXES,
  EDITOR_BOTTOM_MENU,
} from "../_components/details/constants";
import StudioEditorToolbar from "../_components/details/editorToolbar/commonEditorToolbar/StudioEditorToolbar";
import StudioSidebarItemDetailSlider from "../_components/details/sidebarPanels/StudioSidebarItemDetailSlider";
import StudioNavbar from "../_components/details/StudioNavbar";
import StudioRightSidePanel from "../_components/details/StudioRightSidePanel";
import {
  StyledLoaderSlide,
  StyledPointer,
  StyledUserLabel,
} from "../_components/styled/details/stylesDetails";
import { wsStatusMessage } from "../_middleware/middleware";
import {
  endsWithAny,
  genericImageDownload,
  getAudioDurationFromFile,
  getMIMETypeFromFabricObject,
  isURL,
  prepareIconPayload,
} from "../_utils/common";
import {
  DEFAULT_ARTBOARD_DURATION,
  EXPORT_IMAGE_ERROR_PAYLOAD,
  StoryTypes,
  BottomPanelState,
  BottomPanelViewTypes,
} from "../_utils/constants";
import { ACCESS_DENIED } from "../_utils/routes";
import "./../_utils/simplifiedFabric";
import ArtBoard from "./ArtBoard";
import ArtBoardFooter from "./ArtBoardFooter";

import Sidebar from "../_components/home/Sidebar";
import { SidebarStyleComponent, StyledTabbar } from "./StoryDetailsPageStyles";
import { fabric } from "fabric";
import StorySidebarFooter from "../_components/story/StorySidebarFooter";
import Tabbar from "./Tabbar";
import TldrMediaTrimmingModal from "../_components/common/TldrMediaTrimmingModal";
import { FloatingButton } from "../TldrApp/TldrHomeBaseStyles";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import { TabbarWrapper } from "../_components/styled/styles";
import { black, secondaryColor } from "../_components/styled/variable";
import { TimelineProvider } from "../_utils/timeline";
import { closeBottomPanel } from "../_actions/bottomPanelActions";

export class StoryDetailsPage extends Component {
  signal = axios.CancelToken.source();

  constructor(props) {
    super(props);
    this.state = {
      pageArea: {
        height: 576,
        width: 1024,
      },

      zoomRatio: 1,
      editing: false,
      selectedItem: null, // What is the goal of this
      showComment: false,
      mediaTrimmingData: {
        show: false,
        data: null,
        maxTrim: null,
      },
      showBottomMenu: true,
      isExtendedDrawerShowing: false,
    };

    this.pageAreaRef = React.createRef();
    this.editorAreaRef = React.createRef();
    this.canvasRef = React.createRef();
    this.trackMousePointer = this.trackMousePointer.bind(this);
    this.thorttledTrackMousePointer = throttle(this.trackMousePointer, 300);
    this.timers = [];
  }

  isItemActive = (item) => {
    if (!item?.extraData?.panel) {
      return;
    }
    return this.isActivePanel(item?.extraData?.panel);
  };

  isActivePanel = (panel) => {
    const { sliderPanelType, isSliderOpen } = this.props.sidebarSlider;
    // const { sliderPanelType } = this.props.rightsidebar;
    const isActive =
      (sliderPanelType === panel && isSliderOpen === "open") ||
      (this.props.rightsidebar.sliderPanelType === panel &&
        this.props.rightsidebar.isActionPanelOpen)
        ? " active"
        : "";
    return isActive;
  };

  openPanel = (panel) => {
    if (!this.isActivePanel(panel)) {
      this.props.openSlider(panel);
    } else {
      this.props.closeSlider();
    }
  };

  sidebarHeader = "";
  sidebarFooter = (<StorySidebarFooter></StorySidebarFooter>);

  onExtendedDrawerStateChange = (state) => {
    this.setState(() => {
      return { isExtendedDrawerShowing: state };
    });
  };

  render() {
    const {
      params: { designId, org },
    } = this.props.match;
    const { pagestore, story, sidebarSlider, rightsidebar, bottomPanel } =
      this.props;
    const { loaded, pageIds } = pagestore;
    // const { pageIds } = pagestore;
    const { payload } = story;
    const { isSliderOpen } = sidebarSlider;
    const { viewState, viewType: bottomPanelViewType } = bottomPanel;
    const isBottomPanelOpen =
      viewState === BottomPanelState.OPEN ? true : false;
    const { isActionPanelOpen } = rightsidebar;

    const isEmpty = pageIds.length === 0;

    let artboardHeight = payload.image_height ? payload.image_height : 1080;
    let artboardWidth = payload.image_width ? payload.image_width : 1080;

    let artboardSize = this.getArtBoardSize(artboardHeight, artboardWidth);

    // let loaded = false;

    const { zoomRatio, mediaTrimmingData } = this.state;

    const {
      onAdd,
      onRemove,
      onSelect,
      onModified,
      onChange,
      onZoom,
      onTooltip,
      onClick,
      onContext,
      onTransaction,
      onActiveLayer,
      onTextFormatingChange,
      onTextSelectionChange,
      onVideoPlayingStatusChange,
      onCopyPaste,
      onToggleGlobalSearch,
      onSelectTopOrBottomLayer,
      onUndoRedo,
      onGroupUngroup,
      onToggleSidebarPanel,
      onClone,
      onExportAsJPEG,
      onArtboardSelectionChanged,
    } = this.canvasHandlers;

    return (
      <DndProvider backend={HTML5Backend}>
        <TimelineProvider canvasRef={this.canvasRef}>
          <>
            <StudioNavbar
              storyId={designId}
              org={org}
              canvasRef={this.canvasRef}
              onExtendedDrawerStateChange={this.onExtendedDrawerStateChange}
            />

            <StudioSidebarItemDetailSlider
              canvasRef={this.canvasRef}
              artBoardHandler={this.artBoardHandler}
            />
            <div className="tldr-editor-main">
              <div className="d-none d-sm-none d-md-block">
                <Sidebar
                  collapsed={true}
                  menu={EDITOR_SIDEBAR_MENU}
                  header={this.sidebarHeader}
                  footer={this.sidebarFooter}
                  onItemClick={this.onMenuItemClick}
                  isItemActive={this.isItemActive}
                  styles={SidebarStyleComponent}
                ></Sidebar>
              </div>

              <div className="tldr-editor" ref={this.editorAreaRef}>
                {loaded && pageIds.length > 0 ? (
                  <>
                    <div className="tldr-editor-header-toolbar">
                      <StudioEditorToolbar
                        onSelect={onSelect}
                        canvasRef={this.canvasRef}
                        artBoardHandler={this.artBoardHandler}
                      />
                    </div>
                    <div
                      onMouseMove={this.onSliderContainerMouseMove}
                      className="tldr-editor-canvas-container"
                      ref={(node) => {
                        if (!node) return;
                        this.pageAreaRef = node;
                      }}
                    >
                      <Dropable
                        onDrop={this.onDrop}
                        // ref={this.container}
                        className="tldr-editor-canvas"
                      >
                        <Dropzone
                          onDrop={(acceptedFiles) => this.upload(acceptedFiles)}
                          noClick={true}
                        >
                          {({ getRootProps, getInputProps, open }) => (
                            <div {...getRootProps()}>
                              <input {...getInputProps()} />

                              <ArtBoard
                                storyId={designId}
                                ref={(c) => {
                                  if (!c) return;
                                  this.canvasRef = c;
                                }}
                                minZoom={5}
                                maxZoom={500}
                                onModified={onModified}
                                onAdd={onAdd}
                                onActiveLayer={onActiveLayer}
                                onRemove={onRemove}
                                onSelect={onSelect}
                                onZoom={onZoom}
                                onTooltip={onTooltip}
                                onChange={onChange}
                                onClick={onClick}
                                onContext={onContext}
                                onTransaction={onTransaction}
                                onTextFormatingChange={onTextFormatingChange}
                                onTextSelectionChange={onTextSelectionChange}
                                onVideoPlayingStatusChange={
                                  onVideoPlayingStatusChange
                                }
                                onCopyPaste={onCopyPaste}
                                onToggleGlobalSearch={onToggleGlobalSearch}
                                onSelectTopOrBottomLayer={
                                  onSelectTopOrBottomLayer
                                }
                                onUndoRedo={onUndoRedo}
                                onGroupUngroup={onGroupUngroup}
                                onToggleSidebarPanel={onToggleSidebarPanel}
                                onClone={onClone}
                                onExportAsJPEG={onExportAsJPEG}
                                onArtboardSelectionChanged={
                                  onArtboardSelectionChanged
                                }
                                keyEvent={{
                                  transaction: true,
                                }}
                                objectOption={defaultOption}
                                artBoardHandler={this.artBoardHandler}
                              ></ArtBoard>
                            </div>
                          )}
                        </Dropzone>

                        {this.showRemoteMousePointers()}
                      </Dropable>
                      {this.state.showBottomMenu && (
                        <ArtBoardFooter
                          isActionPanelOpen={isActionPanelOpen}
                          isSliderOpen={isSliderOpen === "open"}
                          isBottomPanelOpen={isBottomPanelOpen}
                          canvasRef={this.canvasRef}
                          zoomRatio={zoomRatio}
                          story={story}
                          bottomPanelViewType={bottomPanelViewType}
                        />
                      )}
                    </div>

                    <StudioRightSidePanel
                      artBoardHandler={this.artBoardHandler}
                      canvasRef={this.canvasRef}
                    ></StudioRightSidePanel>
                  </>
                ) : loaded && isEmpty ? (
                  <>
                    <StyledLoaderSlide
                      onClick={this.addNewPage}
                      artboardSize={artboardSize}
                    >
                      <FontAwesomeIcon icon="plus"></FontAwesomeIcon>
                      Add artboard
                    </StyledLoaderSlide>
                  </>
                ) : !loaded ? (
                  <StyledLoaderSlide artboardSize={artboardSize}>
                    <ShowCenterSpinner loaded={loaded} />
                  </StyledLoaderSlide>
                ) : (
                  <></>
                )}
              </div>
            </div>
            <div className="d-block d-sm-block d-md-none o-hidden">
              {!this.state.showBottomMenu && (
                <TabbarWrapper>
                  <div
                    className="cross-btn-container"
                    onClick={(e) => {
                      this.setState({ showBottomMenu: true }, () => {
                        this.props.closeSlider();
                      });
                    }}
                  >
                    <div className="cross-btn">
                      <FontAwesomeIcon
                        className={
                          "floating-add-product-icon align-self-center"
                        }
                        icon={faTimes}
                        fill={secondaryColor}
                        color={secondaryColor}
                      />
                    </div>
                  </div>
                  <div className="tldr-vl" />
                  <StyledTabbar>
                    <Tabbar
                      tabs={EDITOR_BOTTOM_MENU}
                      onItemClick={this.onMenuItemClick}
                      isItemActive={this.isItemActive}
                      fitContent="true"
                      minWidth="100%"
                    ></Tabbar>
                  </StyledTabbar>
                </TabbarWrapper>
              )}
            </div>
            <div className="d-block d-sm-block d-md-none">
              {this.state.showBottomMenu &&
                !(
                  bottomPanelViewType ===
                    BottomPanelViewTypes.ARTBOARDS_GRID_VIEW ||
                  isBottomPanelOpen
                ) &&
                !isActionPanelOpen &&
                !this.state.isExtendedDrawerShowing && (
                  <FloatingButton>
                    <div
                      className="d-flex d-sm-flex d-md-none"
                      onClick={(e) => {
                        this.setState({ showBottomMenu: false });
                      }}
                    >
                      <FontAwesomeIcon
                        className={
                          "floating-add-product-icon align-self-center"
                        }
                        icon={faPlus}
                        fill={black}
                        color={black}
                      />
                    </div>
                  </FloatingButton>
                )}
            </div>

            <TldrCommandK canvasRef={this.canvasRef} />
            {mediaTrimmingData && (
              <TldrMediaTrimmingModal
                show={mediaTrimmingData.show}
                onHide={this.resetTrimmingData}
                onSubmit={this.onSubmitTrimMedia}
                data={mediaTrimmingData.data}
                mediaType={"Video"}
                maxTrimPercentage={mediaTrimmingData.maxTrim}
                defaultTrimPercentage={mediaTrimmingData.maxTrim}
              />
            )}
          </>
        </TimelineProvider>
      </DndProvider>
    );
  }

  componentDidMount() {
    const {
      params: { designId, org },
    } = this.props.match;

    if (this.props.auth.payload.selectedOrg !== Number(org)) {
      this.props.syncWorkSpaces(() => {
        const notPresent = this.props.auth.payload.orgs.every(function (
          _org,
          index
        ) {
          // Do your thing, then:
          if (_org.id === Number(org)) return false;
          else return true;
        });

        if (notPresent) {
          this.props.history.push(ACCESS_DENIED);
          return;
        }

        if (!notPresent) {
          this.props.switchTeamNow(org, this.props.auth.payload.key);
          this.setupEditor(designId);
        }
      });
    } else {
      this.setupEditor(designId);
    }
  }

  setupEditor = (designId) => {
    batch(() => {
      // TODO: call fetchBrandkit here and store in redux
      this.props.fetchBrandKits();
      this.props
        .fetchStoryDetail(designId, this.signal, { ...this.props })
        .then((story) => {
          const storyFonts = story?.story_fonts;
          this.waitForCanvasHandlerForFontLoading(
            this.canvasRef.handler,
            storyFonts
          );
          this.props.fetchStoryPages(designId, null, this.props).then(() => {
            if (this.props.pagestore?.pageIds?.length > 0) {
              const firstPageIndex = 0;
              this.props.setActivePage(
                this.props.pagestore.pageIds[firstPageIndex],
                firstPageIndex,
                false
              );
            }
          });
        });

      const token = localStorage.getItem("Token");
      if (token) {
        var dev = Format(WEBSOCKETS_ENDPOINT, designId, token);
        this.props.wsConnect(dev);
      }
    });

    // Fetch fonts
    this.props.fetchFonts(this.props, this.signal);
  };

  waitForCanvasHandlerForFontLoading = (handler, fonts) => {
    setTimeout(() => {
      if (handler) {
        this.canvasRef.handler.fontHandler.setOptions({
          clearCache: true,
        });
        this.canvasRef.handler.fontHandler.addFonts(fonts);
        return;
      }

      this.waitForCanvasHandlerForFontLoading(this.canvasRef.handler, fonts);
    }, 5);
  };

  componentDidUpdate(prevProps, prevState) {
    // Add google font
    if (!isEqual(this.props.fonts, prevProps.fonts)) {
      this.waitForCanvasHandlerForFontLoading(
        this.canvasRef.handler,
        this.props.fonts
      );
    }

    if (this.props.pagestore.loaded && this.canvasRef) {
      this.artBoardHandler = new ArtBoardHandler(this.canvasRef.handler);
    }
    if (
      this.props.pagestore.pageIds.length > 0 &&
      !isEqual(prevProps.pagestore.pageIds, this.props.pagestore.pageIds)
    ) {
      if (!this.props.activePage.id) {
        const {
          params: { pageId },
        } = this.props.match;
        let pageIndex = pageId ? pageId - 1 : 0;
        this.props.setActivePage(
          this.props.pagestore.pageIds[pageIndex],
          pageIndex,
          false
        );
      }
    }
    // When new page get added
    if (
      this.props.pagestore.pageIds?.length > prevProps.pagestore.pageIds?.length
    ) {
      const {
        params: { designId, org },
      } = this.props.match;
      this.props.fetchStoryFonts(designId, this.props, this.signal);
    }
  }

  addNewPage = () => {
    this.props.wsAddPage();
    // to close the context menu
    if (this.canvasRef.handler && this.canvasRef.handler.contextmenuHandler) {
      this.canvasRef.handler.contextmenuHandler.hide();
    }
  };

  onDrop = async (item) => {
    const itemMeta = item?.content?.meta;
    const itemId = itemMeta?.id;

    if (item.mime === "shape") {
      if (item.type === "icon") {
        let payload = await prepareIconPayload(itemMeta);
        if (payload === null) {
          return;
        }
        this.props.wsAddLayer(this.props.activePage.id, payload);
      } else {
        this.props.wsCopyFromTemplate(this.props.activePage.id, itemId);
      }
    } else if (item.mime === "story_music") {
      this.addStoryMusic(item);
    } else if (item.mime === "video") {
      const { story: { payload: { story_type } = {} } = {} } = this.props;
      const pageDuration = this.getActivePageDuration();
      const videoDuration = item.content.meta?.duration;
      if (
        story_type === StoryTypes.ANIMATED &&
        pageDuration &&
        videoDuration &&
        pageDuration < videoDuration
      ) {
        const maxTrimPercentage = (pageDuration / videoDuration) * 100;
        this.setState({
          mediaTrimmingData: {
            show: true,
            data: item,
            maxTrim: maxTrimPercentage,
          },
        });
      } else {
        this.addToArtBoard(item);
      }
    } else if (item.content) {
      this.addToArtBoard(item);
    } else {
      this.props.wsCopyFromTemplate(this.props.activePage.id, item);
    }
  };

  addStoryMusic = (data) => {
    const { story } = this.props;

    const payload = {
      ...data,
      action: "add",
    };
    batch(() => {
      this.props.wsUpdateStory({ ...story?.payload?.payload, music: payload });
      this.props.closeSlider(); // close slider once music added
      this.props.updateStoryMusic(payload);
    });
  };

  addToArtBoard = async (item) => {
    let updatedData = item;
    if (item?.payload?.app_id === ImageAppSources.GOOGLE_DRIVE) {
      try {
        updatedData = await genericImageDownload(
          item,
          this.signal.token,
          (timer) => {
            this.timers.push(timer);
          },
          this.props
        );
      } catch (e) {
        this.props.showToast({
          message: "Something went wrong while downloading the image",
          heading: "Something went wrong",
          type: "error",
        });
      }
    }
    this.props.wsAddLayer(this.props.activePage.id, updatedData);
  };

  upload = (acceptedFiles) => {
    // @Akshay restrict file upload to only 1 and don't show open dialog
    if (acceptedFiles.length > 0) {
      this.props.setCounter(acceptedFiles.length);
    }
    acceptedFiles.forEach((file) => {
      if (file.type.includes("image")) {
        this.props.uploadImageAndAddLayer(file, { ...this.props }, this.signal);
      } else {
        this.props.uploadFile(file, { ...this.props }, this.signal);
      }
    });
  };

  canvasHandlers = {
    onUpdate: (target, objectPayload, extraMessage = {}) => {
      const { left, top } = this.canvasRef.handler.workarea;
      let payload = Object.assign({}, objectPayload);

      payload["left"] -= left;
      payload["top"] -= top;
      payload["id"] = target.id;
      payload.src = target.src;

      const lastUpdatedTimeStamp = Date.now();

      payload["lastUpdated"] = lastUpdatedTimeStamp;
      target.lastUpdated = lastUpdatedTimeStamp;

      var message = {
        layer: target.id,
        payload: payload,
        ...extraMessage,
      };

      this.props.wsUpdateLayer(message);
    },
    onZoom: (zoom) => {
      this.setState({
        zoomRatio: zoom,
      });
    },
    onTextSelectionChange: (target, style) => {
      this.props.setElementFormat(style);
    },
    onActiveLayer: (target) => {
      // When crop is enable and user click anywhere else then cancel the crop and discard current selection
      if (
        target &&
        target.id !== "cropRect" &&
        this.canvasRef.handler.interactionMode === CROP_INTERACTION
      ) {
        if (!this.canvasRef.handler.clipHandler.clipRect) {
          this.canvasRef.handler.cropHandler.cancel(true);
        } else {
          this.canvasRef.handler.clipHandler.cancel(true);
        }
        this.canvasRef.handler.canvas.discardActiveObject();
        this.props.setCrop(false);
      }
      if (!target) {
        // user clicks outside area
        batch(() => {
          this.props.setActiveLayer(null, null, null, null);
          this.props.setActivePage(
            this.props.activePage.id,
            this.props.activePage.pageIndex,
            true
          );
          this.props.closeBottomPanel();
        });
      } else if (target.id === "cropRect") {
        // Do nothing
      } else if (target.id === "workarea") {
        // user clicks on the artboard area
        this.props.setActivePage(
          this.props.activePage.id,
          this.props.activePage.pageIndex,
          true
        );
      } else if (target.selectable) {
        // user clicks on the node
        let objectPayload = target.toJSON(
          this.canvasRef.handler.propertiesToInclude
        );
        if (
          target instanceof fabric.Textbox ||
          target instanceof fabric.IText
        ) {
          target.setSelectionStart(0);
          target.setSelectionEnd(0);
          objectPayload =
            this.canvasRef.handler.textHandler.getStyle(objectPayload);
        }
        const mime = getMIMETypeFromFabricObject(objectPayload.type);
        this.props.setActiveLayer(target.id, mime, objectPayload, null);
      }
    },
    onAdd: (target) => {
      const { editing } = this.state;

      this.forceUpdate();
      if (!editing) {
        this.changeEditing(true);
      }
      if (target.id === "cropRect") {
        return;
      }
      if (target.type === ACTIVE_SELECTION || target.id === "addText") {
        this.canvasHandlers.onSelect(null);
        return;
      }

      this.canvasHandlers.onUpdate(
        target,
        target.toJSON(
          this.canvasRef.handler.propertiesToInclude,
          this.canvasRef.handler.propertiesToExclude
        )
      );
    },
    onSelect: (target) => {
      const { selectedItem } = this.state;
      if (target) {
        if (
          target.id &&
          target.id !== "workarea" &&
          target.type !== ACTIVE_SELECTION
        ) {
          if (selectedItem && target.id === selectedItem.id) {
            return;
          }
          this.props.setActiveLayer(null, null, null, null);

          if (target && target.animation) {
            this.canvasRef.handler.animationHandler.stop(
              target.id,
              target.animation,
              true,
              false
            );
          }

          this.stopPlayingAllVideo();

          this.setState({
            selectedItem: target,
          });

          this.canvasHandlers.onActiveLayer(target);
          this.props.closeSlider();
          return;
        } else if (
          target.type === ACTIVE_SELECTION ||
          target.type === "group"
        ) {
          const selectedIds = [];
          target._objects.forEach((objectInGroup) => {
            selectedIds.push(objectInGroup.id);
          });
          batch(() => {
            this.props.setClonedItems(null);
            this.props.setGroupSelection(
              target.type === ACTIVE_SELECTION ? "selection" : target.type,
              selectedIds
            );
            this.canvasHandlers.onActiveLayer(null);
          });

          return;
        }
      }

      this.setState({
        selectedItem: null,
      });
      batch(() => {
        this.props.setGroupSelection(null, null);
        this.canvasHandlers.onActiveLayer(null);
      });
    },
    onRemove: (target) => {
      const { activePage } = this.props;
      const { editing } = this.state;
      if (!editing) {
        this.changeEditing(true);
      }
      if (target?.type === ACTIVE_SELECTION) {
        const selectedIds = [];
        target._objects.forEach((objectInGroup) => {
          selectedIds.push(objectInGroup.id);
        });
        this.props.wsDeleteLayers(selectedIds, activePage.id);
      } else if (!target && activePage.isSelected) {
        this.props.wsDeletePage(activePage.id);
      } else {
        this.canvasHandlers.onActiveLayer(null);
        this.props.wsDeleteLayers([target?.id], activePage.id);
      }
    },
    onModified: debounce((target, message) => {
      if (target.id === "cropRect") {
        return;
      }
      const { activePage } = this.props;
      const { editing } = this.state;
      this.forceUpdate();
      if (!editing) {
        this.changeEditing(true);
      }
      if (target.id === "workarea") {
        const { left, top } = this.canvasRef.handler.workarea;
        const objectPayload = target.toJSON(
          this.canvasRef.handler.propertiesToInclude
        );
        objectPayload.src = target.src;
        objectPayload["left"] -= left;
        objectPayload["top"] -= top;
        let message = {
          page: activePage.id,
          payload: objectPayload,
        };
        this.props.wsUpdatePage(message);
        return;
      }

      if (target.type === "activeSelection") {
        this.props.wsUpdateLayers(message, this.props.activePage.id);
      } else {
        if (target.selectable) {
          const objectPayload = target.toJSON(
            this.canvasRef.handler.propertiesToInclude
          );
          this.props.setElementFormat(objectPayload);
        } else {
          target.selectable = false;
        }

        let objectPayload = target.toJSON(
          this.canvasRef.handler.propertiesToInclude,
          this.canvasRef.handler.propertiesToExclude
        );
        this.canvasHandlers.onUpdate(target, objectPayload, message);
      }
    }, 300),
    onChange: (selectedItem, changedValues, allValues) => {
      const { editing } = this.state;
      if (!editing) {
        this.changeEditing(true);
      }
      const changedKey = Object.keys(changedValues)[0];
      const changedValue = changedValues[changedKey];

      if (changedKey === "width" || changedKey === "height") {
        this.canvasRef.handler.scaleToResize(allValues.width, allValues.height);
        return;
      }
      if (changedKey === "angle") {
        this.canvasRef.handler.rotate(allValues.angle);
        return;
      }
      if (changedKey === "locked") {
        this.canvasRef.handler.setObject({
          lockMovementX: changedValue,
          lockMovementY: changedValue,
          hasControls: !changedValue,
          hoverCursor: changedValue ? "pointer" : "move",
          editable: !changedValue,
          locked: changedValue,
        });
        return;
      }
      if (
        changedKey === "file" ||
        changedKey === "src" ||
        changedKey === "code"
      ) {
        if (selectedItem.type === "image") {
          this.canvasRef.handler.setImageById(selectedItem.id, changedValue);
        } else if (selectedItem.superType === "element") {
          this.canvasRef.handler.elementHandler.setById(
            selectedItem.id,
            changedValue
          );
        }
        return;
      }
      if (changedKey === "link") {
        const link = Object.assign({}, defaultOption.link, allValues.link);
        this.canvasRef.handler.set(changedKey, link);
        return;
      }
      if (changedKey === "tooltip") {
        const tooltip = Object.assign(
          {},
          defaultOption.tooltip,
          allValues.tooltip
        );
        this.canvasRef.handler.set(changedKey, tooltip);
        return;
      }
      if (changedKey === "animation") {
        const animation = Object.assign(
          {},
          defaultOption.animation,
          allValues.animation
        );
        this.canvasRef.handler.set(changedKey, animation);
        return;
      }
      if (changedKey === "icon") {
        const { unicode, styles } = changedValue[Object.keys(changedValue)[0]];
        const uni = parseInt(unicode, 16);
        if (styles[0] === "brands") {
          this.canvasRef.handler.set("fontFamily", "Font Awesome 5 Brands");
        } else if (styles[0] === "regular") {
          this.canvasRef.handler.set("fontFamily", "Font Awesome 5 Regular");
        } else {
          this.canvasRef.handler.set("fontFamily", "Font Awesome 5 Free");
        }
        this.canvasRef.handler.set("text", String.fromCodePoint(uni));
        this.canvasRef.handler.set("icon", changedValue);
        return;
      }
      if (changedKey === "shadow") {
        if (allValues.shadow.enabled) {
          if ("blur" in allValues.shadow) {
            this.canvasRef.handler.setShadow(allValues.shadow);
          } else {
            this.canvasRef.handler.setShadow({
              enabled: true,
              blur: 15,
              offsetX: 10,
              offsetY: 10,
            });
          }
        } else {
          this.canvasRef.handler.setShadow(null);
        }
        return;
      }
      if (changedKey === "fontWeight") {
        this.canvasRef.handler.set(
          changedKey,
          changedValue ? "bold" : "normal"
        );
        return;
      }
      if (changedKey === "fontStyle") {
        this.canvasRef.handler.set(
          changedKey,
          changedValue ? "italic" : "normal"
        );
        return;
      }
      if (changedKey === "textAlign") {
        this.canvasRef.handler.set(changedKey, Object.keys(changedValue)[0]);
        return;
      }
      if (changedKey === "trigger") {
        const trigger = Object.assign(
          {},
          defaultOption.trigger,
          allValues.trigger
        );
        this.canvasRef.handler.set(changedKey, trigger);
        return;
      }
    },
    onChangeWokarea: (changedKey, changedValue, allValues) => {
      if (changedKey === "layout") {
        this.canvasRef.handler.workareaHandler.setLayout(changedValue);
        return;
      }
      if (changedKey === "file" || changedKey === "src") {
        this.canvasRef.handler.workareaHandler.setImage(changedValue);
        return;
      }
      if (changedKey === "width" || changedKey === "height") {
        this.canvasRef.handler.originScaleToResize(
          this.canvasRef.handler.workarea,
          allValues.width,
          allValues.height
        );
        this.canvasRef.canvas.centerObject(this.canvasRef.handler.workarea);
        return;
      }
      this.canvasRef.handler.workarea.set(changedKey, changedValue);
      this.canvasRef.canvas.requestRenderAll();
    },
    onClick: (canvas, target) => {
      const { link } = target;
      if (link.state === "current") {
        document.location.href = link.url;
        return;
      }
      window.open(link.url);
    },
    onContext: (ref, event, target) => {
      return (
        <TldrContextMenu
          target={target}
          canvasRef={this.canvasRef}
          parentProps={this.props}
          signal={this.signal}
        ></TldrContextMenu>
      );
    },
    onTransaction: (transaction) => {
      this.forceUpdate();
    },
    onTextFormatingChange: debounce((target, message) => {
      const { editing } = this.state;
      this.forceUpdate();
      if (!editing) {
        this.changeEditing(true);
      }
      let objectPayload = target.toJSON(
        this.canvasRef.handler.propertiesToInclude
      );
      this.props.setElementFormat(objectPayload);
      this.canvasHandlers.onUpdate(target, objectPayload, message);
    }, 500),
    onVideoPlayingStatusChange: (isPlaying, target) => {
      this.props.setVideoPlayingStatus(isPlaying);
    },
    onCopyPaste: (method, acceptedFiles, isInternalElementCopied) => {
      const { activePage, activeElement, activeSelection } = this.props.editor;

      switch (method) {
        case "copy":
          if (activeSelection.mime === "selection") {
            // clone activeSelection
            this.canvasRef.handler.copyToClipboard(
              activeSelection.selectedElements
            );
            this.props.showToast({
              message: "Elements copied successfully. To paste it, use Ctrl+V.",
              heading: "Success",
              type: "success",
            });
          } else if (activePage.isSelected) {
            return;
          } else {
            // Clone selected layer
            this.canvasRef.handler.copyToClipboard(activeElement.id);
            this.props.showToast({
              message: "Element copied successfully. To paste it, use Ctrl+V.",
              heading: "Success",
              type: "success",
            });
          }
          break;
        case "paste":
          if (activePage.id && acceptedFiles && isInternalElementCopied) {
            const copiedLayerIds = acceptedFiles.split(",");
            this.props.wsCloneLayers(copiedLayerIds, activePage.id);
          } else if (
            acceptedFiles &&
            typeof acceptedFiles === "object" &&
            !isInternalElementCopied
          ) {
            this.upload(acceptedFiles);
          } else if (
            acceptedFiles &&
            typeof acceptedFiles === "string" &&
            !isInternalElementCopied
          ) {
            if (!isURL(acceptedFiles)) {
              return;
            } else if (
              isURL(acceptedFiles) &&
              !endsWithAny(PASTED_URL_SUFFIXES, acceptedFiles)
            ) {
              this.props.showToast({
                message: "This file format is not supported.",
                heading: "Invalid URL",
                type: "error",
              });
              return;
            } else {
              if (endsWithAny(IMAGE_URL_SUFFIXES, acceptedFiles)) {
                const item = {
                  mime: "image",
                  payload: {
                    name: "New Image",
                    src: acceptedFiles,
                    type: "image",
                    identifier: acceptedFiles,
                    app_id: ImageAppSources.COPY_PASTE,
                  },
                  content: {
                    url: acceptedFiles,
                    meta: {},
                  },
                  page: activePage.id,
                };
                this.addToArtBoard(item);
              } else if (endsWithAny(MUSIC_URL_SUFFIXES, acceptedFiles)) {
                const { story } = this.props;

                const data = { ...defaultMusicPayload };

                const payload = {
                  ...data,
                  title: "New Music",
                  src: acceptedFiles,
                  action: "add",
                };

                getAudioDurationFromFile(acceptedFiles).then((duration) => {
                  payload.duration = duration;
                  payload.source = "custom";
                  payload.source_url = acceptedFiles;

                  batch(() => {
                    this.props.wsUpdateStory({
                      ...story?.payload?.payload,
                      music: payload,
                    });
                    this.props.closeSlider(); // close slider once music added
                    this.props.updateStoryMusic(payload);
                  });
                });
              }
            }
          }
          break;
        default:
          return;
      }
    },
    onToggleGlobalSearch: () => {
      const { isSearchShowing } = this.props;
      const showCommandKContent = isSearchShowing === "open" ? true : false;
      if (showCommandKContent) {
        this.props.hideCommandKSearch();
      } else {
        this.props.showCommandKSearch();
      }
    },
    onSelectTopOrBottomLayer: (order) => {
      let currentPageLayers = this.canvasRef.handler.getObjects();
      let layerId;

      if (order === "top") {
        layerId = currentPageLayers[currentPageLayers.length - 1].id;
      } else if (order === "bottom") {
        layerId = currentPageLayers[0].id;
      }
      this.canvasRef.handler.searchAndSelect(layerId);
    },
    onUndoRedo: (action) => {
      switch (action) {
        case "undo":
          this.props.wsUndo();
          break;
        case "redo":
          this.props.wsRedo();
          break;
        default:
          return;
      }
    },
    onGroupUngroup: (action, group, updatedLayers) => {
      const { activePage, activeSelection } = this.props.editor;
      switch (action) {
        case GROUP:
          batch(() => {
            this.props.setGroupSelection(null, null);
            this.props.wsGroup(
              activePage.id,
              updatedLayers,
              activeSelection.selectedElements
            );
            this.props.setActiveLayer(
              group,
              getMIMETypeFromFabricObject(updatedLayers.type),
              null,
              null
            );
          });
          break;
        case UNGROUP:
          batch(() => {
            this.props.setGroupSelection(null, null);
            this.props.wsUnGroup(group, updatedLayers);
            this.props.setActiveLayer(null, null, null, null);
          });
          break;
        default:
          return;
      }
    },
    onToggleSidebarPanel: (panel) => {
      if (!panel) {
        this.props.openAdvancedSettings(
          KEYBOARD_SHORTCUTS_PANEL,
          ADVANCED_EDITOR_EDIT
        );
      } else {
        const isActivePanel = (panel) => {
          const { sliderPanelType, isSliderOpen } = this.props.sidebarSlider;
          const isActive =
            sliderPanelType === panel && isSliderOpen === "open"
              ? " active"
              : "";
          return isActive;
        };

        if (!isActivePanel(panel)) {
          this.props.openSlider(panel);
        } else {
          this.props.closeSlider();
        }
      }
    },
    onClone: () => {
      const { activePage, activeElement, activeSelection } = this.props.editor;

      if (activeSelection.mime === "selection") {
        // close selected layer
        this.props.wsCloneLayers(
          activeSelection.selectedElements,
          activePage.id
        );
      } else if (activePage.isSelected) {
        // Clone selected page
        this.props.wsClonePage(activePage.id);
      } else {
        // Clone selected/active layer
        this.props.wsCloneLayers([activeElement.id], activePage.id);
      }
    },
    onExportAsJPEG: () => {
      const { story } = this.props;

      const dataURL = this.canvasRef.handler.getArtBoardAsDataURL({
        format: "jpeg",
        quality: 1,
        multiplier: 1,
        name: `${story.payload.title}`,
      });

      if (!dataURL) {
        this.props.showToast(EXPORT_IMAGE_ERROR_PAYLOAD);
        return;
      }

      this.canvasRef.handler.saveDataURLToFile(dataURL, {
        format: "jpeg",
        name: `${story.payload.title}`,
      });
    },
    onArtboardSelectionChanged: (position) => {
      const { activePage, pagestore } = this.props;
      let currentArtBoardId = activePage.id;
      let currentArtBoardIndex = findIndex(pagestore.pageIds, (id) => {
        return id === currentArtBoardId;
      });
      let pageIndex = findIndex(pagestore.pageIds, (pageId) => {
        return pageId === currentArtBoardId;
      });

      switch (position) {
        case "prev":
          if (pageIndex === 0) {
            return;
          }

          if (currentArtBoardIndex > -1) {
            this.props.setActivePage(
              pagestore.pageIds[currentArtBoardIndex - 1],
              currentArtBoardIndex - 1,
              true
            );
          }
          break;
        case "next":
          let totalArtBoard = pagestore.pageIds.length;
          if (pageIndex + 1 === totalArtBoard) {
            return;
          }
          if (currentArtBoardIndex < pagestore.pageIds.length) {
            this.props.setActivePage(
              pagestore.pageIds[currentArtBoardIndex + 1],
              currentArtBoardIndex + 1,
              true
            );
          }
          break;
        default:
          return;
      }
    },
  };

  stopPlayingAllVideo = () => {
    let allVideosOnCanvas = this.canvasRef.handler.objects.filter(
      (object) => object.type === "video"
    );
    allVideosOnCanvas.forEach((videoObj, index) => {
      this.canvasRef.handler.stopRequestAnimFrame();
      videoObj.stop();
    });
    this.props.setVideoPlayingStatus(false);
  };

  changeEditing = (editing) => {
    this.setState({
      editing,
    });
  };

  componentWillUnmount() {
    this.props.wsDisconnect();
    this.signal.cancel("The user aborted a request.");
    this.timers.forEach((timer) => {
      clearInterval(timer);
    });
  }

  onSliderContainerMouseMove = (e) => {
    e.persist();
    // this.thorttledTrackMousePointer(e);
  };

  trackMousePointer = (e) => {
    let pageAreaOffset = this.pageAreaRef.getBoundingClientRect();

    let pointer = {
      x: Number.parseFloat(
        ((e.nativeEvent.clientX - pageAreaOffset.left) / pageAreaOffset.width) *
          100
      ).toFixed(2),
      y: Number.parseFloat(
        ((e.nativeEvent.clientY - pageAreaOffset.top) / pageAreaOffset.height) *
          100
      ).toFixed(2),
    };

    this.props.wsBroadcast({
      type: REMOTE_COLLOBORATION_BROADCAST_MOUSE_POINTER,
      data: {
        pointer: pointer,
        user: this.props.auth.payload.user,
      },
    });
  };

  showRemoteMousePointers = () => {
    let users = this.props.mousepointerstore.users;
    let mousePointers = [];
    for (let key in users) {
      let pointerPosition = users[key].pointer;

      if (pointerPosition) {
        mousePointers.push(
          <StyledPointer
            color={this.getColor(users[key].user.pk)}
            top={pointerPosition.y}
            left={pointerPosition.x}
          >
            <TldrPointer></TldrPointer>
            <div>
              <StyledUserLabel>
                {`${users[key].user.first_name} ${users[key].user.last_name}`}
              </StyledUserLabel>
            </div>
          </StyledPointer>
        );
      }
    }
    return mousePointers;
  };

  getColor = (pk) => {
    const usersOnline = this.props.session.users;
    let color = "";

    usersOnline.forEach((user) => {
      if (user.pk === pk) {
        color += user.colorApplied;
      }
    });
    return color;
  };

  getArtBoardSize = (artboardHeight, artboardWidth) => {
    let editorAreaHeight = this.editorAreaRef.current
      ? this.editorAreaRef.current.clientHeight
      : 576;
    let editorAreaWidth = this.editorAreaRef.current
      ? this.editorAreaRef.current.clientWidth
      : 1024;
    let artBoardAspectRatio = artboardWidth / artboardHeight;

    let artBoardPreLoaderHeightPercentage = 60;
    let artBoardPreLoaderWidth =
      (artBoardAspectRatio *
        editorAreaHeight *
        artBoardPreLoaderHeightPercentage) /
      100;

    let artBoardPreLoaderWidthPercentage =
      (100 * artBoardPreLoaderWidth) / editorAreaWidth;

    let artboardPreLoaderSize = {
      heightPercentage: artBoardPreLoaderHeightPercentage,
      widthPercentage: artBoardPreLoaderWidthPercentage,
    };

    return artboardPreLoaderSize;
  };

  onMenuItemClick = (item) => {
    if (!item?.extraData?.panel) {
      return;
    }
    this.openPanel(item?.extraData?.panel);
  };

  getActivePageDuration = () => {
    const {
      editor: { activePage: { id } = {} },
      pagestore: { pages = {} } = {},
    } = this.props;
    const page = pages[id];
    if (page) {
      return page?.payload?.animation?.duration ?? DEFAULT_ARTBOARD_DURATION;
    }
    return DEFAULT_ARTBOARD_DURATION;
  };

  resetTrimmingData = () => {
    this.setState({
      mediaTrimmingData: {
        show: false,
        data: null,
        maxTrim: null,
      },
    });
  };

  onSubmitTrimMedia = (startTime, endTime) => {
    const {
      mediaTrimmingData: { data },
    } = this.state;
    const updatedVideoData = {
      ...data,
      payload: {
        ...data.payload,
        startTime: startTime,
        endTime: endTime,
      },
    };
    this.resetTrimmingData();
    this.addToArtBoard(updatedVideoData);
  };
}

StoryDetailsPage.propTypes = {
  editor: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  fonts: state.app.fonts,
  mousepointerstore: state.mousepointerstore,
  auth: state.auth,
  pagestore: state.pagestore,
  layerstore: state.layerstore,
  session: state.session,
  activePage: state.editor.activePage,
  editor: state.editor,
  story: state.story,
  sidebarSlider: state.sidebarSlider,
  isSearchShowing: state.commandK.isSearchShowing,
  actions: state.actions,
  rightsidebar: state.rightsidebar,
  bottomPanel: state.bottomPanel,
});

const mapDispatchToProps = (dispatch) => ({
  setActiveLayer: (elementId, elementType, elementFormat, elementParentId) =>
    dispatch(
      setActiveLayer(elementId, elementType, elementFormat, elementParentId)
    ),
  fetchStoryPages: (storyId, pageId, props) =>
    dispatch(fetchStoryPages(storyId, pageId, props)),
  fetchStoryDetail: (storyId, cancelToken, props) =>
    dispatch(fetchStoryDetail(storyId, cancelToken, props)),
  wsConnect: (url) => dispatch(wsConnect(url)),
  wsDisconnect: () => dispatch(wsDisconnect()),
  wsBroadcast: (payload) => dispatch(wsBroadcast(payload)),
  fetchFonts: (props, cancelToken) => dispatch(fetchFonts(props, cancelToken)),
  fetchStoryFonts: (storyId, cancelToken, props) =>
    dispatch(fetchStoryFonts(storyId, cancelToken, props)),
  wsAddLayer: (pageId, message) => dispatch(wsAddLayer(pageId, message)),
  wsDeleteLayers: (layerIds, pageId) =>
    dispatch(wsDeleteLayers(layerIds, pageId)),
  wsUpdateLayers: (layers, pageId) => dispatch(wsUpdateLayers(layers, pageId)),
  setActivePage: (pageId, pageIndex, isSelected) =>
    dispatch(setActivePage(pageId, pageIndex, isSelected)),
  switchTeamNow: (orgId, key) => dispatch(switchTeamNow(orgId, key)),
  wsUpdateLayer: (payload) => dispatch(wsUpdateLayer(payload)),
  setElementFormat: (format) => dispatch(setElementFormat(format)),
  closeSlider: () => dispatch(closeSlider()),
  wsUpdatePage: (payload) => dispatch(wsUpdatePage(payload)),
  setGroupSelection: (objectType, selectedIds) =>
    dispatch(setGroupSelection(objectType, selectedIds)),
  wsAddPage: () => dispatch(wsAddPage()),
  wsStatusMessage: (message) => dispatch(wsStatusMessage(message)),
  setClonedItems: (ids) => dispatch(setClonedItems(ids)),
  uploadImageAndAddLayer: (file, props, signalToken) =>
    dispatch(uploadImageAndAddLayer(file, props, signalToken)),
  uploadFile: (file, props, signalToken) =>
    dispatch(uploadFile(file, props, signalToken)),
  checkAssetStatus: (assetId, props, signalToken) =>
    dispatch(checkAssetStatus(assetId, props, signalToken)),
  showToast: (payload) => dispatch(showToast(payload)),
  openSlider: (sliderPanelType) => dispatch(openSlider(sliderPanelType)),
  wsMoveLayer: (action, payload) => dispatch(wsMoveLayer(action, payload)),
  wsCopyFromTemplate: (pageId, templateId) =>
    dispatch(wsCopyFromTemplate(pageId, templateId)),
  setCrop: (isEnable) => dispatch(setCrop(isEnable)),
  closeBottomPanel: () => dispatch(closeBottomPanel()),
  setVideoPlayingStatus: (isPlaying) =>
    dispatch(setVideoPlayingStatus(isPlaying)),
  setCounter: (counter) => dispatch(setCounter(counter)),
  fetchBrandKits: () => dispatch(fetchBrandKits()),
  wsDeletePage: (pageId) => dispatch(wsDeletePage(pageId)),
  showCommandKSearch: () => dispatch(showCommandKSearch()),
  hideCommandKSearch: () => dispatch(hideCommandKSearch()),
  wsUndo: () => dispatch(wsUndo()),
  wsRedo: () => dispatch(wsRedo()),
  wsGroup: (pageId, group, layers) => dispatch(wsGroup(pageId, group, layers)),
  wsUnGroup: (group, layerId) => dispatch(wsUnGroup(group, layerId)),
  wsCloneLayers: (layerIds, pageId) =>
    dispatch(wsCloneLayers(layerIds, pageId)),
  wsClonePage: (pageId) => dispatch(wsClonePage(pageId)),
  syncWorkSpaces: (callback) => dispatch(syncWorkSpaces(callback)),
  openAdvancedSettings: (panel, selectedTab) =>
    dispatch(openAdvancedSettings(panel, selectedTab)),

  wsUpdateStory: (payload) => dispatch(wsUpdateStory(payload)),
  updateStoryMusic: (musicData) => dispatch(updateStoryMusic(musicData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(StoryDetailsPage);
