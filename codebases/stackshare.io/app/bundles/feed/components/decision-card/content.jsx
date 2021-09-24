import React, {Component, createRef} from 'react';
import {compose} from 'react-apollo';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {WHITE, BLACK, TARMAC, FOCUS_BLUE, CATHEDRAL, ASH} from '../../../../shared/style/colors';
import {BASE_TEXT} from '../../../../shared/style/typography';
import {
  FEED_CLICK_CARD,
  FEED_CLICK_CARD_SOURCE_SEE_LESS,
  FEED_CLICK_CARD_SOURCE_SEE_MORE
} from '../../constants/analytics';
import {
  withAnalyticsPayload,
  withSendAnalyticsEvent
} from '../../../../shared/enhancers/analytics-enhancer';
import {ALPHA} from '../../../../shared/style/color-utils.js';
import {withTrackEngagement} from '../../../../shared/enhancers/stream-analytics-enhancer';
import {CLICK} from '../../constants/stream-analytics';
import {LIGHT, DARK} from '../../constants/utils';

const LINE_HEIGHT = 25;
const TRUNCATE_HEIGHT = LINE_HEIGHT * 4;

const Container = glamorous.div(
  {
    position: 'relative',
    overflow: 'hidden'
  },
  ({expanded, gradientColor = CATHEDRAL}) => ({
    height: expanded ? 'auto' : TRUNCATE_HEIGHT,
    ':after': expanded
      ? null
      : {
          content: ' ',
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: 30,
          background: `linear-gradient(to bottom, ${ALPHA(gradientColor, 0)}, ${gradientColor} 80%)`
        }
  })
);

const DecisionContent = glamorous.div(
  {
    display: 'inline',
    fontSize: 15,
    ' p': {
      ...BASE_TEXT,
      fontSize: 15,
      lineHeight: 5 / 3,
      letterSpacing: 0.2
    },
    ' p:last-child': {
      display: 'inline'
    },
    ' ul, ol': {
      ' li': {
        ...BASE_TEXT,
        fontSize: 15,
        lineHeight: 5 / 3,
        letterSpacing: 0.2
      }
    },
    ' a, a:visited': {
      textDecoration: 'underline',
      cursor: 'pointer',
      ':hover': {
        textDecoration: 'underline'
      }
    },
    ' pre': {
      whiteSpace: 'pre-wrap',
      wordWrap: 'break-word',
      background: TARMAC,
      color: WHITE,
      margin: '20px 0',
      fontFamily: 'monospace',
      fontSize: 15,
      padding: 10,
      borderRadius: 0
    },
    ' code': {
      borderRadius: 0,
      background: TARMAC,
      color: WHITE,
      fontSize: 15
    },
    ' .tool, .topic': {
      padding: '1px 3px 2px 3px',
      borderRadius: 2
    }
  },
  ({theme}) => ({
    ' a, a:visited': {
      color: theme === LIGHT ? FOCUS_BLUE : WHITE
    },
    ' .tool, .topic': {
      background: theme === LIGHT ? ASH : ALPHA(BLACK, 0.2)
    }
  })
);

export const ToggleContent = glamorous.button({
  ...BASE_TEXT,
  width: '100%',
  textAlign: 'center',
  textDecoration: 'none',
  fontSize: 14,
  cursor: 'pointer',
  color: WHITE,
  display: 'block',
  marginTop: 5,
  boxSizing: 'border-box',
  background: 'none',
  border: 0,
  outline: 'none',
  ':hover,:active,:visited,:focus': {
    color: WHITE,
    textDecoration: 'none'
  }
});

export class Content extends Component {
  static propTypes = {
    sendAnalyticsEvent: PropTypes.func,
    htmlContent: PropTypes.string,
    trackEngagement: PropTypes.func,
    analyticsPayload: PropTypes.object,
    author: PropTypes.object,
    decisionId: PropTypes.any,
    theme: PropTypes.oneOf([LIGHT, DARK]),
    expanded: PropTypes.bool,
    gradientColor: PropTypes.string,
    ToggleComponent: PropTypes.any
  };

  static defaultProps = {
    expanded: false,
    theme: DARK,
    ToggleComponent: null
  };

  state = {
    expanded: this.props.expanded,
    truncated: true
  };

  content = createRef();

  componentDidMount() {
    if (this.content.current) {
      const {height: contentHeight} = this.content.current.getBoundingClientRect();

      if (contentHeight < TRUNCATE_HEIGHT) {
        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState({truncated: false});
      }
    }
  }

  handleToggleContentClick = event => {
    event.preventDefault();
    this.props.sendAnalyticsEvent(FEED_CLICK_CARD, {
      clickSource: this.state.expanded
        ? FEED_CLICK_CARD_SOURCE_SEE_LESS
        : FEED_CLICK_CARD_SOURCE_SEE_MORE
    });
    if (!this.state.expanded) {
      const {trackEngagement, analyticsPayload} = this.props;
      const {streamId, cardPosition} = analyticsPayload;
      trackEngagement(CLICK, streamId, 70, cardPosition);
    }
    this.setState({expanded: !this.state.expanded});
  };

  render() {
    const {htmlContent, author, decisionId, theme, gradientColor, ToggleComponent} = this.props;
    const {expanded, truncated} = this.state;
    return (
      <React.Fragment>
        <Container gradientColor={gradientColor} expanded={expanded || !truncated}>
          <DecisionContent
            innerRef={this.content}
            theme={theme}
            dangerouslySetInnerHTML={{
              __html: htmlContent
            }}
          />
        </Container>
        {ToggleComponent && truncated ? (
          <ToggleComponent onClick={this.handleToggleContentClick}>
            {expanded ? 'READ LESS' : 'READ MORE'}
          </ToggleComponent>
        ) : (
          <React.Fragment>
            {truncated && theme === DARK && (
              <ToggleContent
                onClick={this.handleToggleContentClick}
                href={`/${author.username}/decisions/${decisionId}`}
              >
                {expanded ? 'See less' : 'See more'}
              </ToggleContent>
            )}
          </React.Fragment>
        )}
      </React.Fragment>
    );
  }
}

export default compose(
  withAnalyticsPayload({type: 'decision'}),
  withSendAnalyticsEvent,
  withTrackEngagement
)(Content);
