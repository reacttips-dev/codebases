import React from "react";
import { withRouter } from "react-router-dom";
import { StyledAssetsCard } from "./stylesHome";
import ImageItemActions from "../../common/ImageItemActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import { lightInactive } from "../variable";
import { connect } from "react-redux";
import {
  selectCard,
  unSelectCard,
} from "../../../_actions/homepageCardActions";
import { Checkbox } from "./statelessView";
import TemplateItemActions from "../../common/TemplateItemActions";
import { StoryAction, TldrProgressDialog } from "../../common/statelessView";
import { StyledContentDetails } from "../styles";
import { cloneTemplate } from "../../../_actions/storiesActions";
import axios from "axios";
import { isEqual } from "lodash";

class AssetsCardView extends React.Component {
  signal = axios.CancelToken.source();
  constructor(props) {
    super(props);
    this.state = {
      isChecked: false,
      isHovering: false,
      isTitleEditable: false,
      originalTitle: this.props.payload.payload.name || "",
      title: this.props.payload.payload.name || "",
      status: this.props.payload.payload.publish,
      showCloneModal: false,
      inProgress: "false",
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props !== prevProps) {
      if (this.state.title === "") {
        // update title for the first time
        this.setState({
          title: this.props.payload.payload.name || "",
          originalTitle: this.props.payload.payload.name || "",
          isChecked: this.props.selectedCards.find((item) =>
            isEqual(item, this.props.payload)
          ),
        });
      } else {
        this.setState({
          isChecked: this.props.selectedCards.find((item) =>
            isEqual(item, this.props.payload)
          ),
        });
      }
    }
  }

  handleMouseEnter = () => {
    this.setState({ isHovering: true });
  };

  handleMouseLeave = () => {
    this.setState({ isHovering: false });
  };

  onCheckHandler = (e) => {
    e.stopPropagation();
    if (
      this.state.isTitleEditable &&
      this.state.title !== this.state.originalTitle
    ) {
      if (this.state.title.trim().length > 0) {
        this.props.onEditNameHandler(this.state.title, this.props.payload);
        this.setState({ originalTitle: this.state.title });
      } else {
        this.setState({
          isTitleEditable: false,
          title: this.state.originalTitle,
        });
        return;
      }
    }
    this.setState({ isTitleEditable: !this.state.isTitleEditable });
  };

  onKeyPressHandler = (e) => {
    if (e.key === "Enter") {
      this.onCheckHandler(e);
    } else if (e.key === "Escape") {
      this.setState({
        isTitleEditable: false,
        title: this.state.originalTitle,
      });
    }
  };

  onCardClickHandler = (isChecked) => {
    if (isChecked) {
      this.props.selectCard(this.props.payload);
    } else {
      this.props.unSelectCard(this.props.payload);
    }
    this.setState({ isChecked });
  };

  render() {
    const {
      type,
      hasAction,
      modalFor,
      selectedFolder,
      templateActionMenu,
      isDragging,
    } = this.props;
    const { meta } = this.props.payload.content || { meta: {} };
    const { isHovering, isChecked, title, status, showCloneModal, inProgress } =
      this.state;

    return (
      <>
        <StyledAssetsCard
          autoHeight={this.props.autoHeight}
          onClick={() => this.onCardClickHandler(!isChecked)}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
        >
          <div className="holder">{this.props.children}</div>
          <hr className="modal-hr my-2 mx-0" />
          <div className="title-content d-flex align-items-center justify-content-between">
            {this.state.isTitleEditable ? (
              <input
                type="text"
                value={this.state.title}
                onChange={(e) => {
                  this.setState({ title: e.target.value });
                }}
                autoFocus
                onKeyDown={this.onKeyPressHandler}
              />
            ) : (
              <span className="title">{title}</span>
            )}
            {this.props.showEditIcon ? (
              <FontAwesomeIcon
                icon={this.state.isTitleEditable ? faCheck : faPencilAlt}
                color={lightInactive}
                size="sm"
                className="edit-icon"
                onClick={this.onCheckHandler}
              />
            ) : null}
          </div>
          <span className="date">{this.props.payload?.payload?.type}</span>
          {isHovering || isChecked ? (
            <Checkbox
              checked={isChecked}
              onCheck={this.onCardClickHandler}
              hasAbsolutePosition
              description={isChecked ? "Unselect" : "Select"}
            />
          ) : null}

          {hasAction ? (
            templateActionMenu ? (
              <>
                <StyledContentDetails
                  className={"content-details"}
                  isDragging={isDragging}
                  style={{ flexDirection: "column" }}
                >
                  <TemplateItemActions
                    id={meta.id}
                    title={meta.title}
                    type={type}
                    modalFor={modalFor}
                  />

                  <div className="actions">
                    <StoryAction
                      action="clone"
                      id={this.props.payload.content.meta.id}
                      icon="arrow-circle-right"
                      tooltip="Clone Template"
                      clickHandler={(e) =>
                        this.setState({ showCloneModal: true }, () => {
                          this.props.cloneTemplate(
                            this.props?.payload?.content?.meta?.id,
                            this.signal,
                            this.props
                          );
                        })
                      }
                      label="Clone Template"
                    />
                  </div>
                </StyledContentDetails>
                {showCloneModal && (
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
                    }}
                  ></TldrProgressDialog>
                )}
              </>
            ) : (
              <ImageItemActions
                id={meta.id}
                key={meta.id}
                type={type}
                modalFor={modalFor}
                selectedFolder={selectedFolder}
              />
            )
          ) : null}
        </StyledAssetsCard>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  isPanelShowing: state.homePageCards.isPanelShowing,
  selectedCards: state.homePageCards.selectedCards,
});

const mapDispatchToProps = (dispatch) => ({
  selectCard: (payload) => dispatch(selectCard(payload)),
  unSelectCard: (payload) => dispatch(unSelectCard(payload)),
  cloneTemplate: (storyId, signal, props) =>
    dispatch(cloneTemplate(storyId, signal, props)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AssetsCardView));
