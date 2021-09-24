import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {compose} from 'react-apollo';
import glamorous from 'glamorous';
import {
  withSendAnalyticsEvent,
  withAnalyticsPayload
} from '../../../shared/enhancers/analytics-enhancer';
import {BASE_TEXT, WEIGHT} from '../../style/typography';
import {FOCUS_BLUE, WHITE, SCORE} from '../../style/colors';
import {grid} from '../../utils/grid';
import CloseIcon from '../icons/close.svg';
import InfoIcon from './info.svg';
import {THEMES, DARK_BLUE, INLINE, BOX, DRAFT, BAR} from './themes';
export {INLINE, BOX, DRAFT, BAR};

export {InfoIcon};
export const LEFT = 'left';
export const CENTER = 'center';

// const NOTICE_SHOW = 'notice_show';
const NOTICE_CLICK = 'notice_click';
const NOTICE_CLOSE = 'notice_close';

const Wrapper = glamorous.aside(
  {
    '& a, & a:hover, & a:visited, & a:focus': {
      color: FOCUS_BLUE
    }
  },
  ({theme}) => THEMES[theme].Wrapper
);

const Banner = glamorous.div(
  {
    ...BASE_TEXT,
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    fontSize: 14,
    fontWeight: WEIGHT.BOLD
  },
  ({hasChildren, theme, align}) => ({
    justifyContent: theme === INLINE ? LEFT : align,
    background: theme === INLINE ? 'transparent' : theme === DRAFT ? SCORE : DARK_BLUE,
    borderRadius: theme === BOX ? 3 : 0,
    borderBottomLeftRadius: theme === BOX && !hasChildren ? 3 : 0,
    borderBottomRightRadius: theme === BOX && !hasChildren ? 3 : 0,
    color: theme === DRAFT ? WHITE : FOCUS_BLUE
  })
);

const TitleWrapper = glamorous.div(
  {
    padding: grid(2),
    '& svg': {
      marginRight: grid(1)
    }
  },
  ({theme, link, onClick, hasChildren, fullWidth}) => ({
    paddingTop:
      theme === INLINE
        ? grid(2)
        : theme === BAR || theme === DRAFT || hasChildren
        ? grid(1)
        : grid(2),
    paddingBottom: theme === BAR || theme === DRAFT || hasChildren ? grid(1) : grid(2),
    cursor: link || onClick ? 'pointer' : 'default',
    flex: fullWidth ? 1 : 'initial'
  })
);

const Title = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  '& span >a': {
    textDecoration: 'underline',
    cursor: 'pointer'
  }
});

const TitleLink = glamorous.a({
  display: 'flex',
  alignItems: 'center'
});

const TitleTextWrap = glamorous.span({}, ({fullWidth}) => ({
  flex: fullWidth ? 1 : 'initial'
}));

const TitleText = glamorous.span({
  marginLeft: 5,
  textDecoration: 'underline',
  fontWeight: WEIGHT.BOLD
});

const TitleIcon = glamorous.span(
  {
    display: 'flex',
    alignItems: 'center'
  },
  ({theme}) => ({
    ' svg > g ': {
      fill: theme === DRAFT ? WHITE : FOCUS_BLUE
    }
  })
);

const Content = glamorous.div(
  {
    ...BASE_TEXT,
    color: FOCUS_BLUE,
    fontSize: 14,
    lineHeight: 1.6,
    letterSpacing: 0.3,
    padding: grid(2)
  },
  ({theme}) => ({
    paddingTop: theme === INLINE ? 0 : grid(2)
  })
);

const Dismiss = glamorous.a({
  ...BASE_TEXT,
  position: 'absolute',
  right: grid(2),
  textDecoration: 'none',
  cursor: 'pointer',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '> svg > g': {
    stroke: FOCUS_BLUE,
    fill: FOCUS_BLUE
  }
});

export class Notice extends Component {
  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    align: PropTypes.string,
    onDismiss: PropTypes.func,
    onClick: PropTypes.func,
    link: PropTypes.string,
    linkTitle: PropTypes.string,
    icon: PropTypes.element,
    children: PropTypes.any,
    theme: PropTypes.oneOf([BAR, BOX, INLINE, DRAFT]),
    sendAnalyticsEvent: PropTypes.func,
    // source: PropTypes.string,
    fullWidth: PropTypes.bool
  };

  static defaultProps = {
    align: CENTER,
    theme: BAR
  };

  analyticsPayload = {};

  // componentDidMount() {
  //   const {sendAnalyticsEvent, source, link, linkTitle, title} = this.props;
  //   this.analyticsPayload = {source, link, linkTitle, title: String(title)};
  //   sendAnalyticsEvent(NOTICE_SHOW, this.analyticsPayload);
  // }

  handleClick = event => {
    const {sendAnalyticsEvent, onClick} = this.props;

    sendAnalyticsEvent(NOTICE_CLICK, this.analyticsPayload);
    onClick && onClick(event);
  };

  handleDismiss = () => {
    const {sendAnalyticsEvent, onDismiss} = this.props;

    sendAnalyticsEvent(NOTICE_CLOSE, this.analyticsPayload);
    onDismiss && onDismiss();
  };

  render() {
    const {
      title,
      align,
      icon,
      children,
      link,
      linkTitle,
      theme,
      onClick,
      onDismiss,
      fullWidth
    } = this.props;

    const titleComponent = link ? (
      <TitleLink href={link}>
        <TitleIcon>{icon}</TitleIcon>
        <TitleTextWrap fullWidth={fullWidth}>
          {title}
          {linkTitle && <TitleText>{linkTitle}</TitleText>}
        </TitleTextWrap>
      </TitleLink>
    ) : (
      <Title>
        <TitleIcon theme={theme}>{icon}</TitleIcon>
        {title}
      </Title>
    );

    return (
      <Wrapper theme={theme}>
        <Banner hasChildren={children} theme={theme} align={align}>
          {title && (
            <TitleWrapper
              theme={theme}
              link={link}
              hasChildren={children}
              onClick={link || onClick ? this.handleClick : null}
              fullWidth={fullWidth}
            >
              {titleComponent}
            </TitleWrapper>
          )}
          {onDismiss && (
            <Dismiss onClick={this.handleDismiss}>
              <CloseIcon />
            </Dismiss>
          )}
        </Banner>
        {children && <Content theme={theme}>{children}</Content>}
      </Wrapper>
    );
  }
}

export default compose(
  withAnalyticsPayload(),
  withSendAnalyticsEvent
)(Notice);
