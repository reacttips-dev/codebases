import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {observer} from 'mobx-react';
import * as C from './stack-edit_constants';
import {Saving, Saved} from '../shared/constants';

export default
@observer
class StackEditSaveRow extends Component {
  constructor(props) {
    super(props);

    this.onSaveContinue = this.onSaveContinue.bind(this);
    this.save = this.save.bind(this);
  }

  onSaveContinue() {
    if (this.props.saveContinueCallback) this.props.saveContinueCallback();
    else {
      if (this.context.globalStore.saveState !== Saved) this.context.globalStore.save();
      browserHistory.push(
        `${C.BASE_PATH}/${this.context.slugs.ownerSlug}/${this.context.slugs.stackSlug}${
          this.props.continuePath
        }`
      );
    }
  }

  save() {
    if (this.props.saveCallback) this.props.saveCallback();
    else this.context.globalStore.save();
  }

  saveButtonClass() {
    if (
      this.context.globalStore.saveState === Saving ||
      this.context.globalStore.saveState === Saved
    )
      return ' disabled';
    else return '';
  }

  saveAndContinueButtonText() {
    if (
      this.context.globalStore.saveState === Saving ||
      this.context.globalStore.saveState === Saved
    )
      return this.props.continueText;
    else return `Save & ${this.props.continueText}`;
  }

  render() {
    return (
      <div>
        <div className="react__input-container">
          {this.context.globalStore.stackInfo.path && (
            <div className="react__input-container">
              <a
                className="react__form-wrapper__button white view-stack"
                href={this.context.globalStore.stackInfo.path}
              >
                View Stack
              </a>
            </div>
          )}
          <button
            className={`react__form-wrapper__button spaced${this.saveButtonClass()}`}
            onClick={this.save}
          >
            {this.context.globalStore.saveState}
          </button>
          {!this.props.noContinueButton && (
            <button className="react__form-wrapper__button white" onClick={this.onSaveContinue}>
              {this.saveAndContinueButtonText()}
            </button>
          )}
        </div>
      </div>
    );
  }
}

StackEditSaveRow.contextTypes = {
  globalStore: PropTypes.object,
  slugs: PropTypes.object
};
