import React from 'react';
import TeachBannerUtils from 'bundles/teach-course/lib/TeachBannerUtils';
import TotalLearnerBanner from './TotalLearnerBanner';
import WeeklyActiveLearnerBanner from './WeeklyActiveLearnerBanner';
import WeeklyNewLearnerBanner from './WeeklyNewLearnerBanner';

import 'css!./__styles__/TeachBanner';

const BANNER_TYPES = [
  {
    key: 'weeklyActiveLearner',
    component: WeeklyActiveLearnerBanner,
  },

  {
    key: 'weeklyNewLearner',
    component: WeeklyNewLearnerBanner,
  },

  {
    key: 'totalLearner',
    component: TotalLearnerBanner,
  },
];

class TeachBanner extends React.Component {
  state = {
    course: null,
    membership: null,
    learnerCounts: {},
    bannerIndex: -1,
    dismissed: false,
  };

  componentDidMount() {
    TeachBannerUtils.getBannerData()
      .spread((membership, course, learnerCounts) => {
        const bannerIndex = Math.round(Math.random() * (BANNER_TYPES.length - 1));

        this.setState({
          course,
          membership,
          learnerCounts,
          bannerIndex,
        });
      })
      .catch(() => {})
      .done();
  }

  handleDismiss = () => {
    TeachBannerUtils.setVisitedTimestamp();
    this.setState({
      dismissed: true,
    });
  };

  renderBanner() {
    const Component = BANNER_TYPES[this.state.bannerIndex].component;

    return <Component course={this.state.course} learnerCounts={this.state.learnerCounts} />;
  }

  render() {
    if (!this.state.course || this.state.dismissed || !TeachBannerUtils.shouldShow()) {
      return <div />;
    }

    return (
      <div className="rc-TeachBanner bt3-alert bt3-alert-info bt3-alert-dismissable">
        <div className="c-teach-banner-content">
          <button onClick={this.handleDismiss} className="bt3-close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>

          {this.renderBanner()}
        </div>
      </div>
    );
  }
}

export default TeachBanner;
