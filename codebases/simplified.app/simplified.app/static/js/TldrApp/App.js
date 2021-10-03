import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Login from "../TldrLogin/Login";
import Register from "../TldrRegistration/Register";
import ForgotPassword from "../TldrRegistration/ForgotPassword";
import Home from "../TldrApp/Home";
import Settings from "../TldrSettings/Settings";
import store from "../store.js";
import { Provider } from "react-redux"; // connects our application to the store which provides the state
import {
  ROOT,
  LOGIN,
  REGISTER_PATH,
  FORGOT_PASSWORD_PATH,
  USER_HOME,
  STORY_DETAIL_PATH,
  REGISTRATION_EMAIL_SENT,
  CONFIRM_EMAIL,
  STORY,
  PROJECTS,
  LAYOUTS,
  PASSWORD_RESET_EMAIL_SENT,
  MY_ACCOUNT,
  SETTINGS,
  MY_WORKSPACE,
  PREVIEW_PATH,
  CREATE_WORKSPACE,
  ADD_NEW_MEMBERS,
  BRANDKIT,
  OAUTH_SHOPIFY_CALLBACK,
  STORY_PAGE_PATH,
  SHOPIFY_LOGIN,
  MY_ASSETS,
  MY_TEMPLATES,
  MY_COMPONENTS,
  CONFIRM_PASSWORD_RESET,
  PASSWORD_RESET_SUCCESS,
  PASSWORD_RESET_FAILURE,
  REGISTRATION_VERIFICATION_SUCCESS,
  REGISTRATION_VERIFICATION_FAILURE,
  QUICK_START,
  MY_FOLDERS,
  TEMPLATES_SCREEN,
  CREATE_PASSWORD_VIA_INVITATION,
  PASSWORD_SET_SUCCESS_VIA_INVITATION,
  PASSWORD_SET_FAILURE_VIA_INVITATION,
  MAGICAL,
  MY_COPIES,
  AI_TEMPLATE_PATH,
  AI_NEW_DOCUMENT,
  RENDER_PREVIEW,
  TEMPLATES_BY_FORMAT_SCREEN_PATH,
  TEMPLATES_BY_CATEGORY_SCREEN_PATH,
  ACCESS_DENIED,
  INTERNAL_SERVER_ERROR,
  DOCUMENTS,
  STORY_DETAIL_NAME_PATH,
  BILLING_AND_PAYMENT,
  LIFETIME,
} from "../_utils/routes";

import { logoutUser, setCurrentUser } from "../_actions/authActions";
import PrivateRoute from "../_components/common/PrivateRoute";
import StoryDetailsPage from "../TldrStoryDetail/StoryDetailsPage";
import RegistrationEmailSentNotification from "../TldrRegistration/RegistrationEmail";
import ConfirmYourEmailAddress from "../TldrRegistration/ConfirmYourEmailAddress";
import ResetPassword from "../TldrRegistration/ResetPassword";
import internalServer from "../_components/common/InternalServer";
import { setAuthToken } from "../_utils/common";
import Tldr404 from "./Tldr404";
import Tldr403 from "./Tldr403";
import ResetPasswordEmailSentNotification from "../TldrRegistration/ResetPasswordEmail";
import TldrMyAccount from "../TldrSettings/TldrMyAccount";
import TldrMyWorkspace from "../TldrSettings/TldrMyWorkspace";
import Preview from "../TldrPreview/Preview";
import CreateWorkspace from "../TldrWorkspace/CreateWorkspace";
import AddMembers from "../TldrWorkspace/AddMembers";
import TldrBrandKit from "../TldrSettings/TldrBrandKits/TldrBrandKit";
import Callback from "../TldrSettings/Callback";
import ScrollToTop from "../_components/common/ScrollToTop";
import TldrToastNotification from "../_components/common/TldrToastNotification";
import {
  PasswordResetFailure,
  PasswordResetSuccess,
  PasswordSetSuccessViaInvitation,
  PasswordSetFailureViaInvitation,
  RegistrationVerificationFailure,
  RegistrationVerificationSuccess,
} from "../TldrRegistration/statelessView";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import SetPasswordViaInvitation from "../TldrRegistration/SetPasswordViaInvitation";
import TldrAiEditor from "../TldrAi/TldrAiEditor";
import TldrBillingAndPayment from "../TldrSettings/TldrBillingAndPayments/TldrBillingAndPayment";
import RenderPreview from "../TldrPreview/RenderPreview";
import TldrSavedCopies from "../TldrAi/TldrSavedCopies";
import TldrSumo from "../TldrPartners/TldrSumo";

if (process.env.REACT_APP_ENV === "production") {
  Sentry.init({
    dsn: "https://8531556389fc4472bfb86e5864603d61@o525022.ingest.sentry.io/5649360",
    integrations: [new Integrations.BrowserTracing()],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
    release: `${process.env.REACT_APP_NAME}@${process.env.REACT_APP_VERSION}`,
  });
}

// Check for token
const token = localStorage.getItem("Token");
var selectedOrgID = localStorage.getItem("SelectedOrgID");
if (token) {
  setAuthToken(token, selectedOrgID);
  // Decode token and glocalStorageet user info and expiration
  //const decoded = jwt_decode(localStorage.jwtToken);
  // Set user and isAuthenticated
  const payload = {
    key: token,
    user: JSON.parse(localStorage.getItem("User")),
    orgs: JSON.parse(localStorage.getItem("Orgs")),
    selectedOrg: Number(selectedOrgID),
  };
  store.dispatch(setCurrentUser(payload));
  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (localStorage.key.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = LOGIN;
  }
}

const NoMatchRoute = () => <Tldr404></Tldr404>;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: localStorage.getItem("Token"),
    };
  }

  componentDidMount() {}
  render() {
    return (
      <Provider store={store}>
        <Router>
          <ScrollToTop />
          <TldrToastNotification />
          <Switch>
            <Route
              exact
              path={REGISTRATION_EMAIL_SENT}
              component={RegistrationEmailSentNotification}
            />
            <Route
              exact
              path={CONFIRM_EMAIL}
              component={ConfirmYourEmailAddress}
            />
            <Route
              exact
              path={REGISTRATION_VERIFICATION_SUCCESS}
              component={RegistrationVerificationSuccess}
            />
            <Route
              exact
              path={REGISTRATION_VERIFICATION_FAILURE}
              component={RegistrationVerificationFailure}
            />
            <Route
              exact
              path={PASSWORD_RESET_EMAIL_SENT}
              component={ResetPasswordEmailSentNotification}
            />
            <Route
              exact
              path={CONFIRM_PASSWORD_RESET}
              component={ResetPassword}
            />
            <Route
              exact
              path={PASSWORD_RESET_SUCCESS}
              component={PasswordResetSuccess}
            />
            <Route
              exact
              path={PASSWORD_RESET_FAILURE}
              component={PasswordResetFailure}
            />
            <Route
              exact
              path={CREATE_PASSWORD_VIA_INVITATION}
              component={SetPasswordViaInvitation}
            />
            <Route
              exact
              path={PASSWORD_SET_SUCCESS_VIA_INVITATION}
              component={PasswordSetSuccessViaInvitation}
            />
            <Route
              exact
              path={PASSWORD_SET_FAILURE_VIA_INVITATION}
              component={PasswordSetFailureViaInvitation}
            />

            <PrivateRoute exact path={ROOT} component={Home} />
            <Route exact path={LOGIN} component={Login} />
            <Route exact path={LIFETIME} component={TldrSumo} />
            <Route exact path={REGISTER_PATH} component={Register} />
            <Route
              exact
              path={FORGOT_PASSWORD_PATH}
              component={ForgotPassword}
            />
            <PrivateRoute exact path={QUICK_START} component={Home} />
            <PrivateRoute exact path={USER_HOME} component={Home} />
            <PrivateRoute exact path={PROJECTS} component={Home} />
            <PrivateRoute exact path={MY_ASSETS} component={Home} />
            <PrivateRoute exact path={MY_TEMPLATES} component={Home} />
            <PrivateRoute exact path={MY_COMPONENTS} component={Home} />
            <PrivateRoute exact path={LAYOUTS} component={Home} />
            <PrivateRoute exact path={STORY} component={Home} />
            <PrivateRoute exact path={MY_FOLDERS} component={Home} />
            <PrivateRoute exact path={TEMPLATES_SCREEN} component={Home} />
            <PrivateRoute
              exact
              path={TEMPLATES_BY_CATEGORY_SCREEN_PATH}
              component={Home}
            />
            <PrivateRoute
              exact
              path={TEMPLATES_BY_FORMAT_SCREEN_PATH}
              component={Home}
            />
            <PrivateRoute exact path={MY_COPIES} component={Home} />
            <PrivateRoute exact path={MAGICAL} component={Home} />
            <PrivateRoute exact path={DOCUMENTS} component={TldrSavedCopies} />

            <PrivateRoute
              exact
              path={AI_TEMPLATE_PATH}
              component={TldrAiEditor}
            />
            <PrivateRoute exact path={AI_NEW_DOCUMENT} component={Home} />
            <PrivateRoute
              exact
              path={CREATE_WORKSPACE}
              component={CreateWorkspace}
            />
            <PrivateRoute exact path={ADD_NEW_MEMBERS} component={AddMembers} />
            <PrivateRoute
              exact
              path={STORY_DETAIL_PATH}
              component={StoryDetailsPage}
            />
            <PrivateRoute
              exact
              path={STORY_DETAIL_NAME_PATH}
              component={StoryDetailsPage}
            />
            <PrivateRoute path={STORY_PAGE_PATH} component={StoryDetailsPage} />
            <Route path={PREVIEW_PATH} component={Preview} />
            <Route path={RENDER_PREVIEW} component={RenderPreview} />
            <Route exact path={OAUTH_SHOPIFY_CALLBACK} component={Callback} />
            <PrivateRoute path={SETTINGS} component={Settings} />
            <PrivateRoute path={MY_ACCOUNT} component={TldrMyAccount} />

            <PrivateRoute
              exact
              path={MY_WORKSPACE}
              component={TldrMyWorkspace}
            />
            <PrivateRoute
              exact
              path={BILLING_AND_PAYMENT}
              component={TldrBillingAndPayment}
            />

            <PrivateRoute exact path={BRANDKIT} component={TldrBrandKit} />
            <PrivateRoute exact path={SHOPIFY_LOGIN} component={Settings} />

            <Route path={INTERNAL_SERVER_ERROR} component={internalServer} />
            <Route path={ACCESS_DENIED} component={Tldr403} />
            <Route path="*" component={NoMatchRoute} />
          </Switch>
        </Router>
      </Provider>
    );
  }
}
export default App;
