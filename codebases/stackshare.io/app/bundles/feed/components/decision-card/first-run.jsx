import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import Popover, {
  ARROW_BOTTOM,
  LAYOUT_STYLE_FIT
} from '../../../../shared/library/popovers/base/popover';
import SectionTitle from '../../../../shared/library/typography/section-title';
import {GUNSMOKE} from '../../../../shared/style/colors';
import SimpleButton from '../../../../shared/library/buttons/base/simple';
import Overlay from '../../../../shared/library/overlays';

import {ARROW_CENTER_OFFSET} from '../../../../shared/library/popovers/base/arrow';

const PopoverPosition = glamorous.div({
  position: 'absolute',
  left: 0,
  bottom: 15
});

const Content = glamorous.aside({
  padding: 20
});

const ButtonPanel = glamorous.div({
  marginTop: 20,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end'
});

const Message = glamorous.div({
  color: GUNSMOKE,
  fontSize: 14,
  lineHeight: '25px',
  letterSpacing: 0.3,
  marginBottom: 5
});

export default class FirstRun extends Component {
  static propTypes = {
    onDismiss: PropTypes.func
  };

  render() {
    return (
      <Overlay onDismiss={this.props.onDismiss}>
        {({width}, handleDismiss) => (
          <PopoverPosition style={{width: width}}>
            <Popover
              arrowSide={ARROW_BOTTOM}
              layoutStyle={LAYOUT_STYLE_FIT}
              arrowOffset={width / 2 + ARROW_CENTER_OFFSET}
              inline={true}
            >
              <Content>
                <SectionTitle style={{lineHeight: 1.4}}>
                  ✨ Introducing Stack Decisions - an easy way to share and discuss your technical
                  decisions
                </SectionTitle>
                <Message>
                  Sharing decisions helps developers like you benefit from one another&apos;s
                  experience and build your reputation, with far less effort than writing a full
                  blog post. Tag a tool, and any developer following that tool will see it in their
                  feed! Check out some already posted decisions like the one below.
                </Message>
                <ButtonPanel>
                  <SimpleButton onClick={handleDismiss}>Ok, got it</SimpleButton>
                </ButtonPanel>
              </Content>
            </Popover>
          </PopoverPosition>
        )}
      </Overlay>
    );
  }
}
