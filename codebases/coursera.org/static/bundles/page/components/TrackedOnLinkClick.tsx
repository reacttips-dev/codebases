import _ from 'lodash';
import PropTypes from 'prop-types';
import React from 'react';
import Retracked from 'js/app/retracked';

class TrackedOnLinkClickImpl extends React.Component {
  static propTypes = {
    trackingName: PropTypes.string.isRequired,
    data: PropTypes.object,
    dataFromEvent: PropTypes.func,
    children: PropTypes.node,
    elementType: PropTypes.oneOf(['div', 'span']).isRequired,
    clickHandler: PropTypes.func,
  };

  static contextTypes = {
    _eventData: PropTypes.object,
    _withTrackingData: PropTypes.func,
  };

  trackClick = (e: $TSFixMe) => {
    if (e.target.tagName === 'A') {
      const { _eventData, _withTrackingData } = this.context;
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'dataFromEvent' does not exist on type 'R... Remove this comment to see the full error message
      const { dataFromEvent: dataFromEventProp, data: dataProp, trackingName, clickHandler } = this.props;
      // some links might have a click event instead of the href attribute
      const { href } = e.target.attributes;
      const dataFromEvent = dataFromEventProp ? dataFromEventProp(e) : {};
      const data = {
        ...dataProp,
        ...dataFromEvent,
        href: href && href.value,
      };
      Retracked.trackComponent(_eventData, data, trackingName, 'click', _withTrackingData);

      if (clickHandler) {
        clickHandler(e);
      }
    }
  };

  render() {
    const { _eventData } = this.context;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'trackingName' does not exist on type 'Re... Remove this comment to see the full error message
    const { trackingName, elementType, children } = this.props;
    const namespace = (_eventData && _eventData.namespace) || {};
    const action = 'click';
    const { app, page } = namespace;
    const component = trackingName;
    const Element = elementType;

    return (
      <Element
        onClick={this.trackClick}
        data-track={true}
        data-track-app={app}
        data-track-page={page}
        data-track-action={action}
        data-track-component={component}
        {..._.omit(this.props, 'data', 'elementType', 'trackingName', 'clickHandler')}
      >
        {children}
      </Element>
    );
  }
}

class TrackedOnLinkClickDiv extends React.Component {
  render() {
    return <TrackedOnLinkClickImpl elementType="div" {...this.props} />;
  }
}

class TrackedOnLinkClickSpan extends React.Component {
  render() {
    return <TrackedOnLinkClickImpl elementType="span" {...this.props} />;
  }
}

export { TrackedOnLinkClickDiv, TrackedOnLinkClickSpan };
