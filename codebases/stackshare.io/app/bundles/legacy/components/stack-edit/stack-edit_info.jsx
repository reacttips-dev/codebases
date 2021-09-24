import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {observer} from 'mobx-react';
import * as C from './stack-edit_constants';
import {Savable} from './stack-edit_constants';
import FormValidation from '../shared/form_validation';

import StackEditSaveRow from './stack-edit_save-row.jsx';
import NewCompany from '../shared/company/new.jsx';
import StackEditLoading from './stack-edit_loading.jsx';
import Uploader from '../../../../shared/library/uploadcare/uploader';
import {UploaderContainer, Label} from '../../../../shared/library/uploadcare/styles';
import RadioButton from '../../../../shared/library/inputs/radiobutton';

export default
@observer
class StackInfo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showOwnerList: false,
      clearImage: false,
      showPublicPrivateOptions: true
    };

    this.onChange = this.onChange.bind(this);
    this.onClickOwner = this.onClickOwner.bind(this);
    this.validateName = this.validateName.bind(this);
    this.setOwner = this.setOwner.bind(this);
    this.addNewCompany = this.addNewCompany.bind(this);
    this.submitForm = this.submitForm.bind(this);
    this.stackLoaded = this.stackLoaded.bind(this);
    this._el = null;
  }

  componentDidMount() {
    this.nextPath = `${C.BASE_PATH}/${this.context.slugs.ownerSlug}/${
      this.context.slugs.stackSlug
    }/tool-selection`;
    $(document).on('stack-edit.stack.loaded', this.stackLoaded);
    $(document).on('stack-edit.stack.validate', this.validate);
  }

  componentWillUnmount() {
    this.widget = undefined;
    $(document).off('stack-edit.stack.loaded', this.stackLoaded);
    $(document).off('stack-edit.stack.validate', this.validate);
  }

  stackLoaded() {
    if (!this.refs.image_url) return;

    if (!this.widget) {
      this.widget = uploadcare.SingleWidget(this.refs.image_url);

      this.widget.onUploadComplete(file => {
        this.context.globalStore.stackInfo.image_url = file.cdnUrl;
        this.context.globalStore.saveState = Savable;
      });
    }

    this.widget.value(this.context.globalStore.stackInfo.image_url);
  }

  onChange(e, uploader = false) {
    this.context.globalStore.newCompany.image_url = $('input[name=image_url]').val();
    this.context.globalStore.saveState = Savable;
    if (!uploader) {
      this.context.globalStore.stackInfo[e.target.name] = e.target.value;
      $(e.target)
        .removeClass('error')
        .parent()
        .removeClass('name-collision');
    }
  }

  onClickOwner() {
    this.setState({showOwnerList: !this.state.showOwnerList});
  }

  validate = () => {
    let valid = FormValidation.validate($(this._el).find('input[type=text]'));
    $(document).trigger('stack-edit.stack.valid', {valid});
    return valid;
  };

  submitForm(opts = {}) {
    this.context.globalStore.stackInfo.image_url = $('input[name=image_url]').val();
    trackEvent('stack.edit.stackDetails.submit');
    if (FormValidation.validate($(this._el).find('input[type=text]'))) {
      this.context.globalStore.save();
      if (opts.toNextPage) browserHistory.push(this.nextPath);
    }

    trackEvent('stack.edit.stackDetails.submitErr');
    this.setState({clearImage: true});
  }

  validateName(e, callback) {
    if (!this.context.globalStore.owner.id) {
      callback && callback();
      return;
    }

    let params = {
      name: this.context.globalStore.stackInfo.name,
      stack_id: this.context.globalStore.stackInfo.id
    };
    params.owner =
      this.context.globalStore.owner.type === 'User'
        ? 'personal'
        : this.context.globalStore.owner.id;

    $.get('/api/v1/stacks/name_is_available', params, response => {
      if (response && callback) callback();
      else if (!response) {
        $(document).trigger('errorMsg', 'Stack name is already taken');
        $(this.refs.stackInfoName)
          .addClass('error')
          .parent()
          .addClass('name-collision');
      }
    });
  }

  onToggleClick(value) {
    if (value === 'public') {
      this.context.globalStore.stackInfo.private = false;
      this.context.globalStore.saveState = Savable;
    } else {
      this.context.globalStore.stackInfo.private = true;
      this.context.globalStore.saveState = Savable;
    }
  }

  setOwner(owner) {
    //If owner is personal stack or other, stack should be user type
    if (owner.type !== 'Company') {
      this.setState({
        showPublicPrivateOptions: false
      });
      this.context.globalStore.stackInfo.private = !!this.context.globalStore.stackInfo
        .current_user_private;
    }

    //If company then public should be public
    if (owner.type === 'Company' && owner.private_mode)
      this.setState({
        showPublicPrivateOptions: true
      });
    else if (owner.type === 'Company' && !owner.private_mode)
      this.context.globalStore.stackInfo.private = false;

    this.context.globalStore.saveState = Savable;
    this.context.globalStore.setOwner(owner);
    this.context.globalStore.newCompany.id = null;
    this.forceUpdate();
  }

  addNewCompany() {
    this.context.globalStore.setOwner(this.context.globalStore.newCompany);
    this.context.globalStore.newCompany.id = 0;
  }

  ownerPictureClass() {
    return this.context.globalStore.stackOwner === 'personal' ? 'personal' : 'company';
  }

  render() {
    const {stackOwner} = this.context.globalStore;
    if (this.context.globalStore.stackInfo.id === null) return <StackEditLoading />;

    return (
      <div className="onboarding__stack-info" ref={el => (this._el = el)}>
        <div className="react__form-wrapper">
          <div className="react__input-container nowrap">
            <div className="react__input-container inline clickable" onClick={this.onClickOwner}>
              <h5>Stack Owner</h5>
              <div className="react__input-container--owner">
                <input
                  value={this.context.globalStore.owner.name}
                  name="owner"
                  placeholder="Company Name"
                  readOnly
                />
                <img
                  className={this.ownerPictureClass()}
                  src={C.defaultImage(this.context.globalStore.owner.image_url)}
                />
              </div>
              {this.state.showOwnerList && (
                <div>
                  <div
                    className="react-overlay transparent"
                    onClick={() => this.setState({showOwnerList: false})}
                  />
                  <ul className="stack-edit__owner-list">
                    {this.context.globalStore.possibleOwners.map(o => {
                      if (o === this.context.globalStore.newCompany) {
                        return (
                          <li key={`owner-list-new-company`} onClick={this.addNewCompany}>
                            <img src={C.IMG_NEW_COMPANY} />
                            New Company
                          </li>
                        );
                      } else {
                        return (
                          <li key={`owner-list-${o.id}-${o.type}`} onClick={() => this.setOwner(o)}>
                            <img src={C.defaultImage(o.image_url)} />
                            {o.name}
                          </li>
                        );
                      }
                    })}
                  </ul>
                </div>
              )}
            </div>
            <div className="react__input-owner-divider">/</div>
            <div className="react__input-container">
              <h5>Stack Name</h5>
              <input
                value={this.context.globalStore.stackInfo.name}
                name="name"
                placeholder="Name"
                onChange={this.onChange}
                onBlur={this.validateName}
                ref="stackInfoName"
                type="text"
                pattern=".{2,}"
                required
              />
            </div>
          </div>
          <div className="react__input-container">
            <h5>Description</h5>
            <input
              value={this.context.globalStore.stackInfo.description}
              name="description"
              placeholder="Stack Description"
              onChange={this.onChange}
              type="text"
              pattern=".{3,}"
            />
          </div>
          <div className="react__input-container">
            <h5>Website or GitHub Repo URL</h5>
            <input
              value={this.context.globalStore.stackInfo.website_url}
              name="website_url"
              placeholder="Website or GitHub URL"
              onChange={this.onChange}
              type="text"
              pattern=".{3,}\..{2,}"
            />
          </div>
          {stackOwner &&
            stackOwner.type === 'Company' &&
            stackOwner.private_mode &&
            this.state.showPublicPrivateOptions && (
              <div className="onboarding__input-container">
                <RadioButton
                  checked={this.context.globalStore.stackInfo.private}
                  onToggle={() => {
                    this.onToggleClick('private');
                  }}
                />
                <label className="stack_label">{`Private (visible only to ${
                  this.context.globalStore.owner.name
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
              id="file"
              name="image_url"
              data-crop="1:1"
              value={this.context.globalStore.stackInfo.image_url}
            />
          </UploaderContainer>
          {this.context.globalStore.newCompany.id === 0 && (
            <div>
              <NewCompany />
            </div>
          )}
          <StackEditSaveRow
            continuePath="/tool-selection"
            continueText="Edit Tools"
            saveCallback={this.submitForm}
            saveContinueCallback={() => this.submitForm({toNextPage: true})}
          />
        </div>
      </div>
    );
  }
}

StackInfo.contextTypes = {
  globalStore: PropTypes.object,
  slugs: PropTypes.object
};
