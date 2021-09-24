import React, {Component} from 'react';
import {observer} from 'mobx-react';
import AutosuggestInput from '../../shared/forms/autosuggest_input.jsx';

import store from '../store/onboarding-wizard_store.js';
import FooterBar from '../components/footer-bar.jsx';

@observer
class BasicInformation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uploadText: 'Choose a file'
    };
  }

  UNSAFE_componentWillMount() {
    const uploadText = store.instance.userImg ? 'Change photo' : 'Choose a file';
    this.setState({uploadText});
  }

  componentDidMount() {
    // Initialize uploadcare widget on the input.
    const uploadCareWidget = uploadcare.SingleWidget('[role=uploadcare-uploader]');
    uploadCareWidget.onDialogOpen(() => {
      trackEvent('onboarding.click_selfie_upload', {});
    });
    uploadCareWidget.onUploadComplete(info => {
      store.instance.userImg = info.cdnUrl;
      trackEvent('onboarding.selfie_uploaded', {});
    });
    // Unwieldy hack due to this widget's limitations
    const uploadcareButton = document.getElementsByClassName('uploadcare-widget-button-open')[0];
    if (uploadcareButton) {
      uploadcareButton.innerHTML = this.state.uploadText;
    }
  }

  handleContinueClick = () => {
    const {
      firstName,
      lastName,
      companyName,
      jobTitle,
      userImg,
      weeklyDigestSubscribed
    } = store.instance;

    let params = {
      user: {
        first_name: firstName,
        last_name: lastName,
        company_name: companyName,
        title: jobTitle,
        picture: userImg,
        weekly_digest_subscribed: weeklyDigestSubscribed
      }
    };
    store.instance.ajaxInProgress = true;
    store.instance.clearNotifications();
    post('/api/v1/onboarding/submit_basic_information', {
      body: params
    }).then(response => {
      if (response.status === 200) {
        trackEvent('onboarding.click_continue_basic_info', {
          firstName,
          lastName,
          companyName,
          jobTitle,
          weeklyDigestSubscribed
        });
        store.instance.ajaxInProgress = false;
        store.instance.goToNextStep();
      } else {
        store.instance.showNotification({type: 'serverError', message: response.data.errors});
        store.instance.ajaxInProgress = false;
      }
    });
  };

  handleSkip = () => {
    store.instance.clearNotifications();
    trackEvent('onboarding.click_skip', {});
    store.instance.goToNextStep();
  };

  handleInputChange = event => {
    store.instance[event.target.name] = event.target.value;
  };

  handleCompanyChange = newValue => {
    store.instance.companyName = newValue;
  };

  renderImageUpload = () => {
    if (store.instance.userImg) {
      return (
        <div className="onboarding__basic-information__profile-picture">
          <img
            className="onboarding__basic-information__profile-picture__preview"
            src={store.instance.userImg}
          />
          <div className="uploadcare-light">
            <input
              type="hidden"
              role="uploadcare-uploader"
              name="profile_picture_url"
              data-crop="1:1"
              data-images-only
              data-file-types="png jpeg jpg"
              data-input-accept-types="image/png image/jpeg"
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className="onboarding__basic-information__profile-picture">
          <div className="uploadcare-light uploadcare--placeholder">
            <input
              type="hidden"
              role="uploadcare-uploader"
              name="profile_picture_url"
              data-crop="1:1"
              data-images-only
              data-file-types="png jpeg jpg"
              data-input-accept-types="image/png image/jpeg"
            />
          </div>
          <div className="uploadcare-note">Add your selfie</div>
        </div>
      );
    }
  };

  render() {
    const {
      companyName,
      companySuggestions,
      loadSuggestions,
      clearCompanySuggestions,
      isCompaniesRequestLoading
    } = store.instance;

    return (
      <div className="onboarding__step-content-wrap onboarding__basic-information">
        <div className="onboarding__step-content onboarding__basic-information__form">
          <div className="row onboarding-wizard__header">
            <div className="col-md-12">
              <h1 className="onboarding__step-heading">Your Basic Information</h1>
              <p className="onboarding__step-subtext">You can update this information later</p>
            </div>
          </div>
          <div className="onboarding-wizard__content">
            <div className="row">
              <div className="col-md-12">{this.renderImageUpload()}</div>
            </div>
            <div className="row">
              <div className="col-sm-6 form-group">
                <label className="form-label" htmlFor="firstName">
                  First name
                </label>
                <input
                  name="firstName"
                  type="text"
                  className="form-input form-control"
                  maxLength="30"
                  value={store.instance.firstName}
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="col-sm-6 form-group">
                <label className="form-label" htmlFor="lastName">
                  Last name
                </label>
                <input
                  name="lastName"
                  type="text"
                  className="form-input form-control"
                  maxLength="30"
                  value={store.instance.lastName}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-6 form-group">
                <label className="form-label" htmlFor="companyName">
                  Company
                </label>
                <AutosuggestInput
                  className="form-input form-control"
                  name="companyName"
                  initialValue={companyName}
                  suggestions={companySuggestions}
                  loadSuggestions={loadSuggestions}
                  clearSuggestions={clearCompanySuggestions}
                  isLoading={isCompaniesRequestLoading}
                  onChange={this.handleCompanyChange}
                />
              </div>
              <div className="col-sm-6 form-group">
                <label className="form-label" htmlFor="jobTitle">
                  Job title
                </label>
                <input
                  name="jobTitle"
                  type="text"
                  className="form-input form-control"
                  maxLength="30"
                  value={store.instance.jobTitle}
                  onChange={this.handleInputChange}
                />
              </div>
            </div>
            <div className="col-md-12 onboarding__basic-information__weekly-digest">
              <img
                className="onboarding__basic-information__weekly-digest__envelope-icon"
                src={store.instance.icons.envelopeIconPath}
              />
              <div className="onboarding__basic-information__weekly-digest__subscription-text">
                <div className="subscription-header">The weekly newsletter</div>
                <div className="form-note">Never miss out on the latest tech trends</div>
              </div>
              <div
                onClick={() => {
                  store.instance.weeklyDigestSubscribed = !store.instance.weeklyDigestSubscribed;
                }}
                className={
                  store.instance.weeklyDigestSubscribed
                    ? 'onboarding__basic-information__weekly-digest__subscription-checkbox checked'
                    : 'onboarding__basic-information__weekly-digest__subscription-checkbox'
                }
              >
                <span className="form-note">Yup, Subscribe me</span>
              </div>
            </div>
          </div>
        </div>
        <FooterBar
          onContinueClick={this.handleContinueClick}
          disableButton={store.instance.hasError}
          ajaxInProgress={store.instance.ajaxInProgress}
          altLink="Skip"
          onAltLinkClick={this.handleSkip}
        />
      </div>
    );
  }
}

export default BasicInformation;
