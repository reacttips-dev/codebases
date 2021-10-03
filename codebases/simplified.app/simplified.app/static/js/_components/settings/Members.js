import React, { Component } from "react";
import { Spinner, Modal, Dropdown, Button } from "react-bootstrap";
import { Formik, Form, ErrorMessage } from "formik";
import axios from "axios";
import {
  ADD_NEW_TEAM_MEMBER,
  SHOW_MY_TEAM_MEMBERS,
  DELETE_MEMBER,
  EDIT_TEAM_MEMBER_DETAILS,
} from "../../_actions/endpoints";
import { getModifiedMembers } from "./statelessView";
import { StyledListUserListItem } from "../styled/styleFontBrowser";
import {
  StyledBasicsSectionLabels,
  StyledFormCheckboxField,
  StyledFormColumns,
  StyledFormRows,
  StyledModal,
} from "../styled/settings/stylesSettings";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Format from "string-format";
import * as yup from "yup";
import {
  StyledDropdown,
  StyledButton,
  StyledLoginFormField,
} from "../styled/styles";
import { showToast } from "../../_actions/toastActions";
import {
  analyticsTrackEvent,
  checkFeatureAvailability,
} from "../../_utils/common";
import { handleHTTPError } from "../../_actions/errorHandlerActions";
import { INVITE_MEMBERS } from "../details/constants";
import TldrUpgradeSubscriptionModal from "../../TldrSettings/TldrBillingAndPayments/Modals/TldrUpgradeSubscriptionModal";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Email is required"),
});

const AddNewMemberForm = ({ props, handleCloseAddModal, onSubmit }) => (
  <Formik
    enableReinitialize
    validationSchema={validationSchema}
    initialValues={{
      email: "",
      is_admin: false,
    }}
    onSubmit={(values, { setSubmitting, setErrors }) => {
      const { payload } = props.auth;
      axios
        .post(ADD_NEW_TEAM_MEMBER + payload.selectedOrg + "/members", values)
        .then((res) => {
          setSubmitting(true);
          onSubmit(res.data);
          props.showToast({
            message: "Successfully invited new team member",
            heading: "Success",
            type: "success",
          });
          analyticsTrackEvent("inviteMembers", {
            location: "settings",
          });
        })
        .catch((error) => {
          setSubmitting(false);
          setErrors({ email: error.response.data["email"]?.[0] });
          props.showToast({
            message: "Failed to add member",
            heading: "Error",
            type: "error",
          });
        });
    }}
  >
    {({ isSubmitting, isValid, values }) => (
      <Form>
        <Modal.Header>
          <Modal.Title>Invite member</Modal.Title>
        </Modal.Header>
        <hr className="modal-hr" />
        <Modal.Body>
          <StyledFormColumns>
            <div className="input-group">
              <StyledLoginFormField
                className="input-group"
                type="email"
                name="email"
                placeholder="Email Address"
              />
            </div>
            <ErrorMessage name="email" component="div" className="error" />
            {/* <span className="extra-member-subscription-warning">
              You will be charged $
              {props.subscription?.subscribedPlan?.plan?.amount} per member per{" "}
              {props.subscription?.subscribedPlan?.plan?.interval}
            </span> */}
            <div className="input-group mt-3">
              <StyledFormRows>
                <StyledFormCheckboxField
                  className="input-group mr-2"
                  type="checkbox"
                  name="is_admin"
                  id="makeAdminCheck"
                />

                <StyledBasicsSectionLabels for="makeAdminCheck">
                  Assign admin role
                </StyledBasicsSectionLabels>
              </StyledFormRows>
            </div>
          </StyledFormColumns>
        </Modal.Body>
        <hr className="modal-hr" />
        <Modal.Footer>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleCloseAddModal();
            }}
            variant="outline-warning"
            disabled={isSubmitting}
            className="float-right"
          >
            Cancel
          </Button>
          <Button
            tldrbtn="primary"
            type="submit"
            disabled={values.email === "" || !isValid}
            className="btn btn-warning tldr-login-btn float-right"
            onClick={handleCloseAddModal}
          >
            {!isSubmitting ? (
              "Send invitation"
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
          </Button>
        </Modal.Footer>
        {/*  */}
      </Form>
    )}
  </Formik>
);

const MemberView = ({ props, member, onAction }) => (
  <StyledListUserListItem>
    {member.email}

    <StyledDropdown>
      {!member.is_admin ? (
        <>
          <Dropdown.Toggle id="dropdown-invite-user">
            {!member.is_active ? "Pending" : "Member"}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {!member.is_active && member.is_pending && (
              <>
                <Dropdown.Item
                  onClick={(e) => onAction(props, "remind", member)}
                >
                  Remind
                </Dropdown.Item>
              </>
            )}
            {!member.is_admin && !member.is_pending && (
              <>
                <Dropdown.Item
                  onClick={(e) => onAction(props, "makeAdmin", member)}
                >
                  Make Admin
                </Dropdown.Item>
              </>
            )}
            {!member.is_admin && (
              <>
                <Dropdown.Item
                  onClick={(e) => onAction(props, "remove", member)}
                >
                  Remove
                </Dropdown.Item>
              </>
            )}
          </Dropdown.Menu>
        </>
      ) : member.is_admin && member.is_active ? (
        <>Owner</>
      ) : (
        <>
          <Dropdown.Toggle id="dropdown-invite-user">Owner</Dropdown.Toggle>

          <Dropdown.Menu>
            {!member.is_active && (
              <>
                <Dropdown.Item
                  onClick={(e) => onAction(props, "remove", member)}
                >
                  Remove
                </Dropdown.Item>
              </>
            )}
          </Dropdown.Menu>
        </>
      )}
    </StyledDropdown>
  </StyledListUserListItem>
);

export class Members extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadedMembers: false,
      members: [],
      showAddUserModal: false,
      showUpgradeSubscriptionModal: false,
    };
  }

  componentDidMount() {
    this.fetchCurrentMembers();
  }

  handleShowAddModal = () => {
    const isFeatureAvailable = checkFeatureAvailability(
      this.props,
      INVITE_MEMBERS
    );

    if (!isFeatureAvailable) {
      this.setState({
        showUpgradeSubscriptionModal: true,
      });
    } else {
      this.setState({
        showAddUserModal: true,
      });
    }
  };

  handleCloseAddModal = () => {
    this.setState({
      showAddUserModal: false,
    });
  };

  onAddUser = (newUser) => {
    this.setState({
      members: this.state.members.concat(newUser),
      loadedMembers: true,
    });
  };

  fetchCurrentMembers = () => {
    const { payload } = this.props.auth;
    axios
      .get(SHOW_MY_TEAM_MEMBERS + payload.selectedOrg + "/members")
      .then((res) => {
        this.setState({
          members: this.state.members.concat(res.data.results),
          loadedMembers: true,
        });
      })
      .catch((error) => {
        this.props.handleHTTPError(error, this.props);
      });
  };

  onAction = (props, action, member) => {
    const { payload } = props.auth;
    props.showToast({
      message: "Removing member ...",
      heading: "Updating",
      type: "info",
    });
    if (action === "remove") {
      axios
        .delete(Format(DELETE_MEMBER, payload.selectedOrg, member.id))
        .then((res) => {
          this.setState({
            members: this.state.members.filter(function (_member) {
              return _member.id !== member.id;
            }),
          });
          props.showToast({
            message: "Removed member",
            heading: "Success",
            type: "success",
          });
        })
        .catch((error) => {});
    }
    if (action === "makeAdmin") {
      props.showToast({
        message: "Updating member role to admin",
        heading: "Updating role",
        type: "info",
      });
      const updatedTeamMemberInfo = {
        email: member.email,
        is_admin: true,
      };

      axios
        .put(
          EDIT_TEAM_MEMBER_DETAILS +
            payload.selectedOrg +
            "/members/" +
            member.id,
          updatedTeamMemberInfo
        )
        .then((res) => {
          props.showToast({
            message: "Updated member role to admin",
            heading: "Updated",
            type: "success",
          });
        })
        .catch((error) => {});
    }
    if (action === "remind") {
      props.showToast({
        message: "Sending reminder to join ...",
        heading: "Reminder",
        type: "info",
      });
      const userData = {
        email: member.email,
        is_admin: member.is_admin,
      };
      axios
        .post(
          ADD_NEW_TEAM_MEMBER + payload.selectedOrg + "/members",
          userData,
          { params: { remind_me: true } }
        )
        .then((res) => {
          props.showToast({
            message: "Sent reminder to join the workspace",
            heading: "Success",
            type: "success",
          });
        })
        .catch((error) => {
          props.showToast({
            message: "Failed to add member",
            heading: "Error",
            type: "error",
          });
        });
    }
  };

  render() {
    const { loadedMembers, members } = this.state;

    //const loaded = this.props.account.loaded;
    let modified_members = [];
    if (loadedMembers && members) {
      modified_members = getModifiedMembers(members);
    }

    const membersList = modified_members.map((member) => (
      <MemberView
        key={member.id}
        member={member}
        onAction={this.onAction}
        props={this.props}
      ></MemberView>
    ));

    return (
      <div>
        <StyledButton
          className="mt-1 mb-1 fill fill-text mt-3"
          tldrbtn="primary"
          key="add"
          onClick={this.handleShowAddModal}
        >
          Invite Member
        </StyledButton>

        {membersList}

        <StyledModal
          show={this.state.showAddUserModal}
          onHide={this.handleCloseAddModal}
          backdrop="static"
          size="sm"
          centered
        >
          <AddNewMemberForm
            props={this.props}
            handleCloseAddModal={this.handleCloseAddModal}
            onSubmit={this.onAddUser}
          ></AddNewMemberForm>
        </StyledModal>

        <TldrUpgradeSubscriptionModal
          show={this.state.showUpgradeSubscriptionModal}
          onHide={() => {
            this.setState({
              ...this.state,
              showUpgradeSubscriptionModal: false,
            });
          }}
        />
      </div>
    );
  }
}

Members.propTypes = {
  errors: PropTypes.object.isRequired,
  story: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  errors: state.errors,
  story: state.story,
  auth: state.auth,
  subscription: state.subscription,
});

const mapDispatchToProps = (dispatch) => ({
  showToast: (payload) => dispatch(showToast(payload)),
  handleHTTPError: (error, props) => dispatch(handleHTTPError(error, props)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Members);
