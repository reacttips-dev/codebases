import React, {Component} from 'react';
import TextConfirmButton from '../text_confirm_button/text_confirm_button.jsx';

export default class DeleteUserModal extends Component {
  onConfirmClick() {
    $.ajax({
      url: '/users/delete',
      type: 'POST',
      success: () => (window.location = '/')
    });
  }

  renderStacks() {
    return (
      <div>
        <div className="delete-modal-sh">Stacks to be deleted</div>
        <ul>
          {this.props.stacks.map(function(name, i) {
            return <li key={i}>{name}</li>;
          })}
        </ul>
      </div>
    );
  }

  renderCompanies() {
    return (
      <div>
        <div className="delete-modal-sh">Companies to be deleted</div>
        <ul>
          {this.props.companies.map((name, i) => (
            <li key={i}>{name}</li>
          ))}
        </ul>
      </div>
    );
  }

  renderServices() {
    return (
      <div>
        <div className="delete-modal-sh">Tools to be deleted</div>
        <ul>
          {this.props.services.map((name, i) => (
            <li key={i}>{name}</li>
          ))}
        </ul>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="delete-modal-h">
          This action cannot be undone. This will <b>permanently delete</b> your account and all
          associated data including any and all of your comments, one-liners, votes, reviews,
          stacks, companies, or tools.
        </div>
        <br />
        {this.props.stacks.length > 0 && this.renderStacks()}
        {this.props.companies.length > 0 && this.renderCompanies()}
        {this.props.services.length > 0 && this.renderServices()}
        <hr />
        <TextConfirmButton
          buttonText="Delete My Account"
          confirmText={this.props.username}
          onConfirmClick={this.onConfirmClick}
          warning="To permanently delete your account and associated data, please type in your username to confirm."
        />
      </div>
    );
  }
}
