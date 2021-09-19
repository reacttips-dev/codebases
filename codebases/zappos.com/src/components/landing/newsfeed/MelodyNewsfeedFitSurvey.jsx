import { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { evFitSurveyResponse } from 'events/landing';
import { fitSurveyReply, newsfeedImpression } from 'actions/landing/newsfeed';
import { trackEvent } from 'helpers/analytics';
import { track } from 'apis/amethyst';
import LandingPageImage from 'components/landing/LandingPageImage';
import { constructMSAImageUrl } from 'helpers';
import marketplace from 'cfg/marketplace.json';

// order matters
import commonCardCss from 'styles/components/landing/newsfeed/melodyNewsfeedCard.scss';
import css from 'styles/components/landing/newsfeed/melodyNewsfeedFitSurvey.scss';

export class MelodyNewsfeedFitSurvey extends Component {
  state = {
    fitSurveyVisible: true,
    hideReplyBtns: false,
    showReplyConf: false
  };

  componentDidMount() {
    const { newsfeedImpression, eventId, data } = this.props;
    trackEvent('TE_NEWSFEED_FITSURVEY_LOADED', `eventId:${eventId}`);
    newsfeedImpression(eventId, data, 'false'); // send pageView impression to Cronkite
  }

  onFitSurveyClose = () => {
    const { onNewsfeedCardDismiss, eventId, data: { lineItemId } } = this.props;
    const dismissalData = {
      type: 'fitSurvey',
      eventId,
      lineItemId
    };
    trackEvent('TE_NEWSFEED_FITSURVEY_DISMISS', `eventId:${eventId}`);
    this.setState({ fitSurveyVisible: false });
    onNewsfeedCardDismiss(dismissalData);
  };

  onFitSurveyReply = fitValue => {
    const { newsfeedImpression, fitSurveyReply, eventId, data } = this.props;
    const { stockId, asin } = data;
    trackEvent('TE_NEWSFEED_FITSURVEY_REPLY', `eventId:${eventId}:response:${fitValue}`);

    this.setState({ hideReplyBtns: true });

    setTimeout(() => { // trigger show confirmation message
      this.setState({ showReplyConf: true });
    }, 250);

    setTimeout(() => { // hide fit survey
      this.setState({ fitSurveyVisible: false });
    }, 3000);

    newsfeedImpression(eventId, data, 'true'); // send reply impression to Cronkite
    fitSurveyReply({ stockId, asin }, fitValue); // send reply value to Opal
  };

  makeFitSurveyPromptBtns() {
    const { testId } = this.context;
    const { hideReplyBtns } = this.state;
    const { data: { asin } } = this.props;
    return (
      <div className={cn(css.promptBtns, { [css.promptBtnsHidden]: hideReplyBtns })}>
        <button
          type="button"
          onClick={() => {
            this.onFitSurveyReply('-1');
            track(() => ([
              evFitSurveyResponse, {
                productIdentifiers: { asin },
                fitIndicator: 'TOO_SMALL'
              }
            ]));
          }}
          data-test-id={testId('newsfeedToosmallBtn')}>
          Too Small
        </button>
        <button
          type="button"
          onClick={() => {
            this.onFitSurveyReply('1');
            track(() => ([
              evFitSurveyResponse, {
                productIdentifiers: { asin },
                fitIndicator: 'TOO_BIG'
              }
            ]));
          }}
          data-test-id={testId('newsfeedToobigBtn')}>
          Too Big
        </button>
        <button
          type="button"
          onClick={() => {
            this.onFitSurveyReply('0');
            track(() => ([
              evFitSurveyResponse, {
                productIdentifiers: { asin },
                fitIndicator: 'FIT'
              }
            ]));
          }}
          data-test-id={testId('newsfeedPerfectBtn')}>
          Perfect
        </button>
      </div>
    );
  }

  makeFitSurveySubmittedConf() {
    const { firstName } = this.props;
    const { showReplyConf } = this.state;
    return (
      <div className={cn(css.promptConfMsg, { [css.promptConfMsgVisible]: showReplyConf })}>
        <span className={css.checkImg} />
        <span>{`Thanks! You're the best${firstName && `, ${firstName}`}!`}</span>
      </div>
    );
  }

  render() {
    const {
      data: {
        brandName,
        productName,
        imageId,
        color,
        sizing: {
          size,
          width
        }
      },
      shouldLazyLoad
    } = this.props;
    const { testId } = this.context;
    const { fitSurveyVisible, showReplyConf } = this.state;
    const { search: { msaImageParams } } = marketplace;
    const newsrc = constructMSAImageUrl(imageId, msaImageParams);
    return (
      <div className={cn(commonCardCss.newsfeedCard, { [css.fitSurveyHidden]: !fitSurveyVisible })}>
        <div className={css.header}>
          <h2>How was the fit?</h2>
          <button type="button" onClick={this.onFitSurveyClose} className={css.closeBtn}>
            <span className={css.closeText}>close</span>
          </button>
        </div>
        <div className={css.productInfoWrap}>
          <div className={css.productImageWrap}>
            <span data-test-id={testId('newsfeedImage')}>
              <LandingPageImage
                src={newsrc}
                itemProp="image"
                alt={`${brandName}-${productName}`}
                shouldLazyLoad={shouldLazyLoad}
              />
            </span>
          </div>
          <div className={css.productInfo}>
            <p data-test-id={testId('newsfeedBrandname')}>{brandName}</p>
            <p className={css.productName} data-test-id={testId('newsfeedProductname')}>{productName}</p>
            <p data-test-id={testId('newsfeedProductColor')}>{color}</p>
            <p className={css.productSizing} data-test-id={testId('newsfeedProductSizing')}>{`${size}, ${width}`}</p>
            <p className={css.prompt}>Your response will help us recommend better size suggestions for you and others!</p>
          </div>
        </div>
        <div className={cn(css.promptResponse, { [css.promptResponseConfVisible]: showReplyConf })}>
          {this.makeFitSurveyPromptBtns()}
          {this.makeFitSurveySubmittedConf()}
        </div>
      </div>
    );
  }
}

MelodyNewsfeedFitSurvey.contextTypes = {
  testId: PropTypes.func
};

function mapStateToProps(state) {
  return {
    newsfeed: state.newsfeed,
    firstName: state.holmes.firstName
  };
}

export default connect(mapStateToProps, {
  newsfeedImpression,
  fitSurveyReply
})(MelodyNewsfeedFitSurvey);
