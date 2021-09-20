const { featureFlagClient } = require('@trello/feature-flag-client');
import { isDesktop } from '@trello/browser';

// If the board is not owned by an enterprise (i.e. idEnterprise is falsey)
// or if the board is owned by an enterprise and exists within the
// multi-variate feature flag that allows opt-ins by idEnterprise,
// then display the loom record button

export function isLoomIntegrationEnabled(idEnterprise?: string): boolean {
  // If we're in the desktop app, don't ever show the loom integration
  if (isDesktop()) {
    return false;
  }
  const boardCanShowLoom =
    !idEnterprise ||
    featureFlagClient
      .get('teamplates.web.loom-integration-enterprise-opt-ins', [])
      .includes(idEnterprise);

  return (
    boardCanShowLoom &&
    featureFlagClient.get('teamplates.web.loom-integration', false)
  );
}
