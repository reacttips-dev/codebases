import { AuthType } from '@skillshare/ui-components/components/authentication';
import AuthHelper from 'core/src/helpers/auth-helper';

const LOGIN = 'login';

const checkMobileWebFullPageRedirect = options => {
  if (SS?.serverBootstrap?.isMobileWeb && !options.disableMobileRedirect) {
    const {login, signup} = options.redirectTo;
    const isLoginState = options.state === 'login';

    const location = isLoginState ? '/login' : '/signup';
    const redirectTo = isLoginState ? login : signup;

    window.location = redirectTo ? `${location}?redirectTo=${redirectTo}` : location;
    return true;
  }
  return false;
};

const TwoPanelSignUpView = Backbone.View.extend({

  el: 'body',

  initialize: function(options) {
    const isLogin = options.state === LOGIN;
    const authType = isLogin ? AuthType.Login : AuthType.SignUp;
    this.showCouponCopy = options.showCouponCopy;
    const signupRedirectTo = this.showCouponCopy ? options.redirectTo || SS.serverBootstrap.signupPopupRedirectTo : SS.serverBootstrap.signupPopupRedirectTo || options.redirectTo;
    const loginRedirectTo = SS.serverBootstrap.loginPopupRedirectTo || options.redirectTo;
    const redirectTo = { login: loginRedirectTo, signup: signupRedirectTo };
    const data = this.getData();

    if (checkMobileWebFullPageRedirect({...options, redirectTo})) {
      return false;
    }

    AuthHelper.initializeTwoPanelSignUpView({ scope: this, redirectTo: redirectTo, authType: authType, openOnLoad: true, data: data, showEmailSignUp: options.showEmailSignUp });
    return;
  },

  loginData: function() {
    return {
      headerText: 'Welcome Back to Skillshare',
      subHeaderText: 'Sign in to continue to your account.',
    };
  },

  signUpData: function(){
    const headerText = this.showCouponCopy ?  SS.serverBootstrap.signupPopupCouponHeaderText : SS.serverBootstrap.signupPopupHeaderText;
    const subHeaderText = this.showCouponCopy ? SS.serverBootstrap.signupPopupCouponSubheaderText : SS.serverBootstrap.signupPopupSubheaderText;
    const userProfile = SS.serverBootstrap.signupPopupUserProfile ? {
      picture: SS.serverBootstrap.signupPopupUserProfilePic,
      name: SS.serverBootstrap.signupPopupUserProfileName,
    } : undefined;

    return { headerText, subHeaderText, userProfile };
  },

  getData: function() {

    const loginData = this.loginData();

    const signUpData = this.signUpData();

    return { loginData, signUpData };
  },
 });

export default TwoPanelSignUpView;
