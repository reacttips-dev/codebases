const PATHS: any = {
  "documents-createdbyme": /^\/docs\/created-by-me\/?/i,
  "documents-archived": /^\/docs\/archived\/?/i,
  "documents-all": /^\/$|^\/docs\/?/i,
  "project-createdbyme": /^\/projects\/(?:[a-z0-9-?/]+\/?)\/created-by-me\/?/i,
  "project-archived": /^\/projects\/(?:[a-z0-9-?/]+\/?)\/archived\/?/i,
  "project-all": /^\/projects\/(?:[a-z0-9-?/]+\/?)$/i,
  spaces: /^\/spaces\/?$/i,
  "space-createdbyme": /^\/spaces\/(?:[a-z0-9-?/]+\/?)\/created-by-me\/?/i,
  "space-archived": /^\/spaces\/(?:[a-z0-9-?/]+\/?)\/archived\/?/i,
  "space-all": /^\/spaces\/(?:[a-z0-9-?/]+\/?)$/i,
  search: /^\/search\/?/i,
};

const mapPaths = (pathname: string): string => {
  if (!pathname || pathname.length === 0) {
    return "unknown-path-type";
  }

  const normalizedPathName = pathname.toLowerCase();
  for (const key in PATHS) {
    if (PATHS[key].test(normalizedPathName)) {
      return key;
    }
  }

  return "unknown-path-type";
};

export default mapPaths;
