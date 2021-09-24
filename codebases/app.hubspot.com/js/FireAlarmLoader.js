'use es6'; // TODO: Once #2708 is resolved, use regular import.
// Relevant conversation: https://hubspot.slack.com/archives/C4ABAB8CR/p1596658279222800
// See related: https://git.hubteam.com/HubSpot/asset-bender-hubspot/issues/2708

var _require = require('legacy-hubspot-bender-context'),
    bender = _require.bender;

var ENABLED_APP_DOMAINS = ['local.hubspotqa.com', 'local.hubspot.com', 'app.hubspotqa.com', 'app.hubspot.com', 'app-eu1.hubspotqa.com', 'app-eu1.hubspot.com'];
var domain = document.location.hostname.toLowerCase();
var isAppDomain = ENABLED_APP_DOMAINS.indexOf(domain) >= 0;

if (isAppDomain) {
  window.hubspot = window.hubspot || {};
  var fireAlarmbundleSrc = "" + bender.staticDomainPrefix + bender.depPathPrefixes[bender.project] + "/bundles/loader.js";
  var page = document.head || document.body;
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = fireAlarmbundleSrc;
  page.appendChild(script);
}