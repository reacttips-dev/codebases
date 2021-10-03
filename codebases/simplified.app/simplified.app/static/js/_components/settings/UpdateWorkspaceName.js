import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Formik, Form, ErrorMessage } from "formik";
import axios from "axios";
import { UPDATE_WORKSPACE_NAME } from "../../_actions/endpoints";
import { Spinner } from "react-bootstrap";
import { StyledFormField } from "../styled/settings/stylesSettings";
import * as yup from "yup";
import { StyledButton } from "../styled/styles";
import { showToast } from "../../_actions/toastActions";
import { setWorkspaceName } from "../../_actions/authActions";
import { handleHTTPError } from "../../_actions/errorHandlerActions";

const validationSchema = yup.object({
  name: yup.string().required("Workspace name cannot be empty."),
});

const UpdateWorkspaceNameForm = ({ props, onSubmit }) => (
  <Formik
    enableReinitialize
    initialValues={{
      name: props.auth.payload.orgs.find(
        (orgs) => orgs.id === parseInt(props.auth.payload.selectedOrg)
      )?.name,
    }}
    validationSchema={validationSchema}
    onSubmit={(values, { setSubmitting, setErrors, resetForm }) => {
      props.showToast({
        message: "Updating workspace name ...",
        heading: "Updating",
        type: "info",
      });
      axios
        .patch(UPDATE_WORKSPACE_NAME + props.auth.payload.selectedOrg, values)
        .then((res) => {
          setSubmitting(false);
          onSubmit(values);
          props.setWorkspaceName({
            workspaceName: values.name,
          });
          props.showToast({
            message: "Workspace name updated",
            heading: "Updated",
            type: "success",
          });
          resetForm({ values: "" });
        })
        .catch((error) => {
          setSubmitting(false);
          props.handleHTTPError(error, props);
        });
    }}
  >
    {({ isSubmitting, values, isValid }) => (
      <Form>
        <div className="input-group mt-3">
          <StyledFormField className="input-group" type="text" name="name" />
        </div>
        <ErrorMessage name="name" component="div" className="error" />

        <div className="input-group mb-3 mt-3 form-button">
          <StyledButton
            tldrbtn="primary"
            type="submit"
            disabled={values.name === "" || !isValid}
            className="float-right"
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
        </div>
      </Form>
    )}
  </Formik>
);

export const UpdateWorkspaceName = (props) => {
  return (
    <UpdateWorkspaceNameForm
      props={props}
      onSubmit={onSubmit}
    ></UpdateWorkspaceNameForm>
  );
};

/* Set localStorage orgs value to update workspace name in Navbar */
const onSubmit = (values) => {
  let data = JSON.parse(localStorage.getItem("Orgs"));
  data.find(
    (x) => x.id === parseInt(localStorage.getItem("SelectedOrgID"))
  ).name = values.name;
  localStorage.setItem("Orgs", JSON.stringify(data));
};

UpdateWorkspaceName.propTypes = {
  story: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.errors,
  story: state.story,
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  showToast: (payload) => dispatch(showToast(payload)),
  setWorkspaceName: (payload) => dispatch(setWorkspaceName(payload)),
  handleHTTPError: (error, props) => dispatch(handleHTTPError(error, props)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UpdateWorkspaceName);
