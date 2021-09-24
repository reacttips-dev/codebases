import React, {Component} from 'react';

const isNumeric = n => !isNaN(parseFloat(n)) && isFinite(n);

// http://codereview.stackexchange.com/a/92377
const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

const entityMap = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '/': '&#x2F;'
};

export default class CompanyCustomerForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      submitState: 'Add Customer Below',
      manualInviteState: `I'll invite them myself`,
      validCustomer: false,
      selectedService: props.services[0].id,
      selectedCompanyId: null,
      selectedCompanyName: null,
      selectedEmail: null,
      selectedEmailPartOne: null,
      selectedEmailPartTwo: null,
      multipartEmail: false,
      processingSubmit: false,
      editing: false, // These three state properties are used for editing customers.
      customerId: null, // These three state properties are used for editing customers.
      customerName: null, // These three state properties are used for editing customers.,
      showEmailTextarea: false,
      emailText: ''
    };
    this.companySelect = null;
  }

  // Begin select2 initialization and helper methods.
  componentDidMount() {
    $(this.companySelect).select2({
      placeholder: 'Search for a company',
      minimumInputLength: 1,
      ajax: {
        url: '/companies/search',
        dataType: 'json',
        quietMillis: 250,
        data: function(term) {
          return {
            name: term // search term
          };
        },
        results: function(data) {
          return {
            results: data
          };
        },
        cache: true
      },
      escapeMarkup: function(markup) {
        return markup;
      },
      dropdownCssClass: 'bigdrop',
      formatResult: this.repoFormatResult,
      formatSelection: this.repoFormatSelection,
      createSearchChoice: this.repoNewCompany
    });

    $(this.companySelect).on('select2-selecting', this.handleCompanyNameChange);
  }

  // If the user has clicked edit, we should perform a select2 search.
  UNSAFE_componentWillReceiveProps({customerName}) {
    if (this.props.editing === true) {
      this.setState({customerName});
    }
  }

  componentDidUpdate(prevProps) {
    const {customerName} = this.state;
    if (this.props.editing === true && prevProps.customerName !== customerName) {
      // We need a timeout here because the modal dialog takes a few milliseconds
      // to slide down, making the select2 dropdown 'init' on the wrong vertical
      // position.
      setTimeout(() => {
        $(this.companySelect).select2('search', customerName);
      }, 400);
    }
  }

  repoFormatResult = repo => {
    if (isNumeric(repo.id)) {
      // This is an existing company.
      return repo.name;
    } else {
      // This is a brand new company.
      return `<span class="label label-important">New</span> ${this.escapeHtml(repo.name)}`;
    }
  };

  escapeHtml(string) {
    return String(string).replace(/[&<>"'/]/g, function(s) {
      return entityMap[s];
    });
  }

  repoFormatSelection = repo => {
    return repo.name;
  };

  repoNewCompany = (term, data) => {
    if (
      $(data).filter(function() {
        return this.name.toLowerCase().localeCompare(term.toLowerCase()) === 0;
      }).length === 0
    ) {
      return {id: term, text: term, name: term};
    }
  };

  parseUri(str) {
    const o = {
      strictMode: false,
      key: [
        'source',
        'protocol',
        'authority',
        'userInfo',
        'user',
        'password',
        'host',
        'port',
        'relative',
        'path',
        'directory',
        'file',
        'query',
        'anchor'
      ],
      q: {
        name: 'queryKey',
        parser: /(?:^|&)([^&=]*)=?([^&]*)/g
      },
      parser: {
        strict: /^(?:([^:/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:/?#]*)(?::(\d*))?))?((((?:[^?#/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,
        loose: /^(?:(?![^:@]+:[^:@/]*@)([^:/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#/]*\.[^?#/.]+(?:[?#]|$)))*\/?)?([^?#/]*))(?:\?([^#]*))?(?:#(.*))?)/
      }
    };

    const m = o.parser[o.strictMode ? 'strict' : 'loose'].exec(str);
    let uri = {};
    let i = 14;

    while (i--) uri[o.key[i]] = m[i] || '';

    uri[o.q.name] = {};
    uri[o.key[12]].replace(o.q.parser, function($0, $1, $2) {
      if ($1) uri[o.q.name][$1] = $2;
    });

    let url = uri.host;

    // Strip beginning www if it exists.
    if (url.substring(0, 4) === 'www.') {
      url = url.substring(4);
    }

    // Strip subdomain.
    if (url.substring(0, 4) === 'www.') {
      //url = url.substring(4);
    }

    return '@' + url;
  }

  // End select2 initialization and helper methods.

  // Event fired when user selects a service from the dropdown.
  handleServiceChange = event => {
    this.setState({selectedService: parseInt(event.target.value, 10)});
  };

  // Event fired when user types something into the email field.
  handleEmailChange = event => {
    this.setState({selectedEmail: event.target.value});
  };

  // Event fired when user types something into the email part one field.
  handleEmailPartOneChange = event => {
    this.setState({selectedEmailPartOne: event.target.value});
  };

  // Event fired when user selects something in the select2 element.
  handleCompanyNameChange = event => {
    this.setState({
      selectedCompanyId: null,
      selectedEmail: null,
      selectedCompanyName: null,
      selectedEmailPartOne: null,
      selectedEmailPartTwo: null
    });

    const selectedValue = event.val;
    if (isNumeric(selectedValue)) {
      // User selected an existing company. Since the user picked an existing
      // company set multi-part email inputs.
      const selectedCompanyUrl = this.parseUri(event.choice.website_url);
      this.setState({
        existingCompany: true,
        multipartEmail: true,
        selectedCompanyId: selectedValue,
        selectedEmailPartOne: '',
        selectedEmailPartTwo: selectedCompanyUrl
      });
    } else {
      // User typed in a new company in the select2.
      this.setState({
        existingCompany: false,
        multipartEmail: false,
        selectedCompanyName: selectedValue
      });
    }
  };

  validateEmail(email) {
    return emailRegex.test(email);
  }

  enableSubmit() {
    let customerValid = true;
    let companyValid = true;
    let serviceValid = true;
    let emailValid = true;

    if (
      this.state.selectedCompanyId == null &&
      (this.state.selectedCompanyName === '' || this.state.selectedCompanyName == null)
    ) {
      companyValid = false;
    }

    if (this.state.selectedService == null) {
      serviceValid = false;
    }

    if (this.state.multipartEmail === false) {
      emailValid = this.validateEmail(this.state.selectedEmail);
    } else {
      emailValid = this.validateEmail(
        this.state.selectedEmailPartOne + this.state.selectedEmailPartTwo
      );
    }

    if (companyValid && serviceValid && emailValid) {
      customerValid = true;
    } else {
      customerValid = false;
    }

    // Enable the submit button only if the customer is valid and
    // the component is not processing.
    return customerValid && !this.state.processingSubmit;
  }

  multiPartEmailInput() {
    return (
      <div>
        <div
          className="input-group split-email"
          style={{marginBottom: 10 + 'px', width: 270 + 'px'}}
        >
          <input
            onChange={this.handleEmailPartOneChange}
            value={this.state.selectedEmailPartOne || ''}
            type="text"
            name="first-part-email"
            className="form-control"
            id="email"
            style={{textAlign: 'right'}}
          />
          <div className="input-group-addon second-part-email" style={{paddingLeft: 5 + 'px'}}>
            {this.state.selectedEmailPartTwo}
          </div>
        </div>
        <div style={{fontStyle: 'italic', color: 'grey'}}>
          Domain for email address is prefilled, please dont enter the full email address
        </div>
      </div>
    );
  }

  emailInput() {
    return (
      <input
        onChange={this.handleEmailChange}
        value={this.state.selectedEmail || ''}
        type="text"
        ref="email"
        style={{marginBottom: 10 + 'px'}}
        className="form-control singlepart-email"
        placeholder="Email address"
      />
    );
  }

  addCustomer = e => {
    e.preventDefault();
    // When adding a new customer.
    if (this.props.onCustomerCreated) {
      // Disable the submit button.
      this.setState({processingSubmit: true, submitState: 'Adding customer...'});
      // Prepare ajax data payload.
      let data = {};
      data['company_customer[service_id]'] = this.state.selectedService;
      data['company_name'] = this.state.selectedCompanyId || this.state.selectedCompanyName;
      if (this.state.multipartEmail) {
        data['company_customer[email]'] =
          this.state.selectedEmailPartOne + this.state.selectedEmailPartTwo;
      } else {
        data['company_customer[email]'] = this.state.selectedEmail;
      }

      data['existing_company'] = this.state.existingCompany;

      // Fire off AJAX request.
      $.ajax({
        method: 'POST',
        url: '/company_customers',
        data: data
      })
        .done(result => {
          this.props.onCustomerCreated(result);
          this.resetComponent();
          $('html, body').animate(
            {
              scrollTop: $('table').offset().top
            },
            300
          );
        })
        .fail(result => {
          if (result.responseJSON.message === 'already has service') {
            sweetAlert(
              'Oops...',
              'This customer has already listed you as part of their stack.',
              'error'
            );
          } else {
            sweetAlert(
              'Oops...',
              "Sorry you've already added a customer with that email address.",
              'error'
            );
          }
          this.setState({
            submitState: 'Add Customer Below',
            validCustomer: false,
            processingSubmit: false
          });
        });
    }

    // When editing an existing customer.
    if (this.props.onCustomerEdited) {
      this.setState({processingSubmit: true, submitState: 'Updating customer...'});

      // Prepare ajax data payload.
      let data = {};
      data['company_customer[service_id]'] = this.state.selectedService;
      data['company_name'] = this.state.selectedCompanyId || this.state.selectedCompanyName;
      if (this.state.multipartEmail) {
        data['company_customer[email]'] =
          this.state.selectedEmailPartOne + this.state.selectedEmailPartTwo;
      } else {
        data['company_customer[email]'] = this.state.selectedEmail;
      }

      data['existing_company'] = this.state.existingCompany;
      data['customerId'] = this.props.customerId;

      // Fire off AJAX request.
      $.ajax({
        method: 'PATCH',
        url: '/company_customers/' + data['customerId'],
        data: data
      })
        .done(result => {
          this.props.onCustomerEdited(result);
          this.resetComponent();
          $('#editCompanyCustomerModal').modal('hide');
          $('html, body').animate(
            {
              scrollTop: $('table').offset().top
            },
            300
          );
        })
        .fail(result => {
          if (result.responseJSON.message === 'already has service') {
            sweetAlert(
              'Oops...',
              'This customer has already listed you as part of their stack.',
              'error'
            );
          } else {
            sweetAlert(
              'Oops...',
              "Sorry you've already added a customer with that email address.",
              'error'
            );
          }
          this.setState({
            submitState: 'Add Customer Below',
            validCustomer: false,
            processingSubmit: false
          });
        });
    }
  };

  resetComponent() {
    this.setState({
      submitState: 'Add Customer Below',
      manualInviteState: `I'll invite them myself`,
      validCustomer: false,
      selectedCompanyId: null,
      selectedCompanyName: null,
      selectedEmail: null,
      selectedEmailPartOne: null,
      selectedEmailPartTwo: null,
      multipartEmail: false,
      processingSubmit: false
    });
    $(this.companySelect).select2('val', '');
  }

  render() {
    return (
      <form className="company-customer" onSubmit={this.addCustomer}>
        <input type="hidden" value={this.props.customerId || ''} name="company_customer[id]" />
        <label>Service you&apos;d like to list this customer under:</label>
        <select
          onChange={this.handleServiceChange}
          ref="service_id"
          className="form-control"
          style={{marginBottom: 10 + 'px'}}
        >
          {this.props.services.map((service, i) => (
            <option key={i} value={service['id']}>
              {service['name']}
            </option>
          ))}
        </select>

        <br />

        <label>Customer&apos;s Company Name</label>
        <div className="select-company-ajax">
          <input
            type="hidden"
            ref={el => (this.companySelect = el)}
            name="company_name"
            className="select2-company-ajax"
          />
        </div>

        <br />

        <label>Employee&apos;s Email Address</label>
        <span className="no-email">No email will be sent</span>

        {this.state.multipartEmail ? this.multiPartEmailInput() : this.emailInput()}

        <br />

        <button
          type="submit"
          value={this.state.submitState}
          className="btn btn-ss-alt btn-lg add-customer"
          disabled={!this.enableSubmit()}
          style={{
            float: 'left',
            marginBottom: 40 + 'px',
            width: 'auto !important',
            padding: '11px 16px !important'
          }}
        >
          {this.state.submitState}
          {this.state.processingSubmit && (
            <i className="fa fa-spinner fa-spin" style={{marginLeft: 8 + 'px'}} />
          )}
        </button>

        {this.state.processingSubmit && (
          <span
            style={{
              marginTop: 13 + 'px',
              display: 'inline-block',
              marginLeft: 10 + 'px'
            }}
          >
            This may take a minute.
          </span>
        )}

        <div className="clearfix" />
      </form>
    );
  }
}
