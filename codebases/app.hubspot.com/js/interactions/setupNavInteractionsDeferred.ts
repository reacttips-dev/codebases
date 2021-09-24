import { setupNotifications } from 'unified-navigation-ui/deferred/notifications';
import setupAnalytics from 'unified-navigation-ui/deferred/analytics/setupAnalytics';
import { setupSearch } from 'unified-navigation-ui/deferred/search/searchConfig';
import setupSettingsInteractions from './setupSettingsInteractions';
var completedOneTimeSetup = false;
export default function setupNavInteractionsDeferred(_ref) {
  var userId = _ref.userId,
      userEmail = _ref.userEmail,
      gates = _ref.gates,
      scopes = _ref.scopes,
      isDevPortal = _ref.isDevPortal;

  if (!completedOneTimeSetup) {
    completedOneTimeSetup = true; // Interactions that should be set up only once

    setupAnalytics({
      userId: userId,
      userEmail: userEmail,
      gates: gates
    });
    setupSettingsInteractions();
  }

  if (!isDevPortal) {
    setupSearch({
      scopes: scopes,
      gates: gates,
      userId: userId,
      userEmail: userEmail
    });
  }

  setupNotifications();
}