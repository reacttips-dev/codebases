import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deepEqual } from 'fast-equals';

import { IFRAME_EMPTY_TITLE } from 'constants/appConstants';
import { buildDataBundle, buildIframeUrl, isConfigValid, pixelLogger } from 'helpers/PixelServerUtils';
import marketplace from 'cfg/marketplace.json';
import { onEvent } from 'helpers/EventHelpers';

export class PixelServer extends Component {
  state = {
    mounted: false,
    loadedPageType: null
  };

  componentDidMount() {
    const { config, tid } = this.props;
    pixelLogger('CONFIG: ', config);
    if (isConfigValid(config, tid)) {
      // Delay performing actual work until window load event has fired since this supplemetary
      if (document.readyState === 'complete') {
        this.setState({ mounted: true });
      } else {
        onEvent(window, 'load', () => {
          this.setState({ mounted: true });
        }, null, this);
      }
    }
  }

  componentDidUpdate(prevProps) {
    // If we just updated and have new data for the an already loaded page, then just fire postMessage
    const { mounted, loadedPageType } = this.state;
    const { pixelServer } = this.props;
    // TODO possibly just do deep deepEqual on pixelServer?
    if (mounted && prevProps.pixelServer.pageType === pixelServer.pageType &&
      loadedPageType === pixelServer.pageType &&
      !deepEqual(prevProps.pixelServer.data, pixelServer.data)) {
      this.postData();
    }
  }

  postData = () => {
    const {
      pixelServer: { data, pageType = '' },
      config,
      holmes = null,
      tid
    } = this.props;

    if (!holmes) {
      pixelLogger('Unable to parse holmes cookie, skipping adding holmes data to payload');
    }

    const payload = buildDataBundle(buildIframeUrl(config, pageType), tid, data);
    const { pageload } = payload;
    const payloadDecorated = holmes
      ? { ...payload, pageType, pageload: { ...pageload, holmes } }
      : { ...payload, pageType };

    pixelLogger(`SUCCESS: iframe is loaded (${this.pixelServerFrame.src})`);
    pixelLogger('INFO:', pageType, payloadDecorated);
    this.pixelServerFrame.contentWindow.postMessage(JSON.stringify(payloadDecorated), `https://${config.host}`);
    this.setState({ loadedPageType: pageType });
  };

  render() {
    const { mounted } = this.state;
    const { pixelServer: { pageType, queryString }, config } = this.props;
    if (mounted && pageType) {
      const src = buildIframeUrl(config, pageType, queryString);
      const iframeStyles = { display: 'block', width: 0, height: 0, visibility: 'hidden', border: '0' };
      // Must specify key attribute or else when src changes, duplicate history entries are added to browser
      return (
        <iframe
          aria-hidden="true"
          title={IFRAME_EMPTY_TITLE}
          ref={el => this.pixelServerFrame = el}
          key={src}
          src={src}
          style={iframeStyles}
          onLoad={event => {
            /*
              Only fire if `event` exists, otherwise we get postMessage errors because the
              onLoad event for iframes is a god damn lie.
              https://stackoverflow.com/questions/10781880/dynamically-crated-iframe-triggers-onload-event-twice
            */
            if (event && event.target && event.target.src) {
              this.postData();
            }
          }}/>
      );
    } else {
      return null;
    }
  }
}

const mapStateToProps = state => {
  const { holmes, cookies: { tid = '' } } = state;

  return {
    config: {
      host: state.environmentConfig.pixelServerHost,
      pathname: marketplace.pixelServer.pathname
    },
    pixelServer: state.pixelServer,
    tid,
    holmes
  };
};

export default connect(mapStateToProps)(PixelServer);
