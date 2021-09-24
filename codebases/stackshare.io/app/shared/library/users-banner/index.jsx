import React from 'react';
import glamorous from 'glamorous';
import {BLACK, FOCUS_BLUE, WHITE, CONCRETE, TWITTER_BLUE, ASH} from '../../../shared/style/colors';
import {FONT_FAMILY} from '../../../shared/style/typography';
import {PHONE} from '../../../shared/style/breakpoints';
import TwitterIcon from '../../../shared/library/icons/twitter_white.svg';
import HashIcon from '../../../shared/library/icons/hash_symbol.svg';
import CelebrateIcon from '../../../shared/library/icons/celebrate_icon.svg';
import Dev1MIconMobile from '../../../shared/library/icons/1MDevs_icon.svg';
import Dev1MIconDesktop from '../../../shared/library/icons/desktop_user_profile_1M.svg';
import {useSendAnalyticsEvent} from '../../../shared/enhancers/analytics-enhancer';
import {formatNumber} from '../../../shared/utils/format';

const Container = glamorous.div({
  width: 818,
  height: 156,
  margin: '24px 0 44px 5px',
  background: WHITE,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  border: `1px solid ${ASH}`,
  boxSizing: 'border-box',
  boxShadow: `0px 1.12565px 0px ${ASH}`,
  borderRadius: 4.5,
  padding: '42px 70px 43px 0',
  [PHONE]: {
    width: 355,
    height: 476,
    flexDirection: 'column',
    padding: '40px 0',
    paddingTop: 3,
    marginLeft: 10
  }
});

const ImageWithText = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  width: 642,
  [PHONE]: {
    flexDirection: 'column',
    width: 349,
    height: 216,
    marginBottom: 15
  }
});

const ImageDiv = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  [PHONE]: {
    margin: 15
  }
});

const CelebrateIconStyled = glamorous(CelebrateIcon)({
  marginTop: 5,
  marginBottom: -4,
  marginLeft: 6
});

const DevIconMobileStyled = glamorous(Dev1MIconMobile)({
  width: 274,
  height: 193
});

const DevIconDesktopStyled = glamorous(Dev1MIconDesktop)({
  width: 237,
  height: 150
});

const Info = glamorous.div({
  fontSize: 24,
  fontWeight: 'bold',
  lineHeight: 1.03,
  letterSpacing: 0.09,
  color: BLACK,
  width: 336,
  marginLeft: 25,
  height: 'fit-content',
  '> a': {
    color: FOCUS_BLUE,
    cursor: 'pointer',
    textDecoration: 'none',
    fontSize: 18,
    fontWeight: 'normal',
    ':hover': {
      textDecoration: 'underline'
    }
  },
  '> p': {
    fontSize: 14,
    fontWeight: 700,
    marginLeft: 4,
    marginBottom: 0,
    display: 'flex',
    alignItems: 'center'
  },
  [PHONE]: {
    maxWidth: 325,
    margin: '0 0 0 15px',
    '> p': {
      fontSize: 12,
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      margin: '0 0 0 36px'
    },
    '> a': {
      color: FOCUS_BLUE,
      cursor: 'pointer',
      textDecoration: 'none',
      fontSize: 14,
      fontWeight: 'normal',
      marginLeft: 32
    }
  }
});

const LinkContainer = glamorous.div({
  display: 'block',
  marginLeft: 35,
  [PHONE]: {
    marginLeft: 12
  }
});

const BaseButton = glamorous.a({
  display: 'flex',
  flexDirection: 'row',
  width: 136,
  height: 36,
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
  },
  ':focus': {
    color: WHITE
  },
  [PHONE]: {
    width: 155,
    height: 41,
    padding: '4px 0 4px 21px'
  }
});

const Twitter = glamorous(BaseButton)({
  color: WHITE,
  marginBottom: 10,
  borderRadius: 4,
  backgroundColor: '#1DA1F2',
  borderColor: TWITTER_BLUE,
  '> svg': {
    marginRight: 9
  }
});

const ReadMoreLink = glamorous.a({
  color: FOCUS_BLUE,
  ':hover': {
    textDecoration: 'underline'
  },
  [PHONE]: {
    textDecoration: 'none',
    fontSize: 13,
    marginLeft: 12
  }
});

const UserDetails = glamorous.div({
  display: 'flex',
  fontSize: 60,
  height: 58,
  marginBottom: 9,
  [PHONE]: {
    fontSize: 57,
    marginLeft: 31
  }
});

const UserNumber = glamorous.div({
  marginLeft: 10,
  width: 359,
  [PHONE]: {
    marginLeft: 5
  }
});

const UsersBanner = userData => {
  const profileId = userData && userData.profileId;
  const userId = userData && userData.userId;
  const sendAnalyticsEvent = useSendAnalyticsEvent();
  const title = `Turns out I was %23${formatNumber(
    userId
  )} to join the @stackshareio community! Congrats on reaching one million developers 🥳 Find your own %23 and see a timeline of StackShare's history:`;
  const url = 'https://stackshare.io/one-million-developers';
  const bannerUrl = window.location.href;
  const bannerPathname = window.location.pathname;

  return (
    profileId === userId && (
      <Container>
        <ImageWithText>
          <ImageDiv>
            {userData.mobile ? (
              <a
                href="/one-million-developers"
                target="_blank"
                onClick={() => {
                  sendAnalyticsEvent('one_million_banner_click', {
                    url: bannerUrl,
                    path: bannerPathname,
                    type: 'image'
                  });
                }}
              >
                <DevIconMobileStyled />
              </a>
            ) : (
              <a
                href="/one-million-developers"
                target="_blank"
                onClick={() => {
                  sendAnalyticsEvent('one_million_banner_click', {
                    url: bannerUrl,
                    path: bannerPathname,
                    type: 'image'
                  });
                }}
              >
                <DevIconDesktopStyled />
              </a>
            )}
          </ImageDiv>
          <Info>
            <p>DEVELOPER</p>
            <UserDetails>
              <HashIcon />
              <UserNumber>{`${formatNumber(profileId)}`}</UserNumber>
            </UserDetails>
            <a
              href="/one-million-developers"
              target="_blank"
              onClick={() => {
                sendAnalyticsEvent('one_million_banner_click', {
                  url: bannerUrl,
                  path: bannerPathname,
                  type: 'text'
                });
              }}
            >
              StackShare is now <span style={{fontWeight: 'bold'}}>1M</span> devs strong!
              <CelebrateIconStyled />
            </a>
          </Info>
        </ImageWithText>
        <LinkContainer>
          <Twitter
            href={`https://twitter.com/intent/tweet?text=${title} ${url}`}
            target="_blank"
            onClick={() => {
              sendAnalyticsEvent('one_million_banner_click', {
                url: bannerUrl,
                path: bannerPathname,
                type: 'tweet'
              });
            }}
          >
            <TwitterIcon />
            <div style={{fontSize: 18, fontWeight: 'bold'}}>Tweet this</div>
          </Twitter>
          <ReadMoreLink
            href="/one-million-developers"
            target="_blank"
            onClick={() => {
              sendAnalyticsEvent('one_million_banner_click', {
                url: bannerUrl,
                path: bannerPathname,
                type: 'read_more'
              });
            }}
          >
            <span style={{marginLeft: 20}}>Read more here</span>
          </ReadMoreLink>
        </LinkContainer>
      </Container>
    )
  );
};

export default UsersBanner;
