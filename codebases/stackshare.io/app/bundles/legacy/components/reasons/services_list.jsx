import React, {Component} from 'react';
import {observer} from 'mobx-react';

import ServiceCard from './service_card.jsx';

export default
@observer
class ServicesList extends Component {
  constructor(props) {
    super(props);
    this.store = this.props.store;
  }

  render() {
    const services = this.store.services.map(service => {
      return <ServiceCard service={service} store={this.store} key={`service-${service.id}`} />;
    });

    return (
      <div className="reasons_service_card_list container">
        <div className="row">
          <div className="col-md-12">
            <div className="reasons_service_card_list__explainer__wrapper">
              <div className="reasons_service_card_list__explainer__title">Pros & Cons</div>
              <img
                src={this.store.trendingImagePath}
                className="reasons_service_card_list__explainer__illustration"
              />
              <div className="reasons_service_card_list__explainer__body">
                Help other developers pick the right tools for the job, and <b>earn points</b> while
                doing it
              </div>
            </div>
          </div>
        </div>
        {services}
        <div
          className="reasons_service_card_list__mobile_next_tool_link"
          onClick={this.store.mobileScrollToNextCard}
        >
          <div className="reasons_service_card_list__mobile_next_tool_link__icon">
            <span className="octicon octicon-chevron-down" />
          </div>
        </div>
      </div>
    );
  }
}
