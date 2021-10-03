import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { StyledButton } from "../styled/styles";
import {
  StyledBasicsSectionLabels,
  StyledFormField,
  StyledFormRows,
} from "../../_components/styled/settings/stylesSettings";
import { Spinner } from "react-bootstrap";
import { Formik, Form } from "formik";
import axios from "axios";
import { GET_USER_INFO } from "../../_actions/endpoints";
import { showToast } from "../../_actions/toastActions";
import { handleHTTPError } from "../../_actions/errorHandlerActions";
import { updateUserPersonalInfo } from "../../_actions/authActions";

const UpdatePersonalInfoForm = ({ state, props, onSubmit }) => (
  <Formik
    enableReinitialize
    initialValues={{
      first_name: props.auth.payload.user.first_name,
      last_name: props.auth.payload.user.last_name,
    }}
    onSubmit={(values, { setSubmitting, setErrors, resetForm }) => {
      props.showToast({
        message: "Updating user account information",
        heading: "Updating",
        type: "info",
      });
      axios
        .patch(GET_USER_INFO, values)
        .then((res) => {
          setSubmitting(false);
          onSubmit(res.data);
          props.showToast({
            message: "User account information updated",
            heading: "Success",
            type: "success",
          });
          resetForm({ values: "" });
        })
        .catch((error) => {
          setSubmitting(false);
          props.showToast({
            message: "Failed to update information",
            heading: "Error",
            type: "error",
          });
          props.handleHTTPError(error, this.props);
        });
    }}
  >
    {({ isSubmitting, values, isValid }) => (
      <Form>
        <StyledFormRows>
          <div className="input-group mt-3">
            <StyledBasicsSectionLabels>USERNAME</StyledBasicsSectionLabels>
          </div>

          <div className="input-group mt-3">
            <StyledBasicsSectionLabels>EMAIL ADDRESS</StyledBasicsSectionLabels>
          </div>
        </StyledFormRows>

        <StyledFormRows>
          <div className="input-group mb-3">{state?.username}</div>

          <div className="input-group mb-3">{state?.email}</div>
        </StyledFormRows>
        <StyledFormRows>
          <div className="input-group">
            <StyledBasicsSectionLabels>FIRST NAME</StyledBasicsSectionLabels>
            <StyledFormField
              className="input-group mr-3"
              type="text"
              name="first_name"
            />
          </div>

          <div className="input-group">
            <StyledBasicsSectionLabels>LAST NAME</StyledBasicsSectionLabels>
            <StyledFormField
              className="input-group"
              type="text"
              name="last_name"
            />
          </div>
        </StyledFormRows>

        <StyledButton
          tldrbtn="primary"
          type="submit"
          disabled={values.first_name === "" || !isValid}
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

export class UpdatePersonalInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      username: "",
      first_name: "",
      last_name: "",
    };
  }

  componentDidMount() {
    this.getUserInfo();
  }

  getUserInfo = () => {
    axios
      .get(GET_USER_INFO)
      .then((res) => {
        this.setState({
          email: res.data?.email,
          username: res.data?.username,
          first_name: res.data?.first_name,
          last_name: res.data?.last_name,
        });
      })
      .catch((error) => {
        this.props.handleHTTPError(error, this.props);
      });
  };

  onSubmit = (info) => {
    let data = JSON.parse(localStorage.getItem("User"));
    data.first_name = info.first_name;
    data.last_name = info.last_name;
    data.full_name = info.full_name;
    localStorage.setItem("User", JSON.stringify(data));
    this.props.updateUserPersonalInfo(info);
  };

  render() {
    return (
      <UpdatePersonalInfoForm
        state={this.state}
        props={this.props}
        onSubmit={this.onSubmit}
      ></UpdatePersonalInfoForm>
    );
  }
}

UpdatePersonalInfo.propTypes = {
  errors: PropTypes.object.isRequired,
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
  handleHTTPError: (error, props) => dispatch(handleHTTPError(error, props)),
  updateUserPersonalInfo: (user) => dispatch(updateUserPersonalInfo(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(UpdatePersonalInfo);
