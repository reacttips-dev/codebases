// Extract the host/hostname/pathname from a protocol-less URL value (`www.zappos.com/c/mypage`)
const EXTRACT_FROM_URL_RE = /^((www\.)?((m\.)?(.*?))?\.com)(\/.*)?/;

/**
 * Given a hostname (no scheme or port) and an environmentConfig
 * (from the store state) return the hydra host to use for determining
 * active a/b tests.
 *
 * @param {string} host
 * @param {object} environmentConfig
 */
export const hydraHostForHost = (host, { hydra: { requestToHydraHost } }) => requestToHydraHost[host] || requestToHydraHost['__default__'];

/**
 * Given an array of hydra/url test objects, arrange the tests into an
 * object, keyed on hydra host name.
 *
 * @param {array} tests
 */
export const testsByActiveHost = tests => tests.reduce((testsFor, test) => (test.type === 'url' ? assignActiveHostsForUrlTest(testsFor, test) : assignActiveHostsForHydraTest(testsFor, test)), {});

const addTestToHostList = (testsFor, test, host) => {
  if (!testsFor[host]) {
    testsFor[host] = [];
  }
  testsFor[host].push(test);
  return testsFor;
};

const assignActiveHostsForHydraTest = (testsFor, test) => {
  test.active_hosts.forEach(hydraHost => {
    testsFor = addTestToHostList(testsFor, test, hydraHost);
  });
  return testsFor;
};

export const getInfoForUrlTest = url => {
  const matches = EXTRACT_FROM_URL_RE.exec(url);
  return matches.length === 7 ? { host: matches[1], hostName: matches[3], pathName: matches[6] } : {};
};

const assignActiveHostsForUrlTest = (testsFor, test) => {
  // url tests include a `url` field which is host plus path (no protocol), so regex out the host and use that as the hydra host.
  const { host, hostName } = getInfoForUrlTest(test.url);
  if (hostName && host) {
    /**
     * Regular RRH tests have an array of hosts that the test is active for [www.zappos.com, preprod-m.zappoos.com, www.6pm.com, ...]
     * However, URL tests dont have this active host array, only the test URL (www.zappos.com/coolTest). If the requesting url doesn't
     * match an active host, the test is stripped, so we manually add dev environments to the host list so they can be verified
     * working in pre-production environments.
     */
    testsFor = addTestToHostList(testsFor, test, `https://${host}`);
    testsFor = addTestToHostList(testsFor, test, `https://preprod-m.${hostName}.com`);
  } // if we cant extract the host, just ignore the test
  return testsFor;
};
