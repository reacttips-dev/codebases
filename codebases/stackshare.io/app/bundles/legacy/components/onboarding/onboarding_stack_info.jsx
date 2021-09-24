import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {observer} from 'mobx-react';
import * as C from './constants';
import FormValidation from '../shared/form_validation';
import Uploader from '../../../../shared/library/uploadcare/uploader';
import {UploaderContainer, Label} from '../../../../shared/library/uploadcare/styles';
import RadioButton from '../../../../shared/library/inputs/radiobutton';

export default
@observer
class OnboardingStackInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameCollision: false,
      clearImage: false,
      selectedStackOwner: null
    };

    // event context binding
    this.submitForm = this.submitForm.bind(this);
    this.onChange = this.onChange.bind(this);
    this.validateName = this.validateName.bind(this);
    this._el = null;
  }

  componentDidMount() {
    // This page depends on knowing the stack owner
    if (!this.context.globalStore.stackOwner) {
      browserHistory.push(`${C.ONBOARDING_BASE_PATH}/stack-type`);
      return;
    }

    this.validateName();

    this.context.navStore.backRoute = `${C.ONBOARDING_BASE_PATH}/stack-type`;
    //get selected stackowner
    let findCompany = this.context.globalStore.companies.find(
      company => company.id === this.context.globalStore.stackOwner
    );

    if (this.context.globalStore.stackOwner === 'personal') {
      //Change stack value to user belongs to private company or not.
      this.context.globalStore.stackInfo.private = this.context.globalStore.routerProps.isPrivate;
    } else if (findCompany && findCompany.type === 'company') {
      //If company then It's private or not.
      this.context.globalStore.stackInfo.private = Boolean(findCompany.private_mode);
    }

    // eslint-disable-next-line react/no-did-mount-set-state
    this.setState({
      selectedStackOwner: findCompany
    });
  }

  // handle form input changes
  onChange(e, uploader = false) {
    let imageURL = $('input[name=image_url]').val();

    if (imageURL) this.context.globalStore.stackInfo.image_url = $('input[name=image_url]').val();

    if (!uploader) {
      this.context.globalStore.stackInfo[e.target.name] = e.target.value;
      $(e.target)
        .removeClass('error')
        .parent()
        .removeClass('name-collision');
    }
  }

  onToggleClick(value) {
    if (value === 'public') {
      this.context.globalStore.stackInfo.private = false;
    } else {
      this.context.globalStore.stackInfo.private = true;
    }
  }

  validateName(e, goToNextPage) {
    let stackOwner =
      this.context.globalStore.stackOwner === 'newcompany'
        ? this.context.globalStore.newCompany.id
        : this.context.globalStore.stackOwner;

    $.get(
      '/api/v1/stacks/name_is_available',
      {owner: stackOwner, name: this.context.globalStore.stackInfo.name},
      response => {
        if (goToNextPage && response) {
          browserHistory.push(`${C.ONBOARDING_BASE_PATH}/tool-selection`);
        } else if (goToNextPage && !response) {
          $(document).trigger('errorMsg', 'Stack name is already taken.');
        }

        if (!response) {
          $(this.refs.stackInfoName)
            .addClass('error')
            .parent()
            .addClass('name-collision');
        }
      }
    );
  }

  onFocus(e) {
    trackEvent('stack.create.stackDetails.edit', {value: e.target.name});
  }

  submitForm() {
    this.context.globalStore.stackInfo.image_url = $('input[name=image_url]').val();
    if (FormValidation.validate($(this._el).find('input[type=text]'))) {
      trackEvent('stack.create.stackDetails.submit');
      this.validateName(null, true);
    } else {
      trackEvent('stack.create.stackDetails.submitErr');
    }
    this.setState({clearImage: true});
  }

  ownerPictureClass() {
    return this.context.globalStore.stackOwner === 'personal' ? 'personal' : 'company';
  }

  render() {
    const {selectedStackOwner} = this.state;
    if (!this.context.globalStore.stackOwner) return null;
    return (
      <div className="onboarding__stack-info" ref={el => (this._el = el)}>
        <div className="onboarding__form-wrapper">
          <div className="onboarding__input-container nowrap">
            <div className="onboarding__input-container inline">
              <h5>Stack Owner</h5>
              <div className="onboarding__input-container--owner">
                <input value={this.context.globalStore.ownerName} name="owner" readOnly />
                <img
                  className={this.ownerPictureClass()}
                  src={C.defaultImage(this.context.globalStore.ownerImage)}
                />
              </div>
            </div>
            <div className="react__input-owner-divider">/</div>
            <div className="onboarding__input-container">
              <h5>Stack Name</h5>
              <input
                value={this.context.globalStore.stackInfo.name}
                name="name"
                placeholder="Name"
                onChange={this.onChange}
                onFocus={this.onFocus}
                onBlur={event => this.validateName(event)}
                ref="stackInfoName"
                type="text"
                pattern=".{3,}"
                required
              />
            </div>
          </div>
          <div className="onboarding__input-container">
            <h5>Description</h5>
            <input
              value={this.context.globalStore.stackInfo.description}
              name="description"
              placeholder="Stack Description"
              onChange={this.onChange}
              onFocus={this.onFocus}
              type="text"
              pattern=".{3,}"
            />
          </div>
          <div className="onboarding__input-container">
            <h5>Website or GitHub Repo URL</h5>
            <input
              value={this.context.globalStore.stackInfo.website_url}
              name="website_url"
              placeholder="Website or GitHub URL"
              onChange={this.onChange}
              onClick={this.onFocus}
              type="text"
              pattern=".{3,}\..{2,}"
            />
          </div>
          <br />
          {selectedStackOwner &&
            selectedStackOwner.type === 'company' &&
            selectedStackOwner.private_mode && (
              <div className="onboarding__input-container">
                <RadioButton
                  checked={this.context.globalStore.stackInfo.private}
                  onToggle={() => {
                    this.onToggleClick('private');
                  }}
                />
                <label className="stack_label">{`Private (visible only to ${
                  selectedStackOwner.name
                } members)`}</label>
                &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                <RadioButton
                  checked={!this.context.globalStore.stackInfo.private}
                  onToggle={() => {
                    this.onToggleClick('public');
                  }}
                />
                <label>Public (publicly visible)</label>
              </div>
            )}
          <UploaderContainer>
            <Label>Stack Logo or Image</Label>
            <Uploader
              clearImage={this.state.clearImage}
              onChange={e => this.onChange(e, true)}
              onFocus={this.onFocus}
              id="file"
              name="image_url"
              data-crop="1:1"
              value={this.context.globalStore.stackInfo.image_url}
            />
          </UploaderContainer>
          <div className="onboarding__input-container">
            <button className="onboarding__form-wrapper__button" onClick={this.submitForm}>
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }
}

OnboardingStackInfo.contextTypes = {
  routerProps: PropTypes.object,
  globalStore: PropTypes.object,
  navStore: PropTypes.object
};
