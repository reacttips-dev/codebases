import { Component, createRef } from 'react';
import PropTypes from 'prop-types';

import Link from 'components/hf/HFLink';
import { trackEvent } from 'helpers/analytics';
import { evDynamicBannerClick, evDynamicBannerImpression } from 'events/headerFooter';
import HtmlToReact from 'components/common/HtmlToReact';
import { isDisplayPhraseDataEqual } from 'helpers/HFHelpers';
import { track } from 'apis/amethyst';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';

import css from 'styles/components/hf/zappos/dynamicBanner.scss';

export class DynamicBanner extends Component {
  constructor() {
    super();
    this.container = createRef();
  }

  componentDidMount() {
    this.handleImpression();
  }

  componentDidUpdate(prevProps) {
    const { displayPhraseData } = this.props;
    const { displayPhraseData: prevDisplayPhraseData } = prevProps;
    if (!isDisplayPhraseDataEqual(prevDisplayPhraseData, displayPhraseData)) {
      this.handleImpression();
    }
  }

  handleImpression = () => {
    const { displayPhraseData: { link, image: imageUrl } = {} } = this.props;
    const text = this.container.current?.innerText;
    if (text) {
      const content = {
        contentType: 'DYNAMIC',
        text,
        link,
        imageUrl
      };
      trackEvent('TE_HEADER_DYNAMICBANNER', text);
      track(() => ([evDynamicBannerImpression, { content }]));
    }
  };

  handleClick = () => {
    const { displayPhraseData: { link, image: imageUrl } = {} } = this.props;
    const text = this.container.current?.innerText;
    const content = {
      contentType: 'DYNAMIC',
      text,
      link,
      imageUrl
    };
    trackEvent('TE_HEADER_DYNAMICBANNERCLICKED', text);
    track(() => ([evDynamicBannerClick, { content }]));
  };

  render() {
    const { displayPhraseData } = this.props;
    const { testId } = this.context;
    if (!displayPhraseData) {
      return null;
    }

    const { text, link } = displayPhraseData;

    return (
      <Link
        to={link}
        forwardRef={this.container}
        data-test-id={testId('headerPromo')}
        onClick={this.handleClick}
        className={css.dynamicBanner}>
        <HtmlToReact noContainer={true}>{text}</HtmlToReact>
      </Link>
    );
  }
}

DynamicBanner.contextTypes = {
  testId: PropTypes.func
};

DynamicBanner.displayName = 'DynamicBanner';

export default withErrorBoundary(DynamicBanner.displayName, DynamicBanner);
