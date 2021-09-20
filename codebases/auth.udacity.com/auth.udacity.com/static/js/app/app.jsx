import 'assets/styles/index.scss';

import {
  BrowserRouter,
  Redirect,
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import Helmet from 'react-helmet';
import { Flex, Loading } from '@udacity/veritas-components';
import React, { Component, Suspense, lazy } from 'react';
import Header from './components/header';

import SignIn from './views/sign-in';
import SignUp from './views/sign-up';
import styles from './app.module.scss';

// Code splitting for all the views that aren't part of the default sign-up and
// sign-in use case.
const BirthdateCheck = lazy(() => import('./views/birthdate-check'));
const BirthdateFillup = lazy(() => import('./views/birthdate-fillup'));
const Enable2FA = lazy(() => import('./views/enable-2fa'));
const ResetPassword = lazy(() => import('./views/reset-password'));
const ResetPasswordEmail = lazy(() => import('./views/reset-password-email'));
const TermsOfUse = lazy(() => import('./views/terms-of-use'));
const TwoFactor = lazy(() => import('./views/two-factor'));
const VerifyEmail = lazy(() => import('./views/verify-email'));
const WeakPassword = lazy(() => import('./views/weak-password'));
const UnsupportedBrowser = lazy(() =>
  import('./components/unsupported-browser')
);

const SignUpReqsRedirect = ({ location }) => (
  <Redirect
    from="/sign-up/requirements"
    to={{
      pathname: '/sign-up/requirements/birthdate',
      search: location.search,
    }}
  />
);

const SignInReqsRedirect = ({ location }) => (
  <Redirect
    from="/sign-in/requirements"
    to={{
      pathname: '/sign-in/requirements/birthdate',
      search: location.search,
    }}
  />
);

const RedirectWithParams = withRouter((props) => {
  return <Redirect from="*" to={`/sign-up${props.location.search}`} />;
});

export default class App extends Component {
  state = {
    noFetch: false,
  };

  componentDidMount() {
    if (!window.fetch) {
      this.setState({ noFetch: true });
    }
    if (performance && performance.mark) {
      performance.mark('appComponentDidMount');
    }
  }

  render() {
    // If the document direction is Right-to-Left (RTL), flip our tab title
    // template's direction
    let titleTemplate =
      document.body.dir === 'rtl' ? 'Udacity - %s' : '%s - Udacity';

    if (this.state.noFetch) {
      return (
        <div>
          <Helmet titleTemplate={titleTemplate} />
          <Header />
          <div className={styles.content}>
            <Suspense
              fallback={
                <Flex center>
                  <Loading size="lg" />
                </Flex>
              }
            >
              <UnsupportedBrowser />
            </Suspense>
          </div>
        </div>
      );
    }

    return (
      <div>
        <Helmet titleTemplate={titleTemplate} />

        <div role="banner">
          <Header />
        </div>

        <div className={styles.content} role="main">
          <BrowserRouter>
            <Suspense
              fallback={
                <Flex center>
                  <Loading size="lg" />
                </Flex>
              }
            >
              <Switch>
                <Route
                  exact
                  path="/sign-in"
                  component={() => <SignIn isSso={false} />}
                />

                <Route
                  exact
                  path="/sign-in/sso"
                  component={() => <SignIn isSso={true} />}
                />

                <Route exact path="/sign-up" component={SignUp} />

                {/*Where they request a reset password email*/}
                <Route
                  exact
                  path="/reset-password-email"
                  component={ResetPasswordEmail}
                />

                {/*Where the email link takes them (with their reset token)*/}
                <Route exact path="/reset-password" component={ResetPassword} />

                <Route exact path="/verify-email" component={VerifyEmail} />

                {/* TODO: remove redirects once user-api data.location for age gate is updated */}
                <Route
                  exact
                  path="/sign-up/requirements"
                  component={SignUpReqsRedirect}
                />

                <Route
                  exact
                  path="/sign-in/requirements"
                  component={SignInReqsRedirect}
                />

                <Route
                  exact
                  path="/sign-up/requirements/birthdate"
                  component={BirthdateCheck}
                />

                <Route
                  exact
                  path="/sign-in/requirements/birthdate"
                  component={BirthdateFillup}
                />

                <Route
                  exact
                  path="/sign-in/requirements/terms-of-use"
                  component={TermsOfUse}
                />

                <Route
                  exact
                  path="/sign-in/requirements/password"
                  component={WeakPassword}
                />

                <Route exact path="/2fa" component={TwoFactor} />

                <Route exact path="/enable-2fa" component={Enable2FA} />

                <RedirectWithParams />
              </Switch>
            </Suspense>
          </BrowserRouter>
        </div>
      </div>
    );
  }
}
