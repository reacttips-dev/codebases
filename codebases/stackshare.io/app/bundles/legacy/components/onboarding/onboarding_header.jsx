import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {browserHistory} from 'react-router';
import {observe} from 'mobx';
import {observer} from 'mobx-react';

import * as C from './constants';
import OnboardingHeaderCreateStack from './onboarding_header_create_stack.jsx';

export default
@observer
class OnboardingHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slideMap: {
        'create-stack': 0,
        'create-stackscan': 0,
        'create-stackstack-type': 1,
        'create-stacknew-company': 2,
        'create-stackstack-info': 3,
        'create-stacktool-selection': 3,
        'create-stacktool-details': 3
      },
      activeSlide: 0,
      slideHeights: []
    };

    this.goBack = this.goBack.bind(this);
    this.calcSlideHeights = this.calcSlideHeights.bind(this);
    this.reset = this.reset.bind(this);

    $(document).on('onboarding.calcSlideHeights', this.calcSlideHeights);
  }

  UNSAFE_componentWillMount() {
    browserHistory.listen(route => {
      let cleanedPath = route.pathname.replace(/\//g, '').toLowerCase();
      this.setState({activeSlide: this.state.slideMap[cleanedPath]});
      setTimeout(() => {
        // wait for all of the updated information to hit the state
        this.calcSlideHeights();
      });
    });
  }

  componentDidMount() {
    this.calcSlideHeights();
    observe(this.context.globalStore.selectedTools, () => {
      setTimeout(() => {
        // wait for the tool to hit the array
        this.calcSlideHeights();
      });
    });
  }

  calcSlideHeights() {
    let slideHeights = [];
    $('.onboarding__header__container').each(function(i, v) {
      slideHeights.push($(v).outerHeight());
    });
    this.setState({slideHeights: slideHeights});
  }

  goBack() {
    trackEvent('stack.create.nav', {value: 'back'});

    if (this.context.navStore.backRoute && this.context.navStore.backRoute !== '')
      browserHistory.push(this.context.navStore.backRoute);
  }

  reset() {
    trackEvent('stack.create.nav', {value: 'reset'});

    if (
      confirm(
        "Are you sure that you'd like to reset your stack creation?\nAll stack creation progress will be lost."
      )
    )
      this.context.globalStore.clearForm(this.props.path);
  }

  activeSlideHeight() {
    return this.state.slideHeights[this.state.activeSlide] || 0;
  }

  activeSlidePosition() {
    let position = 0;
    for (let i = 0; i < this.state.activeSlide; i++) {
      position += this.state.slideHeights[i];
    }
    return -position || 0;
  }

  render() {
    return (
      <div className="onboarding__header" style={{height: this.activeSlideHeight()}}>
        {this.context.navStore.backRoute && (
          <div className="onboarding__nav">
            <div className="onboarding__nav__back" onClick={this.goBack}>
              <img src={C.IMG_BACK_ARROW} />
              Back
            </div>
            <div className="onboarding__nav__reset" onClick={this.reset}>
              Reset
            </div>
          </div>
        )}
        <div className="onboarding__header__slider" style={{top: this.activeSlidePosition()}}>
          <div className="onboarding__header__container">
            <h1>Build Your Stack</h1>
            <p>Enter a URL & we&apos;ll guess your stack before you create your stack page.</p>
          </div>
          <div className="onboarding__header__container">
            <h1>What type of stack is this?</h1>
            <p>Select the ownership of this stack</p>
            <div className="onboarding__header__container__results">
              {this.context.globalStore.scanned &&
                this.context.globalStore.selectedTools.map(tool => {
                  return (
                    <img
                      key={`header1-${tool.id}`}
                      src={this.context.globalStore.toolImage(tool)}
                    />
                  );
                })}
            </div>
          </div>
          <div className="onboarding__header__container">
            <h1>Creating a New Company</h1>
            <p>This company will be the owner of your new stack.</p>
            <div className="onboarding__header__container__results">
              {this.context.globalStore.scanned &&
                this.context.globalStore
                  .filterToolsBasedOnPackage(this.context.globalStore.selectedTools)
                  .map(tool => {
                    return (
                      <img
                        key={`header2-${tool.id}`}
                        src={this.context.globalStore.toolImage(tool)}
                      />
                    );
                  })}
            </div>
          </div>
          <OnboardingHeaderCreateStack />
        </div>
      </div>
    );
  }
}

OnboardingHeader.contextTypes = {
  globalStore: PropTypes.object,
  navStore: PropTypes.object
};
