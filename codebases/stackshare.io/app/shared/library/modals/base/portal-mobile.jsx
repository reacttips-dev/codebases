import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {WHITE} from '../../../style/colors';
import {MOBILE_HEADER_ZINDEX} from '../../menus/mobile-header';

const Layout = glamorous.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  width: '100vw',
  zIndex: MOBILE_HEADER_ZINDEX - 2,
  background: WHITE
});

const Modal = glamorous.div({
  width: '100vw',
  paddingBottom: 70
});

export default class MobilePortal extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
  };

  componentDidMount() {
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
      window.scrollTo(0, 0);
    }
  }

  render() {
    const {children} = this.props;

    return (
      <Layout data-portal>
        <Modal>{children}</Modal>
      </Layout>
    );
  }
}
