import { AppId, appId } from '@trello/config';
import { TrelloWindow } from '@trello/window-types';
declare const window: TrelloWindow;

export enum Browser {
  Edge = 'edg',
  EdgeLegacy = 'edge',
  Chrome = 'chrome',
  Explorer = 'explorer',
  Vivaldi = 'vivaldi',
  Yandex = 'yandex',
  Firefox = 'firefox',
  Safari = 'safari',
  Opera = 'opera',
  Samsung = 'samsung',
  UCBrowser = 'ucbrowser',
  Unknown = 'unknown-browser',
}

enum OS {
  Windows = 'windows',
  Mac = 'mac',
  Linux = 'linux',
  Android = 'android',
  iPad = 'ipad',
  iPod = 'ipod',
  iPhone = 'iphone',
  Unknown = 'unknown-os',
}

// Yeah, yeah... UA sniffing is bad... come at me
export const getBrowserName = (
  { userAgent, vendor }: Navigator,
  document: Document,
): Browser => {
  // @ts-ignore
  const ie = !!document.documentMode;
  const edge = userAgent.includes('Edg/');
  const edgeLegacy = userAgent.includes('Edge');
  const opera = userAgent.includes('Opera') || userAgent.includes('OPR');
  const vivaldi = userAgent.includes('Vivaldi');
  const firefox = userAgent.includes('Firefox');
  const uc = userAgent.includes('UCBrowser');
  const samsung = userAgent.includes('SamsungBrowser');
  const yandex = vendor.includes('Yandex');
  const chrome =
    userAgent.includes('CriOS') ||
    (userAgent.includes('Chrom') &&
      !edge &&
      !edgeLegacy &&
      !opera &&
      !yandex &&
      !vivaldi &&
      !samsung &&
      !uc);
  const safari = vendor.includes('Apple') && !chrome;

  switch (true) {
    case chrome:
      return Browser.Chrome;
    case firefox:
      return Browser.Firefox;
    case safari:
      return Browser.Safari;
    case edge:
      return Browser.Edge;
    case edgeLegacy:
      return Browser.EdgeLegacy;
    case ie:
      return Browser.Explorer;
    case opera:
      return Browser.Opera;
    case yandex:
      return Browser.Yandex;
    case vivaldi:
      return Browser.Vivaldi;
    case uc:
      return Browser.UCBrowser;
    case samsung:
      return Browser.Samsung;
    default:
      return Browser.Unknown;
  }
};

export const UNKNOWN_BROWSER_VERSION = 'unknown-browser-version';
export type BrowserVersion = typeof UNKNOWN_BROWSER_VERSION | number;

const parseVersion = (
  prefix: string,
  { userAgent }: Navigator,
): BrowserVersion => {
  const start = userAgent.indexOf(prefix);
  if (start !== -1) {
    return parseInt(userAgent.substring(start + prefix.length + 1), 10);
  }

  return UNKNOWN_BROWSER_VERSION;
};

export const getBrowserVersion = (
  browser: Browser,
  nav: Navigator,
): number | 'unknown-browser-version' => {
  switch (browser) {
    case Browser.Chrome: {
      const chromeDesktop = parseVersion('Chrome', nav);
      return chromeDesktop !== UNKNOWN_BROWSER_VERSION
        ? chromeDesktop
        : parseVersion('CriOS', nav);
    }
    case Browser.Firefox:
      return parseVersion('Firefox', nav);
    case Browser.Safari:
      return parseVersion('Version', nav);
    case Browser.Edge:
      return parseVersion('Edg', nav);
    case Browser.EdgeLegacy:
      return parseVersion('Edge', nav);
    case Browser.Opera:
      return parseVersion('OPR', nav);
    case Browser.Explorer: {
      const msie = parseVersion('MSIE', nav);
      return msie !== UNKNOWN_BROWSER_VERSION ? msie : parseVersion('rv', nav);
    }
    case Browser.Yandex:
      return parseVersion('YaBrowser', nav);
    case Browser.Vivaldi:
      return parseVersion('Vivaldi', nav);
    case Browser.Samsung:
      return parseVersion('SamsungBrowser', nav);
    case Browser.UCBrowser:
      return parseVersion('UCBrowser', nav);
    default:
      return UNKNOWN_BROWSER_VERSION;
  }
};

export const getOS = ({ userAgent, platform }: Navigator): OS => {
  const win = platform.includes('Win');
  const mac = platform.includes('Mac');
  const linux = platform.includes('Linux');
  const android = userAgent.includes('Android');
  const ipad = userAgent.includes('iPad');
  const ipod = userAgent.includes('iPod');
  const iphone = userAgent.includes('iPhone');

  switch (true) {
    case win:
      return OS.Windows;
    case mac:
      return OS.Mac;
    case ipad:
      return OS.iPad;
    case ipod:
      return OS.iPod;
    case iphone:
      return OS.iPhone;
    case android:
      return OS.Android;
    case linux:
      return OS.Linux;
    default:
      return OS.Unknown;
  }
};

// Maintain existing API in classic by exporting these const string values
// eslint-disable-next-line @trello/no-module-logic
export const browserStr = getBrowserName(navigator, document); // "chrome"
// eslint-disable-next-line @trello/no-module-logic
export const browserVersion = getBrowserVersion(browserStr, navigator); // 72
export const browserVersionStr = `${browserStr}-${browserVersion}`; // "chrome-72"
// eslint-disable-next-line @trello/no-module-logic
export const osStr = getOS(navigator); // "mac"
export const asString = `${browserStr} ${browserVersionStr} ${osStr}`; // "chrome chrome-72 mac"

// Export helper APIs for convenience
export const isIE = () => browserStr === Browser.Explorer;
export const isFirefox = () => browserStr === Browser.Firefox;
export const isYandex = () => browserStr === Browser.Yandex;
export const isVivaldi = () => browserStr === Browser.Vivaldi;
export const isEdge = () => browserStr === Browser.Edge;
export const isEdgeLegacy = () => browserStr === Browser.EdgeLegacy;
export const isSamsung = () => browserStr === Browser.Samsung;
export const isUC = () => browserStr === Browser.UCBrowser;
export const isOpera = () => browserStr === Browser.Opera;
export const isChrome = () => browserStr === Browser.Chrome;
export const isSafari = () => browserStr === Browser.Safari;
export const isWindows = () => osStr === OS.Windows;
export const isMac = () => osStr === OS.Mac;
export const isLinux = () => osStr === OS.Linux;
export const isAndroid = () => osStr === OS.Android;
export const isIPad = () => osStr === OS.iPad;
export const isIPod = () => osStr === OS.iPod;
export const isIPhone = () => osStr === OS.iPhone;
export const isIos = () => isIPad() || isIPhone() || isIPod();
export const isTouch = () => isIPad() || isIPhone() || isIPod() || isAndroid();
export const isDesktop = () => appId === AppId.Desktop;
export const isCypress = () => !!window.Cypress;
