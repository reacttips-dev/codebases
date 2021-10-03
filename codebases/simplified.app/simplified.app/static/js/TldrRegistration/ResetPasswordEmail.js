import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { LOGIN } from "../_utils/routes";
import TldrBase from "../TldrLogin/TldrBase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class ResetPasswordEmailSentNotification extends Component {
  render() {
    const urlSearchParams = new URLSearchParams(this.props.location.search);
    const searchKeyEmail = decodeURIComponent(urlSearchParams.get("email"));

    return (
      <TldrBase
        subheading={
          <>
            Please check <span>{[searchKeyEmail]}</span> for a verification
            link. It may take few moments.
          </>
        }
        heading={"Email sent"}
      >
        <div className="input-group mt-5 secondary-links center">
          <Link to={LOGIN}>
            <FontAwesomeIcon icon="arrow-left" className="mr-1" />
            Back to sign in
          </Link>
        </div>
      </TldrBase>
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps)(ResetPasswordEmailSentNotification);
