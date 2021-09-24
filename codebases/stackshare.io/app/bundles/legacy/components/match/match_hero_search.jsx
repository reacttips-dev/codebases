import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import * as C from './constants';
import {Savable} from './constants';

export default
@observer
class MatchHeroSearch extends Component {
  constructor(props) {
    super(props);

    this.state = {
      jobSearch: ''
    };

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onKeyDown(e) {
    if (e.key === 'Enter') {
      trackEvent('match.keyword-search', {
        keywords: this.context.globalStore.jobSearch,
        location: this.context.globalStore.location,
        source: 'keywords'
      });
      clearTimeout(this.saveTimeout);
      this.context.globalStore.serializeToUrl();
      this.context.globalStore.search();
    }
  }

  onChange(e) {
    clearTimeout(this.saveTimeout);
    this.context.globalStore.jobSearch = e.target.value;
    this.context.globalStore.saveState = Savable;
    this.saveTimeout = setTimeout(() => {
      this.context.globalStore.serializeToUrl();
      this.context.globalStore.search();
    }, C.DEBOUNCE_SAVE_TIMEOUT);
  }

  render() {
    return (
      <div className="match__search">
        <div className="match__search__icon">
          <span className="fa fa-search" />
        </div>
        <input
          className="match__search__jobs"
          placeholder="Search by position, industry or keyword"
          value={this.context.globalStore.jobSearch}
          name="jobSearch"
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
        />
        <div
          className="powered-by"
          style={{position: 'inherit', opacity: '.75', float: 'left', marginTop: 10 + 'px'}}
        >
          Powered by
          <a href="/algolia">
            <img
              style={{width: 80 + 'px'}}
              alt="Algolia"
              src="https://img.stackshare.io/fe/algolia.png"
            />
          </a>
        </div>
      </div>
    );
  }
}

MatchHeroSearch.contextTypes = {
  globalStore: PropTypes.object
};
