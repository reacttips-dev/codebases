// E.g. /reports-dashboard/99556608/marketing -> reports-dashboard
// E.g. /contacts/99556608/deals -> deals
// E.g. /activity-feed/99569557 -> activity-feed
export default function getCurrentApp() {
  var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : window.location.pathname;
  var splitPath = path.split('/');

  if (splitPath[1] === 'contacts' && splitPath.length > 2) {
    return splitPath[3];
  } else {
    return splitPath[1];
  }
}