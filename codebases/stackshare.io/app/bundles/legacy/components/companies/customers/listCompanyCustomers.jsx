import React, {Component} from 'react';
import CompanyCustomerForm from './companyCustomerForm.jsx';
import CompanyCustomerEditModal from './companyCustomerEditModal.jsx';
import CompanyCustomerTable from './companyCustomerTable.jsx';

export default class ListCompanyCustomers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      company_services: props.company_services,
      customers: props.customers,
      editingCustomerId: null
    };
  }

  componentDidMount() {
    $('#comparison-loading').remove();
  }

  // When a customer is created in the form, we listen for the event
  // and add the resulting customer to the state.
  handleCustomerCreated = customer => {
    const new_customer = {
      id: customer['id'],
      company_name: customer['company_name'],
      email: customer['email'],
      needs_email: false,
      sent_at: customer['sent_at'],
      service: customer['service'],
      company_verified: customer['company_verified'],
      company_canonical_url: customer['company_canonical_url'],
      status: customer['status'],
      email_content: customer['email_content']
    };
    let customers = this.state.customers;
    customers.unshift(new_customer);
    this.setState({customers: customers});
  };

  // When a customer is edited in the modal dialog.
  handleCustomerEdited = customer => {
    const length = this.state.customers.length;
    let newCustomers = this.state.customers;
    for (let i = 0; i < length - 1; i++) {
      if (newCustomers[i]['id'] === customer.id) {
        newCustomers[i]['email'] = customer.email;
        newCustomers[i]['sent_at'] = null;
        newCustomers[i]['needs_email'] = false;
        newCustomers[i]['email_content'] = customer['email_content'];
      }
    }
    this.setState({customers: newCustomers});
  };

  handleCustomerEmailSent = customer => {
    const length = this.state.customers.length;
    let newCustomers = this.state.customers;
    for (let i = 0; i < length; i++) {
      if (newCustomers[i]['id'] === customer['id']) {
        newCustomers[i]['sent_at'] = customer['sent_at'];
        newCustomers[i]['needs_email'] = false;
      }
    }
    this.setState({customers: newCustomers});
  };

  handleAddEmailClick = (customerId, customerName) => {
    this.setState({editingCustomerId: customerId, editingCustomerName: customerName});
    $('#editCompanyCustomerModal').modal();
  };

  render() {
    return (
      <div>
        <CompanyCustomerForm
          services={this.state.company_services}
          onCustomerCreated={this.handleCustomerCreated}
        />
        <div className="clearfix" />
        <hr />
        <CompanyCustomerEditModal
          company_services={this.state.company_services}
          onCustomerEdited={this.handleCustomerEdited}
          customerName={this.state.editingCustomerName}
          customerId={this.state.editingCustomerId}
        />
        <CompanyCustomerTable
          customers={this.state.customers}
          onCustomerEmailSent={this.handleCustomerEmailSent}
          onAddEmailClick={this.handleAddEmailClick}
        />
      </div>
    );
  }
}
