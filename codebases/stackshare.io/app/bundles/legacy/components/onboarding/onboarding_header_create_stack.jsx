import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {observer} from 'mobx-react';

export default
@observer
class OnboardingHeaderCreateStack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0
    };

    this.h1 = this.h1.bind(this);
  }

  componentDidMount() {
    browserHistory.listen(route => {
      let cleanedPath = route.pathname.replace(/\//g, '').toLowerCase();
      this.setState({
        step:
          {
            'create-stackstack-info': 0,
            'create-stacktool-selection': 1,
            'create-stacktool-details': 2
          }[cleanedPath] || 0
      });
    });
  }

  h1() {
    try {
      switch (this.context.globalStore.stackOwner.type) {
        case 'personal':
          return 'Creating Your Stack';
        case 'company':
          return `Creating ${this.context.globalStore.stackOwner.name}'s Stack`;
        case 'newcompany':
          return `Creating Your Company's Stack`;
        default:
          return 'Creating a New Stack';
      }
    } catch (err) {
      return 'Creating a New Stack';
    }
  }
  timelineClass() {
    return `onboarding__header__timeline step-${this.state.step}`;
  }
  render() {
    return (
      <div className="onboarding__header__container">
        <h1>{this.h1()}</h1>
        <p>A stack is a set of tools & services you use to build apps and infrastructure.</p>
        <ul className={this.timelineClass()}>
          <li className="onboarding__header__timeline__item" data-label="Stack Info" />
          <li className="onboarding__header__timeline__spacer" />
          <li className="onboarding__header__timeline__item" data-label="Tools Selection" />
          <li className="onboarding__header__timeline__spacer" />
          <li className="onboarding__header__timeline__item" data-label="Tools Details" />
        </ul>
        {this.state.step === 0 && this.context.globalStore.scanned === true && (
          <div className="onboarding__header__container__results">
            {this.context.globalStore.selectedTools.map(tool => {
              return (
                <img key={`header3-${tool.id}`} src={this.context.globalStore.toolImage(tool)} />
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

OnboardingHeaderCreateStack.contextTypes = {
  globalStore: PropTypes.object
};
