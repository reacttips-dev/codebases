import React, { Component } from "react";
import PropTypes from "prop-types";
import { StyledAiRow } from "../_components/styled/ai/styledAi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Format from "string-format";
import { AI_TEMPLATE } from "../_utils/routes";
import { Checkbox } from "../_components/styled/home/statelessView";
import { selectCard, unSelectCard } from "../_actions/homepageCardActions";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { deleteUserAssets } from "../_actions/sidebarSliderActions";
import axios from "axios";
import { TldrConfirmationModal } from "../_components/common/statelessView";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

class AIAllDocuments extends Component {
  signal = axios.CancelToken.source();

  constructor(props) {
    super(props);

    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);

    this.state = {
      isHovering: false,
      isChecked: false,
      showConfirmationModal: false,
      inProgress: "false",
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props !== prevProps) {
      this.setState({
        isChecked: this.props.selectedCards.find(
          (item) => item === this.props.result
        ),
      });
    }
  }

  render() {
    const { result, enableCardSelection } = this.props;
    const { isHovering, isChecked, showConfirmationModal, inProgress } =
      this.state;

    return (
      <>
        <StyledAiRow
          className={""}
          onClick={(e) => {
            this.props.history.push(Format(AI_TEMPLATE, result.id));
          }}
          allowOverflow={enableCardSelection}
        >
          <div
            className="thumbnail"
            onMouseEnter={this.handleMouseEnter}
            onMouseLeave={this.handleMouseLeave}
          >
            <div className="icon" key={`${result.id}_icon`}>
              {result?.prompt?.content?.iconType === "brand" ? (
                <FontAwesomeIcon
                  icon={["fab", `${result.prompt.content.icon}`]}
                />
              ) : result?.prompt?.content?.icon ? (
                <FontAwesomeIcon icon={`${result.prompt.content.icon}`} />
              ) : (
                <FontAwesomeIcon icon={"pencil-alt"} size="lg" />
              )}
            </div>

            <hr className="modal-hr my-2 mx-0" />
            {result.title.length >= 25 ? (
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>{result.title}</Tooltip>}
                trigger={["hover", "focus"]}
                key={`${result.id}_title2`}
              >
                <div className="title2">{result.title}</div>
              </OverlayTrigger>
            ) : (
              <div className="title2" key={`${result.id}_title2`}>
                {result.title}
              </div>
            )}
            {result.prompt.title.length >= 25 ? (
              <OverlayTrigger
                placement="bottom"
                overlay={<Tooltip>{result.prompt.title}</Tooltip>}
                trigger={["hover", "focus"]}
                key={`${result.id}_title`}
              >
                <div className="subtitle">{result.prompt.title}</div>
              </OverlayTrigger>
            ) : (
              <div className="subtitle" key={`${result.id}_title`}>
                {result.prompt.title}
              </div>
            )}

            <div className="subtitle" key={`${result.id}_sub`}>
              {result.modified}
            </div>

            {(isHovering || isChecked) && enableCardSelection ? (
              <Checkbox
                checked={isChecked}
                onCheck={this.onDocumentClickHandler}
                hasAbsolutePosition
                description={isChecked ? "Unselect" : "Select"}
              />
            ) : null}

            {isHovering && (
              <div
                className="document-action"
                onClick={(e) => {
                  e.stopPropagation();
                  this.setState({ showConfirmationModal: true });
                }}
              >
                <FontAwesomeIcon icon={faTrash} />
              </div>
            )}
          </div>
        </StyledAiRow>

        <TldrConfirmationModal
          modalFor="document"
          inprogress={inProgress}
          show={showConfirmationModal}
          onHide={(e) => {
            this.setState({
              ...this.state,
              showConfirmationModal: false,
            });
          }}
          onYes={() => {
            this.setState(
              {
                inProgress: "true",
              },
              this.handleDeleteDocument(result.id)
            );
          }}
        />
      </>
    );
  }

  handleMouseEnter() {
    this.setState({ isHovering: true });
  }

  handleMouseLeave() {
    this.setState({ isHovering: false });
  }

  onDocumentClickHandler = (isChecked) => {
    if (isChecked) {
      this.props.selectCard(this.props.result);
    } else {
      this.props.unSelectCard(this.props.result);
    }
    this.setState({ isChecked });
  };

  handleDeleteDocument = (documentId) => {
    const extraProps = {
      type: "document",
      id: documentId,
    };

    this.props.delete(extraProps, this.signal.token).then(() => {
      this.setState({
        showConfirmationModal: false,
      });
    });
  };
}

AIAllDocuments.propTypes = {
  result: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  isPanelShowing: state.homePageCards.isPanelShowing,
  selectedCards: state.homePageCards.selectedCards,
});

const mapDispatchToProps = (dispatch) => ({
  selectCard: (selectedDoc) => dispatch(selectCard(selectedDoc)),
  unSelectCard: (selectedDoc) => dispatch(unSelectCard(selectedDoc)),
  delete: (props, token) => dispatch(deleteUserAssets(props, token)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AIAllDocuments));
