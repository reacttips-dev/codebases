import React, { Component } from "react";
import PropTypes from "prop-types";
import { Dropdown, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  StyledDownloadOptionDropdown,
  StyledNavbarButton,
} from "../../styled/styles";
import TLDRDownloadFileType from "./TLDRDownloadFileType";
import { StyledDownloadDropDownMenu } from "../../styled/details/styleDownloadOptions";
import {
  analyticsTrackEvent,
  checkCeleryTaskStatus,
  triggerDownload,
} from "../../../_utils/common";
import { connect } from "react-redux";
import TLDRDownloadJPEGFileQuality from "./TLDRDownloadJPEGFileQuality";
import TLDRDownloadImageScale from "./TLDRDownloadImageScale";
import axios from "axios";
import { EXPORT_DESIGN, EXPORT_VIDEO } from "../../../_actions/endpoints";
import { showToast } from "../../../_actions/toastActions";
import TLDRDownloadArtBoardOptions from "./TLDRDownloadArtBoardOptions";
import { handleHTTPError } from "../../../_actions/errorHandlerActions";
import Format from "string-format";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import TLDRDownloadPNGTransparentBackground from "./TLDRDownloadPNGTransparentBackground";
import { STORY_TYPE_ANIMATED } from "../../../_utils/constants";

class TLDRDownloadOptionsDropDown extends Component {
  constructor(props) {
    super(props);
    this.initState = {
      fileType: "png",
      isDownloading: false,
      imageQuality: 100,
      imageSize: 1,
      transparentBackground: false,
      downloadingArtBoardIndex: 0,
      selectedArtBoards: [],
    };
    this.state = this.initState;
  }

  render() {
    let {
      fileType,
      selectedArtBoards,
      isDownloading,
      imageQuality,
      imageSize,
      downloadingArtBoardIndex,
    } = this.state;

    const { story, disabled, pagestore } = this.props;
    const artboardsList = this.getArtBoardOptions();
    const isAnimatedStory = story?.payload?.story_type === STORY_TYPE_ANIMATED;

    if (selectedArtBoards) {
      if (selectedArtBoards.length === 0) {
        selectedArtBoards = [artboardsList[0]];
      } else if (selectedArtBoards[0].id !== "all") {
        selectedArtBoards = selectedArtBoards.filter((selectedArtboard) => {
          return pagestore.pageIds.includes(selectedArtboard.id);
        });
        if (selectedArtBoards.length === 0) {
          selectedArtBoards = [artboardsList[0]];
        }
      }
    }

    return (
      <>
        <Dropdown disabled={disabled}>
          <Dropdown.Toggle
            variant="secondary"
            id="download-artboards"
            as={StyledDownloadOptionDropdown}
          >
            {isDownloading ? (
              <>
                <Spinner
                  variant="warning"
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                {"  "}
                {`Downloading (${downloadingArtBoardIndex}/${selectedArtBoards.length})`}
              </>
            ) : (
              <>
                <div className="d-none d-sm-none d-md-block">
                  <>
                    Export
                    <FontAwesomeIcon
                      icon="chevron-down"
                      className="ml-2"
                    ></FontAwesomeIcon>
                  </>
                </div>
                <div className="d-block d-sm-block d-md-none">
                  <FontAwesomeIcon
                    icon={faDownload}
                    className="ml-2 download-btn"
                  ></FontAwesomeIcon>
                </div>
              </>
            )}
          </Dropdown.Toggle>
          <StyledDownloadDropDownMenu show={this.props.show}>
            <Dropdown.Item
              as={TLDRDownloadFileType}
              fileType={fileType}
              onFileTypeChange={this.onFileTypeChange}
              isAnimatedStory={isAnimatedStory}
            ></Dropdown.Item>

            {(fileType === "png" || fileType === "jpeg") && (
              <Dropdown.Item
                as={TLDRDownloadImageScale}
                imageSize={imageSize}
                onImageSizeChange={this.onImageSizeChange}
                contentSize={story.contentSize}
              ></Dropdown.Item>
            )}

            {/* Transparent background check */}
            {fileType === "png" && (
              <Dropdown.Item
                as={TLDRDownloadPNGTransparentBackground}
                onTransparentBackgroundCheckBoxChange={
                  this.onTransparentBackgroundCheckBoxChange
                }
              ></Dropdown.Item>
            )}

            {/* File quality */}
            {fileType === "jpeg" && (
              <Dropdown.Item
                as={TLDRDownloadJPEGFileQuality}
                imageQuality={imageQuality}
                onImageQualityChange={this.onImageQualityChange}
              ></Dropdown.Item>
            )}
            <Dropdown.Item
              as={TLDRDownloadArtBoardOptions}
              selectedArtBoards={selectedArtBoards}
              artboardsList={artboardsList}
              onArtBoardsSelectionChange={this.onArtBoardsSelectionChange}
            ></Dropdown.Item>
            <Dropdown.Item
              as={StyledNavbarButton}
              tldrbtn="primary"
              onClick={this.download}
              style={{
                margin: "0.5rem 1.5rem",
                width: "300px",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
              unresponsive="true"
              disabled={!(selectedArtBoards?.length > 0)}
            >
              Export Now
            </Dropdown.Item>
          </StyledDownloadDropDownMenu>
        </Dropdown>
      </>
    );
  }

  onImageSizeChange = (imageSize) => {
    this.setState({
      ...this.state,
      imageSize,
    });
  };

  onFileTypeChange = (fileType) => {
    this.setState({
      ...this.state,
      fileType,
    });
  };

  onArtBoardsSelectionChange = (selectedArtBoards) => {
    this.setState({
      ...this.state,
      selectedArtBoards,
    });
  };

  onImageQualityChange = (quality) => {
    if (this.state.imageQuality === quality) {
      return;
    }

    this.setState({
      ...this.state,
      imageQuality: quality,
    });
  };

  onTransparentBackgroundCheckBoxChange = (checked) => {
    this.setState({
      ...this.state,
      transparentBackground: checked,
    });
  };

  download = (event) => {
    const { fileType } = this.state;

    this.setState(
      {
        ...this.state,
        isDownloading: true,
      },
      () => {
        if (fileType === "mp4") {
          this.startExportingVideo();
        } else {
          this.downloadArtBoards();
        }
      }
    );
    analyticsTrackEvent("download", {
      design: fileType,
    });
  };

  showFailedMessage = () => {
    this.onDownloadFinish();
    this.props.showToast({
      message:
        "Oops, something went wrong while exporting the content. Please try again later.",
      heading: "Error",
      type: "error",
    });
  };

  renderingTracker = (task_id) => {
    checkCeleryTaskStatus(task_id, () => {})
      .then((result) => {
        if (result.response.status === "SUCCESS") {
          if (result.response.info.jobId) {
            this.props.showToast({
              message: "Adding some finishing touches.",
              heading: "Just a second",
              type: "info",
            });
            this.renderingTracker(result.response.info.jobId);
          } else {
            this.onDownloadFinish();
            triggerDownload(result.response.info, "video", "mp4");
          }
        } else {
          this.showFailedMessage();
        }
      })
      .catch((error) => {
        this.onDownloadFinish();
        this.showFailedMessage();
      });
  };

  addingMusic = (task_id) => {
    this.props.showToast({
      message: "Starting to render",
      heading: "Rending in progress",
      type: "info",
    });

    checkCeleryTaskStatus(task_id, () => {})
      .then((result) => {
        this.onDownloadFinish();
        triggerDownload(result.response.info, "video", "mp4");
      })
      .catch((error) => {
        this.props.handleHTTPError(error, this.props);
      });
  };

  startExportingVideo = () => {
    const { story } = this.props;

    axios
      .post(Format(EXPORT_VIDEO, story.payload.id), { type: "video" })
      .then((response) => {
        checkCeleryTaskStatus(response.data.id, () => {})
          .then((result) => {
            if (result.response.status === "SUCCESS") {
              this.props.showToast({
                heading: "Starting to render",
                message: "Please wait, rendering in progress.",
                type: "info",
              });
              this.renderingTracker(result.response.info.jobId);
            } else {
              this.showFailedMessage();
            }
          })
          .catch((error) => {
            this.onDownloadFinish();
            this.props.handleHTTPError(error, this.props);
          });
      })
      .catch((error) => {
        this.onDownloadFinish();
        this.props.handleHTTPError(error, this.props);
      });
  };

  downloadArtBoards = () => {
    const {
      imageQuality: quality = 100,
      imageSize: multiplier = 1,
      selectedArtBoards,
    } = this.state;

    const { story } = this.props;

    let imageQuality = quality / 100;
    let artboardIds = this.props.pagestore.pageIds;

    if (selectedArtBoards?.length > 0 && selectedArtBoards[0].id !== "all") {
      artboardIds = selectedArtBoards.map(
        (selectedArtBoard) => selectedArtBoard.id
      );
    }

    axios
      .post(Format(EXPORT_DESIGN, story.payload.id), {
        format: this.state.fileType,
        quality: imageQuality,
        multiplier: multiplier,
        artboardIds: artboardIds,
        transparentBackground: this.state.transparentBackground,
      })
      .then((response) => {
        checkCeleryTaskStatus(response.data.id, () => {})
          .then((result) => {
            if (result.response.status === "SUCCESS") {
              this.props.showToast({
                heading: "Exporting..",
                message: "Please wait, exporting now.",
                type: "info",
              });
              this.renderingTracker(result.response.info.jobId);
            } else {
              this.showFailedMessage();
            }
          })
          .catch((error) => {
            this.showFailedMessage();
            this.onDownloadFinish();
            this.props.handleHTTPError(error, this.props);
          });
      })
      .catch((error) => {
        this.showFailedMessage();
        this.onDownloadFinish();
        this.props.handleHTTPError(error, this.props);
      });
  };

  onDownloadFinish = () => {
    this.setState({
      ...this.state,
      isDownloading: false,
      downloadingArtBoardIndex: 0,
    });
  };

  getArtBoardOptions = () => {
    const { pagestore } = this.props;
    let { pageIds } = pagestore;

    let artBoardList = [];
    artBoardList.push({
      label: "All Artboards",
      value: pageIds,
      id: "all",
    });

    pageIds.forEach((pageId, index) => {
      artBoardList.push({
        label: `Artboard ${index + 1}`,
        value: pageId,
        id: pageId,
      });
    });

    return artBoardList;
  };
}

TLDRDownloadOptionsDropDown.propTypes = {
  pagestore: PropTypes.object.isRequired,
  story: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  editor: state.editor,
  pagestore: state.pagestore,
  story: state.story,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  showToast: (payload) => dispatch(showToast(payload)),
  handleHTTPError: (error, props) => dispatch(handleHTTPError(error, props)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TLDRDownloadOptionsDropDown);
