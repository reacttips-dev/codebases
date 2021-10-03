import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import TldrBase from "../TldrLogin/TldrBase";
import { VERIFY_EMAIL } from "../_actions/endpoints";
import { handleHTTPError } from "../_actions/errorHandlerActions";
import {
  REGISTRATION_VERIFICATION_FAILURE,
  REGISTRATION_VERIFICATION_SUCCESS,
} from "../_utils/routes";
import { Spinner } from "react-bootstrap";

class ConfirmYourEmailAddress extends Component {
  signal = axios.CancelToken.source();

  constructor() {
    super();
    this.onClick = this.onClick.bind(this);
  }

  // Confirm email :
  verifyEmailAddress = () => {
    const userData = { key: this.props.match.params.key };
    axios
      .post(VERIFY_EMAIL, userData, { cancelToken: this.signalToken })
      .then((res) => {
        this.props.history.push(REGISTRATION_VERIFICATION_SUCCESS);
      })
      .catch((error) => {
        if (error.response.status === 404) {
          this.props.history.push(REGISTRATION_VERIFICATION_FAILURE);
        } else {
          this.props.handleHTTPError(error, { ...this.props });
        }
      });
  };

  componentDidMount() {
    this.verifyEmailAddress();
  }

  onClick() {
    const userData = { key: this.props.match.params.key };
    this.verifyEmailAddress(userData, this.props.history, this.signal.token);
  }

  componentWillUnmount() {
    this.signal.cancel("The user aborted a request.");
  }
  render() {
    return (
      <TldrBase
        wrapperClassName="login-wrapper"
        showBackgroundImage
        heading={"One last step"}
        subheading="Please wait activating your account."
      >
        <div className="input-group mt-3 mb-3 center">
          <button
            type="submit"
            className="btn btn-lg btn-warning tldr-login-btn"
          >
            <Spinner
              variant={"dark"}
              as="span"
              animation="border"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          </button>
        </div>
      </TldrBase>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleHTTPError: (error, props) => dispatch(handleHTTPError(error, props)),
  };
};

export default connect(
  mapDispatchToProps,
  mapDispatchToProps
)(ConfirmYourEmailAddress);
