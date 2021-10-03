import axios from "axios";
import React, { Component } from "react";
import { Link, withRouter, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser, loginWithGoogle } from "../_actions/authActions";
import {
  ROOT,
  REGISTER_PATH,
  FORGOT_PASSWORD_PATH,
  LIFETIME,
} from "../_utils/routes";
import FormErrors from "./FormErrors";
import { GoogleLogin } from "react-google-login";
import { GOOGLE_CLIENT_ID } from "../_actions/endpoints";
import { StyledLoginFormControl } from "../_components/styled/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Spinner } from "react-bootstrap";
import TldrBase from "./TldrBase";
import { setErrorMessage } from "./statelessView";
import { faArrowCircleRight, faLongArrowAltRight } from "@fortawesome/free-solid-svg-icons";
import { getSubscription } from "../_actions/subscriptionActions";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errors: "",
      formErrors: { email: "", password: "" },
      emailValid: false,
      passwordValid: false,
      formValid: false,
      isAuthenticated: false,
      user: null,
      token: "",
      loginWithGoogleLoading: false,
      loginWithEmailLoading: false,
      googleLoginErrors: "",
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  renderSpinner = (varient) => {
    return (
      <Spinner
        variant={varient}
        as="span"
        animation="border"
        size="sm"
        role="status"
        aria-hidden="true"
      />
    );
  };

  logout = () => {
    this.setState({ isAuthenticated: false, token: "", user: null });
  };

  onFailure = (error) => {
    let errorMessage = setErrorMessage(error);
    this.setState({
      loginWithGoogleLoading: false,
      googleLoginErrors: errorMessage,
    });
  };

  facebookResponse = (response) => {
    const tokenBlob = new Blob(
      [JSON.stringify({ access_token: response.accessToken }, null, 2)],
      { type: "application/json" }
    );
    const options = {
      method: "POST",
      body: tokenBlob,
      mode: "cors",
      cache: "default",
    };
    axios("http://127.0.0.1:8000/api/v1/auth/facebook/", options).then((r) => {
      const token = r.headers.get("x-auth-token");
      r.json().then((user) => {
        if (token) {
          this.setState({ isAuthenticated: true, user, token });
        }
      });
    });
  };

  googleResponse = (response, e) => {
    const tokenJSON = { access_token: response.accessToken };
    this.props.loginWithGoogle(tokenJSON, { ...this.props }).then(() => {
      this.props.getSubscription();
    });
  };

  onChange(e) {
    this.validateField(e.target.name, e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  }

  errorClass(error) {
    return error.length === 0 ? "" : "has-error is-invalid";
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;
    let passwordValid = this.state.passwordValid;

    switch (fieldName) {
      case "email":
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.email = emailValid
          ? ""
          : "Please enter a valid email address.";
        break;
      case "password":
        passwordValid = value.length >= 6;
        fieldValidationErrors.password = passwordValid
          ? ""
          : "Password must be atleast 8 characters.";
        break;
      default:
        break;
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        emailValid: emailValid,
        passwordValid: passwordValid,
      },
      this.validateForm
    );
  }

  validateForm() {
    this.setState({
      formValid: this.state.emailValid && this.state.passwordValid,
    });
  }

  onSubmit(e) {
    e.preventDefault();

    const { from } = this.props.location.state || { from: { pathname: "/" } };
    const userData = {
      email: this.state.email,
      password: this.state.password,
    };

    if (from.location === LIFETIME) {
      this.props.history.replace({ pathname: LIFETIME });
    } else {
      this.props.loginUser(userData, { ...this.props }).then(() => {
        this.props.getSubscription();
      });
    }
  }

  onGoogleLoginClick = (renderProps) => {
    const { from } = this.props.location.state || { from: { pathname: "/" } };

    if (from.location === LIFETIME) {
      this.props.history.replace({ pathname: LIFETIME });
    } else {
      renderProps.onClick();
    }
  };

  render() {
    const { loginWithGoogleLoading, loginWithEmailLoading } = this.state;
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    if (this.props.auth.isAuthenticated) {
      return <Redirect to={from ? from : ROOT} />;
    }

    const nonFieldErrors = !Object.keys(this.props.errors).includes(
      "non_field_errors"
    ) ? (
      <div></div>
    ) : (
      <div className="alert alert-danger">
        <FormErrors formErrors={this.props.errors} />
      </div>
    );

    const loginErrors =
      Object.keys(this.state.googleLoginErrors).length === 0 ? (
        <div></div>
      ) : (
        <div className="alert alert-danger">
          <FormErrors formErrors={this.state.googleLoginErrors} />
        </div>
      );

    return (
      <TldrBase
        heading={"Welcome back"}
        showBackgroundImage
        wrapperClassName="login-wrapper"
      >
        <div className="mb-3 social-buttons">
          <GoogleLogin
            buttonText="Sign In with Google"
            clientId={GOOGLE_CLIENT_ID}
            onSuccess={this.googleResponse}
            onFailure={this.onFailure}
            cookiePolicy={"single_host_origin"}
            className="social-btn-google"
            theme="dark"
          />
        </div>

        <div className="form-option-divider">
          <hr className="tldr-hr" />
          <p>OR</p>
          <hr className="tldr-hr" />
        </div>

        {loginErrors}

        {nonFieldErrors}

        <form onSubmit={this.onSubmit}>
          <div className="input-group">
            <StyledLoginFormControl
              type="email"
              placeholder="Your email"
              aria-label="Email"
              aria-describedby="basic-addon1"
              name="email"
              value={this.state.email}
              onChange={this.onChange}
            />
          </div>
          <div className="mb-3 error">{this.state.formErrors.email}</div>
          <div className="input-group">
            <StyledLoginFormControl
              type="password"
              placeholder="Your password"
              aria-label="Password"
              aria-describedby="basic-addon1"
              name="password"
              value={this.state.password}
              onChange={this.onChange}
            />
          </div>
          <div className="error">{this.state.formErrors.password}</div>
          <div className="input-group mb-3 mt-1 secondary-links">
            <Link to={FORGOT_PASSWORD_PATH}>forgot password?</Link>
          </div>
          <div className="input-group mb-3 form-button">
            <button
              type="submit"
              className="btn btn-warning btn-lg tldr-login-btn"
              disabled={!this.state.formValid}
            >
              {!loginWithEmailLoading && from?.pathname === LIFETIME ? (
                "Verify"
              ) : !loginWithEmailLoading ? (
                <>
                  Let's go{" "}
                  <FontAwesomeIcon icon={faArrowCircleRight}></FontAwesomeIcon>
                </>
              ) : (
                this.renderSpinner("light")
              )}
            </button>
          </div>
        </form>

        <div className="input-group mt-4 secondary-links">
          <label>
            Not on Simplified? <Link to={REGISTER_PATH}>Sign up now</Link>
          </label>
        </div>
      </TldrBase>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, {
  loginUser,
  loginWithGoogle,
  getSubscription,
})(withRouter(Login));
