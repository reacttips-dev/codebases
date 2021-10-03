import React, { Component } from "react";
import { Link, Redirect } from "react-router-dom";
import { registerUser, loginWithGoogle } from "../_actions/authActions";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { StyledLoginFormControl } from "../_components/styled/styles";
import { LOGIN, ROOT } from "../_utils/routes";
import axios from "axios";
import FormErrors from "../TldrLogin/FormErrors";
import TldrBase from "../TldrLogin/TldrBase";
import GoogleLogin from "react-google-login";
import { GOOGLE_CLIENT_ID } from "../_actions/endpoints";
import { Spinner } from "react-bootstrap";
import { setErrorMessage } from "../TldrLogin/statelessView";

class Register extends Component {
  signal = axios.CancelToken.source();

  constructor() {
    super();
    this.state = {
      email: "",
      company: "",
      password1: "",
      password2: "",
      formErrors: {
        email: "",
        company: "",
        password1: "",
        password2: "",
      },
      emailValid: false,
      companyValid: false,
      password1Valid: false,
      password2Valid: false,
      formValid: false,
      loginWithGoogleLoading: false,
      googleLoginErrors: "",
      loading: false,
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.validateField(e.target.name, e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  }

  validateForm() {
    this.setState({
      formValid:
        this.state.emailValid &&
        this.state.password1Valid &&
        this.state.password2Valid &&
        this.state.companyValid,
    });
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;
    let companyValid = this.state.companyValid;
    let password1Valid = this.state.password1Valid;
    let password2Valid = this.state.password2Valid;
    switch (fieldName) {
      case "email":
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.email = emailValid ? "" : "Email is invalid";
        break;
      case "company":
        companyValid = value.length > 0;
        fieldValidationErrors.company = companyValid
          ? ""
          : "Company Name is required";
        break;
      case "password1":
        password1Valid = value.length >= 8;
        fieldValidationErrors.password1 = password1Valid
          ? ""
          : "Password must be atleast 8 characters";
        break;
      case "password2":
        password2Valid = value === this.state.password1;
        fieldValidationErrors.password2 = password2Valid
          ? ""
          : "Passwords must match!";
        break;
      default:
        break;
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        emailValid: emailValid,
        companyValid: companyValid,
        password1Valid: password1Valid,
        password2Valid: password2Valid,
      },
      this.validateForm
    );
  }

  googleResponse = (response, e) => {
    const tokenJSON = { access_token: response.accessToken };
    this.props.loginWithGoogle(tokenJSON, { ...this.props }, "signUp");
  };

  onFailure = (error) => {
    let errorMessage = setErrorMessage(error);
    this.setState({
      loginWithGoogleLoading: false,
      googleLoginErrors: errorMessage,
    });
  };

  errorClass(error) {
    return error.length === 0 ? "" : "has-error is-invalid";
  }

  validateEmail = (email) => {
    const re =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(String(email).toLowerCase()))
      setTimeout(() => this.setErrors({ email: "Email is invalid" }), 800);
    else this.setErrors({ email: "" });
  };

  setErrors = (error) =>
    this.setState({
      formErrors: { ...this.state.formErrors, ...error },
    });

  onSubmit(e) {
    e.preventDefault();
    if (this.state.loginWithGoogleLoading || this.state.loading) {
      return;
    }
    this.setState({
      loginWithGoogleLoading: true,
      loading: true,
    });
    const newUser = {
      email: this.state.email,
      company: this.state.company,
      password1: this.state.password1,
      password2: this.state.password2,
    };

    this.props
      .registerUser(newUser, { ...this.props }, this.signal.token)
      .then(() => {
        this.setState({
          ...this.state,
          loading: false,
        });
      });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }
  }

  componentWillUnmount() {
    this.signal.cancel("The user aborted a request.");
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

  render() {
    const { loginWithGoogleLoading, googleLoginErrors, loading } = this.state;
    const { from } = this.props.location.state || { from: { pathname: "/" } };
    if (this.props.auth.isAuthenticated) {
      return <Redirect to={from ? from : ROOT} />;
    }
    const signUpError =
      !Object.keys(this.props.errors).includes("email") &&
      !Object.keys(this.props.errors).includes("password1") &&
      googleLoginErrors.length === 0 ? (
        <div></div>
      ) : (
        <div className="alert alert-danger">
          <FormErrors
            formErrors={
              googleLoginErrors.length > 0
                ? googleLoginErrors
                : this.props.errors
            }
          />
        </div>
      );

    return (
      <TldrBase
        heading={"Welcome, Let's get started"}
        showBackgroundImage
        wrapperClassName="register-wrapper"
      >
        <div className="mb-3 social-buttons">
          <GoogleLogin
            buttonText="Sign Up with Google"
            clientId={GOOGLE_CLIENT_ID}
            onSuccess={this.googleResponse}
            onFailure={this.onFailure}
            cookiePolicy={"single_host_origin"}
            className="social-btn-google"
            theme="dark"
          />
        </div>

        <div className="mt-2 form-option-divider">
          <hr className="tldr-hr" />
          <p>OR</p>
          <hr className="tldr-hr" />
        </div>

        {signUpError}
        <form onSubmit={this.onSubmit}>
          <div className="input-group">
            <StyledLoginFormControl
              type="email"
              name="email"
              className={`form-control ${this.errorClass(
                this.state.formErrors.email
              )}`}
              placeholder="Email"
              onBlur={(e) => this.validateEmail(e.target.value)}
              value={this.email}
              onChange={this.onChange}
            />
          </div>
          <div className="mb-3 error">{this.state.formErrors.email}</div>
          <div className="input-group">
            <StyledLoginFormControl
              type="text"
              name="company"
              className={`form-control ${this.errorClass(
                this.state.formErrors.company
              )}`}
              placeholder="Company"
              value={this.company}
              onChange={this.onChange}
            />
          </div>
          <div className="mb-3 error">{this.state.formErrors.company}</div>
          <div className="input-group">
            <StyledLoginFormControl
              type="password"
              name="password1"
              className={`form-control ${this.errorClass(
                this.state.formErrors.password1
              )}`}
              placeholder="Password"
              value={this.password1}
              onChange={this.onChange}
            />
          </div>
          <div className="mb-3 error">{this.state.formErrors.password1}</div>
          <div className="input-group">
            <StyledLoginFormControl
              type="password"
              name="password2"
              className={`form-control ${this.errorClass(
                this.state.formErrors.password2
              )}`}
              placeholder="Retype password"
              value={this.password2}
              onChange={this.onChange}
            />
          </div>
          <div className="mb-3 error">{this.state.formErrors.password2}</div>
          <div className="input-group mb-1 form-button">
            <button
              type="submit"
              className="btn btn-warning btn-lg tldr-login-btn"
              disabled={!this.state.formValid || loading}
            >
              {!loginWithGoogleLoading ? (
                <>Sign up</>
              ) : (
                this.renderSpinner("dark")
              )}
            </button>
            <p style={{ color: "red" }}>{this.state.formErrors.checked}</p>
          </div>
        </form>

        <div className="input-group mt-4 secondary-links">
          <label>
            Already signed up? <Link to={LOGIN}>Log In</Link>
          </label>
          <label>
            By registering I accept your{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://simplified.co/termsofservice"
            >
              Terms and conditions.
            </a>
          </label>
        </div>
      </TldrBase>
    );
  }
}

Register.prototypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, { registerUser, loginWithGoogle })(
  withRouter(Register)
);
