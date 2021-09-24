import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {MentionsInput, Mention} from 'react-mentions';
import {BASE_TEXT} from '../../../../shared/style/typography';
import {withApollo, compose} from 'react-apollo';
import {topicSearch} from '../../../../data/feed/queries';
import {FOCUS_BLUE} from '../../../../shared/style/colors';
import {ALPHA} from '../../../../shared/style/color-utils';
import {withSendAnalyticsEvent} from '../../../../shared/enhancers/analytics-enhancer';
import {
  FEED_CHOOSE_COMPOSER_TOOL,
  FEED_CHOOSE_COMPOSER_TOPIC,
  FEED_SEARCH_COMPOSER_TOOL,
  FEED_SEARCH_COMPOSER_TOPIC
} from '../../constants/analytics';
import {tagsPresenter} from './index';
import MarkdownHelp from './markdown-help';
import {toolSearch} from '../../../../data/shared/queries';

const noop = () => null;

const style = {
  display: 'flex',
  flexDirection: 'column',

  control: {
    display: 'flex',
    flexDirection: 'column',
    paddingTop: 1 // fixes phantom border
  },

  input: {
    padding: 16,
    ...BASE_TEXT,
    color: '#2d2d2d',
    minHeight: 80,
    border: 0,
    outline: 'none',
    overflow: 'scroll'
  },

  suggestions: {
    zIndex: 2,
    transform: 'translate(-52px,5px)',
    border: '1px solid #e1e1e1',
    list: {},
    item: {
      ...BASE_TEXT,
      color: '#565656',
      paddingTop: 5,
      paddingBottom: 5,
      paddingLeft: 16,
      paddingRight: 16,
      '&focused': {
        backgroundColor: '#f0f0f0'
      }
    },
    loadingIndicator: {
      width: 200,
      height: 30,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column'
    }
  }
};

const mentionStyle = {
  fontWeight: 'normal',
  color: 'rgba(0,0,0,0)',
  background: ALPHA(FOCUS_BLUE, 0.15)
  // WebkitTextStrokeWidth: 0.4 // makes it bold without increasing span width (this is an "overlay" so it relies on the absolute position of mentions over the base input text)
};

const mentionHiddenStyle = {
  opacity: 0
};

const MentionWithIcon = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  '>img': {
    borderRadius: 3,
    border: '1px solid #d1d1d1',
    width: 22,
    height: 22,
    marginRight: 12
  }
});

const Container = glamorous.div(
  {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  ({showMarkdownHelp}) => ({
    paddingBottom: showMarkdownHelp ? 25 : 0
  })
);

export class MentionsWidget extends Component {
  static propTypes = {
    value: PropTypes.string,
    style: PropTypes.object,
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    placeholder: PropTypes.string,
    innerRef: PropTypes.func,
    client: PropTypes.shape({query: PropTypes.func}), // ApolloClient
    sendAnalyticsEvent: PropTypes.func,
    onAddTool: PropTypes.func,
    showMarkdownHelp: PropTypes.bool,
    editMode: PropTypes.bool
  };

  static defaultProps = {
    value: '',
    style: {},
    onFocus: noop,
    onChange: noop,
    placeholder: '',
    innerRef: noop
  };

  textarea = null;

  state = {
    isLoading: false
  };

  handleChange = event => {
    const input = this.container.getElementsByClassName('mentionsInput__input');
    this.props.onChange(event, input[0].scrollHeight);
  };

  fetchTools = (keyword, callback) => {
    if (keyword && keyword.length > 0) {
      this.setState({isLoading: true});
      this.props.client
        .query({
          query: toolSearch,
          variables: {keyword}
        })
        .then(result => {
          if (result.data && result.data.toolSearch) {
            this.props.sendAnalyticsEvent(FEED_SEARCH_COMPOSER_TOOL, {
              keyword,
              ...tagsPresenter('results', result.data.toolSearch)
            });
            callback(result.data.toolSearch);
          }
          this.setState({isLoading: false});
        });
    }
  };

  fetchTopics = (keyword, callback) => {
    if (keyword && keyword.length > 0) {
      this.setState({isLoading: true});
      this.props.client
        .query({
          query: topicSearch,
          variables: {keyword}
        })
        .then(result => {
          if (result.data && result.data.topicSearch) {
            this.props.sendAnalyticsEvent(FEED_SEARCH_COMPOSER_TOPIC, {
              keyword,
              ...tagsPresenter('results', result.data.topicSearch)
            });
            // The client resolver needs to provide a unique name for each keyword search or
            // the Apollo cache will produce the first record that used the id of `null`, but we
            // want to send null to the server if it's user-entered topic. Topics coming from
            // Algolia with have a numeric id, so we need to clean it up here...
            callback(
              result.data.topicSearch.map(t => ({...t, id: isNaN(parseInt(t.id)) ? 'null' : t.id}))
            );
          }
          this.setState({isLoading: false});
        });
    }
  };

  handleAddTool = (id, name) => {
    const {sendAnalyticsEvent, onAddTool} = this.props;
    sendAnalyticsEvent(FEED_CHOOSE_COMPOSER_TOOL, {'tool.id': id, 'tool.name': name});
    onAddTool && onAddTool();
  };

  handleAddTopic = (id, name) => {
    this.props.sendAnalyticsEvent(FEED_CHOOSE_COMPOSER_TOPIC, {'topic.id': id, 'topic.name': name});
  };

  container = null;
  assignContainer = el => (this.container = el);

  componentDidMount() {
    const input = this.container.getElementsByClassName('mentionsInput__input');
    if (input.length) {
      this.textarea = input[0];
      this.props.innerRef(this.textarea);
      this.textarea.addEventListener('focus', this.props.onFocus, false);

      // this no-op is fired initially to inform parent of scrollHeight
      this.handleChange({target: {value: this.props.value}});
    }
  }

  componentWillUnmount() {
    if (this.textarea) {
      this.textarea.removeEventListener('focus', this.props.onFocus, false);
    }
  }

  render() {
    return (
      <Container innerRef={this.assignContainer} showMarkdownHelp={this.props.showMarkdownHelp}>
        <style
          dangerouslySetInnerHTML={{
            __html: `
              .mentionsInput__suggestions__loadingIndicator__spinner {
                display: none;
              }
              .mentionsInput__suggestions__loadingIndicator::before {
                content: "Searching…";
                font-family: Open Sans, Helvetica Neue, Helvetica, Arial, sans;
                display: block;
                width: 200;
                text-align: center;
                color: #4a4a4a;
                font-size: 12px;
              }
              `
          }}
        />
        <MentionsInput
          className="mentionsInput"
          value={this.props.value}
          onChange={this.handleChange}
          placeholder={this.props.placeholder}
          style={{...style, input: {...style.input, ...this.props.style}}}
          allowSpaceInQuery={false}
          markup="@{__display__}|__type__:__id__|"
        >
          <Mention
            type="tool"
            trigger="@"
            data={this.fetchTools}
            style={mentionStyle}
            isLoading={this.state.isLoading}
            appendSpaceOnAdd={true}
            renderSuggestion={entry => {
              return (
                <MentionWithIcon title={entry.title}>
                  <img src={entry.imageUrl} alt={entry.display} /> {entry.display}
                </MentionWithIcon>
              );
            }}
            onAdd={this.handleAddTool}
          />
          <Mention
            type="topic"
            trigger="#"
            data={this.fetchTopics}
            style={mentionHiddenStyle}
            isLoading={this.state.isLoading}
            appendSpaceOnAdd={true}
            onAdd={this.handleAddTopic}
          />
        </MentionsInput>
        {this.props.showMarkdownHelp && !this.props.editMode && <MarkdownHelp />}
      </Container>
    );
  }
}

export default compose(
  withApollo,
  withSendAnalyticsEvent
)(MentionsWidget);
