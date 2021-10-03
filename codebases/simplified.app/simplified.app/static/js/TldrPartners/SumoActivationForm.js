import React from "react";
import { ErrorMessage, Formik } from "formik";
import { Button, Form, Spinner } from "react-bootstrap";
import { StyledWorkSpaceFormField } from "../_components/styled/workspace/styles";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { handleHTTPError } from "../_actions/errorHandlerActions";
import { SUMO_ACTIVATE_ENDPOINT } from "../_actions/endpoints";
import Axios from "axios";
import Format from "string-format";
import { loginUser } from "../_actions/authActions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleRight } from "@fortawesome/free-solid-svg-icons";

const SumoActivationForm = (props) => {
  const { details } = props;

  return (
    <Formik
      initialValues={{
        email: details.email,
        workspace: "My workspace",
        password1: "",
        password2: "",
      }}
      validate={(values) => {
        const errors = {};
        if (!values.password1 || values.password1.length < 8) {
          errors.password1 = "Please enter valid password.";
        }
        if (!values.password2 || values.password2.length < 8) {
          errors.password2 = "Please enter valid password.";
        }
        if (values.password1 !== values.password2) {
          errors.password2 = "Please enter exact same password";
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting, setErrors }) => {
        setSubmitting(true);
        Axios.post(Format(SUMO_ACTIVATE_ENDPOINT, details.id), values)
          .then((res) => {
            const userData = {
              email: values.email,
              password: values.password1,
            };
            props.loginUser(userData, { props });
          })
          .catch((error) => {
            setSubmitting(false);
            if (error.response.status === 400) {
              setErrors({
                "password1":error.response.data?.password1,
                "password2":error.response.data?.password2,
                "email":error.response.data?.email,
              })
            }else{
              props.handleHTTPError(error, props);
            }
          });
      }}
    >
      {({ isSubmitting, handleChange, handleSubmit }) => (
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="center heading">You workspace is almost ready</div>
          <div className="center title">Please setup password to continue</div>

          <div className="input-group">
            <StyledWorkSpaceFormField
              className="input-group"
              type="email"
              name="email"
              readOnly
            />
            <label className="email-message">
              This is the email you choose when activating on AppSumo
            </label>
          </div>
          <ErrorMessage name="email" component="div" className="error" />

          <div className="input-group">
            <StyledWorkSpaceFormField
              className="input-group"
              placeholder="Enter password"
              type="password"
              name="password1"
              onChange={handleChange}
              autoComplete
            />
          </div>
          <ErrorMessage name="password1" component="div" className="error" />

          <div className="input-group">
            <StyledWorkSpaceFormField
              className="input-group"
              onChange={handleChange}
              placeholder="Confirm password"
              type="password"
              name="password2"
            />
          </div>
          <ErrorMessage name="password2" component="div" className="error" />

          <div className="input-group mb-3 mt-3 form-button">
            <Button
              type="submit"
              variant={"tprimary"}
              disabled={isSubmitting}
              className="form-button"
            >
              {!isSubmitting ? (
                <>
                Activate account <FontAwesomeIcon icon={faArrowCircleRight}></FontAwesomeIcon>
                </>
              ) : (
                <>
                  <Spinner
                    variant="dark"
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                </>
              )}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

SumoActivationForm.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  loginUser: (userData, props) => dispatch(loginUser(userData, props)),
  handleHTTPError: (error, props) => dispatch(handleHTTPError(error, props)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SumoActivationForm);
