import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {observer} from 'mobx-react';

import MatchCompany from './match_company.jsx';
import MatchJob from './match_job.jsx';
import MatchNoResults from './match_no_results.jsx';

export default
@observer
class MatchResults extends Component {
  companies() {
    if (this.context.globalStore.matchedCompany.length === 0) {
      return <MatchNoResults />;
    }

    let matches;
    matches = this.context.globalStore.matchedCompany.map(function(company) {
      return <MatchCompany company={company} key={`match-company-${company.id}`} />;
    });

    return matches;
  }

  jobs() {
    if (this.context.globalStore.matchedJob.length === 0) return <MatchNoResults />;

    let matches;
    matches = this.context.globalStore.matchedJob.map(function(job) {
      return <MatchJob job={job} key={`match-job-${job.id}`} />;
    });

    return matches;
  }

  switchVisibleIndex(visibleIndex) {
    this.context.globalStore.visibleIndex = visibleIndex;
  }

  render() {
    if (this.context.globalStore.searching)
      return (
        <div className="container-fluid match__results-container">
          <img
            className="loading-spinner"
            src="https://img.stackshare.io/fe/spinner.svg"
            alt="Loading..."
          />
        </div>
      );

    return (
      <div className="container-fluid match__results-container">
        <div className="match__results-container__type-buttons">
          <button
            className={this.context.globalStore.visibleIndex === 'Job' ? 'active' : ''}
            onClick={() => this.switchVisibleIndex('Job')}
          >
            <span className="match__results-container__type-buttons__match-type">Jobs</span>
            <span className="match__results-container__type-buttons__match-count">
              {this.context.globalStore.matchedTotalJob}
            </span>
          </button>
          <button
            className={this.context.globalStore.visibleIndex === 'Company' ? 'active' : ''}
            onClick={() => this.switchVisibleIndex('Company')}
          >
            <span className="match__results-container__type-buttons__match-type">Companies</span>
            <span className="match__results-container__type-buttons__match-count">
              {this.context.globalStore.matchedTotalCompany}
            </span>
          </button>
        </div>
        {this.context.globalStore.visibleIndex === 'Company' && this.companies()}
        {this.context.globalStore.visibleIndex === 'Job' && this.jobs()}
      </div>
    );
  }
}

MatchResults.contextTypes = {
  globalStore: PropTypes.object
};
