import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import Uploader from '../../../../../shared/library/uploadcare/uploader';
import {UploaderContainer, Label} from '../../../../../shared/library/uploadcare/styles';

export default
@observer
class NewCompany extends Component {
  constructor(props) {
    super(props);
    this.state = {
      needsValidation: false,
      alreadyExists: false,
      saving: false,
      clearImage: false
    };

    // event context bindings
    this.onChange = this.onChange.bind(this);
    this.validateCompanyName = this.validateCompanyName.bind(this);
    this.parseEmail = this.parseEmail.bind(this);
  }

  componentDidMount() {
    this.parseEmail();
  }

  onChange(e) {
    // uploadcare hack...
    this.context.globalStore.newCompany.image_url = $('input[name=image_url]').val();

    this.context.globalStore.newCompany[e.target.name] = e.target.value;
    $(e.target)
      .removeClass('error')
      .parent()
      .removeClass('name-collision');
  }

  validateCompanyName(e) {
    let target = e.target;
    $.get(
      '/companies/exists',
      {company_name: this.context.globalStore.newCompany.name},
      response => {
        if (response.exists) {
          $(target)
            .addClass('error')
            .parent()
            .addClass('name-collision');
          trackEvent('tack.create.stackType.newCompany.editErr', {
            value: 'name-collision'
          });
        }
      }
    );
  }

  parseEmail() {
    if (!this.context.globalStore.newCompany.email_address.match(/.+@.+\..+/)) return;

    let domainRegex = /[a-zA-Z0-9]+\..+$/;
    let domain, emailDomain;

    try {
      domain = this.context.globalStore.newCompany.website_url.match(domainRegex)[0].toLowerCase();
    } catch (err) {
      domain = '';
    }
    try {
      emailDomain = this.context.globalStore.newCompany.email_address
        .match(domainRegex)[0]
        .toLowerCase();
    } catch (err) {
      emailDomain = '';
    }

    if (domain !== emailDomain) this.setState({needsValidation: true});
    else this.setState({needsValidation: false});
  }

  render() {
    return (
      <div className="onboarding__new-company">
        <div className="onboarding__form-wrapper">
          <div className="onboarding__input-container">
            <h5>Company Name</h5>
            <input
              value={this.context.globalStore.newCompany.name}
              name="name"
              placeholder="Company Name"
              onChange={this.onChange}
              onBlur={this.validateCompanyName}
              type="text"
              pattern=".{3,}"
              required
            />
          </div>
          <div className="onboarding__input-container">
            <h5>Company Website</h5>
            <input
              value={this.context.globalStore.newCompany.website_url}
              name="website_url"
              placeholder="Company Website"
              onChange={this.onChange}
              type="text"
              pattern=".+\..+"
              required
            />
          </div>
          <div className="onboarding__input-container">
            <h5>Description</h5>
            <input
              value={this.context.globalStore.newCompany.description}
              name="description"
              placeholder="Company description"
              onChange={this.onChange}
              type="text"
              pattern=".{3,}"
              required
            />
          </div>
          <div className="onboarding__input-container">
            <h5>AngelList Profile URL</h5>
            <input
              value={this.context.globalStore.newCompany.angellist_url}
              name="angellist_url"
              placeholder='e.g. "http://angel.co/stackshare"'
              onChange={this.onChange}
              type="text"
              pattern=".+\..+"
            />
          </div>
          <div className="onboarding__input-container">
            <h5>Company Email Address</h5>
            <input
              value={this.context.globalStore.newCompany.email_address}
              name="email_address"
              placeholder="Company email"
              onChange={this.onChange}
              onBlur={this.parseEmail}
              type="text"
              pattern=".+@.+\..+"
              required
            />
            {this.state.needsValidation && (
              <p className="onboarding__input-container__domain-match">
                Your email address doesn&apos;t match the domain address you entered for your
                company website. We&apos;ll need to manually verify that you work for the company in
                order to get a &apos;Verified&apos; badge on your stack. We&apos;ll send you an
                email once you&apos;ve been verified.
              </p>
            )}
          </div>
          <div className="onboarding__input-container">
            <h5>Company Twitter Username</h5>
            <input
              value={this.context.globalStore.newCompany.twitter_username}
              name="twitter_username"
              placeholder="@username"
              onChange={this.onChange}
              type="text"
              pattern=".{2,}"
            />
          </div>
          <UploaderContainer>
            <Label>Company Logo or Image</Label>
            <Uploader
              clearImage={this.state.clearImage}
              id="file"
              name="image_url"
              data-crop="1:1"
              value={this.context.globalStore.newCompany.image_url}
            />
          </UploaderContainer>
        </div>
        {this.state.alreadyExists && (
          <div>
            <div className="react-overlay" onClick={() => this.setState({alreadyExists: false})} />
            <div className="react-overlay__modal">
              <div
                className="x-corner-close-button"
                onClick={() => this.setState({alreadyExists: false})}
              />
              <h3>This company already exists</h3>
              <p>
                Would you like to update {this.context.globalStore.newCompany.name} or continue with
                the stack creation of the existing company?
              </p>
              <button className="onboarding__edit-btn" onClick={this.updateCompany}>
                Update Company
              </button>
              <button className="onboarding__continue-btn" onClick={this.toStackInfo}>
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

NewCompany.contextTypes = {
  globalStore: PropTypes.object,
  stackSlug: PropTypes.string
};
