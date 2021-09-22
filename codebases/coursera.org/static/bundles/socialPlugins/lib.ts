import { memoize } from 'underscore';

import epic, { Namespaces } from 'bundles/epic/client';

import language from 'js/lib/language';
import Multitracker from 'js/app/multitrackerSingleton';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import thirdParty from 'js/lib/thirdParties';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import timing from 'js/lib/timing';

declare global {
  interface Window {
    fbAsyncInit: () => void;
    googleAsyncInit: () => void;
    onGoogleLibraryLoad?: () => void;
  }
}

const PLUGINS = {
  apple: {
    exports: 'AppleID',
    url: () => `https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js`,
  },
  facebook: {
    exports: 'FB',
    url: () => `https://connect.facebook.net/${language.getFacebookLocaleString()}/all/sdk.js`,
  },
  google: {
    exports: 'gapi',
    url: () => 'https://apis.google.com/js/platform.js?onload=googleAsyncInit',
  },
  googleOneTap: {
    exports: 'google',
    url: () => 'https://accounts.google.com/gsi/client',
  },
};

function isEnabled(name: 'apple' | 'facebook' | 'google' | 'googleOneTap'): boolean {
  return epic.get('siteMisc', `${name}PluginEnabled` as keyof Namespaces['siteMisc']);
}

function report(name: string, error: Error) {
  Multitracker.push([
    `socialPlugins.${name}.error`,
    {
      name,
      message: error.message,
    },
  ]);
}

const pluginFactory = memoize(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async (name: keyof typeof PLUGINS, _lang?: string): Promise<unknown> => {
    if (isEnabled(name)) {
      timing.time(name);
      try {
        const plugin = PLUGINS[name];

        await new Promise((ok, ko) => {
          thirdParty.loadScript(plugin.url(), ok, '', ko);
        });
        timing.timeEnd(name);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return window[plugin.exports as any];
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`There was an issue loading the ${name} plugin. See the following error:`);

        report(name, error);

        throw new Error(`Social Plugins: There was an error loading plugin ${name}`);
      }
    } else {
      throw new Error(`Social Plugins: Plugin ${name} is disabled`);
    }
  },
  (name: keyof typeof PLUGINS, lang?: string) => name + lang
);

function apple(): Promise<unknown> {
  return pluginFactory('apple');
}

async function facebook(): Promise<unknown> {
  const lock = new Promise<void>((ok) => {
    window.fbAsyncInit = ok;
  });

  await Promise.all([lock, pluginFactory('facebook', language.getFacebookLocaleString())]);

  // It is not the same instance after fbAsyncInit is called.
  // We return the new instance after everything is ready
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return window[PLUGINS.facebook.exports as any];
}

async function google(): Promise<unknown> {
  const lock = new Promise<void>((ok) => {
    window.googleAsyncInit = ok;
  });

  const [, Google] = await Promise.all([lock, pluginFactory('google')]);

  return Google;
}

async function googleOneTap(): Promise<unknown> {
  const lock = new Promise<void>((ok) => {
    window.onGoogleLibraryLoad = ok;
  });

  const [, GoogleOneTap] = await Promise.all([lock, pluginFactory('googleOneTap')]);

  return GoogleOneTap;
}

export { apple, facebook, google, googleOneTap };

export default { apple, facebook, google, googleOneTap };
