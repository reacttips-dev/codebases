import React, {Component} from 'react';

export default class CompanyMembershipMembers extends Component {
  displayName(member) {
    if (member.name && member.name !== ' ') {
      return member.name;
    } else {
      return member.username;
    }
  }

  actionButtons(member) {
    if (this.props.currentUserRole === 'admin' && member.username !== this.props.currentUsername) {
      return (
        <div>
          <a onClick={() => this.props.editModalClick(member)} href="#">
            <i className="fa fa-pencil" aria-hidden="true" />
          </a>
          <a onClick={() => this.props.deleteModalClick(member)} href="#">
            <i className="fa fa-times-circle" aria-hidden="true" />
          </a>
        </div>
      );
    }
  }

  render() {
    return (
      <table className="table table-hover manage-team-table">
        <tbody>
          {this.props.members.map(member => {
            if (member.invitedByEmail) {
              return (
                <tr key={member.email}>
                  <th scope="row" className="profile-column">
                    <i
                      className="fa fa-question-circle"
                      aria-hidden="true"
                      style={{fontSize: 32 + 'px'}}
                    />
                  </th>
                  <td className="user">{member.email}</td>
                  <td style={{textTransform: 'capitalize'}}>{member.role} (Invited)</td>
                  <td className="edit-delete">
                    <button className="btn btn-ss" onClick={() => this.props.resendInvite(member)}>
                      Resend Invite
                    </button>
                  </td>
                </tr>
              );
            } else {
              return (
                <tr key={member.id}>
                  <th scope="row" className="profile-column">
                    <img src={member.image_url} />
                  </th>
                  <td className="user">{this.displayName(member)}</td>
                  <td style={{textTransform: 'capitalize'}}>{member.role}</td>
                  <td className="edit-delete">{this.actionButtons(member)}</td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
    );
  }
}
