/**
 * A wrapper on top of the Bugsnag JS library.
 * The goal here is making Bugsnag compatible with CAFE's composable app runtime.
 * Without this wrapper, multiple instances of Bugsnag would be loaded on the page causing multiple reporting of errors
 * and unnecessary duplicate page weight.
 * This wrapper instantiate a Bugsnag client only once and keeps its settings aligned with the current feature so that
 * the reported errors are redirected to the correct project. Also, when the user navigates to a feature that doesn't
 * use Bugsnag, this wrapper prevents errors from being sent.
 */
const BugsnagBrowser = require('@bugsnag/browser');
const BugsnagPluginReact = require('@bugsnag/plugin-react');

const bugsnag = {
  isAllowedToRun: false,
  client: undefined,
  currentApiKey: undefined,
  currentAppVersion: undefined,

  // Since we have a single Bugsnag client we must use the onError callback to customize the error reports.
  // The onError callback is run immediately after an error is reported or captured.
  onError: function (event) {
    if (!bugsnag.currentApiKey) {
      return false; // We can return false to prevent an event from being sent.
    }

    event.apiKey = bugsnag.currentApiKey;
    event.app.version = bugsnag.currentAppVersion;

    // Keep the user ID in sync with the vendor context
    const user = window.inGlobalContext.appShell.user.getVendorContext() || {};
    event.setUser(user.vendorID || user.userID, undefined, undefined);
  },

  // Reset the Bugsnag configuration properties used when reporting an error (effectively disabling the reporting).
  resetFeatureSettings: function () {
    bugsnag.currentApiKey = undefined;
    bugsnag.currentAppVersion = undefined;
    BugsnagBrowser.setUser(undefined, undefined, undefined);
  },

  /**
   * Get a Bugsnag client compatible with CAFE's composable app runtime.
   * In order to be compatible with the composable app runtime, the returned client supports only a subset of the
   * properties available in an original Bugsnag client — we expose only properties that we're able to clean-up
   * while navigating between features.
   * The client supports the React plugin by default. You can access it with getClient().getPlugin('react').
   *
   * @return {object} A CAFE-compatible Bugsnag client instance.
   */
  getClient: function () {
    // Safety check — we don't expect this RPR to run outside of CAFE, so appShell should always be available.
    if (!window.inGlobalContext || !window.inGlobalContext.appShell) {
      console.error('Unable to get Bugsnag because inGlobalContext.appShell is not defined');
      return;
    }
    const appShell = window.inGlobalContext.appShell;

    // Get the API key and the version of the current  app (which we expect to be the caller of this function).
    const featureContext = appShell.currentApp && appShell.currentApp.getFeatureContext();
    bugsnag.currentApiKey = featureContext && featureContext.envContext && featureContext.envContext.bugsnagAPIKey;
    bugsnag.currentAppVersion = featureContext && featureContext.version;
    if (!bugsnag.currentApiKey) {
      console.error(
        'Unable to find a valid Bugsnag API key for the current app. Make sure a "bugsnagAPIKey" is set in the env context of the current app.'
      );
      return;
    }

    // Check in Third-Party Manager if Bugsnag is allowed to run: if it is, the callback function will be invoked
    // synchronously; otherwise, it will never be invoked.
    window.inGlobalContext.thirdPartyManager.whenAllowed(
      window.inGlobalContext.thirdPartyManager.thirdParties.BUGSNAG,
      function () {
        bugsnag.isAllowedToRun = true;
      }
    );
    if (!bugsnag.isAllowedToRun) {
      return;
    }

    // We want to initialize Bugsnag only once and re-use the same client on all apps.
    // Event though we have a single client, we can still send the errors to the right project by changing the API key
    // (used by the onError callback) each time a new app that supports Bugsnag is mounted.
    if (!bugsnag.client) {
      // We don't want Bugsnag to report errors unless it has been explicitly requested (by calling getBugsnag) by the
      // current app, so we can disable Bugsnag on each app unmount event.
      const beforeUnmountEvent = appShell.events.EVENT_PREFIXES.BEFORE + ':' + appShell.events.COMMAND_TYPES.UNMOUNT;
      appShell.on(beforeUnmountEvent, function (props) {
        if (!appShell.getFeatureContext(props.featureName).isFeatureAnApp()) {
          return;
        }
        bugsnag.resetFeatureSettings();
      });

      // Initialize the Bugsnag client
      bugsnag.client = BugsnagBrowser.start({
        apiKey: bugsnag.currentApiKey,
        appVersion: bugsnag.currentAppVersion,
        releaseStage: window.inGlobalContext.appMetaData && window.inGlobalContext.appMetaData.tier,
        autoCaptureSessions: true,
        plugins: [new BugsnagPluginReact()],
        onError: bugsnag.onError,
      });
    }

    // Seal the client instance exposing only the features that we can clean-up.
    return {
      getPlugin: BugsnagBrowser.getPlugin,
      leaveBreadcrumb: BugsnagBrowser.leaveBreadcrumb,
      notify: BugsnagBrowser.notify,
    };
  },
};

module.exports = {
  getClient: bugsnag.getClient,
  __UNSAFE_INTERNALS__: bugsnag,
  __UNSAFE_BUGSNAG_BROWSER__: BugsnagBrowser,
};
