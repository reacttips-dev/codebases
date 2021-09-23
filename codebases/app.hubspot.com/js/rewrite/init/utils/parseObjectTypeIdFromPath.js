'use es6'; // HACK: This is used in our quick-fetches too, so to keep
// their bundle sizes down we directly hardcode the objectTypeIds.
// This prevents us from having to pull in code from customer-data-objects.
// Each of these cases correspond to the routes defined in the router.
// See https://git.hubteam.com/HubSpot/CRM/blob/61be3635fb8413a639c42ca38ce6ae999bf0cdf6/crm-index-ui/static/js/router/Router.js

export var parseObjectTypeIdFromPath = function parseObjectTypeIdFromPath(path) {
  // legacy contacts routes
  if (path.match(/^\/contacts\/[0-9]+(\/|\/contacts.*)?$/i)) {
    return '0-1'; // Contact objectTypeId
  } // legacy companies routes


  if (path.match('/companies')) {
    return '0-2'; // Company objectTypeId
  } // legacy deals routes


  if (path.match('/deals')) {
    return '0-3'; // Deal objectTypeId
  } // legacy tickets routes


  if (path.match('/tickets')) {
    return '0-5'; // Ticket objectTypeId
  } // Generic object routes


  var match = path.match(/\/objects\/(\d+-\d+)/);

  if (!match) {
    return null;
  }

  return match[1];
};