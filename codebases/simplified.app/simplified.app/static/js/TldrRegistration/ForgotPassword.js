import React, { Component } from "react";
import { Link } from "react-router-dom";
import { StyledLoginFormControl } from "../_components/styled/styles";
import { LOGIN } from "../_utils/routes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { resetPassword } from "../_actions/authActions";
import { Spinner } from "react-bootstrap";
import TldrBase from "../TldrLogin/TldrBase";

class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formErrors: { email: "" },
      email: "",
      emailValid: false,
      formValid: false,
      loading: false,
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.validateField(e.target.name, e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  }

  validateField(fieldName, value) {
    let fieldValidationErrors = this.state.formErrors;
    let emailValid = this.state.emailValid;

    switch (fieldName) {
      case "email":
        emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        fieldValidationErrors.email = emailValid
          ? ""
          : "Please enter a valid email address.";
        break;
      default:
        break;
    }
    this.setState(
      {
        formErrors: fieldValidationErrors,
        emailValid: emailValid,
      },
      this.validateForm
    );
  }

  validateForm() {
    this.setState({
      formValid: this.state.emailValid,
    });
  }

  onSubmit(e) {
    e.preventDefault();

    this.setState({ loading: true });
    const userData = {
      email: this.state.email,
    };

    this.props.resetPassword(userData, { ...this.props });
  }

  render() {
    return (
      <TldrBase
        heading={"Reset password"}
        subheading={
          "Enter your account's email address and we'll send you a secure link to reset your password."
        }
      >
        <form onSubmit={this.onSubmit}>
          <div className="input-group mt-3 mb-3">
            <StyledLoginFormControl
              type="email"
              className="form-control"
              placeholder="Email"
              name="email"
              value={this.state.email}
              onChange={this.onChange}
            />
          </div>
          <div className="mb-3 error">{this.state.formErrors.email}</div>
          <div className="input-group mb-3 form-button">
            <button
              type="submit"
              className="btn btn-warning btn-lg tldr-login-btn"
              disabled={!this.state.formValid}
            >
              {!this.state.loading ? (
                "Reset password"
              ) : (
                <Spinner
                  variant="light"
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              )}
            </button>
          </div>
        </form>
        <div className="input-group mt-5 secondary-links">
          <Link to={LOGIN}>
            <FontAwesomeIcon icon="arrow-left" className="mr-1" />
            Back to sign in
          </Link>
        </div>
      </TldrBase>
    );
  }
}

ForgotPassword.propTypes = {
  resetPassword: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { resetPassword })(ForgotPassword);
