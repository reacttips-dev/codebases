import React from "react";
import { Form, Button, Modal, Col, Dropdown } from "react-bootstrap";
import {
  StyledBasicsSectionLabels,
  StyledModalButtons,
  StyledModal,
} from "../../_components/styled/settings/stylesSettings";
import {
  StyledDropdown,
  StyledInviteForm,
  StyledLoginFormField,
  StyledButton,
} from "../styled/styles";
import { StyledListUserListItem } from "../styled/styleFontBrowser";
import { Formik, ErrorMessage } from "formik";
import { Spinner } from "react-bootstrap";

export const columns = [
  {
    name: "ID",
    selector: "id",
    sortable: true,
  },
  {
    name: "Email",
    selector: "email",
    sortable: true,
  },
  {
    name: "Is Admin",
    selector: "is_admin",
    sortable: true,
  },

  {
    name: "Is Active",
    selector: "is_active",
    sortable: true,
  },
  {
    cell: (row) => (
      <Button
        variant="warning"
        onClick={(e) =>
          this.editUserDetails(row.id, row.email, row.is_active, row.is_admin)
        }
      >
        Edit
      </Button>
    ),
    ignoreRowClick: true,
  },
];

export const AddUser = ({ handleShowAddModal }) => {
  return (
    <>
      <Button key="add" variant="warning" onClick={handleShowAddModal}>
        Add
      </Button>
    </>
  );
};

export const OpenAddUserModal = ({
  title,
  state,
  handleCloseAddModal,
  onSubmitAddNewMember,
  onChange,
  onAddUserChange,
}) => {
  return (
    <>
      <StyledModal
        show={state.showAddUserModal}
        onHide={handleCloseAddModal}
        backdrop="static"
        size="sm"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Team Member</Modal.Title>
        </Modal.Header>
        <hr className="modal-hr" />
        <Modal.Body>
          <Form
            noValidate
            validated={state.validated}
            onSubmit={onSubmitAddNewMember}
          >
            <Form.Group controlId="formGroupEmail">
              <StyledBasicsSectionLabels>
                <Form.Label>EMAIL ADDRESS</Form.Label>
              </StyledBasicsSectionLabels>

              <Form.Control
                className="input-group modal-form-text-field"
                required
                name="email"
                placeholder="Email"
                value={state.email}
                onChange={onChange}
              />
            </Form.Group>
            <Form.Group id="formGridCheckbox">
              <Form.Check
                className="manage-account-forms"
                type="checkbox"
                label={
                  <StyledBasicsSectionLabels>
                    <Form.Label>MAKE ADMIN</Form.Label>
                  </StyledBasicsSectionLabels>
                }
                name="isAdmin"
                checked={state.isAdmin}
                onChange={onAddUserChange}
              />
            </Form.Group>

            <StyledModalButtons
              variant="warning"
              type="submit"
              onClick={handleCloseAddModal}
              disabled={!state.formValid}
              className="float-right variant fill fill-text"
            >
              Add
            </StyledModalButtons>
          </Form>
          <div className="mb-3 error" style={{ color: "red" }}>
            {state.formErrors.email}
          </div>
        </Modal.Body>
      </StyledModal>
    </>
  );
};

export const OpenDeleteUserModal = ({ state, handleCloseDeleteModal }) => {
  return (
    <>
      <Modal
        show={state.showDeleteModal}
        onHide={handleCloseDeleteModal}
        centered
        size="sm"
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Are you sure you want to delete this {state.editEmail} ?
          </Modal.Title>
        </Modal.Header>
        {/* <Modal.Body>This action is irreversible.</Modal.Body> */}
        <hr className="modal-hr" />
        <Modal.Footer>
          <Button variant="warning" className="float-right btn-group mr-2 mb-2">
            Yes
          </Button>
          <Button
            onClick={handleCloseDeleteModal}
            variant="outline-warning"
            className="float-right btn-group mr-2 mb-2"
            //disabled={inprogress === "true" ? true : false}
          >
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export const OpenCreateNewTeamModal = ({
  state,
  handleCloseCreateNewTeamModal,
  onSubmit_CreateNewTeam,
  onChange,
}) => {
  return (
    <>
      <Modal
        show={state.showCreateNewTeamModal}
        onHide={handleCloseCreateNewTeamModal}
        backdrop="static"
        size="sm"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={onSubmit_CreateNewTeam}>
            <Form.Group controlId="formGroupEmail">
              <Form.Label className="manage-account-forms">
                Team Name
              </Form.Label>
              <Form.Control
                name="teamName"
                placeholder="Team Name"
                value={state.teamName}
                onChange={onChange}
                required
              />
            </Form.Group>
            <Button
              variant="warning"
              type="submit"
              onClick={handleCloseCreateNewTeamModal}
            >
              Create Team
            </Button>{" "}
            <Button
              variant="outline-warning"
              onClick={handleCloseCreateNewTeamModal}
            >
              Cancel
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export const CreateNewTeamForm = ({
  state,
  onClear,
  onSubmit_CreateNewTeam,
  onChange,
}) => {
  return (
    <>
      <Form onSubmit={onSubmit_CreateNewTeam}>
        <Form.Group controlId="formGroupTeamName">
          <Form.Label className="manage-account-forms">Team Name</Form.Label>
          <Form.Control
            name="teamName"
            placeholder="Team Name"
            value={state.teamName}
            onChange={onChange}
          />
        </Form.Group>
        <Button
          variant="outline-warning"
          className="float-right variant fill-text"
          onClick={onClear}
        >
          Clear
        </Button>{" "}
        <Button
          variant="warning"
          type="submit"
          disabled={!state.formValid}
          className="float-right fill fill-text"
          //onClick={handleCloseCreateNewTeamModal}
        >
          Create Team
        </Button>
      </Form>
    </>
  );
};

export const UpdateWorkspace = React.forwardRef(
  (
    { props, state, handleCloseCreateNewTeamModal, onSubmit, onChange },
    ref
  ) => {
    return (
      <>
        <Form ref={ref} onSubmit={onSubmit}>
          <Form.Group controlId="formGroupName">
            <StyledBasicsSectionLabels>
              <Form.Label>WORKSPACE</Form.Label>
            </StyledBasicsSectionLabels>
            <Form.Control
              name="workspace"
              placeholder="Workspace"
              onChange={onChange}
            />
          </Form.Group>
          <div className="custom-margin">
            <Button
              variant="warning"
              type="submit"
              className="float-right fill fill-text"
              disabled={!state.formValid}
            >
              {/* Update */}
              {!state.startSpinner ? (
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
            </Button>
          </div>
        </Form>
      </>
    );
  }
);

export const PersonalInformationSection = ({
  props,
  state,
  onChange,
  onSubmit,
}) => {
  return (
    <Form onSubmit={onSubmit}>
      <Form.Row>
        <Form.Group as={Col} controlId="formGroupUsername">
          <StyledBasicsSectionLabels>
            <Form.Label>USERNAME</Form.Label>
          </StyledBasicsSectionLabels>
          <br></br>
          <Form.Label>{props.account?.payload?.username}</Form.Label>
        </Form.Group>

        <Form.Group as={Col} controlId="formGroupEmail">
          <StyledBasicsSectionLabels>
            <Form.Label>EMAIL ADDRESS</Form.Label>
          </StyledBasicsSectionLabels>
          <br></br>
          <Form.Label>{props.account.payload.email}</Form.Label>
        </Form.Group>
      </Form.Row>

      <Form.Row>
        <Form.Group as={Col} controlId="formGroupFirstName">
          <StyledBasicsSectionLabels>
            <Form.Label>FIRST NAME</Form.Label>
          </StyledBasicsSectionLabels>

          <Form.Control
            name="firstname"
            placeholder="FirstName"
            onChange={onChange}
            defaultValue={props.account.payload.first_name}
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formGroupLastName">
          <StyledBasicsSectionLabels>
            <Form.Label>LAST NAME</Form.Label>
          </StyledBasicsSectionLabels>

          <Form.Control
            name="lastname"
            placeholder="LastName"
            onChange={onChange}
            defaultValue={props.account.payload.last_name}
          />
        </Form.Group>
      </Form.Row>

      <Button
        variant="warning"
        type="submit"
        className="float-right fill fill-text"
        //disabled={!state.formValid}
      >
        {/* Save changes */}
        {!state.startSpinner ? (
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
      </Button>
    </Form>
  );
};

export const getModifiedMembers = (members) => {
  let modified_members = [];
  members.forEach((index, item) => {
    index.is_admin === true || index.is_admin === "Yes"
      ? (index.is_admin = true)
      : (index.is_admin = false);
    index.is_active === true || index.is_active === "Yes"
      ? (index.is_active = true)
      : (index.is_active = false);
    index.is_active === true || index.is_active === "Yes"
      ? (index.is_pending = false)
      : (index.is_pending = true);
    modified_members.push(index);
  });
  return modified_members;
};

export const MemberView = ({ member, onAction }) => (
  <StyledListUserListItem>
    {member.email}

    <StyledDropdown>
      {!member.is_admin ? (
        <>
          <Dropdown.Toggle id="dropdown-invite-user">Member</Dropdown.Toggle>

          <Dropdown.Menu>
            {!member.is_active && (
              <>
                <Dropdown.Item onClick={(e) => onAction("makeAdmin", member)}>
                  Make Admin
                </Dropdown.Item>
              </>
            )}
            {!member.is_admin && (
              <>
                <Dropdown.Item onClick={(e) => onAction("remove", member)}>
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
                <Dropdown.Item onClick={(e) => onAction("remove", member)}>
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

export const InviteUser = ({ org, onSubmit }) => (
  <div className="mb-3">
    <Formik
      initialValues={{ email: "" }}
      validate={(values) => {
        const errors = {};
        if (!values.email) {
          errors.email = "Required";
        } else if (
          !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
        ) {
          errors.email = "Invalid email address";
        }
        return errors;
      }}
      onSubmit={onSubmit}
    >
      <Form>
        <StyledInviteForm>
          <StyledLoginFormField
            type="email"
            name="email"
            placeholder="enter email address"
          />
          <StyledButton tldrbtn="primary" type="submit">
            Add Member
          </StyledButton>
        </StyledInviteForm>
        <ErrorMessage name="email" component="div" className="error" />
      </Form>
    </Formik>
  </div>
);
