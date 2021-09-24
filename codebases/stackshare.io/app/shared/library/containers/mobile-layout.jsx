import React, {useRef, useEffect} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {WHITE} from '../../style/colors';
import Header from '../../../bundles/feed/components/nav/header';
import Footer from '../../../bundles/site/components/footer';
import animate, {translateXvw} from '../animation/animate';
import Circular, {LARGE} from '../indicators/indeterminate/circular';

const Page = glamorous.main({
  display: 'flex',
  justifyContent: 'center',
  overflowX: 'hidden',
  flexDirection: 'column',
  background: WHITE,
  position: 'relative',
  width: '100vw'
});

const Navigator = glamorous.div({
  display: 'flex',
  flexDirection: 'row'
});

const View = glamorous.div({
  width: '100vw'
});

const Spinner = glamorous.div({
  display: 'flex',
  justifyContent: 'center',
  marginTop: 100
});

const handleModalExit = (navigator, mainView, scrollTop) => onAnimDone => (...args) => {
  mainView.current.style.height = 'auto';
  mainView.current.style.overflow = 'visible';
  animate([{element: navigator.current, from: -100, to: 0}], 300, translateXvw, () => {
    onAnimDone(...args);
    if (window && scrollTop.current > 0 && typeof window.scrollTo === 'function') {
      window.scrollTo(0, scrollTop.current);
    }
  });
};

const handleModalEntry = (navigator, mainView) => {
  animate([{element: navigator.current, from: 0, to: -100}], 300, translateXvw, () => {
    mainView.current.style.height = '0px';
    mainView.current.style.overflow = 'hidden';
  });
};

const usePrevious = value => {
  const prev = useRef(false);
  useEffect(() => {
    prev.current = Boolean(value);
  });
  return prev.current;
};

const renderViewNavigator = (children, navigator) => {
  const mainView = useRef(null);
  const scrollTop = useRef(0);
  const [main, modal] = children(handleModalExit(navigator, mainView, scrollTop));

  const prevModal = usePrevious(modal);

  if (modal && !prevModal) {
    if (window) {
      scrollTop.current = window.pageYOffset;
    }
    setTimeout(() => handleModalEntry(navigator, mainView), 0);
  }

  if (!main) {
    return (
      <Spinner>
        <Circular size={LARGE} />
      </Spinner>
    );
  }

  return (
    <Navigator
      innerRef={navigator}
      style={{
        width: modal ? '200vw' : '100vw'
      }}
    >
      <View innerRef={mainView}>{main}</View>
      {modal && <View>{modal}</View>}
    </Navigator>
  );
};

const MobileLayout = ({children, currentUser, loading = false, privateMode = false}) => {
  const navigator = useRef(null);

  return (
    <Page>
      <Header
        currentUser={currentUser}
        path={currentUser ? currentUser.path : null}
        userId={!loading && currentUser && currentUser.id}
        privateMode={privateMode}
        contentRef={navigator}
      />
      {renderViewNavigator(children, navigator)}
      {!loading && <Footer />}
    </Page>
  );
};

MobileLayout.propTypes = {
  children: PropTypes.func,
  currentUser: PropTypes.object,
  loading: PropTypes.bool,
  privateMode: PropTypes.any
};

export default MobileLayout;
