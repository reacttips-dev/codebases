import React from "react";
import { batch, connect } from "react-redux";
import TldrBase from "../TldrLogin/TldrBase";
import { Spinner } from "react-bootstrap";
import { Formik, Form, ErrorMessage } from "formik";
import { StyledWorkSpaceFormField } from "../_components/styled/workspace/styles";
import axios from "axios";
import { WORKSPACE } from "../_actions/endpoints";
import {
  analyticsTrackEvent,
  setAuthTokenInLocalStorage,
} from "../_utils/common";
import { redirect } from "../_actions/commonAction";
import { ADD_NEW_MEMBERS } from "../_utils/routes";

const WorkspaceForm = ({ props }) => (
  <Formik
    initialValues={{ name: "" }}
    validate={(values) => {
      const errors = {};
      if (!values.name) {
        errors.name = "Please enter valid name.";
      }
      return errors;
    }}
    onSubmit={(values, { setSubmitting, setErrors }) => {
      values["is_admin"] = true;
      axios
        .post(WORKSPACE, values)
        .then((res) => {
          setSubmitting(false);
          let orgs = JSON.parse(localStorage.getItem("Orgs"));
          if (orgs) {
            orgs.push(res.data);
          } else {
            orgs = [res.data];
          }
          const token = localStorage.getItem("Token");
          batch(() => {
            props.setAuthTokenInLocalStorage(token, res.data.id, orgs, props);
            props.redirect(ADD_NEW_MEMBERS, props);
            analyticsTrackEvent("createdWorkspace");
          });
        })
        .catch((error) => {
          setSubmitting(false);
          if (error.response.status === 404 || error.response.status === 500) {
            setErrors({
              name: "Sorry, something went wrong. Please contact the support.",
            });
          }
        });
    }}
  >
    {({ isSubmitting }) => (
      <Form>
        <div className="input-group">
          <StyledWorkSpaceFormField
            className="input-group"
            type="text"
            name="name"
            placeholder="Hint: Name of your company"
          />
        </div>
        <ErrorMessage name="name" component="div" className="error" />

        <div className="input-group mb-3 mt-3 form-button">
          <button
            type="submit"
            className="btn btn-block btn-lg btn-warning tldr-login-btn"
            disabled={isSubmitting}
          >
            {!isSubmitting ? (
              "Create workspace"
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
          </button>
        </div>
      </Form>
    )}
  </Formik>
);

export const CreateWorkspace = (props) => {
  return (
    <TldrBase
      heading={"Create workspace"}
      subheading={"Welcome, this is where creativity and collaboration begins."}
    >
      <WorkspaceForm props={props}></WorkspaceForm>
    </TldrBase>
  );
};

CreateWorkspace.propTypes = {};

const mapStateToProps = (state) => ({});
const mapDispatchToProps = (dispatch) => {
  return {
    setAuthTokenInLocalStorage: (token, id, orgs, props) =>
      dispatch(setAuthTokenInLocalStorage(token, id, orgs, props)),
    redirect: (path, props) => dispatch(redirect(path, props)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateWorkspace);
