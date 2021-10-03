import React, { useState, useEffect } from "react";
import { ErrorMessage, Formik } from "formik";
import { Button, Form, Spinner } from "react-bootstrap";
import { StyledWorkSpaceFormField } from "../_components/styled/workspace/styles";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { handleHTTPError } from "../_actions/errorHandlerActions";
import Select from "react-select";
import { sumoSelectWorkspaceOptionsStyle } from "../_components/styled/details/stylesSelect";
import { useHistory } from "react-router";
import { LOGIN, ROOT } from "../_utils/routes";
import { isEmpty } from "lodash";
import { SUMO_ASSOCIATE_ENDPOINT } from "../_actions/endpoints";
import Axios from "axios";
import Format from "string-format";

const SumoSelectWorkspaceForm = (props) => {
  const [message, setMessage] = useState("");
  const { details } = props;
  const history = useHistory();
  const { isAuthenticated, payload } = props.auth;
  const { orgs } = payload;
  const [workspaceOptions, setWorkspaceOptions] = useState([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      var options = [];
      orgs.forEach((workspace) => {
        options.push({
          value: workspace.id,
          label: workspace.name,
        });
      });

      setWorkspaceOptions(options);
    }
  }, [isAuthenticated]);

  return (
    <Formik
      initialValues={{ email: details.email }}
      validate={(values) => {
        const errors = {};
        return errors;
      }}
      onSubmit={(values, { setSubmitting, setErrors }) => {
        setSubmitting(true);
        Axios.post(Format(SUMO_ASSOCIATE_ENDPOINT, details.id), {
          org_id: selectedWorkspace.value,
        })
          .then((res) => {
            history.replace({ pathname: ROOT });
          })
          .catch((error) => {
            props.handleHTTPError(error, props);
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
          <div className="center heading">Welcome back!</div>
          <div className="center title">
            {isAuthenticated
              ? "Select a workspace to get started"
              : "Verify your Simplified account"}
          </div>

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

          {isAuthenticated && (
            <Select
              placeholder="Select Workspace"
              styles={sumoSelectWorkspaceOptionsStyle}
              isDisabled={!isAuthenticated}
              options={workspaceOptions}
              onChange={selectWorkspace}
            />
          )}

          <div className="input-group mb-3 mt-3 form-button">
            {isAuthenticated ? (
              <Button
                type="submit"
                variant={"tprimary"}
                disabled={isSubmitting || isEmpty(selectedWorkspace)}
                className="form-button"
              >
                {!isSubmitting ? (
                  "Activate plan"
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
            ) : (
              <Button
                type="submit"
                variant={"tprimary"}
                className="form-button"
                onClick={verifyAccount}
              >
                Verify account
              </Button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );

  function selectWorkspace(selected) {
    setSelectedWorkspace(selected);
  }

  function verifyAccount() {
    history.replace({
      pathname: LOGIN,
      state: {
        from: history.location,
        email: details?.email,
      },
    });
  }
};

SumoSelectWorkspaceForm.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

const mapDispatchToProps = (dispatch) => ({
  handleHTTPError: (error, props) => dispatch(handleHTTPError(error, props)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SumoSelectWorkspaceForm);
