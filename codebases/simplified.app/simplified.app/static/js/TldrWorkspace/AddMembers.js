import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import TldrBase from "../TldrLogin/TldrBase";
import { Spinner } from "react-bootstrap";
import { Formik, Form } from "formik";
import axios from "axios";
import TldrFormControl from "../_components/common/TldrFormControl";
import { BULK_INVITE } from "../_actions/endpoints";
import Format from "string-format";
import { redirect } from "../_actions/commonAction";
import { USER_HOME } from "../_utils/routes";
import { Link } from "react-router-dom";

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const WorkspaceForm = ({ props }) => {
  var memberEmails = [];
  const getEmails = (listOfEmails) => {
    memberEmails = listOfEmails;
  };

  return (
    <Formik
      initialValues={{ emails: "" }}
      validate={(values) => {
        const errors = {};
        if (values.emails.length === 0 && memberEmails.length === 0) {
          errors.emails = "Please enter valid email address.";
          return errors;
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting, setErrors }) => {
        // to add the those emails which are not convered into tag
        if (values.emails.length > 0 && values.emails !== " ") {
          var emails = [values.emails];
          if (values.emails.indexOf(" ") > 0) {
            emails = values.emails.split(" ");
          } else if (values.emails.indexOf(",") > 0) {
            emails = values.emails.split(",");
          }
          memberEmails = memberEmails.concat(emails);
        }
        var emails = memberEmails;
        var valid = true;
        var payload = [];
        for (var i = 0; i < emails.length; i++) {
          var email = emails[i].replace(/,/g, "").trim();
          if (!validateEmail(email)) {
            valid = false;
            break;
          } else {
            payload.push({ is_admin: false, email: email });
          }
        }
        if (!valid) {
          setSubmitting(false);
          setErrors({ emails: "Please enter valid email address." });
          return;
        }
        axios
          .post(Format(BULK_INVITE, props.auth.payload.selectedOrg), payload)
          .then((res) => {
            setSubmitting(false);
            props.redirect(USER_HOME, props);
          })
          .catch((error) => {
            setSubmitting(false);
            if (error.response.status >= 404) {
              setErrors({
                name: "Sorry, something went wrong. Please contact the support.",
              });
            }
          });
      }}
    >
      {({ isSubmitting, values }) => {
        return (
          <Form className="mt-2">
            <TldrFormControl
              placeholder="Enter space separated email addresses"
              control="tags-textarea"
              label="Email address"
              name="emails"
              getEmails={getEmails}
            ></TldrFormControl>

            <div className="input-group mb-3 mt-3 form-button">
              <button
                type="submit"
                className="btn btn-block btn-lg btn-warning tldr-login-btn"
                disabled={
                  isSubmitting ||
                  (values.emails.length === 0 && memberEmails.length === 0)
                }
              >
                {!isSubmitting ? (
                  "Send Invitation"
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
            <hr className="tldr-hr" />

            <div className="text-center skip">
              <Link className="text-center skip" to={USER_HOME}>
                Skip for now
              </Link>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};

export const AddMembers = (props) => {
  return (
    <TldrBase
      heading={"Invite your teammates."}
      subheading={
        "Alone we can do so little, together we can do so much. Simplified works great for teams of any size."
      }
    >
      <WorkspaceForm props={props}></WorkspaceForm>
    </TldrBase>
  );
};

AddMembers.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    redirect: (path, props) => dispatch(redirect(path, props)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AddMembers);
