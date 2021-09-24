import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {observer} from 'mobx-react';

import * as C from './stack-edit_constants';

export default
@observer
class StackEditHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      step: null
    };

    this.goTo = this.goTo.bind(this);
  }

  componentDidMount() {
    this.headerBarStep();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.location !== this.props.location) {
      this.headerBarStep();
    }
  }

  headerBarStep = () => {
    let {location} = this.props;
    let cleanedPath = location.split('/');
    cleanedPath = cleanedPath[cleanedPath.length - 1].replace(/\//g, '').toLowerCase();
    let step = cleanedPath === 'info' ? 0 : cleanedPath === 'tool-selection' ? 1 : 2;
    if (this.state.step !== step) {
      this.setState({step});
    }
  };

  goTo(path) {
    if (location.pathname.split('/').pop() === 'info') {
      const checkValid = (e, data) => {
        $(document).off('stack-edit.stack.valid', checkValid);
        if (!data.valid) return;
        browserHistory.push(
          `${C.BASE_PATH}/${this.context.slugs.ownerSlug}/${this.context.slugs.stackSlug}${path}`
        );
      };
      $(document).on('stack-edit.stack.valid', checkValid);
      $(document).trigger('stack-edit.stack.validate');
      return;
    }

    browserHistory.push(
      `${C.BASE_PATH}/${this.context.slugs.ownerSlug}/${this.context.slugs.stackSlug}${path}`
    );
  }

  timelineClass() {
    return `onboarding__header__timeline step-${this.state.step}`;
  }

  render() {
    return (
      <div className="onboarding__header auto-height navable">
        <div className="onboarding__header__container">
          <h1>Editing Your Stack</h1>
          <ul className={this.timelineClass()}>
            <li
              className="onboarding__header__timeline__item"
              data-label="Stack Info"
              onClick={() => this.goTo('/info')}
            />
            <li className="onboarding__header__timeline__spacer" />
            <li
              className="onboarding__header__timeline__item"
              data-label="Tools Selection"
              onClick={() => this.goTo('/tool-selection')}
            />
            <li className="onboarding__header__timeline__spacer" />
            <li
              className="onboarding__header__timeline__item"
              data-label="Tools Details"
              onClick={() => this.goTo('/tool-details')}
            />
          </ul>
          <div
            className="onboarding__header__container__results"
            onClick={() => this.goTo('/tool-selection')}
          >
            {this.context.globalStore.selectedTools.map(tool => {
              return (
                <img key={`header3-${tool.id}`} src={this.context.globalStore.toolImage(tool)} />
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}

StackEditHeader.contextTypes = {
  globalStore: PropTypes.object,
  slugs: PropTypes.object
};
