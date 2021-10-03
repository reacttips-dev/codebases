import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  StyledContentDetails,
  StyledContentAction,
  StyledTemplateActionsDropDownMenu,
  StyledTemplateActionsDropDownItem,
} from "../styled/styles";
import {
  faEllipsisV,
  faFileUpload,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { primary } from "../styled/variable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import axios from "axios";
import {
  deleteUserAssets,
  publishTemplate,
} from "../../_actions/sidebarSliderActions";
import { TldrConfirmationModal } from "./statelessView";
import { Dropdown } from "react-bootstrap";
import TldrPublishTemplateModal from "./TldrPublishTemplateModal";
import { Link, withRouter } from "react-router-dom";
import { cloneTemplate } from "../../_actions/storiesActions";
import { analyticsTrackEvent } from "../../_utils/common";

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <Link
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick(e);
    }}
  >
    <FontAwesomeIcon icon={faEllipsisV} size="1x" color={primary} />
  </Link>
));

class TemplateItemActions extends Component {
  signal = axios.CancelToken.source();

  constructor(props) {
    super(props);
    this.state = {
      showDeletePopup: false,
      showPublishPopup: false,
      inProgress: "false",
      showCloneModal: false,
    };
  }

  delete = () => {
    this.props.delete(this.props, this.signal.token).then(() => {
      this.setState({
        showDeletePopup: false,
      });
    });
  };

  publish = async (name, tags, categories) => {
    var arrayOfCategories = [];
    categories.forEach((category) => {
      arrayOfCategories.push(category.id);
    });

    const payload = {
      template: "story",
      title: name,
      tags: tags,
      publish: true,
      categories: arrayOfCategories,
    };

    this.props.publishTemplate(this.props.id, payload, this.signal).then(() => {
      this.setState({
        showPublishPopup: false,
        inProgress: "false",
      });
    });

    analyticsTrackEvent("publishTemplate");
  };

  toggleDeletePopup = () => {
    this.setState({ showDeletePopup: !this.state.showDeletePopup });
  };

  togglePublishPopup = () => {
    this.setState({ showPublishPopup: !this.state.showPublishPopup });
  };

  componentWillUnmount() {
    this.signal.cancel("The user aborted a request.");
  }

  render() {
    const { showDeletePopup, showPublishPopup, inProgress } = this.state;
    const { isDragging, modalFor, title, index, auth } = this.props;

    return (
      <>
        <StyledContentDetails
          className={"content-details"}
          isDragging={isDragging}
          style={{ flexDirection: "column" }}
        >
          <StyledContentAction className={"pl-4 pr-4"} marginRight={true}>
            <Dropdown drop={index % 3 === 0 ? "right" : "left"}>
              <Dropdown.Toggle
                as={CustomToggle}
                id="dropdown-template-action"
              ></Dropdown.Toggle>

              <StyledTemplateActionsDropDownMenu>
                <StyledTemplateActionsDropDownItem
                  onClick={(e) => {
                    e.stopPropagation();
                    this.togglePublishPopup();
                  }}
                >
                  Publish
                  <FontAwesomeIcon icon={faFileUpload} size="1x" />
                </StyledTemplateActionsDropDownItem>
                <StyledTemplateActionsDropDownItem
                  onClick={(e) => {
                    e.stopPropagation();
                    this.toggleDeletePopup();
                  }}
                >
                  Delete
                  <FontAwesomeIcon icon={faTrash} size="1x" />
                </StyledTemplateActionsDropDownItem>
              </StyledTemplateActionsDropDownMenu>
            </Dropdown>

            {showDeletePopup && (
              <div onClick={(e) => e.stopPropagation()}>
                <TldrConfirmationModal
                  modalFor={modalFor}
                  inprogress={inProgress}
                  show={showDeletePopup}
                  onHide={(e) => {
                    this.setState({
                      ...this.state,
                      showDeletePopup: false,
                    });
                  }}
                  onYes={() => {
                    this.setState(
                      {
                        inProgress: "true",
                      },
                      this.delete
                    );
                  }}
                />
              </div>
            )}

            {showPublishPopup && (
              <div onClick={(e) => e.stopPropagation()}>
                <TldrPublishTemplateModal
                  show={showPublishPopup}
                  inprogress={inProgress}
                  templateName={title}
                  onHide={(e) => {
                    this.setState({
                      ...this.state,
                      showPublishPopup: false,
                    });
                  }}
                  onYes={(name, tags, category) => {
                    this.setState(
                      {
                        inProgress: "true",
                      },
                      () => this.publish(name, tags, category)
                    );
                  }}
                />
              </div>
            )}
          </StyledContentAction>
        </StyledContentDetails>
      </>
    );
  }
}

TemplateItemActions.propTypes = {
  delete: PropTypes.func.isRequired,
  publishTemplate: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  closeModal: state.sidebarSlider.closeTemplateModal,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  delete: (props, token) => dispatch(deleteUserAssets(props, token)),
  publishTemplate: (id, payload, signalToken) =>
    dispatch(publishTemplate(id, payload, signalToken)),
  cloneTemplate: (storyId, signal, props) =>
    dispatch(cloneTemplate(storyId, signal, props)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(TemplateItemActions));
