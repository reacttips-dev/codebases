import React from "react";
import axios from "axios";
import PropTypes from "prop-types";
import TldrBase from "../TldrLogin/TldrBase";
import { withRouter } from "react-router-dom";
import {
  StyledFormField,
  StyledFormRows,
} from "../_components/styled/settings/stylesSettings";
import { StyledButton } from "../_components/styled/styles";
import { Formik, Form, ErrorMessage } from "formik";
import { connect } from "react-redux";
import * as yup from "yup";
import { RESET_PASSWORD_CONFIRMATION } from "../_actions/endpoints";
import { Spinner } from "react-bootstrap";
import {
  PASSWORD_RESET_SUCCESS,
  PASSWORD_RESET_FAILURE,
} from "../_utils/routes";

const validationSchema = yup.object({
  new_password1: yup
    .string()
    .min(8, "Password should be minimum 8 characters.")
    .required("Password is a required field"),
  new_password2: yup
    .string()
    .required("Confirm Password is a required field.")
    .oneOf([yup.ref("new_password1"), null], "Passwords must match."),
});

const ResetPasswordForm = ({ props }) => (
  <Formik
    initialValues={{ new_password1: "", new_password2: "" }}
    validationSchema={validationSchema}
    onSubmit={(values, { setSubmitting, setErrors, resetForm }) => {
      var userData = {
        uid: props.match.params.uid,
        token: props.match.params.token,
        new_password1: values.new_password1,
        new_password2: values.new_password2,
      };
      axios
        .post(RESET_PASSWORD_CONFIRMATION, userData)
        .then((res) => {
          setSubmitting(false);
          resetForm({ values: "" });
          props.history.push(PASSWORD_RESET_SUCCESS);
        })
        .catch((error) => {
          setSubmitting(false);
          props.history.push(PASSWORD_RESET_FAILURE);
        });
    }}
  >
    {({ isSubmitting }) => (
      <TldrBase
        subheading={"Please enter your new password."}
        heading={"Reset Password"}
      >
        <hr className="tldr-hr" />
        <Form>
          <div className="input-group mt-2">
            <StyledFormField
              className="input-group"
              type="password"
              name="new_password1"
              placeholder="New password"
            />
          </div>

          <StyledFormRows>
            <div className="input-group">
              <ErrorMessage
                name="new_password1"
                component="div"
                className="error"
              />
            </div>
          </StyledFormRows>

          <div className="input-group mt-3">
            <StyledFormField
              className="input-group"
              type="password"
              name="new_password2"
              placeholder="Confirm password"
            />
          </div>

          <StyledFormRows>
            <div className="input-group">
              <ErrorMessage
                name="new_password2"
                component="div"
                className="error"
              />
            </div>
          </StyledFormRows>

          <StyledButton
            tldrbtn="primary"
            type="submit"
            disabled={isSubmitting}
            className="btn btn-warning btn-lg tldr-login-btn float-right mt-3"
          >
            {!isSubmitting ? (
              "Reset"
            ) : (
              <Spinner
                variant="dark"
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
          </StyledButton>
        </Form>
      </TldrBase>
    )}
  </Formik>
);

export const ResetPassword = (props) => {
  return <ResetPasswordForm props={props}></ResetPasswordForm>;
};

ResetPassword.prototypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

export default connect(mapStateToProps, null)(withRouter(ResetPassword));
