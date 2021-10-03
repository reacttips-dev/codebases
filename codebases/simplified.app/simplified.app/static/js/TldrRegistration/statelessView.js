import React from "react";
import TldrBase from "../TldrLogin/TldrBase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { LOGIN } from "../_utils/routes";

export const PasswordResetSuccess = () => {
  return (
    <>
      <TldrBase
        subheading={
          "You password has been successfully reset. Please try logging in."
        }
        heading="You are all set."
      >
        <div className="input-group mt-5 secondary-links center">
          <Link to={LOGIN}>
            <FontAwesomeIcon icon="arrow-left" className="mr-1" />
            Back to sign in
          </Link>
        </div>
      </TldrBase>
    </>
  );
};

export const PasswordResetFailure = () => {
  return (
    <>
      <TldrBase
        subheading={"Failed to reset your password. Please try again."}
        heading="Oops, Sorry!."
      >
        <div className="input-group mt-5 secondary-links center">
          <Link to={LOGIN}>
            <FontAwesomeIcon icon="arrow-left" className="mr-1" />
            Back to sign in
          </Link>
        </div>
      </TldrBase>
    </>
  );
};

// Password set from invitation link - SUCCESS
export const PasswordSetSuccessViaInvitation = () => {
  return (
    <>
      <TldrBase
        subheading={
          "You password has been successfully reset. Please try logging in."
        }
        heading="You are all set."
      >
        <div className="input-group mt-5 secondary-links center">
          <Link to={LOGIN}>
            <FontAwesomeIcon icon="arrow-left" className="mr-1" />
            Back to sign in
          </Link>
        </div>
      </TldrBase>
    </>
  );
};

// Password set from invitation link - FAILURE
export const PasswordSetFailureViaInvitation = () => {
  return (
    <>
      <TldrBase
        subheading={"Failed to reset your password. Please try again."}
        heading="Oops, Sorry!."
      >
        <div className="input-group mt-5 secondary-links center">
          <Link to={LOGIN}>
            <FontAwesomeIcon icon="arrow-left" className="mr-1" />
            Back to sign in
          </Link>
        </div>
      </TldrBase>
    </>
  );
};

export const RegistrationVerificationSuccess = () => {
  return (
    <>
      <TldrBase
        wrapperClassName="login-wrapper"
        showBackgroundImage
        subheading={
          "You account has been verified and activated successfully!."
        }
        heading="You are set."
      >
        <div className="input-group mt-5 secondary-links center">
          <Link to={LOGIN}>
            Click here to sign in
            <FontAwesomeIcon icon="arrow-right" className="ml-1" />
          </Link>
        </div>
      </TldrBase>
    </>
  );
};

export const RegistrationVerificationFailure = () => {
  return (
    <>
      <TldrBase
        wrapperClassName="login-wrapper"
        showBackgroundImage
        subheading={"Failed to verify your email address. Please try again."}
        heading="Oops, Sorry!"
      >
        <div className="input-group mt-5 secondary-links center">
          <Link to={LOGIN}>
            <FontAwesomeIcon icon="arrow-left" className="mr-1" />
            Back to sign in
          </Link>
        </div>
      </TldrBase>
    </>
  );
};
