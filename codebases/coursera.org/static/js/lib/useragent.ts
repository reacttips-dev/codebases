// NOTE this file is required by preloader so polyfills aren't available while
// this module is loading unless explicitly required here as a prerequisite
import 'js/app/polyfills';

/**
 * Custom user agent detector optimized for Coursera
 *
 * Before you work on this, consider whether you'd accomplish your goals more quickly
 * by using an open source lib. We have https://github.com/darcyclarke/Detect.js
 * in our codebase, though it isn't required in many places because it's 49kb to this
 * lib's 6.3KB. But that's before uglify and gzip, and Detect.js has custom builds
 * to only detect the agents you care about.
 */
const ROBOT_RE = /PhantomJS|Googlebot/;
const PRERENDER_RE = /Prerender/;
const COURSERA_MOBILE_RE = /Coursera-Mobile/;

const VERSIONS = {
  Firefox: /Firefox\/([\d\w.-]+)/,
  IE: /MSIE\s([\d.]+[\d])/,
  IE11: /Trident.*rv:(11)\./,
  Chrome: /(?:Chrome|CriOS)\/([\d\w.-]+)/,
  Safari: /Version\/([\d\w.-]+)/,
  Ps3: /([\d\w.-]+)\)\s*$/,
  Psp: /([\d\w.-]+)\)?\s*$/,
  Edge: /Edge\/([\d.]+)/,
  fallback: /#\{name\}[/ ]([\d\w.-]+)/i,
} as const;

const APPS = {
  Chrome: /Chrome|CriOS/,
  Firefox: /Firefox/,
  PhantomJS: /PhantomJS/,
  Googlebot: /Googlebot/,
  IE: /MSIE|Trident.*rv:11\./, // http://stackoverflow.com/questions/20089145/how-to-detect-ie11-using-jquery
  Konqueror: /Konqueror/,
  Opera: /Opera/,
  Safari: /Safari/,
  Edge: /Edge/,
} as const;

const SYSTEMS = {
  Windows2000: /Windows NT 5\.0/,
  WindowsXP: /Windows NT 5\.1/,
  Windows2003: /Windows NT 5\.2/,
  WindowsVista: /Windows NT 6\.0/,
  // REF https://msdn.microsoft.com/en-us/library/ie/hh920767%28v=vs.85%29.aspx
  Windows7: /Windows NT 6\.1/,
  Windows8: /Windows NT 6\.[2-9]/,
  OSX: /Mac OS X (\d+)[._](\d+)/,
  Linux: /Linux/i,
  Ipad: /\(iPad.*OS (\d+)[._](\d+)/,
  Iphone: /\(iPhone.*OS (\d+)[._](\d+)/,
} as const;

const PLATFORMS = {
  Windows: /Windows/,
  Mac: /Macintosh/,
  Linux: /Linux/,
  Ipad: /iPad/,
  Ipod: /iPod/,
  Iphone: /iPhone/,
  Android: /Android/,
  Blackberry: /Blackberry/,
} as const;

function browserNameIn(uaString: string) {
  // ordered because strings often contain multiple names and we want the most selective
  const names = ['Edge', 'PhantomJS', 'Chrome', 'IE', 'Firefox', 'Safari', 'Konqueror', 'Opera', 'Googlebot'] as const;

  return names.find((name) => APPS[name].test(uaString)) || 'unknown';
}

function browserVersionIn(uaString: string) {
  switch (browserNameIn(uaString)) {
    case 'Chrome':
      if (VERSIONS.Chrome.test(uaString)) {
        return RegExp.$1;
      }
      break;
    case 'Safari':
      if (VERSIONS.Safari.test(uaString)) {
        return RegExp.$1;
      }
      break;
    case 'Firefox':
      if (VERSIONS.Firefox.test(uaString)) {
        return RegExp.$1;
      }
      break;
    case 'IE':
      if (VERSIONS.IE.test(uaString)) {
        return RegExp.$1;
      } else if (VERSIONS.IE11.test(uaString)) {
        return RegExp.$1;
      }
      break;
    case 'Edge':
      if (VERSIONS.Edge.test(uaString)) {
        return RegExp.$1;
      }
      break;
    // @ts-expect-error TODO: browserNameIn can't return this value
    case 'PS3':
      if (VERSIONS.Ps3.test(uaString)) {
        return RegExp.$1;
      }
      break;
    // @ts-expect-error TODO: browserNameIn can't return this value
    case 'PSP':
      if (VERSIONS.Psp.test(uaString)) {
        return RegExp.$1;
      }
      break;
    default:
      if (VERSIONS.fallback.test(uaString)) {
        return RegExp.$1;
      }
  }
  return undefined;
}

function systemIn(uaString: string): string {
  if (SYSTEMS.WindowsVista.test(uaString)) {
    return 'Windows Vista';
  } else if (SYSTEMS.Windows8.test(uaString)) {
    return 'Windows 8';
  } else if (SYSTEMS.Windows7.test(uaString)) {
    return 'Windows 7';
  } else if (SYSTEMS.Windows2003.test(uaString)) {
    return 'Windows 2003';
  } else if (SYSTEMS.WindowsXP.test(uaString)) {
    return 'Windows XP';
  } else if (SYSTEMS.Windows2000.test(uaString)) {
    return 'Windows 2000';
  } else if (SYSTEMS.Linux.test(uaString)) {
    return 'Linux';
  } else if (SYSTEMS.OSX.test(uaString)) {
    return uaString.match(SYSTEMS.OSX)?.[0].replace('_', '.') as string;
  } else if (SYSTEMS.Ipad.test(uaString)) {
    return uaString.match(SYSTEMS.Ipad)?.[0].replace('_', '.').replace('(', '') as string;
  } else if (SYSTEMS.Iphone.test(uaString)) {
    return uaString.match(SYSTEMS.Iphone)?.[0].replace('_', '.').replace('(', '') as string;
  } else {
    return 'unknown';
  }
}

function platformIn(uaString: string) {
  if (PLATFORMS.Windows.test(uaString)) {
    return 'Microsoft Windows';
  } else if (PLATFORMS.Mac.test(uaString)) {
    return 'Apple Mac';
  } else if (PLATFORMS.Android.test(uaString)) {
    return 'Android';
  } else if (PLATFORMS.Blackberry.test(uaString)) {
    return 'Blackberry';
  } else if (PLATFORMS.Linux.test(uaString)) {
    return 'Linux';
  } else if (PLATFORMS.Ipad.test(uaString)) {
    return 'iPad';
  } else if (PLATFORMS.Ipod.test(uaString)) {
    return 'iPod';
  } else if (PLATFORMS.Iphone.test(uaString)) {
    return 'iPhone';
  } else {
    return 'unknown';
  }
}

class UserAgent {
  source: string;

  browser: {
    name: string; // TODO: maybe union?
    version?: string;
  };

  system: string; // TODO: maybe union?

  platform: string; // TODO: maybe union?

  isMobileBrowser: boolean;

  isAndroid: boolean;

  isCourseraMobileApp: boolean;

  isMobile: boolean;

  isIOS: boolean;

  isMobilePhoneBrowser: boolean;

  isPrerender: boolean;

  isRobot: boolean;

  // TODO: deprecate passing in undefined source
  constructor(source = navigator.userAgent) {
    this.source = source;

    this.browser = {
      name: browserNameIn(this.source),
      version: browserVersionIn(this.source),
    };

    this.system = systemIn(source);

    this.platform = platformIn(source);

    this.isMobileBrowser = /iPhone|iPod|iPad|Android|BlackBerry|Opera Mini|IEMobile/.test(source);

    this.isAndroid = this.isMobileBrowser && this.platform === 'Android';

    this.isCourseraMobileApp = !!source.match(COURSERA_MOBILE_RE);

    this.isMobile = this.isMobileBrowser || this.isCourseraMobileApp;

    this.isIOS =
      this.isMobileBrowser && (this.platform === 'iPad' || this.platform === 'iPhone' || this.platform === 'iPod');

    let height: number;
    let width: number;
    if (typeof document !== 'undefined' && typeof window !== 'undefined') {
      if (typeof window.screen !== 'undefined') {
        height = window.screen.height;
        width = window.screen.width;
      } else {
        height = window.innerHeight;
        width = window.innerWidth;
      }
    } else {
      height = 0;
      width = 0;
    }

    this.isMobilePhoneBrowser = this.isMobileBrowser && (height < 420 || width < 420);

    this.isPrerender = !!source.match(PRERENDER_RE);

    this.isRobot = this.isPrerender || !!this.source.match(ROBOT_RE);
  }
}

export default UserAgent;
