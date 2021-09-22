import React from 'react';
import { DefaultThemeProvider } from '@skillshare/ui-components/themes';
import { EnvironmentProvider, CookieProvider, EventsProvider } from '@skillshare/ui-components/components/providers';
import { ModalController, GoogleOneTap, LoginForm, EmailSignUpForm } from '@skillshare/ui-components/components/authentication';
import { LoginForm as MUILoginForm, EmailSignUpForm as MUIEmailSignUpForm} from '@skillshare/ui-components/Authentication';
import ReactDOM from 'react-dom';
import { shouldMUIAuth } from '../views/modules/flags';

const AuthHelper = {
    getVariables: function () {
        return {
            siteKey: SS?.serverBootstrap?.gRecaptcha?.siteKey,
            facebookId: $('#fb-id').val(),
            googleClientId: SS?.serverBootstrap?.googleClientId,
            csrfToken: $.cookie('YII_CSRF_TOKEN'),
            appHost: document.location.origin,
            appleClientId: SS?.serverBootstrap?.appleClientId,
        };
    },

    initialize: function(rootElement, component) {
        const { siteKey, facebookId, googleClientId, csrfToken, appHost, appleClientId } = this.getVariables();
        const trackEventHandler = SS.EventTracker.trackingCallback();
        ReactDOM.unmountComponentAtNode(rootElement);
        ReactDOM.render(
            <DefaultThemeProvider>
                <CookieProvider cookies={{ 'YII_CSRF_TOKEN': csrfToken }}>
                    <EnvironmentProvider variables={{recaptcha: { siteKey }, facebookId, googleClientId, appleClientId, appHost }}>
                        <EventsProvider trackEventHandler={trackEventHandler}>
                            { component }
                        </EventsProvider>
                    </EnvironmentProvider>
                </CookieProvider>
            </DefaultThemeProvider>,
            rootElement
        );
    },

    initializeTwoPanelSignUpView: function({ scope, redirectTo, authType, openOnLoad, data, showEmailSignUp }) {
        const rootElement = scope.$('.click-off-overlay').get(0);
        if (!rootElement) {
            return;
        }
        this.initialize(
            rootElement,
            <ModalController authType={authType} requiresTrigger={false} openOnLoad={openOnLoad} loginData={data.loginData} signUpData={data.signUpData} redirectTo={redirectTo} showEmailSignUp={showEmailSignUp ? showEmailSignUp : false} />
        );
    },

    initializeAuthForm: function({ rootElement, redirectTo, showSocialLogins, isLogin, team }) {
        // gr_mui_auth
        if (shouldMUIAuth()) {
            this.initialize(rootElement,
                isLogin
                ? <MUILoginForm redirectTo={redirectTo} showSocialLogins={showSocialLogins} isModal={false} team={team} />
                : <MUIEmailSignUpForm redirectTo={redirectTo} showSocialLogins={showSocialLogins} isModal={false} team={team} />
            );
        } else {
            this.initialize(rootElement,
                isLogin
                ? <LoginForm redirectTo={redirectTo} showSocialLogins={showSocialLogins} isModal={false} team={team} />
                : <EmailSignUpForm redirectTo={redirectTo} showSocialLogins={showSocialLogins} isModal={false} team={team} />
            );
        }
    },

    getRedirectTo: function() {
        return SS.serverBootstrap?.pageData?.redirectTo
            ?? SS.serverBootstrap?.loginPopupRedirectTo
            ?? SS.serverBootstrap?.signupPopupRedirectTo
            ?? null;
    },

    getOneTapTop: function() {
        const isSiteBannerVisible = $('#site-banner').length > 0;
        const isLoH = location.pathname === "/";
        if (isSiteBannerVisible) {
            return 90;
        } else if (isLoH) {
            return 66;
        }
        return 58;
    },

    initializeGoogleOneTouch: function () {
        if (!SS.currentUser.isGuest() || !($('#google-ot-container').length)) {
            return;
        }

        const { googleClientId, appHost, csrfToken } = this.getVariables();
        const redirectTo = this.getRedirectTo();
        const top = this.getOneTapTop();
        const addEmbeddedSignUpClass = () => {
            const element = $('.embedded-signup');

            if (element.length) {
                element.addClass('embedded-signup--one-tap');
            }
        };

        ReactDOM.render(
            <DefaultThemeProvider>
                <CookieProvider cookies={{ 'YII_CSRF_TOKEN': csrfToken }}>
                    <EnvironmentProvider variables={{ googleClientId, appHost }}>
                        <GoogleOneTap autoSelect={false} left="auto" right="16px" top={`${top}px`} redirectTo={redirectTo} onRenderOneTap={addEmbeddedSignUpClass} />
                    </EnvironmentProvider>
                </CookieProvider>
            </DefaultThemeProvider>,
            $('#google-ot-container').get(0)
        );
    },
};

export default AuthHelper;
