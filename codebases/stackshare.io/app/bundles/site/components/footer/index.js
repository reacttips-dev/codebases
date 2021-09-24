import React, {useContext, useMemo} from 'react';
import glamorous from 'glamorous';
import PropTypes from 'prop-types';
import LogoImage from './images/ss-logo.svg';
import AngelListIcon from '../../../../shared/library/icons/social/angellist.svg';
import FacebookIcon from '../../../../shared/library/icons/social/facebook.svg';
import TwitterIcon from '../../../../shared/library/icons/social/twitter.svg';
import LinkedinIcon from '../../../../shared/library/icons/social/linkedin.svg';
import {TABLET, LAPTOP, DESKTOP, WIDE, NON_MOBILE} from '../../../../shared/style/breakpoints';
import {BASE_TEXT, WEIGHT} from '../../../../shared/style/typography';
import {
  CHARCOAL,
  FOCUS_BLUE,
  GUNSMOKE,
  WHITE,
  CONCRETE,
  SCORE
} from '../../../../shared/style/colors';
import {PrivateModeContext} from '../../../../shared/enhancers/private-mode-enchancer';

const FooterContainer = glamorous.footer({
  ...BASE_TEXT,
  lineHeight: 1.4,
  background: CHARCOAL,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '50px 0 80px',
  [TABLET]: {
    padding: '0 0 40px'
  }
});

const FooterWrap = glamorous.div({
  maxWidth: 1220,
  [LAPTOP]: {
    width: 700
  },
  [DESKTOP]: {
    width: 955
  },
  [WIDE]: {
    width: 1220
  }
});

const Grid = glamorous.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  justifyItems: 'center',
  columnGap: '3%',
  [TABLET]: {
    gridTemplateColumns: '1fr',
    textAlign: 'center'
  }
});

const GridItem = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'left',
  width: '100%'
});

const FooterLinks = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  color: WHITE,
  fontSize: 14,
  lineHeight: 1.7,
  letterSpacing: 0.3,
  [TABLET]: {
    alignItems: 'center',
    width: '95%',
    fontSize: 16,
    lineHeight: 2
  },
  '& a': {
    color: WHITE,
    textDecoration: 'none',
    '&:visited': {
      color: WHITE
    },
    '&:hover': {
      color: FOCUS_BLUE
    },
    '&:hover span': {
      color: WHITE
    },
    '&:active span': {
      color: WHITE
    }
  }
});

const Heading = glamorous.h3({
  color: WHITE,
  fontWeight: WEIGHT.BOLD,
  fontSize: 20,
  letterSpacing: 0.38,
  [TABLET]: {
    marginTop: 36,
    marginBottom: 24
  }
});

const WithTag = glamorous.a({
  position: 'relative',
  [NON_MOBILE]: {
    marginRight: 'auto'
  }
});

const IconList = glamorous.ul({
  padding: 0,
  margin: '8px 0',
  '& li': {
    display: 'inline-block',
    margin: '0 5px',
    [NON_MOBILE]: {
      '&:first-child': {
        marginLeft: 0
      }
    }
  },
  [TABLET]: {
    margin: '0 0 80px'
  }
});

const IconLink = glamorous.a({
  '& svg:hover path': {
    fill: GUNSMOKE
  }
});

const LogoLink = glamorous.a({
  lineHeight: '100%',
  '& svg': {
    maxWidth: 135,
    '& g': {
      fill: WHITE
    }
  }
});

const ExtraLinks = glamorous.div({
  color: WHITE,
  '& a, & span': {
    display: 'inline-block',
    marginRight: 8,
    fontSize: 13,
    letterSpacing: 0.24
  },
  '& a:last-child': {
    marginRight: 0
  },
  [TABLET]: {
    lineHeight: 1.5,
    marginTop: 14,
    marginBottom: 11
  }
});

const Copyright = glamorous.div({
  color: CONCRETE,
  fontSize: 10,
  marginTop: 5,
  '& div': {
    whiteSpace: 'nowrap'
  },
  [TABLET]: {
    fontSize: 13,
    lineHeight: 1.5,
    textAlign: 'center'
  }
});

const Pill = glamorous.span({
  color: WHITE,
  background: SCORE,
  fontSize: '12px',
  fontWeight: 'bold',
  padding: '3px 5px',
  borderRadius: 6,
  marginLeft: 5
});

const Footer = ({isAdmin, privateMode: private_mode}) => {
  const isPrivateMode = useContext(PrivateModeContext);
  const privateMode = private_mode || (isPrivateMode && isPrivateMode.id);

  const data = [
    {
      heading: 'Tools & Services',
      links: [
        {
          href: '/stackups/trending',
          title: 'Compare Tools',
          tag: 'Compare Tools'
        },
        {href: '/search', title: 'Search Tools & Services', tag: 'Search'},
        {href: '/alternatives', title: 'Browse Tools & Services', tag: 'Browse Tool Alternatives'},
        {href: '/categories', title: 'Technology Tools & Services', tag: 'Browse Tool Categories'},
        {href: '/submit', title: 'Submit a Tool', tag: 'Submit A Tool'},
        {href: '/admin/approval-tool', title: 'Approve Tools', tag: 'Approve Tools', show: isAdmin},
        {href: '/match', title: 'Stack Match', tag: 'Job Search', show: !privateMode},
        {href: '/featured-posts', title: 'Featured Posts', tag: 'Stories & Blog'}
      ]
    },
    {
      heading: 'Company',
      links: [
        {
          href: '/private',
          title: 'Private StackShare',
          tag: (
            <>
              🔒 Private StackShare<Pill>NEW</Pill>
            </>
          ),
          show: false
        },
        {href: '/api', title: 'API', tag: 'API'},
        {href: '/careers', title: 'Careers at StackShare', tag: 'Careers', withTag: true},
        {href: '/stackshare', title: 'Our Stack', tag: 'Our Stack'},
        {href: '/vendors', title: 'Advertise With Us', tag: 'Advertise With Us'},
        {href: 'mailto:team@stackshare.io', title: 'Contact Us', tag: 'Contact Us'}
      ]
    },
    {
      heading: 'Follow Us',
      iconList: true,
      links: [
        {
          href: 'https://twitter.com/stackshareio',
          target: '_blank',
          icon: <TwitterIcon />,
          rel: 'noreferrer noopener nofollow'
        },
        {
          href: 'https://facebook.com/stackshareio',
          target: '_blank',
          icon: <FacebookIcon />,
          rel: 'noreferrer noopener nofollow'
        },
        {
          href: 'https://www.linkedin.com/company/stackshare',
          target: '_blank',
          icon: <LinkedinIcon />,
          rel: 'noreferrer noopener nofollow'
        },
        {
          href: 'https://angel.co/stackshare',
          target: '_blank',
          icon: <AngelListIcon />,
          rel: 'noreferrer noopener nofollow'
        }
      ]
    }
  ];

  const renderedSections = useMemo(
    () =>
      data.map((item, index) => (
        <GridItem key={index}>
          <FooterLinks>
            <Heading>{item.heading}</Heading>
            {item.iconList ? (
              <IconList>
                {item.links.map((link, ind) => (
                  <li key={ind}>
                    <IconLink href={link.href} target={link.target} rel={link.rel}>
                      {link.icon}
                    </IconLink>
                  </li>
                ))}
              </IconList>
            ) : (
              item.links.map((link, ind) =>
                !link.show ? (
                  link.withTag ? (
                    <WithTag href={link.href} title={link.title} key={ind}>
                      {link.tag}
                    </WithTag>
                  ) : (
                    <a href={link.href} title={link.title} key={ind}>
                      {link.tag}
                    </a>
                  )
                ) : (
                  <></>
                )
              )
            )}
          </FooterLinks>
        </GridItem>
      )),
    [isAdmin, privateMode]
  );

  return (
    <FooterContainer>
      <FooterWrap>
        <Grid>
          {renderedSections}
          <GridItem>
            <FooterLinks>
              <LogoLink href="/">
                <LogoImage />
              </LogoLink>
              <ExtraLinks>
                <a href="/terms">Terms</a>
                <span>&middot;</span>
                <a href="/privacy">Privacy</a>
              </ExtraLinks>
              <Copyright>
                <div>Copyright © {new Date().getFullYear()} StackShare, Inc. </div>
                <div>All rights reserved.</div>
              </Copyright>
              <ExtraLinks>
                <a href="/html-sitemaps/stackups/main.html">Sitemap</a>
              </ExtraLinks>
            </FooterLinks>
          </GridItem>
        </Grid>
      </FooterWrap>
    </FooterContainer>
  );
};

Footer.propTypes = {
  isAdmin: PropTypes.bool,
  privateMode: PropTypes.bool
};

Footer.defaultProps = {
  isAdmin: false,
  privateMode: false
};

export default Footer;
