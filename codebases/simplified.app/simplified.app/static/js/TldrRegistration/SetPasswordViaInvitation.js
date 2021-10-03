import React, { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import TldrBase from "../TldrLogin/TldrBase";
import { withRouter, Redirect } from "react-router-dom";
import {
  StyledFormField,
  StyledFormRows,
} from "../_components/styled/settings/stylesSettings";
import { GoogleLogin } from "react-google-login";
import { GOOGLE_CLIENT_ID, INVITATIONS } from "../_actions/endpoints";
import { Link } from "react-router-dom";
import { Formik, Form, ErrorMessage } from "formik";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { connect } from "react-redux";
import * as yup from "yup";
import { SET_NEW_PASSWORD_VIA_INVITATION } from "../_actions/endpoints";
import { Spinner } from "react-bootstrap";

import {
  PASSWORD_SET_SUCCESS_VIA_INVITATION,
  PASSWORD_SET_FAILURE_VIA_INVITATION,
  LOGIN,
} from "../_utils/routes";
import { loginWithGoogle } from "../_actions/authActions";
import { ROOT } from "../_utils/routes";
import Format from "string-format";
import { ShowCenterSpinner } from "../_components/common/statelessView";

const validationSchema = yup.object({
  first_name: yup.string().required("First name cannot be empty."),
  last_name: yup.string().required("Last name cannot be empty."),
  password: yup
    .string()
    .min(8, "Password should be minimum 8 characters.")
    .required("Password is a required field"),
});

const googleResponse = (response, props) => {
  var invitationToken = props.match.params.token;
  const tokenJSON = {
    access_token: response.accessToken,
    invite_token: invitationToken,
  };
  props.loginWithGoogle(tokenJSON, props, "accepetedInvite");
};

const onFailure = (error) => {};

const SetPasswordViaInvitationForm = ({ data, props }) => (
  <Formik
    initialValues={{
      email: data.email,
      first_name: data.first_name,
      last_name: data.last_name,
      password: "",
    }}
    validationSchema={validationSchema}
    onSubmit={(values, { setSubmitting, setErrors, resetForm }) => {
      var userData = {
        first_name: values.first_name,
        last_name: values.last_name,
        password: values.password,
      };
      axios
        .post(
          SET_NEW_PASSWORD_VIA_INVITATION + `/${props.match.params.token}/`,
          userData
        )
        .then((res) => {
          setSubmitting(false);
          resetForm({ values: "" });
          props.history.push(PASSWORD_SET_SUCCESS_VIA_INVITATION);
        })
        .catch((error) => {
          setSubmitting(false);
          props.history.push(PASSWORD_SET_FAILURE_VIA_INVITATION);
        });
    }}
  >
    {({ isSubmitting, isValid, values }) => (
      <>
        <TldrBase
          showBackgroundImage
          heading={"Welcome"}
          subheading={
            "We are excited to onboard you. Sign up & start collaborating."
          }
        >
          <div className="row mt-2 mb-2 social-buttons">
            <GoogleLogin
              buttonText="Sign up with Google"
              clientId={GOOGLE_CLIENT_ID}
              onSuccess={(response) => googleResponse(response, props)}
              onFailure={onFailure}
              cookiePolicy={"single_host_origin"}
              render={(renderProps) => (
                <button
                  className="btn btn-outline-warning btn-lg tldr-login-btn"
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                >
                  <>
                    <FontAwesomeIcon icon={["fab", "google"]} /> Continue with
                    Google
                  </>
                </button>
              )}
            />
          </div>
          <hr className="tldr-hr" />
          {/* <div className="input-group mb-3 center">
            Please create your password.
          </div> */}
          <Form>
            <StyledFormRows>
              <div className="input-group mt-2">
                <StyledFormField
                  readOnly
                  className="input-group"
                  type="email"
                  name="email"
                  placeholder="Email"
                />
              </div>
            </StyledFormRows>
            <StyledFormRows>
              <div className="input-group mt-3">
                <StyledFormField
                  className="input-group"
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                />
              </div>
            </StyledFormRows>
            <StyledFormRows>
              <div className="input-group">
                <ErrorMessage
                  name="first_name"
                  component="div"
                  className="error"
                />
              </div>
            </StyledFormRows>
            <StyledFormRows>
              <div className="input-group mt-3">
                <StyledFormField
                  className="input-group"
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                />
              </div>
            </StyledFormRows>
            <StyledFormRows>
              <div className="input-group">
                <ErrorMessage
                  name="last_name"
                  component="div"
                  className="error"
                />
              </div>
            </StyledFormRows>
            <StyledFormRows>
              <div className="input-group mt-3">
                <StyledFormField
                  className="input-group"
                  type="password"
                  name="password"
                  placeholder="Password"
                />
              </div>
            </StyledFormRows>
            <StyledFormRows>
              <div className="input-group">
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error"
                />
              </div>
            </StyledFormRows>
            <button
              type="submit"
              className="btn btn-warning btn-lg tldr-login-btn mt-3 mb-3 float-right"
              disabled={values.first_name === "" || !isValid}
            >
              {!isSubmitting ? (
                "Sign Up"
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
            </button>
          </Form>
          <div className="input-group mt-3 secondary-links">
            <label>
              By registering I accept your{" "}
              <Link to="/register">Terms and conditions.</Link>
            </label>
          </div>
        </TldrBase>
        <div className="input-group mt-3 copyright">
          <div>Copyright © 2021 TLDR Technologies, Inc.</div>
        </div>
      </>
    )}
  </Formik>
);
class SetPasswordViaInvitation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      error: "",
      data: {},
    };
  }

  componentDidMount() {
    const {
      params: { token },
    } = this.props.match;

    axios
      .get(Format(INVITATIONS, token))
      .then((res) => {
        this.setState({
          loaded: true,
          token: token,
          data: res.data,
        });
      })
      .catch((error) => {
        this.setState({
          loaded: true,
          error: "Invalid url, please try again.",
        });
      });
  }

  render() {
    const { loaded, error, data } = this.state;

    if (this.props.auth.isAuthenticated) {
      return <Redirect to={ROOT} />;
    }
    return (
      <>
        {loaded && error ? (
          <TldrBase>
            <h2 className="text-center">Sorry!</h2>
            <div className="text-center">{error}</div>
            <div className="text-center mt-2 secondary-links">
              <Link to={LOGIN}>
                <FontAwesomeIcon icon="arrow-left" className="mr-1" />
                Back to login
              </Link>
            </div>
          </TldrBase>
        ) : loaded ? (
          <SetPasswordViaInvitationForm
            data={data}
            props={this.props}
          ></SetPasswordViaInvitationForm>
        ) : (
          <ShowCenterSpinner loaded={loaded}></ShowCenterSpinner>
        )}
      </>
    );
  }
}

SetPasswordViaInvitation.prototypes = {
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors,
});

const mapDispatchToProps = (dispatch) => ({
  loginWithGoogle: (token, props, action) =>
    dispatch(loginWithGoogle(token, props, action)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(SetPasswordViaInvitation));
