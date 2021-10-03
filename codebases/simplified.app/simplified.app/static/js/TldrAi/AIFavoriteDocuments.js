import React, { Component } from "react";
import PropTypes from "prop-types";
import { StyledAiRow } from "../_components/styled/ai/styledAi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { selectCard, unSelectCard } from "../_actions/homepageCardActions";
import { AI_TEMPLATE } from "../_utils/routes";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { deleteUserAssets } from "../_actions/sidebarSliderActions";
import axios from "axios";
import { TldrConfirmationModal } from "../_components/common/statelessView";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { StyledAiResultButton } from "../_components/styled/styles";
import {
  faExternalLinkSquareAlt,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { ToolTipWrapper } from "../_components/common/statelessView";
import CopyToClipboard from "react-copy-to-clipboard";
import { COPIES_ENDPOINT } from "../_actions/endpoints";
import Format from "string-format";

class AIFavoriteDocuments extends Component {
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
      copyId: null,
      copied: false,
      result: this.props.result,
      favorite: false,
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

  unfavoriteCopy(copy, state) {
    axios
      .patch(
        Format(COPIES_ENDPOINT, copy.id),
        { status: state },
        {
          cancelToken: this.signal.token,
        }
      )
      .then((res) => {
        this.setState({
          result: res.data,
          showConfirmationModal: false,
        });
      })
      .catch((error) => {
        //dispatch(handleHTTPError(error, props));
      });
  }

  render() {
    const { enableCardSelection } = this.props;
    const { isHovering, isChecked, showConfirmationModal, inProgress, result } =
      this.state;
    return (
      <>
        {result.status === "saved" ? (
          <StyledAiRow
            className={""}
            /* onClick={(e) => {
            this.props.history.push(Format(AI_TEMPLATE, result.document));
          }} */
            allowOverflow={enableCardSelection}
          >
            <div
              className="thumbnail"
              onMouseEnter={this.handleMouseEnter}
              onMouseLeave={this.handleMouseLeave}
            >
              <div className="icon" key={`${result.id}_icon`}>
                <FontAwesomeIcon icon={"pencil-alt"} size="lg" />
              </div>
              <hr className="modal-hr my-3 mx-0" />
              {result.payload.display.length >= 25 ? (
                <OverlayTrigger
                  placement="bottom"
                  overlay={<Tooltip>{result.payload.headline}</Tooltip>}
                  trigger={["hover", "focus"]}
                  key={`${result.id}_title2`}
                >
                  <div className="title2">{result.payload.headline}</div>
                </OverlayTrigger>
              ) : (
                <div className="title2" key={`${result.id}_title2`}>
                  {result.payload.headline}
                </div>
              )}

              <div className="subtitle" key={`${result.id}_sub`}>
                {result.payload.modified}
              </div>

              {isHovering && (
                <div
                  className="document-action"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <ToolTipWrapper
                    tooltip={"Copy"}
                    key={`fv1_${result.id}`}
                    id={`fv1_${result.id}`}
                  >
                    <CopyToClipboard
                      key={`t5_${result.id}`}
                      text={
                        result.payload?.cta
                          ? result.payload.headline + "\n" + result.payload.cta
                          : result.payload.headline
                      }
                      onCopy={() => {
                        this.setState({
                          copied: true,
                          copyId: result.id,
                        });
                      }}
                    >
                      <StyledAiResultButton>
                        {this.state.copied ? (
                          <>
                            <FontAwesomeIcon icon={"copy"}></FontAwesomeIcon>{" "}
                            Copied!
                          </>
                        ) : (
                          <>
                            <FontAwesomeIcon icon={"copy"}></FontAwesomeIcon>
                          </>
                        )}
                      </StyledAiResultButton>
                    </CopyToClipboard>
                  </ToolTipWrapper>
                  <ToolTipWrapper
                    tooltip={"Delete from Favorites"}
                    key={`fv1_${result.id}`}
                    id={`fv1_${result.id}`}
                  >
                    <StyledAiResultButton>
                      <FontAwesomeIcon
                        icon={faTrash}
                        onClick={(e) => {
                          e.stopPropagation();
                          this.setState({ showConfirmationModal: true });
                          //this.unfavoriteCopy(result, "draft");
                        }}
                      />
                    </StyledAiResultButton>
                  </ToolTipWrapper>
                  <ToolTipWrapper
                    tooltip={"Open document"}
                    key={`fv1_${result.id}`}
                    id={`fv1_${result.id}`}
                  >
                    <StyledAiResultButton>
                      <FontAwesomeIcon
                        icon={faExternalLinkSquareAlt}
                        onClick={(e) => {
                          e.stopPropagation();
                          //this.props.history.push(Format(AI_TEMPLATE, result.document));
                          window.open(
                            Format(AI_TEMPLATE, result.document),
                            "_blank"
                          );
                        }}
                      />
                    </StyledAiResultButton>
                  </ToolTipWrapper>
                </div>
              )}
            </div>
          </StyledAiRow>
        ) : null}

        <TldrConfirmationModal
          customMessage="Are you sure you want to delete this copy from Favorites?"
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
              //this.handleDeleteDocument(result.id)
              this.unfavoriteCopy(result, "draft")
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

AIFavoriteDocuments.propTypes = {
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
)(withRouter(AIFavoriteDocuments));
