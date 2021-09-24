import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {CHARCOAL, ASH, WHITE, TARMAC} from '../../../style/colors';
import {BASE_TEXT} from '../../../style/typography';
import CloseIcon from '../../icons/close.svg';
import {TABLET, PHONE} from '../../../style/breakpoints';

export const ButtonPanel = glamorous.div({
  display: 'flex',
  borderTop: `1px solid ${ASH}`,
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignContent: 'center',
  paddingTop: 16,
  paddingLeft: 4,
  paddingRight: 4,
  marginTop: 16
});

const Container = glamorous.div(
  {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    borderRadius: 4,
    boxShadow: '0 0 54px 0 rgba(122, 122, 122, 0.31)',
    minWidth: 200
  },
  ({width, layout}) => ({
    width,
    backgroundColor: layout === 'auto' ? WHITE : 'none',
    [TABLET]: {
      width: '80vw'
    },
    [PHONE]: {
      width: '95vw'
    }
  })
);

const TitleBar = glamorous.div({
  background: CHARCOAL,
  paddingLeft: 20,
  paddingTop: 6,
  paddingBottom: 6,
  paddingRight: 12,
  borderTopLeftRadius: 4,
  borderTopRightRadius: 4,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  cursor: 'default'
});

const PinCorner = glamorous.div({
  position: 'absolute',
  top: 0,
  right: 0,
  '>div>svg>g': {
    fill: TARMAC,
    stroke: TARMAC
  }
});

const Title = glamorous.div(
  {
    ...BASE_TEXT,
    color: WHITE,
    letterSpacing: 0.4,
    fontSize: 15,
    flexGrow: 1
  },
  ({titleLeftJustified}) =>
    titleLeftJustified
      ? {
          textAlign: 'left'
        }
      : {}
);

const Content = glamorous.div(
  {
    ...BASE_TEXT
  },
  ({layout}) => ({padding: layout === 'auto' ? '32px 24px' : 0})
);

export const CloseButton = glamorous.div({
  cursor: 'pointer',
  padding: 8
});

export default class BaseModal extends Component {
  static propTypes = {
    title: PropTypes.string,
    onDismiss: PropTypes.func,
    children: PropTypes.any,
    width: PropTypes.any,
    layout: PropTypes.oneOf(['auto', 'none']),
    hideTitleBar: PropTypes.bool,
    hideCloseIcon: PropTypes.bool,
    titleLeftJustified: PropTypes.bool
  };

  static defaultProps = {
    width: 'auto',
    layout: 'auto',
    hideTitleBar: false,
    hideCloseIcon: false,
    titleLeftJustified: false
  };

  render() {
    const {
      title,
      children,
      width,
      onDismiss,
      layout,
      hideTitleBar,
      hideCloseIcon,
      titleLeftJustified
    } = this.props;
    return (
      <Container width={width} layout={layout}>
        {!hideTitleBar && (
          <TitleBar>
            <Title titleLeftJustified={titleLeftJustified}>{title}</Title>
            {typeof onDismiss === 'function' && (
              <CloseButton data-testid="closeModal" onClick={onDismiss}>
                <CloseIcon />
              </CloseButton>
            )}
          </TitleBar>
        )}
        {hideTitleBar && !hideCloseIcon && typeof onDismiss === 'function' && (
          <PinCorner>
            <CloseButton data-testid="closeModal" onClick={onDismiss}>
              <CloseIcon />
            </CloseButton>
          </PinCorner>
        )}
        <Content layout={layout}>{children}</Content>
      </Container>
    );
  }
}
