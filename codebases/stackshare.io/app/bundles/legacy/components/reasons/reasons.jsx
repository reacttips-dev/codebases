import React, {Component} from 'react';
import {observer} from 'mobx-react';

import ReasonStore from './store/reason_store.js';

import ReasonsHeader from './reasons_header.jsx';
import ServicesList from './services_list.jsx';

export default
@observer
class Reasons extends Component {
  constructor(props) {
    super(props);
    this.store = new ReasonStore(props);
  }

  render() {
    return (
      <div>
        <ReasonsHeader store={this.store} />
        <ServicesList store={this.store} />
        {this.store.isLoading && (
          <img
            id="reasons_service_card_list--spinner"
            style={{
              display: 'block',
              width: 70 + 'px',
              margin: '30px auto'
            }}
            src="https://img.stackshare.io/fe/spinner.svg"
          />
        )}
        {this.store.endOfServices && (
          <div className="reasons_service_card_list__explainer__body reasons_service_card_list__explainer__body--footer">
            <span>Good work!</span> Those are all the tools you&apos;re a fan of.
          </div>
        )}
      </div>
    );
  }
}
