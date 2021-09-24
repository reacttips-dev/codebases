import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import {SigninDesktopModal} from '../../../../shared/library/modals/signin';
import {withLocalStorage} from '../../../../shared/enhancers/local-storage-enhancer';
import debug from 'debug';
import {testAuthPage, testGatewayPage} from '../../../../shared/constants/paths';
import {testCrawler} from '../../../../shared/constants/useragent';
import {useCookies} from 'react-cookie';

const ONE_DAY = 60 * 60 * 24 * 1000;

const blur = () => {
  document.getElementById('wrap').style.filter = 'blur(4px)';
  document.getElementById('wrap').style['-webkit-filter'] = 'blur(4px)';
};

const log = debug('signin');

const captureLastPage = (setCookie, pathname) => {
  if (!window.is404 && !testAuthPage(pathname)) {
    setCookie('lastPage', pathname, {
      path: '/',
      expires: new Date(Date.now() + ONE_DAY)
    });
  }
};

const GlobalWrapper = ({onDismiss, storageProvider, currentUser, ...restProps}) => {
  const [visible, setVisible] = useState(false);
  const [dismissable, setDismissable] = useState(true);
  const [cookies, setCookie] = useCookies(['pageViews']);
  const [redirectPath, setRedirectPath] = useState('/feed');
  const values = ['Stacks', 'Featured Posts', 'Users', 'Timelines'];

  useEffect(() => {
    // Install global accessors for legacy code to show the modal
    window.SigninModal = {
      show: () => {
        log('Showing signin modal from global SignInModal.show()...');
        setDismissable(true);
        setVisible(true);
      }
    };

    window.signupModal = () => {
      log('Showing signin modal from global signupModal()...');
      setDismissable(true);
      setVisible(true);
    };

    if (storageProvider.getObject('testMode')) {
      return;
    }

    if (currentUser) {
      log('User signed in...');
      return;
    }

    if (typeof navigator !== 'undefined' && testCrawler(navigator.userAgent)) {
      log('Crawler...');
      return;
    }

    const pathname = window.location.pathname;

    setRedirectPath(pathname);

    captureLastPage(setCookie, pathname);

    // eslint-disable-next-line no-constant-condition
    // eslint-disable-next-line no-undef
    if (window.is404 || testGatewayPage(pathname) || values.includes(contentGroupPage)) {
      log('Signin modal is disabled for gateway pages');
      return;
    }

    // maintain a list of pathnames
    let pageViews = cookies.pageViews;
    if (!pageViews) {
      pageViews = [pathname];
    }

    // identical sequential pathnames are ignored
    if (pageViews[pageViews.length - 1] !== pathname) {
      // if the users goes back. (i.e. has the same url) no popup should show up
      if (pageViews[pageViews.length - 2] === pathname) pageViews.pop();
      else pageViews.push(pathname);
    }

    setCookie('pageViews', pageViews, {path: '/', expires: new Date(Date.now() + ONE_DAY)});

    if (pageViews.length >= 2) {
      log(`Page views = ${pageViews}. Showing blocking signin modal...`);
      setTimeout(() => {
        setDismissable(false);
        blur();
        setVisible(true);
      }, 1);
    }
  }, []);

  if (visible) {
    const handleDismiss = dismissable
      ? () => {
          storageProvider.setItem('dismissedModal', true);
          setVisible(false);
          onDismiss && onDismiss();
        }
      : null;
    return (
      <SigninDesktopModal
        onDismiss={handleDismiss}
        {...restProps}
        preventClickAway={!dismissable}
        redirect={redirectPath}
      />
    );
  }

  return null;
};

GlobalWrapper.propTypes = {
  onDismiss: PropTypes.func,
  storageProvider: PropTypes.object.isRequired,
  currentUser: PropTypes.any
};

export default withLocalStorage('Signin', '2')(GlobalWrapper);
