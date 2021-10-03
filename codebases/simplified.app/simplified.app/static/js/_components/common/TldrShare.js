import React, { Component } from "react";
import axios from "axios";
import { Modal, Dropdown } from "react-bootstrap";
import { Formik, Form, ErrorMessage } from "formik";
import PropTypes from "prop-types";
import {
  StyledButton,
  StyledLoginFormField,
  StyledDropdown,
  StyledInviteForm,
  StyledCopied,
  StyledShareWeb,
} from "../styled/styles";
import Format from "string-format";
import {
  ADD_MEMBER,
  DELETE_MEMBER,
  ADD_NEW_TEAM_MEMBER,
} from "../../_actions/endpoints";
import { StyledListUserListItem } from "../styled/styleFontBrowser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { PREVIEW } from "../../_utils/routes";
import { connect } from "react-redux";
import Switch from "react-switch";
import { accent, white, accentGrey } from "../styled/variable";
import { updateStory } from "../../_actions/storiesActions";
import { getModifiedMembers } from "../settings/statelessView";
import { analyticsTrackEvent } from "../../_utils/common";
import { showToast } from "../../_actions/toastActions";

const format = require("string-format");

const MemberView = ({ member, onAction }) => (
  <StyledListUserListItem>
    {member.email}
    <StyledDropdown>
      {!member.is_admin ? (
        <>
          <Dropdown.Toggle id="dropdown-invite-user">
            {!member.is_active ? "Pending" : "Editor"}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {!member.is_active && (
              <>
                <Dropdown.Item onClick={(e) => onAction("remind", member)}>
                  Remind
                </Dropdown.Item>
              </>
            )}

            {!member.is_pending && (
              <>
                <Dropdown.Item onClick={(e) => onAction("editor", member)}>
                  {!member.is_admin && (
                    <FontAwesomeIcon
                      color="yellow"
                      icon="check"
                      className="mr-1"
                    />
                  )}
                  Editor
                </Dropdown.Item>
                <Dropdown.Item onClick={(e) => onAction("viewer", member)}>
                  Viewer
                </Dropdown.Item>
              </>
            )}

            {!member.is_admin && (
              <>
                <Dropdown.Divider></Dropdown.Divider>

                <Dropdown.Item onClick={(e) => onAction("remove", member)}>
                  Remove
                </Dropdown.Item>
              </>
            )}
          </Dropdown.Menu>
        </>
      ) : (
        <>Owner</>
      )}
    </StyledDropdown>
  </StyledListUserListItem>
);

const InviteUser = ({ onSubmit, props }) => (
  <div className="mb-3 mt-2">
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
      onSubmit={(values, { setSubmitting, setErrors }) => {
        values["is_admin"] = false;
        setSubmitting(true);
        axios
          .post(Format(ADD_MEMBER, props.auth.payload.selectedOrg), values)
          .then((res) => {
            setSubmitting(false);
            onSubmit(res.data);
            analyticsTrackEvent("inviteMembers");
          })
          .catch((error) => {
            setSubmitting(false);
            setErrors({ email: error.response.data["email"]?.[0] });
          });
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <StyledInviteForm>
            <StyledLoginFormField
              type="email"
              name="email"
              placeholder="enter email address"
            />
            <StyledButton
              tldrbtn="primary"
              type="submit"
              className="ml-2"
              disabled={isSubmitting}
            >
              Send Invite
            </StyledButton>
          </StyledInviteForm>
          <ErrorMessage name="email" component="div" className="error" />
        </Form>
      )}
    </Formik>
  </div>
);

const ShareLink = ({
  shareLink,
  onSetCopy,
  isCopied,
  isSharingEnabled,
  onHandleSwitch,
}) => (
  <Formik enableReinitialize initialValues={{ link: shareLink }}>
    {() => (
      <StyledShareWeb>
        <div className="control">
          <div className="info">
            <div className="title">Share preview link on web</div>
            <div className="subtitle">
              {"Anyone with the link can preview."}
            </div>
          </div>
          <div className="toggle">
            <Switch
              onChange={() => onHandleSwitch(isSharingEnabled)}
              checked={isSharingEnabled}
              offColor={white}
              onColor={white}
              onHandleColor={accent}
              offHandleColor={accentGrey}
              checkedIcon={false}
              uncheckedIcon={false}
              height={16}
              width={32}
            />
          </div>
        </div>
        {isSharingEnabled && (
          <Form className="mt-2">
            <StyledInviteForm>
              <StyledLoginFormField
                readOnly={true}
                type="text"
                name="link"
                placeholder="copy preview link"
              />

              <CopyToClipboard text={shareLink} onCopy={() => onSetCopy()}>
                <StyledButton className="ml-2">
                  {isCopied ? (
                    <StyledCopied>
                      <FontAwesomeIcon icon={"copy"}></FontAwesomeIcon> Copied!
                    </StyledCopied>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={"copy"}></FontAwesomeIcon> Copy
                    </>
                  )}
                </StyledButton>
              </CopyToClipboard>
            </StyledInviteForm>
          </Form>
        )}
      </StyledShareWeb>
    )}
  </Formik>
);

export class TldrShare extends Component {
  signal = axios.CancelToken.source();
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      members: [],
      shareLink: "",
      isCopied: false,
      isSharingEnabled: false,
    };
  }

  onHandleSwitch = (isEnabled) => {
    this.setState({
      isSharingEnabled: !this.state.isSharingEnabled,
    });

    const storyId = this.props.story.payload.id;

    this.props.updateStory(
      storyId,
      {
        access: isEnabled ? 1 : 2,
        share: 1,
      },
      this.signal,
      { ...this.props }
    );
  };

  onSetCopy = () => {
    this.setState(
      {
        isCopied: true,
      },
      () => {
        setTimeout(() => {
          this.setState({
            isCopied: false,
          });
        }, 3000);
      }
    );
    analyticsTrackEvent("copiedSharedLink");
  };

  fetchCurrentSettings = () => {
    axios
      .get(Format(ADD_MEMBER, this.props.org))
      .then((res) => {
        this.setState({
          members: this.state.members.concat(res.data.results),
          loaded: true,
        });
      })
      .catch((error) => {});
  };

  onInvite = () => {};

  onAddUser = (newUser) => {
    this.setState({
      members: this.state.members.concat(newUser),
      loaded: true,
    });
  };

  onAction = (action, member) => {
    if (action === "remove") {
      axios
        .delete(Format(DELETE_MEMBER, this.props.org, member.id))
        .then((res) => {
          this.setState({
            members: this.state.members.filter(function (_member) {
              return _member.id !== member.id;
            }),
          });
        })
        .catch((error) => {});
    }
    if (action === "remind") {
      const userData = {
        email: member.email,
        is_admin: member.is_admin,
      };
      axios
        .post(
          ADD_NEW_TEAM_MEMBER +
            this.props.auth.payload.selectedOrg +
            "/members",
          userData,
          { params: { remind_me: true } }
        )
        .then((res) => {
          this.props.showToast({
            message: "Reminder sent successfully.",
            heading: "Success",
            type: "success",
          });
        })
        .catch((error) => {
          this.props.showToast({
            message: "Something went wrong, failed to send.",
            heading: "Opps",
            type: "error",
          });
        });
    }
  };

  onEmailChange = (e) => {
    this.validateField(e.target.name, e.target.value);
    this.setState({ [e.target.name]: e.target.value });
  };

  getPreviewUrl = () => {
    const previewUrl = format(
      PREVIEW,
      this.props.auth.payload.selectedOrg,
      this.props?.story?.payload?.id,
      encodeURIComponent(this.props?.story?.payload?.title)
    );
    return previewUrl;
  };

  componentWillMount() {
    this.fetchCurrentSettings();
  }

  componentDidMount() {
    this.setState({
      shareLink: window.location.origin + encodeURI(this.getPreviewUrl()),
      isSharingEnabled: this.props?.story?.payload?.access === 2 ? true : false,
    });
  }

  render() {
    const { loaded, members } = this.state;
    const { onHide, auth } = this.props;
    const storyId = this.props.story?.payload?.id;

    let modified_members = [];
    modified_members = getModifiedMembers(members);

    const membersList = modified_members.map((member, index) => (
      <MemberView
        key={index}
        member={member}
        onAction={this.onAction}
      ></MemberView>
    ));
    return (
      <div>
        <Modal show={true} onHide={onHide} centered size="m" backdrop="static">
          <Modal.Header>
            <Modal.Title>
              {storyId ? "Share with people" : "Invite your team"}
            </Modal.Title>
          </Modal.Header>
          <hr className="modal-hr" />
          <Modal.Body bsPrefix="modal-body share-modal-body">
            {loaded ? (
              <>
                {storyId && (
                  <>
                    <ShareLink
                      shareLink={this.state.shareLink}
                      isCopied={this.state.isCopied}
                      onSetCopy={this.onSetCopy}
                      isSharingEnabled={this.state.isSharingEnabled}
                      onHandleSwitch={this.onHandleSwitch}
                    ></ShareLink>
                    <hr className="modal-hr mt-3 mb-2 ml-0 mr-0" />
                  </>
                )}
                <StyledShareWeb>
                  <div className="info">
                    <div className="title">Invite to collaborate</div>
                  </div>
                </StyledShareWeb>
                <InviteUser
                  onSubmit={this.onAddUser}
                  props={this.props}
                ></InviteUser>
                {membersList}
              </>
            ) : (
              <div>Loading..</div>
            )}
          </Modal.Body>
          {/* <hr className="modal-hr" /> */}
          <Modal.Footer>
            <StyledButton
              onClick={(e) => {
                e.stopPropagation();
                onHide();
              }}
              tldrbtn="primary"
            >
              Close
            </StyledButton>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

TldrShare.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  story: state.story,
});

const mapDispatchToProps = (dispatch) => ({
  updateStory: (storyId, data, signal, props) =>
    dispatch(updateStory(storyId, data, signal, props)),
  showToast: (payload) => dispatch(showToast(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(TldrShare);
