import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  pushStoredMicrosoftUetEvents,
  setMicrosoftUetTagLoaded
} from 'actions/microsoftUetTag';
import { IFRAME_EMPTY_TITLE, MICROSOFT_UET_IFRAME_ID } from 'constants/appConstants';
import { onEvent } from 'helpers/EventHelpers';
import { MartyContext } from 'utils/context';

const IFRAME_STYLES = { display: 'block', width: 0, height: 0, visibility: 'hidden', border: '0' };

export class MicrosoftUetTag extends Component {
  state = { mounted: false };

  componentDidMount() {
    // only bother with the Microsoft UET tag if we're in a browser that
    // supports window.postMessage
    if (typeof window !== 'undefined' && window.postMessage) {
      // delay performing actual work until window load event has fired since
      // this is supplementary
      if (document.readyState === 'complete') {
        this.setState({ mounted: true });
      } else {
        onEvent(window, 'load', () => {
          this.setState({ mounted: true });
        }, null, this);
      }
    }
  }

  getMarketplaceConfig = context => context.marketplace.analytics.microsoft.uet;

  onLoad = event => {
    // https://stackoverflow.com/questions/10781880/dynamically-crated-iframe-triggers-onload-event-twice
    if (event?.target?.src) {
      const {
        pushStoredMicrosoftUetEvents,
        setMicrosoftUetTagLoaded
      } = this.props;
      setMicrosoftUetTagLoaded(true);
      pushStoredMicrosoftUetEvents();
    }
  };

  renderWithContext = context => {
    const { mounted } = this.state;
    const { enabled, tagUrl } = this.getMarketplaceConfig(context);
    if (!enabled || !mounted) {
      return null;
    }

    return (
      <iframe
        aria-hidden="true"
        id={MICROSOFT_UET_IFRAME_ID}
        title={IFRAME_EMPTY_TITLE}
        src={tagUrl}
        style={IFRAME_STYLES}
        onLoad={this.onLoad} />
    );
  };

  render() {
    return (
      <MartyContext.Consumer>
        {context => this.renderWithContext(context)}
      </MartyContext.Consumer>
    );
  }
}

const mapDispatchToProps = { setMicrosoftUetTagLoaded, pushStoredMicrosoftUetEvents };

export default connect(null, mapDispatchToProps)(MicrosoftUetTag);
