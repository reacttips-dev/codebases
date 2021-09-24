import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {ONBOARDING_BASE_PATH} from './constants';
import {toJS} from 'mobx';
import {observer} from 'mobx-react';
import FormValidation from '../shared/form_validation';
import Uploader from '../../../../shared/library/uploadcare/uploader';
import {UploaderContainer, Label} from '../../../../shared/library/uploadcare/styles';

export default
@observer
class OnboardingNewCompany extends Component {
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
    this.updateCompany = this.updateCompany.bind(this);
    this.toStackInfo = this.toStackInfo.bind(this);
    this._el = null;
  }

  componentDidMount() {
    this.context.navStore.backRoute = `${ONBOARDING_BASE_PATH}/stack-type`;
    this.parseEmail();
    uploadcare.initialize();
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

  toStackInfo() {
    this.setState({saving: false});
    browserHistory.push(`${ONBOARDING_BASE_PATH}/stack-info`);
  }

  submitForm() {
    // uploadcare hack...
    this.context.globalStore.newCompany.image_url = $('input[name=image_url]').val();

    if (FormValidation.validate($(this._el).find('input[type=text]'))) {
      this.context.globalStore.stackOwner = 'newcompany';

      if (this.context.globalStore.newCompany.id) this.setState({alreadyExists: true});
      else this.saveCompany();
    }
    this.setState({clearImage: true});
  }

  saveCompany() {
    this.setState({saving: true});
    $.post(
      '/api/v1/companies/create',
      {company: toJS(this.context.globalStore.newCompany)},
      response => {
        trackEvent('stack.create.stackType.newCompany.submit');
        this.context.globalStore.stackInfo.name = this.context.globalStore.newCompany.name;
        this.context.globalStore.stackInfo.image_url = this.context.globalStore.newCompany.image_url;
        this.context.globalStore.stackInfo.website_url = this.context.globalStore.newCompany.website_url;
        this.context.globalStore.newCompany.id = response;
        this.toStackInfo();
      }
    ).fail(error => {
      trackEvent('stack.create.stackType.newCompany.submitErr');
      FormValidation.parseErrors(error.responseJSON);
    });
  }

  updateCompany() {
    $.post(
      '/api/v1/onboarding/update_company',
      {company: toJS(this.context.globalStore.newCompany)},
      () => {
        this.toStackInfo();
      }
    ).fail(error => {
      FormValidation.parseErrors(error.responseJSON);
    });
  }

  render() {
    return (
      <div className="onboarding__new-company" ref={el => (this._el = el)}>
        <div className="onboarding__form-wrapper">
          <h3>New Company</h3>
          <div className="onboarding__input-container">
            <h5>
              Company Name<span> *</span>
            </h5>
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
            <h5>
              Company Website<span> *</span>
            </h5>
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
            <h5>
              Description<span> *</span>
            </h5>
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
            <h5>
              Company Email Address<span> *</span>
            </h5>
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
            <div className="onboarding__input-container">
              <h5>
                <span>* Required Field</span>
              </h5>
            </div>
          </UploaderContainer>
          <div className="onboarding__input-container">
            <button
              className="onboarding__form-wrapper__button"
              onClick={() => {
                this.submitForm();
              }}
            >
              Continue
            </button>
          </div>
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

OnboardingNewCompany.contextTypes = {
  globalStore: PropTypes.object,
  navStore: PropTypes.object
};
