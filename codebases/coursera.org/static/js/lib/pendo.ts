// @ts-nocheck Copypasted pendo script. TODO: Move init function to a separate file and ignore typecheck for it.
/* eslint-disable no-console */

import Q from 'q';
import { DEGREE_PARTNER_SHORTNAMES } from 'bundles/teach-course/constants/Degrees';

import type Partner from 'bundles/author-common/models/Partner';
import Cookie from 'js/lib/cookie';

let deferred: Q.Deferred<void>;

export const PARTNER_API_KEY = 'd93226db-9e24-4d5f-5223-540c05442f1b';
export const ENTERPRISE_API_KEY = '63fb34da-80f5-4d22-588a-3f2a6ce5224e';
export const LEARNER_API_KEY = 'bfe8c8aa-f7a6-46f4-5ede-db5a212ce2cc';
const E2E_DISABLE_PENDO_FLAG = 'X-Coursera-Disable-Pendo';

/**
 * Override pendo types to add support for "string[]". Remove when
 * https://github.com/DefinitelyTyped/DefinitelyTyped/pull/55323 is merged and released.
 */
interface Metadata {
  [key: string]: string | number | boolean | string[];
}

type IdentityMetadata = { id?: string | undefined } & Metadata;

interface Identity {
  /** visitor.id is required if user is logged in, otherwise an anonymous ID is generated and tracked by a cookie */
  visitor?: IdentityMetadata | undefined;
  account?: IdentityMetadata | undefined;
}

interface InitOptions extends Identity {
  apiKey?: string | undefined;
  excludeAllText?: boolean | undefined;
  excludeTitle?: boolean | undefined;
  disablePersistence?: boolean | undefined;
  guides?:
    | {
        delay?: boolean | undefined;
        disable?: boolean | undefined;
        timeout?: number | undefined;
        tooltip?:
          | {
              arrowSize?: number | undefined;
            }
          | undefined;
      }
    | undefined;
  events?: pendo.EventCallbacks | undefined;
}

/**
 * Helper to return consistent Account data for Pendo clients across Partner apps.
 * See `withPendoWrapper` for sample usage.
 */
export const getPartnerAccountData = ({
  partners = [],
  isSuperuser = false,
}: {
  partners?: Partner[];
  isSuperuser: boolean;
}): IdentityMetadata => {
  if (!partners || partners.length === 0) {
    return {};
  }

  const partnerShortNames = partners.map((partner) => partner.shortName);
  return {
    id: isSuperuser ? 'superuser' : partners[0].shortName, // pick the first partner as primary
    name: isSuperuser ? 'Coursera Superuser' : partners[0].name, // pick the first partner as primary
    partners: partnerShortNames,
    isDegreePartner: partnerShortNames.some((name) => DEGREE_PARTNER_SHORTNAMES.includes(name)),
  };
};

/**
 * Use this to initilize Pendo.
 * @param options Initialization options.
 * @param API_KEY The API key to use.
 * @param onGuidesLoadedCallback Optionally triggered when the Agent loads all guides. Returns back a valid Pendo object.
 */
const init = (options: InitOptions, API_KEY: string, onGuidesLoadedCallback?: (pendo: pendo.Pendo) => void) => {
  // https://coursera.atlassian.net/browse/CP-6548
  // Disable initialization for requests coming from e2e test framework to prevent
  // flakiness in tests due to the pendo guides
  const disabled = Cookie.get(E2E_DISABLE_PENDO_FLAG) === 'true';
  if (typeof window === 'undefined' || typeof window.pendo !== 'undefined' || disabled) {
    return;
  }

  deferred = Q.defer();
  deferred.promise.then(() => {
    const pendo = window.pendo as pendo.Pendo | undefined;
    if (pendo) {
      pendo.events.guidesLoaded(() => {
        onGuidesLoadedCallback?.(pendo);
      });
      pendo.initialize(options);
      console.info('[pendo] initialized with data: ', JSON.stringify(options));
    }
  });

  /* eslint-disable */
  (function (p, e, n, d, o) {
    let v, w, x, y, z;
    o = p[d] = p[d] || {};
    o._q = [];
    v = ['initialize', 'identify', 'updateOptions', 'pageLoad'];
    for (w = 0, x = v.length; w < x; ++w)
      (function (m) {
        o[m] =
          o[m] ||
          function () {
            o._q[m === v[0] ? 'unshift' : 'push']([m].concat([].slice.call(arguments, 0)));
          };
      })(v[w]);
    y = e.createElement(n);
    y.async = !0;
    y.src = 'https://cdn.pendo.io/agent/static/' + API_KEY + '/pendo.js';
    y.onload = deferred.resolve;
    z = e.getElementsByTagName(n)[0];
    z.parentNode.insertBefore(y, z);
  })(window, document, 'script', 'pendo');
  /* eslint-enable */
};

const identify = (id: string) => {
  window.pendo?.identify(id);
};

const showGuideById = (id: string) => {
  window.pendo?.showGuideById(id);
};

const pendo = { init, identify, showGuideById };

export default pendo;
