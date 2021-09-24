import React, {Component} from 'react';
import glamorous from 'glamorous';
import {FOCUS_BLUE, ASH, BLACK} from '../../../../shared/style/colors';
import {WEIGHT} from '../../../../shared/style/typography';
import {PAGE_WIDTH} from '../../../../shared/style/dimensions';
import {PHONE} from '../../../../shared/style/breakpoints';

const Wrapper = glamorous.div({
  maxWidth: PAGE_WIDTH,
  margin: '20px auto 0 auto',
  [PHONE]: {
    padding: '0 25px'
  }
});

const Container = glamorous.div({
  fontSize: 14,
  display: 'flex',
  ' ul, ol': {
    margin: 0,
    fontSize: 14,
    padding: '0 0 0 15px'
  },
  ' a, a:visited': {
    color: FOCUS_BLUE
  }
});

const Heading = glamorous.h4({
  color: BLACK,
  fontSize: 16,
  fontWeight: WEIGHT.BOLD
});

const MarkdownStyle = glamorous.div({
  width: '50%'
});

const Item = glamorous.div({
  padding: '5px 0'
});

const Code = glamorous.div({
  backgroundColor: ASH,
  display: 'table'
});

class MarkdownModal extends Component {
  render() {
    return (
      <Wrapper>
        <h1>Supported Markdown</h1>
        <Container>
          <MarkdownStyle>
            <Heading>Markdown</Heading>
            <Item>__Bold__ or **Bold**</Item>
            <Item>_Italic_ or *Italic*</Item>
            <Item>&#96;inline code&#96;</Item>
            <Item>&#96;&#96;&#96;code block&#96;&#96;&#96;</Item>
            <Item>https://</Item>
            <Item>[Link](https://)</Item>
            <Item>* Bullet List</Item>
            <Item>1. Ordered List</Item>
          </MarkdownStyle>
          <MarkdownStyle>
            <Heading>Result</Heading>
            <Item>
              <strong>Bold</strong>
            </Item>
            <Item>
              <em>Italic</em>
            </Item>
            <Item>
              <Code>inline code</Code>
            </Item>
            <Item>
              <Code>code block</Code>
            </Item>
            <Item>
              <a href="https://">https://</a>
            </Item>
            <Item>
              <a href="https://">Link</a>
            </Item>
            <Item>
              <ul>
                <li>Bullet List</li>
              </ul>
            </Item>
            <Item>
              <ol>
                <li>Ordered List</li>
              </ol>
            </Item>
          </MarkdownStyle>
        </Container>
      </Wrapper>
    );
  }
}

export default MarkdownModal;
