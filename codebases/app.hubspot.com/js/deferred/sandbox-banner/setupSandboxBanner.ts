import { getPortalId } from 'unified-navigation-ui/js/utils/getPortalId';
import { getIsSandboxPortal, getSandboxPortalParent, renderSandboxBanner } from './sandboxUtils';
var SANDBOX = 11;
export function setupSandboxBanner() {
  getIsSandboxPortal(getPortalId(), function (sandboxResp) {
    var isSandboxPortal = sandboxResp.hubType === SANDBOX;

    if (isSandboxPortal) {
      getSandboxPortalParent(getPortalId(), function (parentResp) {
        var parentPortalId = parentResp.parentHubId;
        renderSandboxBanner(parentPortalId);
      });
    }
  });
}