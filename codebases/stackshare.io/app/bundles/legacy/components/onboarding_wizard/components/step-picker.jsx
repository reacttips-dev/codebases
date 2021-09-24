import React, {Component} from 'react';
import {Link} from 'react-router';
import {observer} from 'mobx-react';

import store from '../store/onboarding-wizard_store.js';

@observer
class StepPicker extends Component {
  constructor(props) {
    super(props);
  }

  // Do NOT attach any event handlers to these buttons.
  // They just show the active class
  _renderStepButton = (slug, i) => {
    let stepButtonClass = `onboarding-wizard__step-picker__step-button${
      store.instance.stepsCompleted.includes(slug) ? ' completed' : ''
    }`;

    return (
      <Link
        onClick={e => {
          e.preventDefault();
        }}
        key={`step-picker-${slug}`}
        className={stepButtonClass}
        activeClassName="active"
        to={`/onboarding/${slug}`}
      >
        {i + 1}
      </Link>
    );
  };

  render() {
    return (
      <div className="onboarding-wizard__step-picker">
        <span className="hidden">{store.instance.currentStep.slug}</span>
        {store.instance.steps.map((step, i) => {
          return this._renderStepButton(step.slug, i);
        })}
      </div>
    );
  }
}

export default StepPicker;
