import { text } from 'unified-navigation-ui/js/utils/NavI18n';
import getOrigin from 'unified-navigation-ui/utils/getOrigin';
import { getPortalId } from 'unified-navigation-ui/js/utils/getPortalId';
import { GET } from 'unified-navigation-ui/utils/API';
import { addClickTracking } from 'unified-navigation-ui/deferred/analytics/navEvent';

var mon505Callback = function mon505Callback(owned) {
  if (owned.length === 0) {
    document.getElementById('mon505').innerHTML = "\n  <div id=\"mon505\" class=\"mon505\">" + text('nav.freePlan.text', {
      defaultValue: "You're on HubSpot's Free plan."
    }) + "\n    <br/>\n  \n    <a class=\"mon505-link\" data-tracking=\"click\" id=\"freePlan\"\n      href=\"" + getOrigin() + "/upgrade/" + getPortalId() + "/free-plan\">" + text('nav.freePlan.link', {
      defaultValue: 'Learn more'
    }) + "</a>\n  </div>\n      ";
  }

  var element = document.getElementById('freePlan');

  if (element) {
    addClickTracking(element);
  }
};

export function mon505Template() {
  GET("/monetization-service/v3/product/owned?portalId=" + getPortalId(), mon505Callback);
  return "<div id=\"mon505\"></div>";
}