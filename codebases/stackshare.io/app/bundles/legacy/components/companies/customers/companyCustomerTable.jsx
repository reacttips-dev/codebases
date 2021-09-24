import React, {Component} from 'react';
import {formatDistance, parseISO} from 'date-fns';
import CopyableTextarea from '../copyable_textarea/copyableTextarea.jsx';

export default class CompanyCustomerTable extends Component {
  constructor(props) {
    super(props);
    this.state = {customers: props.customers};
  }

  addEmailButton(customerId, customerName) {
    return (
      <button
        onClick={() => {
          this.props.onAddEmailClick(customerId, customerName);
        }}
        className="btn btn-ss-alt btn-sm edit-company-customer"
      >
        Add Email
      </button>
    );
  }

  customerLink(customer) {
    return <a href={customer['company_canonical_url']}>{customer['company_name']}</a>;
  }

  formatDate(date) {
    if (date) {
      const parsedDate = parseISO(date === '' ? new Date().toISOString() : date);
      return formatDistance(parsedDate, new Date(), {addSuffix: true});
    } else {
      return 'N/A';
    }
  }

  updateCopiedAtTimeForCustomer(customer) {
    $.ajax({
      method: 'POST',
      url: '/company-customers/update-copied-at',
      data: {id: customer['id']}
    });
  }

  showCopyableTextareaModal(customer) {
    this.updateCopiedAtTimeForCustomer(customer);
    this.setState({emailContent: customer['email_content']});
    $(this.refs.copyableTextareaModal).modal({show: true});
  }

  sendEmail(customer) {
    $.ajax({
      method: 'POST',
      url: '/send-invite',
      data: {id: customer['id']}
    })
      .done(result => {
        this.props.onCustomerEmailSent(result);
        sweetAlert(
          'Great!',
          'We’ve sent an email to your customer asking them to verify.',
          'success'
        );
      })
      .fail(() => sweetAlert('Oops...', 'Something went wrong sending this email.', 'error'));
  }

  actionButtons(customer) {
    if (customer['needs_email'] && customer['status'] !== 'Added') {
      return this.addEmailButton(customer['id'], customer['company_name']);
    } else if (customer['sent_at'] == null) {
      return (
        <div>
          <button
            onClick={this.showCopyableTextareaModal.bind(null, customer)}
            className="btn btn-ss btn-sm"
          >
            Copy Email
          </button>
          <button
            onClick={this.sendEmail.bind(null, customer)}
            style={{marginLeft: 5}}
            className="btn btn-ss btn-sm"
          >
            Send Email
          </button>
        </div>
      );
    } else {
      return (
        <div>
          <button
            onClick={this.showCopyableTextareaModal.bind(null, customer)}
            className="btn btn-ss btn-sm"
          >
            Copy Email
          </button>
        </div>
      );
    }
  }

  statusColorCodeStyle(customer) {
    if (customer.status === 'Customer Not Listed') {
      return 'customer-not-listed';
    } else if (customer.status === 'Email Sent' || customer.status === 'Email Copied') {
      return 'customer-pending';
    } else {
      return 'customer-listed';
    }
  }

  render() {
    let sortedCustomers = this.state.customers;
    sortedCustomers.sort(firstBy('id').thenBy('created_at'));
    sortedCustomers.reverse();

    return (
      <div>
        <table
          className="company-customers-list table table-hover table-bordered"
          style={{
            marginBottom: 200 + 'px'
          }}
        >
          <thead>
            <tr>
              <th>Service</th>
              <th>Customer</th>
              <th>
                Verified{' '}
                <div data-hint="Profile has been claimed by this company" className="hint--right">
                  <span className="octicon octicon-info" />
                </div>
              </th>
              <th>Invite Email</th>
              <th>Sent At</th>
              <th>Status</th>
              <th className="customer-table-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedCustomers.map((customer, i) => (
              <tr key={i}>
                <td>{customer['service']}</td>
                <td>
                  {customer['company_verified']
                    ? this.customerLink(customer)
                    : customer['company_name']}
                </td>
                <td>{customer['company_verified'] ? 'Yes' : 'No'}</td>
                <td>{customer['email']}</td>
                <td>{this.formatDate(customer['sent_at'])}</td>
                <td className={this.statusColorCodeStyle(customer)}>{customer['status']}</td>
                <td>{this.actionButtons(customer)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="modal fade" ref="copyableTextareaModal" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
                <h4 className="modal-title" id="gridSystemModalLabel">
                  Copy your email invite text here
                </h4>
              </div>
              <div className="modal-body">
                <CopyableTextarea copyValue={this.state.emailContent} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
