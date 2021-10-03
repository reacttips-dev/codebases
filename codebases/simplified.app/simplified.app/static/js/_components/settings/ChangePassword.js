import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  StyledBasicsSectionLabels,
  StyledFormField,
  StyledFormRows,
} from "../../_components/styled/settings/stylesSettings";
import { StyledButton } from "../styled/styles";
import { Spinner } from "react-bootstrap";
import { Formik, Form, ErrorMessage } from "formik";
import axios from "axios";
import { CHANGE_PASSWORD } from "../../_actions/endpoints";
import * as yup from "yup";
import { showToast } from "../../_actions/toastActions";

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

const ChangePasswordForm = ({ props }) => (
  <Formik
    initialValues={{ new_password1: "", new_password2: "" }}
    validationSchema={validationSchema}
    onSubmit={(values, { setSubmitting, setErrors, resetForm }) => {
      props.showToast({
        message: "Updating password ...",
        heading: "Updating",
        type: "info",
      });
      axios
        .post(CHANGE_PASSWORD, values)
        .then((res) => {
          setSubmitting(false);
          props.showToast({
            message: "Password updated",
            heading: "Success",
            type: "success",
          });
          resetForm({ values: "" });
        })
        .catch((error) => {
          setSubmitting(false);

          if (error.response.data !== null) {
            setErrors({
              new_password2: error.response.data.new_password2,
            });
          } else if (
            error.response.status === 404 ||
            error.response.status === 500 ||
            error.response.status === 400
          ) {
            setErrors({
              name: "Sorry, something went wrong. Please contact the support.",
            });
          }

          props.showToast({
            message: "Failed to update password",
            heading: "Error",
            type: "error",
          });
        });
    }}
  >
    {({ isSubmitting, isValid, values }) => (
      <Form>
        <StyledFormRows>
          <div className="input-group mt-3">
            <StyledBasicsSectionLabels>NEW PASSWORD</StyledBasicsSectionLabels>
            <StyledFormField
              className="input-group mr-3"
              type="password"
              name="new_password1"
              placeholder="New Password"
            />
          </div>

          <div className="input-group mt-3">
            <StyledBasicsSectionLabels>
              CONFIRM PASSWORD
            </StyledBasicsSectionLabels>
            <StyledFormField
              className="input-group"
              type="password"
              name="new_password2"
              placeholder="Confirm Password"
            />
          </div>
        </StyledFormRows>

        <StyledFormRows>
          <div className="input-group">
            <ErrorMessage
              name="new_password1"
              component="div"
              className="error"
            />
          </div>
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
          disabled={values.new_password1 === "" || !isValid}
          className="float-right mt-3"
        >
          {!isSubmitting ? (
            "Update"
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
    )}
  </Formik>
);

export const ChangePassword = (props) => {
  return <ChangePasswordForm props={props}></ChangePasswordForm>;
};

ChangePassword.propTypes = {
  errors: PropTypes.object.isRequired,
  story: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.errors,
  story: state.story,
});

const mapDispatchToProps = (dispatch) => ({
  showToast: (payload) => dispatch(showToast(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
