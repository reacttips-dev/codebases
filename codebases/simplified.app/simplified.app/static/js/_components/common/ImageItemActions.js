import React, { Component } from "react";
import PropTypes from "prop-types";
import { StyledContentDetails, StyledContentAction } from "../styled/styles";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { primary } from "../styled/variable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import axios from "axios";
import { deleteUserAssets } from "../../_actions/sidebarSliderActions";
import { TldrConfirmationModal } from "./statelessView";

class ImageItemActions extends Component {
  signal = axios.CancelToken.source();

  constructor(props) {
    super(props);
    this.state = {
      showDeletePopup: false,
      inProgress: "false",
    };
  }

  delete = () => {
    this.props.delete(
      this.props,
      this.signal.token,
      this.props.selectedFolder ? true : false
    );
  };

  toggleDeletePopup = () => {
    this.setState({ showDeletePopup: !this.state.showDeletePopup });
  };

  componentWillUnmount() {
    this.signal.cancel("The user aborted a request.");
  }

  render() {
    const { showDeletePopup, inProgress } = this.state;
    const { isDragging, modalFor } = this.props;
    return (
      <StyledContentDetails
        className={"content-details"}
        isDragging={isDragging}
        style={{ flexDirection: "column" }}
      >
        <StyledContentAction marginRight={false}>
          <FontAwesomeIcon
            icon={faTrash}
            size="1x"
            color={primary}
            onClick={(e) => {
              e.stopPropagation();
              this.toggleDeletePopup();
            }}
          ></FontAwesomeIcon>
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
        </StyledContentAction>
      </StyledContentDetails>
    );
  }
}

ImageItemActions.propTypes = {};

const mapStateToProps = (state) => ({
  delete: PropTypes.func.isRequired,
});

const mapDispatchToProps = (dispatch) => ({
  delete: (props, token, shouldUpdateFolders) =>
    dispatch(deleteUserAssets(props, token, shouldUpdateFolders)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ImageItemActions);
