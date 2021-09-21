/*
  Represents active test groups in LD
*/

export const activeTests = {
  startersTestGroup: {
    // Matches /starters path, with optional trailing slash, and adds `/` or `` to capture group $1
    from: /^\/starters(\/|$)/,
    // $1 adds the trailing slash, if present in the path
    to: "/starters-next$1",
  },
}
