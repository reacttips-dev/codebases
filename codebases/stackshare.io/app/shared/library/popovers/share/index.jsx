import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import clipboard from 'clipboard-polyfill';
import {
  CATHEDRAL,
  CONCRETE,
  FACEBOOK_BLUE,
  FOCUS_BLUE,
  LINKEDIN_BLUE,
  TWITTER_BLUE,
  WHITE
} from '../../../style/colors';
import {FONT_FAMILY} from '../../../style/typography';
import PopoverWithAnchor, {ACTIVATE_MODE_CLICK, AUTO_FIT_VERTICAL} from '../base';

import LinkIcon from './link.svg';
import FacebookIcon from './facebook.svg';
import TwitterIcon from './twitter.svg';
import LinkedInIcon from './linkedin.svg';
import EmailIcon from './email.svg';

import {KEY_MODIFIER_SYMBOL} from '../../../utils/user-agent';
import {withSendAnalyticsEvent} from '../../../../shared/enhancers/analytics-enhancer';

const ButtonRow = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  marginBottom: 9,
  ':last-child': {
    marginBottom: 0
  }
});

const inputStyle = {
  fontFamily: FONT_FAMILY,
  fontSize: 11,
  color: CATHEDRAL,
  padding: 11,
  borderRadius: 1,
  border: `1px solid ${CONCRETE}`,
  flexGrow: 1,
  minWidth: 192
};

const PermalinkInput = glamorous.input(inputStyle);

const CopiedMsg = glamorous.div({
  ...inputStyle,
  backgroundColor: FOCUS_BLUE,
  borderColor: FOCUS_BLUE,
  color: WHITE
});

const CopyButton = glamorous.button({
  cursor: 'pointer',
  flexGrow: 0,
  width: 37,
  padding: 0,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 1,
  border: `1px solid ${CONCRETE}`,
  borderLeftWidth: 0,
  outline: 'none',
  ':hover,.copied': {
    backgroundColor: FOCUS_BLUE,
    borderColor: FOCUS_BLUE,
    '>svg>g': {
      fill: WHITE
    }
  }
});

const BaseButton = glamorous.a({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  borderRadius: 1,
  border: `1px solid ${CONCRETE}`,
  padding: '9px 11px',
  fontFamily: FONT_FAMILY,
  fontSize: 12,
  textDecoration: 'none',
  cursor: 'pointer',
  flex: 1,
  marginRight: 9,
  ':last-child': {
    marginRight: 0
  },
  ':hover': {
    color: WHITE,
    backgroundColor: FOCUS_BLUE,
    borderColor: FOCUS_BLUE,
    '>svg>*': {
      fill: WHITE
    }
  }
});

export const Facebook = glamorous(BaseButton)({
  color: FACEBOOK_BLUE,
  '> svg': {
    marginRight: 15
  },
  ':hover': {
    backgroundColor: FACEBOOK_BLUE,
    borderColor: FACEBOOK_BLUE
  }
});

export const Twitter = glamorous(BaseButton)({
  color: TWITTER_BLUE,
  '> svg': {
    marginRight: 9
  },
  ':hover': {
    backgroundColor: TWITTER_BLUE,
    borderColor: TWITTER_BLUE
  }
});

export const LinkedIn = glamorous(BaseButton)({
  color: LINKEDIN_BLUE,
  '> svg': {
    position: 'relative',
    top: -2, // baseline nudge
    marginRight: 10
  },
  ':hover': {
    backgroundColor: LINKEDIN_BLUE,
    borderColor: LINKEDIN_BLUE
  }
});

export const Email = glamorous(BaseButton)({
  color: FOCUS_BLUE,
  '> svg': {
    marginRight: 6
  }
});

export class SharePopover extends Component {
  static propTypes = {
    url: PropTypes.string,
    title: PropTypes.string,
    children: PropTypes.any,
    analyticsEventName: PropTypes.string,
    sendAnalyticsEvent: PropTypes.func,
    deactivateMode: PropTypes.string
  };

  state = {
    showCopiedMsg: false
  };

  _timer = null;

  componentWillUnmount() {
    clearTimeout(this._timer);
  }

  copyUrl = async () => {
    if (this.props.url && this.props.url.length > 0) {
      try {
        await clipboard.writeText(this.props.url);
        this._timer = setTimeout(() => this.setState({showCopiedMsg: false}), 2000);
        this.setState({showCopiedMsg: true});
      } catch (err) {
        // eslint-disable-next-line
        console.warn('could not copy share url to clipboard', err);
      }
    }
  };

  render() {
    const {children, url, title, analyticsEventName, deactivateMode} = this.props;
    const {showCopiedMsg} = this.state;
    return (
      <PopoverWithAnchor
        anchor={children}
        activateMode={ACTIVATE_MODE_CLICK}
        deactivateMode={deactivateMode}
        autoFit={AUTO_FIT_VERTICAL}
      >
        <ButtonRow>
          {showCopiedMsg ? (
            <CopiedMsg>Link copied ({KEY_MODIFIER_SYMBOL}+V to paste)</CopiedMsg>
          ) : (
            <PermalinkInput type="text" value={url} readOnly />
          )}
          <CopyButton className={showCopiedMsg ? 'copied' : ''} onClick={this.copyUrl}>
            <LinkIcon />
          </CopyButton>
        </ButtonRow>
        <ButtonRow>
          <Facebook
            href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
            onClick={() => this.props.sendAnalyticsEvent(analyticsEventName, {share: 'Facebook'})}
          >
            <FacebookIcon />
            facebook
          </Facebook>
          <Email
            href={`mailto:?subject=${title}&body=${url}`}
            onClick={() => this.props.sendAnalyticsEvent(analyticsEventName, {share: 'Mail'})}
          >
            <EmailIcon />
            Email
          </Email>
        </ButtonRow>
        <ButtonRow>
          <Twitter
            href={`https://twitter.com/intent/tweet?via=stackshareio&text=${title} ${url}`}
            onClick={() => this.props.sendAnalyticsEvent(analyticsEventName, {share: 'Twitter'})}
          >
            <TwitterIcon />
            Twitter
          </Twitter>
          <LinkedIn
            href={`https://www.linkedin.com/shareArticle?url=${url}&title=${encodeURI(title)}`}
            onClick={() => this.props.sendAnalyticsEvent(analyticsEventName, {share: 'Linkedin'})}
          >
            <LinkedInIcon />
            LinkedIn
          </LinkedIn>
        </ButtonRow>
      </PopoverWithAnchor>
    );
  }
}

export default withSendAnalyticsEvent(SharePopover);
