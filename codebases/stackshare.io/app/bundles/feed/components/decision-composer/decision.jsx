import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import ServiceTile, {MICRO} from '../../../../shared/library/tiles/service';
import {BASE_TEXT, WEIGHT} from '../../../../shared/style/typography';
import {CHARCOAL, FOCUS_BLUE, ALABASTER} from '../../../../shared/style/colors';
import {ALPHA} from '../../../../shared/style/color-utils';

const Container = glamorous.div({
  display: 'flex',
  flexDirection: 'column'
});

const Label = glamorous.div({
  ...BASE_TEXT,
  color: CHARCOAL,
  fontSize: 16,
  letterSpacing: 0.2,
  fontWeight: WEIGHT.BOLD
});

const Set = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  '>:first-child': {
    marginRight: 5
  },
  marginRight: 15,
  marginBottom: 10
});

const Tags = glamorous.div({
  display: 'flex',
  flexWrap: 'wrap'
});

const Content = glamorous.div({
  ...BASE_TEXT,
  lineHeight: 1.7,
  letterSpacing: 0.2,
  ' .topic, .tool': {
    fontWeight: 'normal',
    background: ALPHA(FOCUS_BLUE, 0.15),
    padding: '0px 2px'
  },
  ' a, a:visited': {
    color: FOCUS_BLUE,
    textDecoration: 'underline',
    cursor: 'pointer',
    ':hover': {
      textDecoration: 'underline'
    }
  },
  ' pre': {
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
    background: ALABASTER,
    color: CHARCOAL,
    margin: '15px 0',
    fontFamily: 'monospace',
    padding: 10,
    borderRadius: 0
  },
  ' code': {
    borderRadius: 0,
    background: ALABASTER,
    color: CHARCOAL
  }
});

export default class Decision extends Component {
  static propTypes = {
    htmlContent: PropTypes.string.isRequired,
    services: PropTypes.array,
    topics: PropTypes.array
  };

  renderServices() {
    return this.props.services.map(s => (
      <Set key={s.id}>
        <ServiceTile size={MICRO} imageUrl={s.imageUrl} />
        <Label>{s.name}</Label>
      </Set>
    ));
  }

  renderTopics() {
    return this.props.topics.map(s => (
      <Set key={s.id}>
        <Label>#{s.name}</Label>
      </Set>
    ));
  }

  render() {
    return (
      <Container>
        <Tags>
          {this.renderServices()}
          {this.renderTopics()}
        </Tags>
        <Content
          dangerouslySetInnerHTML={{
            __html: this.props.htmlContent
          }}
        />
      </Container>
    );
  }
}
