import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import PropTypes from "prop-types";
import React, { Component } from "react";
import {
  Nav,
  Navbar,
  OverlayTrigger,
  Spinner,
  Tooltip,
  Modal,
} from "react-bootstrap";
import { batch, connect } from "react-redux";
import { withRouter } from "react-router-dom";
import WhoIsOnline from "../../TldrPreview/WhoIsOnline";
import { showCommandKSearch } from "../../_actions/commandKActions";
import { backToDashboard, redirect } from "../../_actions/commonAction";
import {
  captureAndUpdateCover,
  updateStory,
} from "../../_actions/storiesActions";
import { showToast } from "../../_actions/toastActions";
import {
  wsRedo,
  wsSaveAsTemplate,
  wsUndo,
} from "../../_actions/webSocketAction";
import { closeSlider } from "../../_actions/sidebarSliderActions";
import { analyticsTrackEvent, dataURItoBlob } from "../../_utils/common";
import { PREVIEW, PROJECTS } from "../../_utils/routes";
import TldrCommentDropdown from "../comment/TldrCommentDropdown";
import { BrandLogo } from "../common/statelessView";
import StoryNameDropDown from "../common/StoryNameDropDown";
import TldrNavDropdown from "../common/TldrNavDropdown";
import TldrShare from "../common/TldrShare";
import {
  StyledCommandKTooltipContainer,
  StyledNavbar,
  StyledNavbarButton,
  StyledRedoNavbarButton,
  StyledUndoNavbarButton,
  StyledContextNavbarButton,
  StyledStoryNameSubLabel,
  StyledStoryNameInput,
  StyledStoryNameSubBlock,
  StyledDrawer,
  BottomDrawerDivider,
  StyledDrawerButton,
  StyledBackNavbarButton,
} from "../styled/styles";
import TLDRDownloadOptionsDropDown from "./downloadArtboards/TLDRDownloadOptionsDropDown";
import { EditProjectName } from "../common/statelessView";
import Drawer from "react-bottom-drawer";
import { faPen } from "@fortawesome/free-solid-svg-icons";
import { grey, lightInactive } from "../styled/variable";
const format = require("string-format");

export class StudioNavBar extends Component {
  signal = axios.CancelToken.source();

  constructor(props) {
    super(props);

    this.handleFocus = this.handleFocus.bind(this);
    this.handleFocusOut = this.handleFocusOut.bind(this);
    this.state = {
      saving: false,
      showConfirmation: false,
      isPresenting: false,
      showRenameDialog: false,
      visible: false,
      showDownloadDropdown: false,
    };
  }

  componentWillUnmount() {
    this.signal.cancel("The user aborted a request.");
  }

  handleFocus(text) {}

  handleFocusOut(text) {
    const storyId = this.props.story.payload.id;
    if (text) {
      this.props.updateStory(storyId, { title: text }, this.signal, {
        ...this.props,
      });
    }
  }

  openRenameDialog = () => {
    this.setState({
      showRenameDialog: true,
    });
  };

  componentDidMount() {
    // Do nothing
  }

  undo = () => {
    this.props.wsUndo();
  };

  redo = () => {
    this.props.wsRedo();
  };

  preview = () => {
    this.setState({
      isPresenting: true,
    });
    analyticsTrackEvent("previewDesign");
    const previewUrl = format(
      PREVIEW,
      this.props.auth.payload.selectedOrg,
      this.props.story.payload.id,
      encodeURIComponent(this.props.story.payload.title)
    );
    const win = window.open(encodeURI(previewUrl), "_blank");
    win.focus();
  };

  saveOnBack = () => {
    const { pageIds } = this.props.pagestore;
    const storyId = this.props.story.payload.id;

    this.setState({
      saving: true,
    });

    if (pageIds.length > 0 && this.props.websockets.snapshot) {
      this.setStoryPageCover(storyId, pageIds[0]);
    } else {
      batch(() => {
        this.props.backToDashboard({ ...this.props });
        this.props.redirect(PROJECTS, { ...this.props });
      });
    }
  };

  render() {
    const { loaded, pageIds } = this.props.pagestore;
    const isEmpty = loaded && pageIds.length > 0;
    const { details } = this.props.websockets;
    const storyFetched = this.props.story.loaded;
    const { undo, redo } = this.props.actions;
    const { selectedOrg } = this.props.auth.payload;
    const { canvasRef } = this.props;

    return (
      <>
        <StyledNavbar
          expanded={true}
          fixed="top"
          iscompact="true"
          location="editor"
        >
          <Navbar.Brand
            className="nav-brand-icon story-brand-icon"
            onClick={(e) => {
              e.stopPropagation();
              this.saveOnBack();
            }}
          >
            <BrandLogo />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <StyledBackNavbarButton
                onClick={(e) => {
                  e.stopPropagation();
                  this.saveOnBack();
                }}
              >
                {!this.state.saving ? (
                  <FontAwesomeIcon icon="chevron-left" />
                ) : (
                  <Spinner
                    variant="warning"
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                )}
              </StyledBackNavbarButton>
              <StyledUndoNavbarButton
                disabled={!undo}
                onClick={(e) => this.undo()}
              >
                <FontAwesomeIcon icon="undo" />
              </StyledUndoNavbarButton>
              <StyledRedoNavbarButton
                disabled={!isEmpty || !redo}
                onClick={(e) => this.redo()}
                style={{ marginLeft: "-1px" }}
              >
                <FontAwesomeIcon icon="redo" />
              </StyledRedoNavbarButton>

              <div className="d-none d-sm-none d-md-block">
                {storyFetched && (
                  <StoryNameDropDown
                    props={this.props}
                    title={this.props.story.payload.title}
                    contentSize={this.props.story.contentSize}
                    last_updated={this.props.story.payload.last_updated}
                  />
                )}
              </div>

              <div className="d-none d-sm-none d-md-block">
                {storyFetched && (
                  <OverlayTrigger
                    placement="bottom"
                    overlay={
                      <Tooltip id="heart">
                        {this.props.story.payload.title}
                      </Tooltip>
                    }
                  >
                    <StyledStoryNameSubBlock>
                      <StyledStoryNameInput onClick={this.openRenameDialog}>
                        {this.props.story.payload.title}
                      </StyledStoryNameInput>
                      <StyledStoryNameSubLabel>
                        {details}
                      </StyledStoryNameSubLabel>
                    </StyledStoryNameSubBlock>
                  </OverlayTrigger>
                )}
              </div>
            </Nav>

            <div className="d-none d-sm-none d-md-block">
              <WhoIsOnline></WhoIsOnline>
            </div>
            {/* <StyledNavbarEditButton
            tldrbtn={!this.state.isPresenting ? "primary" : ""}
            onClick={this.edit}
          >
            <FontAwesomeIcon icon="pencil-alt"></FontAwesomeIcon>
          </StyledNavbarEditButton> */}
            <div className="d-none d-sm-none d-md-block">
              <TldrCommentDropdown />
            </div>
            <div className="d-none d-sm-none d-md-block">
              <OverlayTrigger
                placement="bottom"
                overlay={
                  <Tooltip id="command-k">
                    <StyledCommandKTooltipContainer>
                      <div className="tooltip-title">
                        Move fast with the lighting speed..
                      </div>
                      <div className="tooltip-subtitle">
                        To get started press
                      </div>
                      <div className="hotkeys">
                        <kbd>Ctrl</kbd> <kbd>K</kbd>
                      </div>
                    </StyledCommandKTooltipContainer>
                  </Tooltip>
                }
              >
                <StyledNavbarButton
                  onClick={this.showCommandK}
                  disabled={!isEmpty}
                >
                  <FontAwesomeIcon icon="bolt"></FontAwesomeIcon>
                </StyledNavbarButton>
              </OverlayTrigger>
            </div>
            <div className="d-none d-sm-none d-md-block">
              <div className="tldr-vl" />
            </div>
            <div className="d-none d-sm-none d-md-block">
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id="heart">Preview</Tooltip>}
              >
                <StyledNavbarButton onClick={this.preview} disabled={!isEmpty}>
                  <FontAwesomeIcon icon="eye"></FontAwesomeIcon>
                </StyledNavbarButton>
              </OverlayTrigger>
            </div>
            <div className="d-none d-sm-none d-md-block">
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id="heart">Share with others</Tooltip>}
              >
                <StyledNavbarButton
                  tldrbtn="primary"
                  disabled={!isEmpty}
                  onClick={this.share}
                >
                  <FontAwesomeIcon
                    icon="user-plus"
                    className="mr-1"
                  ></FontAwesomeIcon>
                  Share
                </StyledNavbarButton>
              </OverlayTrigger>
            </div>

            <TLDRDownloadOptionsDropDown
              disabled={!isEmpty}
              canvasRef={canvasRef}
              show={this.state.showDownloadDropdown}
            />
            <div className="d-block d-sm-block d-md-none">
              <StyledContextNavbarButton
                onClick={() => {
                  this.setState(
                    (prevState) => {
                      return { visible: !prevState.visible };
                    },
                    () => {
                      this.props.closeSlider();
                      this.props.onExtendedDrawerStateChange(
                        this.state.visible
                      );
                    }
                  );
                }}
              >
                <FontAwesomeIcon icon="ellipsis-v" />
              </StyledContextNavbarButton>
            </div>

            <div className="d-none d-sm-none d-md-block">
              <TldrNavDropdown />
            </div>
          </Navbar.Collapse>
          {this.state.showConfirmation && (
            <TldrShare
              org={selectedOrg}
              onHide={() => {
                this.setState({
                  ...this.state,
                  showConfirmation: false,
                });
              }}
            />
          )}
        </StyledNavbar>
        <Modal
          show={this.state.showRenameDialog}
          onHide={(e) => this.setState({ showRenameDialog: false })}
          backdrop="static"
          size="sm"
          centered
        >
          <EditProjectName
            props={this.props}
            handleCloseAddModal={(e) =>
              this.setState({ showRenameDialog: false })
            }
            signal={this.signal}
          ></EditProjectName>
        </Modal>

        <div className="d-block d-sm-block d-md-none">
          <StyledDrawer>
            <Drawer
              className="drawer"
              isVisible={this.state.visible}
              hideScrollbars="true"
              onClose={() => {
                this.setState(
                  (prevState) => {
                    return { visible: false };
                  },
                  () => {
                    this.props.onExtendedDrawerStateChange(false);
                  }
                );
              }}
            >
              <StyledStoryNameSubBlock>
                <StyledStoryNameInput onClick={this.openRenameDialog}>
                  {this.props.story.payload.title}
                  <FontAwesomeIcon
                    icon={faPen}
                    color={grey}
                    className="mr-1 icon"
                  ></FontAwesomeIcon>
                </StyledStoryNameInput>
                <StyledStoryNameSubLabel>{details}</StyledStoryNameSubLabel>
              </StyledStoryNameSubBlock>
              <BottomDrawerDivider></BottomDrawerDivider>
              <StyledDrawerButton
                tldrbtn="primary"
                disabled={!isEmpty}
                onClick={() => {
                  this.setState(
                    (prevState) => {
                      return { visible: false };
                    },
                    () => {
                      this.props.onExtendedDrawerStateChange(false);
                      this.share();
                    }
                  );
                }}
              >
                <FontAwesomeIcon
                  icon="user-plus"
                  color={lightInactive}
                  className="mr-1 share-mobile icon"
                ></FontAwesomeIcon>
                <span className="label">Share</span>
              </StyledDrawerButton>

              {/* <StyledDrawerButton
                tldrbtn="primary"
                disabled={!isEmpty}
                onClick={()=>{this.setState({ showDownloadDropdown: true })}}
              >
                <FontAwesomeIcon
                  icon={faDownload}
                  color={lightInactive}
                  className="mr-1 share-mobile icon"
                ></FontAwesomeIcon>
                <span className="label">Download</span>
              </StyledDrawerButton> */}

              <div
                onClick={() => {
                  this.setState(
                    (prevState) => {
                      return { visible: false };
                    },
                    () => {
                      this.props.onExtendedDrawerStateChange(false);
                    }
                  );
                }}
              >
                <TldrCommentDropdown />
              </div>

              <StyledDrawerButton
                onClick={() => {
                  this.setState(
                    (prevState) => {
                      return { visible: false };
                    },
                    () => {
                      this.props.onExtendedDrawerStateChange(false);
                      this.preview();
                    }
                  );
                }}
                disabled={!isEmpty}
              >
                <FontAwesomeIcon className="icon" icon="eye"></FontAwesomeIcon>
                <span className="label">Preview</span>
              </StyledDrawerButton>

              {/* <StyledDrawerButton onClick={this.preview} disabled={!isEmpty}>
                <FontAwesomeIcon
                  className="icon"
                  icon={faFile}
                ></FontAwesomeIcon>
                <span className="label">Save as template</span>
              </StyledDrawerButton> */}

              {/* <StyledDrawerButton onClick={this.preview} disabled={!isEmpty}>
                <FontAwesomeIcon
                  className="icon"
                  icon={faCog}
                ></FontAwesomeIcon>
                <span className="label">Settings</span>
              </StyledDrawerButton> */}
            </Drawer>
          </StyledDrawer>
        </div>
      </>
    );
  }

  setStoryPageCover = (storyId, pageId, saveAsTemplate) => {
    const { canvasRef } = this.props;
    let imageQuality = 0.2;
    let fileType = "jpeg";

    let fileName = `${pageId}_${Date.now()}.${fileType}`;

    const dataURL = canvasRef.handler.getArtBoardAsDataURL({
      format: fileType,
      quality: imageQuality,
      name: fileName,
    });

    if (!dataURL) {
      this.props.showToast({
        message: "Something went wrong. Please contact support center.",
        heading: "Failed to generate cover image",
        type: "error",
      });
      this.props.backToDashboard();
      this.props.redirect(PROJECTS, this.props);
      return;
    }

    let file = new File([dataURItoBlob(dataURL)], fileName, {
      type: "image/jpeg",
    });

    this.props.captureAndUpdateCover(
      storyId,
      file,
      saveAsTemplate,
      this.signal,
      {
        ...this.props,
      }
    );
  };

  share = () => {
    this.setState({
      showConfirmation: true,
    });
  };

  edit = () => {
    this.setState({
      isPresenting: false,
    });
  };

  showCommandK = () => {
    analyticsTrackEvent("showCommandK");
    this.props.showCommandKSearch();
  };
}

const mapStateToProps = (state) => ({
  pagestore: state.pagestore,
  websockets: state.websockets,
  story: state.story,
  editor: state.editor,
  session: state.session,
  actions: state.actions,
  auth: state.auth,
});

StudioNavBar.propTypes = {
  websockets: PropTypes.object.isRequired,
  pagestore: PropTypes.object.isRequired,
  story: PropTypes.object.isRequired,
  editor: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapDispatchToProps = (dispatch) => ({
  backToDashboard: (props) => dispatch(backToDashboard(props)),
  updateStory: (storyId, data, signal, props) =>
    dispatch(updateStory(storyId, data, signal, props)),
  captureAndUpdateCover: (
    storyId,
    file,
    saveAsTemplate,
    signal,
    props,
    templateName
  ) =>
    dispatch(
      captureAndUpdateCover(
        storyId,
        file,
        saveAsTemplate,
        signal,
        props,
        templateName
      )
    ),
  redirect: (url, props) => dispatch(redirect(url, props)),
  wsSaveAsTemplate: (pageId) => dispatch(wsSaveAsTemplate(pageId)),
  wsUndo: () => dispatch(wsUndo()),
  wsRedo: () => dispatch(wsRedo()),
  showCommandKSearch: () => dispatch(showCommandKSearch()),
  showToast: (payload) => dispatch(showToast(payload)),
  closeSlider: () => dispatch(closeSlider()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(StudioNavBar));
