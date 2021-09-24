import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {observer} from 'mobx-react';
import * as C from './constants';
import {Savable} from './constants';

export default
@observer
class MatchHeroLocation extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.search = this.search.bind(this);
  }

  componentDidMount() {
    if (places) {
      let placesAutocomplete = places({
        type: 'city',
        templates: {
          value: function(suggestion) {
            return suggestion.name;
          }
        },
        container: document.querySelector('#algolia-places')
      });
      placesAutocomplete.on('change', e => {
        this.context.globalStore.location = `${e.suggestion.value}`;
        trackEvent('match.keyword-search', {
          keywords: this.context.globalStore.jobSearch,
          location: this.context.globalStore.location,
          source: 'location'
        });
        this.search();
      });
    }

    $('.ap-icon-clear').click(() => {
      this.context.globalStore.location = '';
      this.search();
    });
  }

  search() {
    this.context.globalStore.serializeToUrl();
    this.context.globalStore.search();
  }

  onChange(e) {
    clearTimeout(this.saveTimeout);
    this.context.globalStore.location = e.target.value;
    this.context.globalStore.saveState = Savable;
    this.saveTimeout = setTimeout(() => {
      this.context.globalStore.serializeToUrl();
      this.context.globalStore.search();
    }, C.DEBOUNCE_SAVE_TIMEOUT);
  }

  render() {
    return (
      <div className="match__location-wrapper">
        <div className="match__location">
          <input
            type="search"
            id="algolia-places"
            placeholder="Location"
            value={this.context.globalStore.location}
            onChange={this.onChange}
            ref="location"
          />
        </div>
      </div>
    );
  }
}

MatchHeroLocation.contextTypes = {
  globalStore: PropTypes.object
};
