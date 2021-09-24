import React, {Component} from 'react';

export default class CompanyMembershipLeaveTeam extends Component {
  constructor(props) {
    super(props);

    this.leaveTeamModal = this.leaveTeamModal.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleSecondConfirm = this.handleSecondConfirm.bind(this);

    this.state = {
      inputText: '',
      confirmText: this.props.username,
      buttonEnabled: false
    };
  }

  handleChange(event) {
    if (event.target.value === this.state.confirmText) {
      this.setState({buttonEnabled: true, inputText: event.target.value});
    } else {
      this.setState({buttonEnabled: false, inputText: event.target.value});
    }
  }

  handleConfirm() {
    this.setState({buttonEnabled: false});
    $('#confirm-leave-team').modal();
    $('#remove-member').modal('hide');
  }

  handleSecondConfirm() {
    let id = this.props.currentUserCompanyOwnerId;
    let companyId = this.props.companyId;

    $.ajax({
      url: '/api/v1/company_owners/leave_team/' + id,
      type: 'DELETE',
      data: {id: id, company_id: companyId},
      success: function() {
        trackEvent('companyMembership.leftTeam', {userId: id, companyId: companyId});
        window.location = '/';
      },
      error: function() {
        $('#error-user-only-admin-modal').modal();
        this.setState({buttonEnabled: true});
      }
    });
  }

  leaveTeamModal() {
    return (
      <div
        className="modal fade"
        id="remove-member"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="remove-member"
      >
        <div className="modal-dialog manage-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 className="modal-title manage-modal-title" id="myModalLabel">
                Confirm Removal
              </h4>
            </div>
            <div className="modal-body manage-modal-body">
              This will revoke your access to {this.props.companyName}’s company profile & stack on
              StackShare. To regain access you’ll need to request it from the company admin.
              <br />
              <br /> To leave, type your username in the field below
              <div className="input-group">
                <span className="input-group-addon" id="basic-addon1">
                  @
                </span>
                <input
                  placeholder={this.state.confirmText}
                  onChange={this.handleChange}
                  type="text"
                  className="form-control"
                  aria-describedby="basic-addon1"
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                onClick={this.handleConfirm}
                disabled={!this.state.buttonEnabled}
                type="button"
                className="btn btn-delete"
              >
                Leave {this.props.companyName}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  confirmLeaveTeamModal() {
    return (
      <div
        className="modal fade"
        id="confirm-leave-team"
        tabIndex="-1"
        role="dialog"
        aria-labelledby="remove-member"
      >
        <div className="modal-dialog manage-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
              <h4 className="modal-title manage-modal-title" id="myModalLabel">
                Confirm Removal
              </h4>
            </div>
            <div className="modal-body manage-modal-body">
              <p>Are you really sure?</p>
            </div>
            <div className="modal-footer">
              <button onClick={this.handleSecondConfirm} type="button" className="btn btn-delete">
                Yes, I am sure!
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  errorUserOnlyAdminModal() {
    return (
      <div
        className="modal fade"
        id="error-user-only-admin-modal"
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
              <p>Before you can leave this team, you need to make someone else an admin.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        {this.leaveTeamModal()}
        {this.confirmLeaveTeamModal()}
        {this.errorUserOnlyAdminModal()}

        <a href="#" id="remove-myself" data-toggle="modal" data-target="#remove-member">
          Leave My Team
        </a>
      </div>
    );
  }
}
