import React, {Component} from 'react';

import CompanyMembershipMembers from './company_membership_members.jsx';
import CompanyMembershipLeaveTeam from './company_membership_leave_team.jsx';

export default class CompanyMembership extends Component {
  constructor() {
    super();

    this.state = {
      members: []
    };

    this.editMemberModal = this.editMemberModal.bind(this);
    this.editModalClick = this.editModalClick.bind(this);
    this.deleteMemberModal = this.deleteMemberModal.bind(this);
    this.deleteModalClick = this.deleteModalClick.bind(this);
    this.deleteMemberConfirmClick = this.deleteMemberConfirmClick.bind(this);
    this.inviteMemberConfirmClick = this.inviteMemberConfirmClick.bind(this);
    this.leaveMyTeamButton = this.leaveMyTeamButton.bind(this);
    this.resendInvite = this.resendInvite.bind(this);
    this.inviteSentModal = this.inviteSentModal.bind(this);
    this.submitEdit = this.submitEdit.bind(this);
  }

  componentDidMount() {
    let companyId = this.props.companyId;
    let self = this;
    $.get('/api/v1/company_owners', {company_id: companyId}, response => {
      self.setState({members: response, companyId: this.props.companyId});
      $('.company_membership_loading').remove();
    });

    // Ugly hack, will fix once we figure out NPM load order.
    setTimeout(function() {
      $('#username').selectize({
        valueField: 'id',
        labelField: 'username',
        searchField: 'username',
        create: false,
        highlight: false,
        maxItems: 1,
        render: {
          option: function(item) {
            return (
              '<div class="search-member-item">' +
              '<img src=' +
              item.image_url +
              ' />' +
              '<span>' +
              item.username +
              '</span>' +
              '</div>'
            );
          },
          item: function(item) {
            return (
              '<div class="search-member-item">' +
              '<img src=' +
              item.image_url +
              ' />' +
              '<span>' +
              item.username +
              '</span>' +
              '</div>'
            );
          }
        },
        load: function(query, callback) {
          if (!query.length) return callback();
          $.ajax({
            url: '/api/v1/company_owners/search', // Move this to a user controller in api v1.
            type: 'GET',
            data: {term: query},
            error: function() {
              callback();
            },
            success: function(res) {
              callback(res.slice(0, 10));
            }
          });
        }
      });
    }, 4000);
  }

  newMemberModal() {
    return (
      <div
        className="modal fade"
        id="add-member-modal"
        tabIndex="-2"
        role="dialog"
        aria-labelledby="add-member-modal"
      >
        <div className="modal-dialog manage-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 className="modal-title manage-modal-title" id="myModalLabel">
                New Member
              </h4>
              {this.state.newMemberError ? (
                <div className="alert alert-error">Please fill in</div>
              ) : (
                ''
              )}
            </div>
            <div className="modal-body manage-modal-body">
              <div className="form-group form-group-email">
                <label htmlFor="email">Email Address</label>
                <input ref="newMemberEmail" type="text" className="form-control" id="email" />
              </div>

              <div className="form-group modal-or">
                <label htmlFor="usr">or</label>
              </div>

              <div className="form-group">
                <label htmlFor="username">StackShare Username</label>
                <input ref="newMemberUserId" type="text" className="form-control" id="username" />
              </div>

              <hr />

              <div className="form-group">
                <label htmlFor="role">Role</label>
                <select ref="newMemberRole" className="form-control" id="role">
                  <option value="member">Member</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => this.inviteMemberConfirmClick()}
                type="button"
                className="btn btn-new-member"
              >
                Add Member
              </button>
              <p>We will send an invite if this user is not a member on StackShare</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  inviteMemberConfirmClick() {
    let role = this.refs.newMemberRole.value;
    let email = this.refs.newMemberEmail.value;
    let userId = this.refs.newMemberUserId.value;
    let companyId = this.state.companyId;
    let self = this;

    if (!((email || userId) && role)) {
      self.setState({newMemberError: true});
      return;
    }

    if (email) {
      // Fire off invite email for new  user.
      $.ajax({
        url: '/api/v1/company_owner_invites',
        type: 'POST',
        data: {company_id: companyId, email: email, role: role},
        success: function(res) {
          self.refs.newMemberEmail.value = null;
          self.refs.newMemberUserId.value = null;
          let newMember = {
            id: res.id,
            invitedByEmail: true,
            email: res.email,
            accepted: res.accepted,
            role: res.role
          };
          let members = self.state.members;
          members.push(newMember);
          self.setState({members: members, newMemberError: false});
          $('#add-member-modal').modal('hide');
          trackEvent('companyMembership.invitedNewStackShareUser', {member: newMember});
        },
        error: function() {
          $('#error-user-exists-modal').modal();
        }
      });
    } else {
      // Add existing stackshare user as company member.
      $.ajax({
        url: '/api/v1/company_owners/invite',
        type: 'POST',
        data: {company_id: companyId, user_id: userId, role: role},
        success: function(res) {
          self.refs.newMemberEmail.value = null;
          self.refs.newMemberUserId.value = null;
          let members = self.state.members;
          members.push(res);
          self.setState({members: members, newMemberError: false});
          $('#add-member-modal').modal('hide');
          self.setState({notificationMsg: 'Invite sent.'});
          trackEvent('companyMembership.invitedExistingStackShareUser', {member: res});
          setTimeout(() => {
            self.setState({notificationMsg: null});
          }, 5000);
        },
        error: function() {
          $('#error-user-exists-modal').modal();
        }
      });
    }
  }

  resendInvite(member) {
    let self = this;
    $.ajax({
      url: '/api/v1/company_owner_invites/resend',
      type: 'POST',
      data: {id: member.id, company_id: self.props.companyId},
      success: function() {
        trackEvent('companyMembership.resentInviteEmail', {member: member});
        $('#invite-sent-modal').modal();
      },
      error: function() {
        $('#invite-sent-modal').modal();
      }
    });
  }

  inviteSentModal() {
    return (
      <div
        className="modal fade"
        id="invite-sent-modal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="edit-member-modal"
      >
        <div className="modal-dialog manage-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 className="modal-title manage-modal-title" id="myModalLabel">
                Invite Sent
              </h4>
            </div>
            <div className="modal-body manage-modal-body">
              <p>Your invite has been sent.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  errorUserExistsModal() {
    return (
      <div
        className="modal fade"
        id="error-user-exists-modal"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="edit-member-modal"
      >
        <div className="modal-dialog manage-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 className="modal-title manage-modal-title" id="myModalLabel">
                Sorry
              </h4>
            </div>
            <div className="modal-body manage-modal-body">
              <p>It looks like that user is already part of the team.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  editMemberModal(editingMember) {
    return (
      <div
        className="modal fade"
        id="edit-member-modal"
        tabIndex="-2"
        role="dialog"
        aria-labelledby="edit-member-modal"
      >
        <div className="modal-dialog manage-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 className="modal-title manage-modal-title" id="myModalLabel">
                Edit Member
              </h4>
            </div>
            <div className="modal-body manage-modal-body">
              <form onSubmit={this.submitEdit}>
                <div className="form-group">
                  <input
                    ref="editing_id"
                    type="hidden"
                    id="id"
                    name="id"
                    value={editingMember ? editingMember.id : ''}
                  />
                  <label htmlFor="role">Role:</label>
                  <select ref="editing_role" className="form-control" id="role" name="role">
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <input
                  type="submit"
                  className="btn btn-new-member"
                  value="Update"
                  style={{marginBottom: 16 + 'px'}}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

  errorUserCannotLeaveTeam() {
    return (
      <div
        className="modal fade"
        id="error-user-cannot-leave-modal"
        tabIndex="-2"
        role="dialog"
        aria-labelledby="delete-member-modal"
      >
        <div className="modal-dialog manage-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 className="modal-title manage-modal-title" id="myModalLabel">
                Sorry
              </h4>
            </div>
            <div className="modal-body manage-modal-body-delete">
              <p>Before you can leave this team, you need to make someone else an admin.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  errorUserCannotDeleteModal() {
    return (
      <div
        className="modal fade"
        id="error-user-cannot-delete-modal"
        tabIndex="-2"
        role="dialog"
        aria-labelledby="delete-member-modal"
      >
        <div className="modal-dialog manage-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 className="modal-title manage-modal-title" id="myModalLabel">
                Sorry
              </h4>
            </div>
            <div className="modal-body manage-modal-body-delete">
              <p>You cannot delete yourself from a team.</p>
              <p>If you want to leave your team, click Leave My Team.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  deleteMemberModal(deletingMember) {
    return (
      <div
        className="modal fade"
        id="delete-member-modal"
        tabIndex="-2"
        role="dialog"
        aria-labelledby="delete-member-modal"
      >
        <div className="modal-dialog manage-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 className="modal-title manage-modal-title" id="myModalLabel">
                Remove Member
              </h4>
            </div>
            <div className="modal-body manage-modal-body-delete">
              <img src={deletingMember ? deletingMember.image_url : ''} width="64" /> Are you sure
              you want to remove
              <br />
              <span>{deletingMember ? deletingMember.username : ''}?</span>
            </div>
            <div className="modal-footer" style={{textAlign: 'center'}}>
              <button
                type="button"
                className="btn btn-new-member"
                data-dismiss="modal"
                style={{width: 47 + '%', display: 'inline', margin: 0}}
              >
                Cancel
              </button>
              <button
                onClick={() => this.deleteMemberConfirmClick(deletingMember)}
                type="button"
                className="btn btn-delete"
                style={{width: 47 + '%'}}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  deleteMemberConfirmClick(member) {
    let self = this;
    let companyId = this.state.companyId;

    $.ajax({
      url: '/api/v1/company_owners/' + member.id,
      type: 'DELETE',
      data: {id: member.id, company_id: companyId},
      success: function() {
        let members = self.state.members;
        for (let i in members) {
          if (members[i].id === member.id) {
            members.splice(i, 1);
            break;
          }
        }
        self.setState({members: members});
        trackEvent('companyMembership.deletedMember', {member: member});
        $('#delete-member-modal').modal('hide');
      },
      error: function() {
        $('#error-user-cannot-delete-modal').modal();
      }
    });
  }

  editModalClick(member) {
    this.setState({editingMember: member});
    trackEvent('companyMembership.editModalClick');
    $('#edit-member-modal').modal();
  }

  deleteModalClick(member) {
    this.setState({deletingMember: member});
    trackEvent('companyMembership.deleteModalClick');
    $('#delete-member-modal').modal();
  }

  submitEdit(e) {
    e.preventDefault();
    let id = this.refs.editing_id.value;
    let role = this.refs.editing_role.value;
    let companyId = this.state.companyId;
    let self = this;

    $.ajax({
      url: '/api/v1/company_owners/' + id,
      type: 'PATCH',
      data: {id: id, company_id: companyId, company_owner: {role: role}},
      success: function(response) {
        let members = self.state.members;
        for (let i in members) {
          if (members[i].id === response.id) {
            members[i].role = response.role;
            break;
          }
        }
        self.setState({members: members});
        trackEvent('companyMembership.editedMember', {member: id});
        $('#edit-member-modal').modal('hide');
      }
    });
  }

  noOtherAdmins() {
    let noOtherAdmins = true;
    let members = this.state.members;
    for (let i in members) {
      if (members[i].id !== this.props.currentUserCompanyOwnerId && members[i].role === 'admin') {
        noOtherAdmins = false;
      }
    }
    return noOtherAdmins;
  }

  leaveMyTeamButton() {
    let role = this.props.currentUserRole;
    if (this.state.members.length > 1 && role === 'admin' && this.noOtherAdmins()) {
      return (
        <a
          href="#"
          id="remove-myself"
          data-toggle="modal"
          data-target="#error-user-cannot-leave-modal"
        >
          Leave My Team
        </a>
      );
    } else {
      return (
        <CompanyMembershipLeaveTeam
          currentUserCompanyOwnerId={this.props.currentUserCompanyOwnerId}
          companyId={this.props.companyId}
          companyName={this.props.companyName}
          username={this.props.username}
        />
      );
    }
  }

  render() {
    return (
      <div style={{marginTop: 20}}>
        <div
          className="notification-banner"
          style={{height: this.state.notificationMsg ? '50px' : 0}}
        >
          {this.state.notificationMsg}
        </div>
        <div id="manage-header">
          <h2>{`Manage ${this.props.companyName}'s Team`}</h2>
          <a
            href="#"
            className="btn btn-ss-alt"
            data-toggle="modal"
            data-target="#add-member-modal"
            style={{float: 'right'}}
          >
            Add Member
          </a>
        </div>

        <CompanyMembershipMembers
          editModalClick={this.editModalClick}
          deleteModalClick={this.deleteModalClick}
          resendInvite={this.resendInvite}
          currentUsername={this.props.username}
          currentUserRole={this.props.currentUserRole}
          members={this.state.members}
        />

        {this.leaveMyTeamButton()}

        {this.newMemberModal()}
        {this.editMemberModal(this.state.editingMember)}
        {this.deleteMemberModal(this.state.deletingMember)}
        {this.errorUserExistsModal()}
        {this.errorUserCannotDeleteModal()}
        {this.errorUserCannotLeaveTeam()}
        {this.inviteSentModal()}
      </div>
    );
  }
}
