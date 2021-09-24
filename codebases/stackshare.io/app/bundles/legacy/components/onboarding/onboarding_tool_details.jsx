import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import * as C from './constants';
import {observer} from 'mobx-react';

import ToolDetails from '../shared/tool_details.jsx';

export default
@observer
class OnboardingToolDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      saving: false
    };

    this.save = this.save.bind(this);
    this.saveBtnClass = this.saveBtnClass.bind(this);
  }

  componentDidMount() {
    if (this.context.globalStore.selectedTools.length === 0) {
      browserHistory.push(`${C.ONBOARDING_BASE_PATH}/tool-selection`);
      $(document).trigger(
        'errorMsg',
        'You need to add tools to your stack before proceeding to this page.'
      );
      return;
    }

    let noReasons = [];
    for (let tool of this.context.globalStore.selectedTools)
      if (!(tool.reasons instanceof Array) || tool.reasons.length === 0) noReasons.push(tool);

    $.get(
      '/api/v1/services/reasons',
      {
        service_ids: noReasons.map(r => {
          return r.id;
        })
      },
      response => {
        let toolIndex;
        for (let tool of response) {
          toolIndex = this.context.globalStore.selectedTools.findIndex(t => {
            return t.id === tool.id;
          });
          if (toolIndex !== -1)
            this.context.globalStore.selectedTools[toolIndex].reasons = tool.reasons;
        }
        this.forceUpdate();
      }
    );

    this.context.navStore.backRoute = `${C.ONBOARDING_BASE_PATH}/tool-selection`;
  }

  save() {
    if (this.state.saving) return;
    this.setState({saving: true});

    trackEvent('stack.create.toolDetails.submit');

    this.context.globalStore.saveStack();
  }

  saveBtnClass() {
    return `btn btn-ss-alt btn-lg ${this.state.saving && 'disabled'}`;
  }

  render() {
    return (
      <div>
        <ToolDetails />
        <div className="submit-links-container">
          <div className="submit-links">
            <button className={this.saveBtnClass()} onClick={this.save}>
              {this.state.saving ? (
                <span className="onboarding__button-saving">
                  Saving... <img src={C.IMG_SPINNER} />
                </span>
              ) : (
                'Save Stack'
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

OnboardingToolDetails.contextTypes = {
  routerProps: PropTypes.object,
  globalStore: PropTypes.object,
  navStore: PropTypes.object
};
