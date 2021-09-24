import React, {Component} from 'react';
import TextConfirmButton from '../text_confirm_button/text_confirm_button.jsx';

export default class DeleteCompanyModal extends Component {
  onConfirmClick = () => {
    $.ajax({
      url: '/companies/delete',
      type: 'POST',
      data: {companyId: this.props.companyId},
      success: () => (window.location = '/')
    });
  };

  renderStacks() {
    return (
      <div>
        <div className="delete-modal-sh">Stacks to be deleted</div>
        <ul>
          {this.props.stacks.map((name, i) => (
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
          This action cannot be undone. This will <b>permanently delete</b> your company&apos;s
          account and all associated data including stack comments, favorites, jobs, and posts.
        </div>
        <br />
        {this.props.stacks.length > 0 && this.renderStacks()}
        {this.props.services.length > 0 && this.renderServices()}
        <hr />
        <TextConfirmButton
          buttonText="Delete My Company"
          confirmText={this.props.companyName}
          onConfirmClick={this.onConfirmClick}
          warning="To permanently delete your company and associated data, please type in your company name to confirm."
        />
      </div>
    );
  }
}
