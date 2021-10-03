import axios from "axios";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import dashboardArtBoardPlaceholder from "../../assets/images/dashboardArtBoardPlaceholder.png";
import { selectCard, unSelectCard } from "../../_actions/homepageCardActions";
import {
  cloneStory,
  cloneTemplate,
  deleteStory,
  updateStory,
} from "../../_actions/storiesActions";
import { convertPixelToFloat } from "../../_utils/common";
import { PREVIEW, STORY_DETAIL } from "../../_utils/routes";
import EditableLabel from "../common/EditableLabel";
import {
  StoryAction,
  TldrConfirmationModal,
  TldrProgressDialog,
} from "../common/statelessView";
import TLDRImage from "../common/TLDRImage";
import {
  PLACEHOLDER_IMAGE_SIZE,
  TAB_MY_STORIES,
  TAB_TEMPLATES,
} from "../details/constants";
import { Checkbox } from "../styled/home/statelessView";
import { StyledDesignCard } from "../styled/styles";
const format = require("string-format");

export class StoryCard extends Component {
  signal = axios.CancelToken.source();
  constructor(props) {
    super(props);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
    this.actionClickHandler = this.actionClickHandler.bind(this);
    this.onClick = this.onClick.bind(this);
    this.state = {
      isHovering: false,
      showConfirmation: false,
      inProgress: "false",
      showCloneModal: false,
      isChecked: false,
      isTitleHovering: false,
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props !== prevProps) {
      this.setState({
        isChecked: this.props.selectedCards.find(
          (item) => item === this.props.story
        ),
      });
    }
  }

  componentWillUnmount() {
    this.signal.cancel("The user aborted a request.");
  }

  handleMouseEnter() {
    this.setState({
      isHovering: true,
    });
  }

  handleMouseLeave() {
    this.setState({
      isHovering: false,
    });
  }

  preview = () => {
    const previewUrl = format(
      PREVIEW,
      this.props.story.org || this.props.story.organization,
      this.props.story.id
    );
    const win = window.open(encodeURI(previewUrl), "_blank");
    win.focus();
  };

  actionClickHandler = (action) => {
    if (action === "delete") {
      this.setState({
        showConfirmation: true,
      });
    } else if (action === "edit") {
      const editStoryUrl = format(
        STORY_DETAIL,
        this.props.story.org || this.props.story.organization,
        this.props.story.id,
        encodeURIComponent(this.props.story.title)
      );
      this.props.history.push(editStoryUrl);
    } else if (action === "clone" && this.props.tab === TAB_MY_STORIES) {
      this.setState({
        inProgress: true,
        showCloneModal: true,
      });
      this.props.cloneStory(this.props.story.id, this.signal, this.props);
    } else if (action === "clone" && this.props.tab === TAB_TEMPLATES) {
      this.setState({
        inProgress: true,
        showCloneModal: true,
      });
      this.props.cloneTemplate(this.props.story.id, this.signal, this.props);
    } else if (action === "preview") {
      this.preview();
    }
  };

  onClick = () => {
    if (this.props.tab === TAB_MY_STORIES) {
      const editStoryUrl = format(
        STORY_DETAIL,
        this.props.story.org || this.props.story.organization,
        this.props.story.id,
        encodeURIComponent(this.props.story.title)
      );
      this.props.history.push(encodeURI(editStoryUrl));
    } else {
      this.setState({
        inProgress: true,
        showCloneModal: true,
      });
      this.props.cloneTemplate(this.props.story.id, this.signal, this.props);
    }
  };

  onCardClickHandler = (isChecked) => {
    if (isChecked) {
      this.props.selectCard(this.props.story);
    } else {
      this.props.unSelectCard(this.props.story);
    }
    this.setState({ isChecked });
  };

  handleTitleMouseEnter = () => {
    this.setState({ isTitleHovering: true });
  };

  handleTitleMouseLeave = () => {
    this.setState({ isTitleHovering: false });
  };

  handleProjectNameFocus = (text) => {};

  handleProjectNameFocusOut = (text) => {
    if (text === this.props.story.title) {
      return;
    }

    this.props.updateStory(
      this.props.story.id,
      { title: text },
      this.signal,
      this.props
    );
  };

  render() {
    const {
      showConfirmation,
      inProgress,
      showCloneModal,
      isHovering,
      isChecked,
      isTitleHovering,
    } = this.state;
    const { story, template, enableCardSelection, height } = this.props;
    const {
      id,
      title,
      status,
      image,
      last_updated,
      image_height,
      image_width,
    } = story;
    const editStoryUrl = format(STORY_DETAIL, id);

    return (
      <StyledDesignCard
        varient={template}
        allowOverflow={enableCardSelection}
        cardHeight={height}
      >
        <div
          className="thumbnail"
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          onClick={this.onClick}
        >
          <div className="placeholder">
            {image ? (
              <TLDRImage
                src={image}
                alt={title}
                width={convertPixelToFloat(
                  PLACEHOLDER_IMAGE_SIZE[template]
                    ? PLACEHOLDER_IMAGE_SIZE[template].width
                    : `${image_width}px`
                )}
                height={convertPixelToFloat(
                  PLACEHOLDER_IMAGE_SIZE[template]
                    ? PLACEHOLDER_IMAGE_SIZE[template].height
                    : `${image_height}px`
                )}
              />
            ) : (
              <img src={dashboardArtBoardPlaceholder} alt=""></img>
            )}
          </div>
          {this.state.isHovering && (
            <div className="actions">
              {status === "draft" && (
                <StoryAction
                  action="edit"
                  id={id}
                  icon="pencil-alt"
                  url={editStoryUrl}
                  tooltip="Edit"
                  clickHandler={this.actionClickHandler}
                />
              )}

              <StoryAction
                action="clone"
                id={id}
                icon="copy"
                tooltip="Make a clone"
                clickHandler={this.actionClickHandler}
              />

              <StoryAction
                action="preview"
                id={id}
                icon="eye"
                tooltip="Preview"
                clickHandler={this.actionClickHandler}
              />

              {status === "draft" && (
                <StoryAction
                  action="delete"
                  id={"Delete"}
                  icon="trash"
                  url={"#"}
                  tooltip="Delete"
                  clickHandler={this.actionClickHandler}
                />
              )}
            </div>
          )}
          <div className="template">{template}</div>

          {(isHovering || isChecked) && enableCardSelection ? (
            <Checkbox
              checked={isChecked}
              onCheck={this.onCardClickHandler}
              hasAbsolutePosition
              description={isChecked ? "Unselect" : "Select"}
            />
          ) : null}
        </div>
        <div
          className="title"
          onMouseEnter={this.handleTitleMouseEnter}
          onMouseLeave={this.handleTitleMouseLeave}
        >
          <EditableLabel
            text={title}
            labelClassName="projectnamevalue"
            inputClassName="projectnameinput"
            onFocus={this.handleProjectNameFocus}
            onFocusOut={this.handleProjectNameFocusOut}
            showIcon={isTitleHovering}
            inputMaxLength={100}
            labelPlaceHolder="Name of the Project"
          />
        </div>
        <div className="subtitle">Updated {last_updated} ago</div>

        <TldrConfirmationModal
          modalFor={"story"}
          inprogress={inProgress}
          show={showConfirmation}
          onHide={() => {
            this.setState({
              ...this.state,
              showConfirmation: false,
            });
          }}
          onYes={() => {
            this.setState({
              inProgress: "true",
            });
            this.props.deleteStory(
              id,
              this.signal,
              this.props,
              this.props.selectedFolder ? true : false
            );
          }}
        />

        <TldrProgressDialog
          inprogress={inProgress}
          show={showCloneModal}
          onHide={() => {
            this.setState({
              ...this.state,
              showCloneModal: false,
            });
          }}
          onYes={() => {
            this.setState({
              inProgress: "true",
            });
            this.props.deleteStory(id, this.signal, this.props);
          }}
        ></TldrProgressDialog>
      </StyledDesignCard>
    );
  }
}

StoryCard.propTypes = {
  story: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.errors,
  isPanelShowing: state.homePageCards.isPanelShowing,
  selectedCards: state.homePageCards.selectedCards,
});

const mapDispatchToProps = {
  deleteStory,
  cloneStory,
  cloneTemplate,
  selectCard,
  unSelectCard,
  updateStory,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(StoryCard));
