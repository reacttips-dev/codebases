import React, {Component} from 'react';
import CompanyCustomerForm from './companyCustomerForm.jsx';

export default class CompanyCustomerEditModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customerId: props.customerId,
      customerName: props.customerName,
      company_services: props.company_services
    };
  }

  render() {
    return (
      <div
        id="editCompanyCustomerModal"
        className="modal fade"
        role="dialog"
        tabIndex="-1"
        style={{outline: 'none', zIndex: 10000}}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <button className="close" data-dismiss="modal" type="button">
                <span>&times;</span>
              </button>
              <h4 id="myModalLabel">Add Email for Company Customer</h4>
            </div>

            <div className="modal-body" style={{paddingTop: 0, textAlign: 'inherit'}}>
              <CompanyCustomerForm
                editing={true}
                customerId={this.props.customerId}
                customerName={this.props.customerName}
                onCustomerEdited={this.props.onCustomerEdited}
                services={this.state.company_services}
              />
              <div className="clearfix" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
