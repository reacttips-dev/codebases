import { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { track } from 'apis/amethyst';
import { evIFrameImpression } from 'events/symphony';
import { fetchCustomerDirectedIdAndAppend } from 'actions/landing/iframe';

import css from 'styles/components/landing/iframe.scss';

export class Iframe extends Component {

  componentDidMount() {
    const {
      landing: {
        pageInfo: {
          customerAuth
        }
      },
      slotIndex,
      slotName,
      slotDetails,
      slotDetails: {
        iframe: {
          href
        }
      },
      fetchCustomerDirectedIdAndAppend
    } = this.props;
    if (customerAuth === 'FULL' && href.includes('sheerid')) { // append customer directId to SheerId iframe src
      fetchCustomerDirectedIdAndAppend(href);
    }

    track(() => ([evIFrameImpression, { url: href, slotIndex, slotName, slotDetails }]));
  }

  render() {
    const { slotDetails: { iframe, monetateId }, iframe: stateIframe } = this.props;
    const { href, sandbox, width, height, frameborder, title } = iframe;
    const { updatedHref } = stateIframe;
    const iframeHref = updatedHref || href;
    const style = {
      height: height || null,
      width: width || null
    };

    if (iframeHref) {
      return (
        <div className={css.iframeWrapper} data-monetate-id={monetateId}>
          <iframe
            title={title}
            src={iframeHref}
            sandbox={sandbox}
            width={width}
            height={height}
            style={style}
            frameBorder={frameborder || '0'}></iframe>
        </div>
      );
    } else {
      return false;
    }
  }
}

Iframe.propTypes = {
  slotDetails: PropTypes.shape({
    href: PropTypes.string,
    height: PropTypes.string
  }).isRequired
};

const mapStateToProps = state => ({
  landing: state.landingPage,
  iframe: state.iframe
});

const ConnectIframe = connect(mapStateToProps, {
  fetchCustomerDirectedIdAndAppend
})(Iframe);

export default withErrorBoundary('Iframe', ConnectIframe);
