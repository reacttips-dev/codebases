import { ModelLoader } from 'app/scripts/db/model-loader';
import type { BoardPlugin } from 'app/scripts/models/BoardPlugin';

const orgToDomainMapMapCache: { [key: string]: DomainMap } = {};
const outstandingRequests: { [key: string]: Promise<DomainMap> } = {};

interface DomainMap {
  [key: string]: [BoardPlugin];
}

// grab second-level domain, e.g 'https://na36.salesforce.com/008' to 'salesforce.com'
export function getSecondLevelDomain(url: string) {
  const allowedProtocols = ['http:', 'https:'];
  const eTLDs = ['co', 'com', 'org', 'gov'];
  let secondLevelDomain;
  try {
    const parsedUrl = new URL(url);
    if (!allowedProtocols.includes(parsedUrl.protocol)) {
      return null;
    }
    const domainParts = parsedUrl.hostname.split('.');
    if (domainParts.length < 2) {
      return null;
    }
    secondLevelDomain = domainParts.slice(-2).join('.');
    // most times the SLD will be the second domain
    // but in cases like example.co.uk, the SLD is actually the third
    if (
      domainParts.length > 2 &&
      eTLDs.includes(domainParts[domainParts.length - 2])
    ) {
      secondLevelDomain = domainParts.slice(-3).join('.');
    }
  } catch (err) {
    // if we are unable to parse the URL for whatever reason
    return null;
  }
  return secondLevelDomain;
}

// returns mapping of second-level domains to its plugin based on your org.
// for example: dropbox.com -> Dropbox, google.com -> Google Drive.
// this mapping acts as an index to faster match attachment urls to plugins
// this needs to be based on org
// because different orgs have different plugins visible to them.
export async function getClaimedSecondLevelDomainsToPluginMapForOrg(
  idOrg: string,
  idBoard: string,
) {
  if (orgToDomainMapMapCache[idOrg]) {
    return orgToDomainMapMapCache[idOrg];
  }
  if (outstandingRequests[idOrg]) {
    return outstandingRequests[idOrg];
  }
  const req: Promise<DomainMap> = new Promise((resolve) => {
    ModelLoader.loadPluginsWithClaimedDomains(idBoard).then((plugins) => {
      if (!plugins) {
        return null;
      }
      const claimedDomainsMap: DomainMap = {};
      plugins.forEach((plugin) => {
        plugin.attributes.claimedDomains?.forEach((domain) => {
          const secondLevelDomain = getSecondLevelDomain(
            `https://${domain.replace(/^\*\./, '')}`,
          );
          if (!secondLevelDomain) {
            return;
          }
          if (!claimedDomainsMap[secondLevelDomain]) {
            claimedDomainsMap[secondLevelDomain] = [plugin];
            return;
          }
          if (!claimedDomainsMap[secondLevelDomain].includes(plugin)) {
            claimedDomainsMap[secondLevelDomain].push(plugin);
          }
        });
      });
      orgToDomainMapMapCache[idOrg] = claimedDomainsMap;
      delete outstandingRequests[idOrg];
      resolve(orgToDomainMapMapCache[idOrg]);
    });
  });
  outstandingRequests[idOrg] = req;
  return req;
}

export function doesMatchClaimedDomain(url: string, claimedDomain: string) {
  // claimedDomain examples: paper.dropbox.com, dropbox.com/path/, *.dropbox.com, dropbox.co.uk
  let parsedUrl, parsedClaimedDomain;
  try {
    parsedUrl = new URL(url);
  } catch {
    return false;
  }
  // check for wildcard '*' claimedDomain
  if (claimedDomain.startsWith('*.')) {
    parsedClaimedDomain = new URL(`https://${claimedDomain.substring(2)}`);
    return (
      (parsedUrl.host === parsedClaimedDomain.host ||
        parsedUrl.host.endsWith(`.${parsedClaimedDomain.host}`)) &&
      parsedUrl.pathname.startsWith(parsedClaimedDomain.pathname)
    );
  } else {
    parsedClaimedDomain = new URL(`https://${claimedDomain}`);
    return (
      parsedUrl.host === parsedClaimedDomain.host &&
      parsedUrl.pathname.startsWith(parsedClaimedDomain.pathname)
    );
  }
}

export const Util = {
  getSecondLevelDomain,
  getClaimedSecondLevelDomainsToPluginMapForOrg,
  doesMatchClaimedDomain,
};
