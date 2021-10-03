import React, { Component } from "react";
import { faClone, faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import {
  StyledPreviewNavbar,
  StyledPreviewStoryName,
  StyledPreviewNavbarButton,
} from "../_components/styled/styles";
import { cloneStory } from "../_actions/storiesActions";
import { Navbar, OverlayTrigger, Tooltip } from "react-bootstrap";
import { BrandLogo } from "../_components/common/statelessView";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import axios from "axios";

class PreviewNavbar extends Component {
  signal = axios.CancelToken.source();

  constructor(props) {
    super(props);
    this.state = {
      isArtboardPlaying: false,
    };
  }

  cloneProject = (storyID) => {
    this.props.cloneStory(storyID, this.signal, this.props);
  };

  render() {
    const { story } = this.props;
    const { isArtboardPlaying } = this.state;
    return (
      <>
        <StyledPreviewNavbar expanded={false} fixed="top" iscompact="true">
          <Navbar.Collapse>
            <Navbar.Brand>
              <BrandLogo height={"46.33px"} width={"36.85px"} />
            </Navbar.Brand>

            <OverlayTrigger
              placement="bottom"
              overlay={<Tooltip id="heart">{story.payload.title}</Tooltip>}
            >
              <StyledPreviewStoryName>
                <span> {story.payload.title} </span>
              </StyledPreviewStoryName>
            </OverlayTrigger>
            <div style={{ display: "flex" }}>
              {!isArtboardPlaying && (
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip id="play">Play</Tooltip>}
                >
                  <StyledPreviewNavbarButton onClick={this.onClickPlay}>
                    <FontAwesomeIcon icon={faPlay} size="lg" color="white" />
                  </StyledPreviewNavbarButton>
                </OverlayTrigger>
              )}
              {isArtboardPlaying && (
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip id="stop">Stop</Tooltip>}
                >
                  <StyledPreviewNavbarButton onClick={this.onClickStop}>
                    <FontAwesomeIcon icon={faStop} size="lg" color="white" />
                  </StyledPreviewNavbarButton>
                </OverlayTrigger>
              )}
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip id="heart">Duplicate</Tooltip>}
              >
                <StyledPreviewNavbarButton
                  onClick={(e) => {
                    e.stopPropagation();
                    this.cloneProject(story.payload.id);
                  }}
                >
                  <FontAwesomeIcon icon={faClone} size="lg" color="white" />
                </StyledPreviewNavbarButton>
              </OverlayTrigger>
            </div>
          </Navbar.Collapse>
        </StyledPreviewNavbar>
      </>
    );
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.activePageId !== this.props.activePageId) {
      this.onClickStop(null);
    }
  }

  onClickPlay = (event) => {
    const { activePageId, pagestore } = this.props;
    if (!activePageId) {
      return;
    }

    let staticCanvas = document.querySelector(
      `#preview_${activePageId}`
    ).staticCanvas;
    let { staticHandler } = staticCanvas;

    const duration =
      pagestore.pages[activePageId]?.payload?.animation?.duration || 0;
    staticHandler.animationHandler.previewCurrentArtboard(duration);

    this.setState({
      ...this.state,
      isArtboardPlaying: true,
    });
  };

  onClickStop = (event) => {
    const { activePageId } = this.props;
    if (!activePageId) {
      return;
    }

    const staticCanvas = document.querySelector(
      `#preview_${activePageId}`
    )?.staticCanvas;

    if (!staticCanvas?.staticHandler) {
      return;
    }

    // Stop all
    staticCanvas.staticHandler.animationHandler.stopAll();

    this.setState({
      ...this.state,
      isArtboardPlaying: false,
    });
  };
}

PreviewNavbar.propTypes = {};

const mapStateToProps = (state) => ({
  pagestore: state.pagestore,
  sockets: state.websockets,
  activePageId: state.editor.activePage.id,
  auth: state.auth,
  actionstore: state.actionstore,
  story: state.story,
});

const mapDispatchToProps = (dispatch) => ({
  cloneStory: (storyID, signal, props) =>
    dispatch(cloneStory(storyID, signal, props)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(PreviewNavbar));
