import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {ASH, CATHEDRAL, CHARCOAL, WHITE} from '../../../style/colors';
import {BASE_TEXT} from '../../../style/typography';
import BackIcon from './back.svg';

const Container = glamorous.div({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '90vh'
});

const TitleBar = glamorous.div({
  background: WHITE,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 55,
  borderBottom: `1px solid ${ASH}`,
  position: 'relative'
});

const Title = glamorous.span({
  ...BASE_TEXT,
  color: CHARCOAL,
  fontSize: 18
});

export const BackButton = glamorous.button({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  ...BASE_TEXT,
  color: CATHEDRAL,
  fontSize: 14,
  position: 'absolute',
  left: 0,
  top: 0,
  height: 55,
  paddingLeft: 18,
  paddingRight: 5,
  WebkitAppearance: 'none',
  border: 0,
  outline: 'none',
  background: WHITE
});

export default class ModalMobile extends Component {
  static propTypes = {
    title: PropTypes.string,
    onDismiss: PropTypes.func,
    onDismissLabel: PropTypes.string,
    children: PropTypes.any
  };

  render() {
    const {title, children, onDismiss, onDismissLabel} = this.props;

    return (
      <Container>
        <TitleBar>
          <Title>{title}</Title>
          {onDismiss && (
            <BackButton onClick={onDismiss}>
              {onDismissLabel ? (
                onDismissLabel
              ) : (
                <>
                  <BackIcon style={{marginRight: 5}} /> Back
                </>
              )}
            </BackButton>
          )}
        </TitleBar>
        {children}
      </Container>
    );
  }
}
