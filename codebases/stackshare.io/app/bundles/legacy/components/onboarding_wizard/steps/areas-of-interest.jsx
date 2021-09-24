import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {observer} from 'mobx-react';

import store from '../store/onboarding-wizard_store.js';
import FooterBar from '../components/footer-bar.jsx';

@observer
class AreasOfInterest extends Component {
  static defaultProps = {
    boxes: [
      {
        className: 'news',
        title: 'News',
        description: 'Keep up with the latest updates about the tools you use'
      },
      {
        className: 'tools',
        title: 'Tools',
        description: 'Find 3000+ of the best and latest tools with details about each'
      },
      {
        className: 'comparisons',
        title: 'Comparisons',
        description: 'Check out side-by-side comparisons of similar tools'
      },
      {
        className: 'deep_dives',
        title: 'Deep dives',
        description:
          'Learn how companies like Medium, Opendoor, Dubsmash, and others have scaled their tech stacks to hundreds of millions of users'
      },
      {
        className: 'companies',
        title: 'Companies',
        description:
          "Uncover the tech stacks behind 10,000+ of the world's most successful startups"
      },
      {
        className: 'jobs',
        title: 'Jobs',
        description: 'See 30,000+ jobs from companies that use the same tools as you'
      }
    ]
  };

  static propTypes = {
    boxes: PropTypes.arrayOf(PropTypes.object)
  };

  state = {
    isChecked: {
      news: true,
      tools: false,
      comparisons: true,
      deep_dives: false,
      companies: true,
      jobs: false
    }
  };

  componentDidMount() {
    const {page_name, page_properties, path, referrer, url} = store.instance.tracking;

    get('/api/v1/onboarding/current_interests').then(response => {
      this.setState({isChecked: response.data});
    });

    trackEvent('Viewed onboarding.areas_of_interest Page', {
      contentGroupAuthenticationStatus: page_properties.contentGroupAuthenticationStatus,
      contentGroupPage: page_properties.contentGroupPage,
      name: page_name,
      path,
      referrer,
      url,
      title: document.title
    });
  }

  handleContinueClick = () => {
    store.instance.ajaxInProgress = true;
    post('/api/v1/onboarding/interests', {
      body: {
        interests: this.state.isChecked
      }
    }).then(response => {
      if (response.status === 200) {
        const keys = Object.keys(this.state.isChecked);
        const interests = keys.filter(key => {
          return this.state.isChecked[key];
        });
        trackEvent('onboarding.click_continue_areas_of_interest', {interests});
        store.instance.goToNextStep();
        store.instance.ajaxInProgress = false;
      } else {
        store.instance.showNotification({type: 'serverError', message: response.data.errors});
        store.instance.ajaxInProgress = false;
      }
    });
  };

  handleSkip = () => {
    trackEvent('onboarding.click_skip', {});
    store.instance.goToNextStep();
  };

  handleCheckboxClick = event => {
    const box = this.refs[event.currentTarget.htmlFor];
    this.setState({isChecked: {...this.state.isChecked, [box.name]: !box.checked}});
  };

  renderBoxes = () => {
    let boxes = [];
    this.props.boxes.forEach(box => {
      boxes.push(
        <div key={box.className} className="col-sm-6">
          <div className="interest-box">
            <input
              ref={box.className}
              type="checkbox"
              className={`fancy-checkbox ${box.className}`}
              name={box.className}
              checked={this.state.isChecked[box.className]}
            />
            <label htmlFor={box.className} onClick={this.handleCheckboxClick}>
              <span />
            </label>
            <div className="interest-content">
              <div className="interest-title">{box.title}</div>
              <div className="interest-description">{box.description}</div>
            </div>
          </div>
        </div>
      );
    });
    return boxes;
  };

  render() {
    return (
      <div className="onboarding__step-content-wrap onboarding__areas-of-interest">
        <div className="onboarding__step-content onboarding__areas-of-interest__form">
          <div className="row onboarding-wizard__header">
            <div className="col-md-12">
              <h1 className="onboarding__step-heading">What are you interested in?</h1>
            </div>
          </div>
          <div className="onboarding-wizard__content">
            <div className="row">{this.renderBoxes()}</div>
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

export default AreasOfInterest;
