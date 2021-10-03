import React, { useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { Button, Modal, Spinner } from "react-bootstrap";
import { StyledLoginFormField } from "../styled/styles";
import { ErrorMessage, Form, Formik } from "formik";
import { takeSnapshopAndCreateTemplate } from "../../_actions/storiesActions";
import { wsStatusMessage } from "../../_middleware/middleware";

function TldrCreateComponent(props) {
  let signal = axios.CancelToken.source();
  const { show, onHide } = props;

  useEffect(() => {
    return () => {
      signal.cancel("The user aborted a request.");
    };
  }, [signal]);

  const CreateComponent = ({ parentProps, signal }) => (
    <Formik
      initialValues={{ name: "My component" }}
      validate={(values) => {
        const errors = {};
        if (!values.name) {
          errors.name = "Please enter valid name.";
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting, setErrors }) => {
        takeSnapshopAndCreateTemplate(values.name, parentProps, signal)
          .then(() => {
            setSubmitting(false);
            parentProps.onHide();
          })
          .catch((error) => {
            setSubmitting(false);
            setErrors({
              name: "Sorry, something went wrong. Please try again.",
            });
          });
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Modal.Header>
            <Modal.Title>
              {isSubmitting ? "Creating a new component." : "Save as component"}
            </Modal.Title>
          </Modal.Header>
          <hr className="modal-hr" />
          <Modal.Body>
            <div>
              {isSubmitting
                ? "Hang in tight, creating a new component."
                : "Create it once and use anywhere."}
            </div>

            <div className="input-group mt-2">
              <StyledLoginFormField
                className="input-group"
                type="text"
                name="name"
                placeholder="Hint: Promotion headline"
              />
            </div>
            <ErrorMessage name="name" component="div" className="error" />
          </Modal.Body>
          <hr className="modal-hr" />
          <Modal.Footer>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                parentProps.onHide();
              }}
              variant="outline-warning"
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="btn btn-warning tldr-login-btn"
              disabled={isSubmitting}
            >
              {!isSubmitting ? (
                "Save now"
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
          </Modal.Footer>
        </Form>
      )}
    </Formik>
  );

  return (
    <Modal show={show} onHide={onHide} centered size="sm" backdrop="static">
      <CreateComponent parentProps={props} signal={signal}></CreateComponent>
    </Modal>
  );
}

TldrCreateComponent.propTypes = {};

const mapStateToProps = (state) => {
  return {
    editor: state.editor,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    wsStatusMessage: (message) => dispatch(wsStatusMessage(message)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TldrCreateComponent);
