// The following are things that look like they could be usernames or org names
// but are known to be top-level routes (e.g. /shortcuts) handled by our single
// page app.  The server reserves many more words and prevents them from being
// used as user or org names, but these are the only ones that we'd expect to
// see in URLs that users would naturally visit.  This is used by quickload, so
// we don't want to increase the file size by including every possible thing
// that the server reserves.
//
// Note that we don't need to include routes that don't match /^[a-z0-9_]{3,}$/
// (e.g. /me or /select-org-to-upgrade) or are handled by the server/meta pages
// (e.g. /login)
const KNOWN_ROUTES = ['blank', 'shortcuts', 'search', 'templates'];

export const isPossiblyValidOrgName = (s: string): boolean =>
  /^[a-z0-9_]{3,}$/.test(s) && KNOWN_ROUTES.indexOf(s) === -1;
