import { TrelloStorage } from '@trello/storage';
import { atlassianFeatureFlagClientKey, environment } from '@trello/config';
import { memberId } from '@trello/session-cookie';
import { Analytics } from '@trello/atlassian-analytics';
import { isDesktop, isTouch } from '@trello/browser';
import AtlassianFeatureFlagClient, {
  Identifiers,
  EnvironmentType,
  FeatureFlagUser,
  SupportedFlagTypes,
} from '@atlassiansox/feature-flag-web-client';

const USER_DATA_CACHE_TIMEOUT = 24 * 60 * 60 * 1000;
const USER_DATA_CACHE_STORAGE_KEY = 'featureFlagUserData';
const OVERRIDES_STORAGE_KEY = 'featureFlagOverrides';

interface UserData {
  channel: string;
  idEnterprises: string[];
  idOrgs: string[];
  orgs: string[];
  emailDomain: string;
  clientVersion: string;
  head: string;
  version: number;
  // LD dates must be formatted as UNIX milliseconds
  // https://docs.launchdarkly.com/home/managing-flags/targeting-users#date-comparisons
  signupDate: number;
}

interface UserDataCache {
  lastUpdated: number;
  key: string | null;
  data: UserData;
}

interface ChangeListener<T> {
  (current?: T, previous?: T): void;
}
interface ChangeListenerMap {
  [key: string]: ChangeListener<SupportedFlagTypes>[];
}

interface UnsubscriberMap {
  [key: string]: () => void;
}

export interface FlagSet {
  [key: string]: SupportedFlagTypes;
}

interface FeatureFlagGroups {
  remote: FlagSet;
  overrides: FlagSet;
}

export class FeatureFlagClient {
  // @ts-ignore
  private atlassianClientUser: FeatureFlagUser;
  private atlassianClientUnsubscribers: UnsubscriberMap = {};
  private changeListeners: ChangeListenerMap = {};

  // @ts-ignore
  public atlassianClient: AtlassianFeatureFlagClient;
  public pollingInterval: number = 5000;

  createInitialUser() {
    const identifierValue = memberId;

    // Build up our flag user: we want to omit the `identifier` if the memberId
    // is not set, so that the client will generate a UUID
    this.atlassianClientUser = {};
    if (identifierValue !== null) {
      this.atlassianClientUser.identifier = {
        type: Identifiers.TRELLO_USER_ID,
        value: identifierValue,
      };
    }

    // Add the attributes we know are present at startup
    this.atlassianClientUser.custom = {
      isDesktop: isDesktop(),
      isTouch: isTouch(),
    };

    // Attempt to load cached user information, and hydrate it if we are the same
    // user
    const userData: UserDataCache = TrelloStorage.get(
      USER_DATA_CACHE_STORAGE_KEY,
    );
    const isUserDataExpired =
      userData && Date.now() - userData.lastUpdated > USER_DATA_CACHE_TIMEOUT;
    const sameUser = userData && userData.key && userData.key === memberId;

    if (userData) {
      if (!isUserDataExpired && sameUser) {
        this.atlassianClientUser = {
          ...this.atlassianClientUser,
          custom: {
            ...this.atlassianClientUser.custom,
            ...userData.data,
          },
        };
      } else {
        TrelloStorage.unset(USER_DATA_CACHE_STORAGE_KEY);
      }
    }
  }

  initializeAtlassianClient() {
    let clientEnv = EnvironmentType.DEV;
    if (environment === 'staging') {
      clientEnv = EnvironmentType.STAGING;
    } else if (environment === 'prod') {
      clientEnv = EnvironmentType.PROD;
    }

    // Poll at 5 minutes in prod, 5 seconds otherwise
    this.pollingInterval =
      clientEnv === EnvironmentType.PROD ? 1000 * 60 * 5 : 5000;

    this.atlassianClient = new AtlassianFeatureFlagClient(
      atlassianFeatureFlagClientKey,
      Analytics,
      this.atlassianClientUser,
      {
        productKey: 'trello',
        environment: clientEnv, // Would be nice if we didn't need to provide this
        pollingInterval: this.pollingInterval,
      },
    );
  }

  constructor() {
    // Create the initial feature flag user
    this.createInitialUser();

    // Initialize the fx3 client
    this.initializeAtlassianClient();
  }

  refineUserData(data: UserData) {
    const cacheData: UserDataCache = {
      lastUpdated: Date.now(),
      key: memberId,
      data,
    };

    TrelloStorage.set(USER_DATA_CACHE_STORAGE_KEY, cacheData);

    return this.atlassianClient.updateFeatureFlagUser({
      ...this.atlassianClientUser,
      custom: {
        ...this.atlassianClientUser.custom,
        ...data,
      },
    });
  }

  get = <T extends SupportedFlagTypes>(key: string, defaultValue: T): T => {
    if (defaultValue === undefined && process.env.NODE_ENV === 'development') {
      console.warn(
        `Flag evaluation now requires a default value as the second argument to .get(). Please ensure a default value as the second argument when evaluating ${key}`,
      );
    }
    const override = this.getOverride(key);

    if (typeof override !== 'undefined') {
      return override as T;
    }

    return this.atlassianClient.getFlagValue(key, defaultValue);
  };

  getTrackedVariation = <T extends SupportedFlagTypes>(
    key: string,
    defaultValue: T,
    attributes?: object,
  ): T => {
    const override = this.getOverride(key);

    if (typeof override !== 'undefined') {
      FeatureFlagClient.triggerExposureEvent(key, override, 'OVERRIDE');
      return override as T;
    }

    const evaluatedFlag = this.atlassianClient.getFlagDetails(
      key,
      defaultValue,
    );
    const value = evaluatedFlag.value;
    const evaluationDetail = evaluatedFlag.evaluationDetail;
    if (evaluationDetail) {
      const kind = evaluationDetail.reason;
      const ruleId = evaluationDetail.ruleId;

      FeatureFlagClient.triggerExposureEvent(
        key,
        value,
        kind,
        ruleId,
        attributes,
      );
    }
    return value;
  };

  all(): FeatureFlagGroups {
    const overrides: FlagSet = TrelloStorage.get(OVERRIDES_STORAGE_KEY) || {};

    // Get the raw flags from atlassianClient
    const atlassianClientFlags = this.atlassianClient.getFlags();

    // Pluck the values off the flags (they come with some additional stuff we don't
    // care about here)
    const remote: FlagSet = {};
    for (const [key, { value }] of Object.entries(atlassianClientFlags)) {
      remote[key] = value;
    }

    return { remote, overrides };
  }

  public static triggerExposureEvent(
    flagKey: string,
    value: SupportedFlagTypes,
    reason: string,
    ruleId?: string,
    attributes?: object,
  ) {
    Analytics.sendTrackEvent({
      source: '@trello/feature-flag-client',
      actionSubject: 'feature',
      action: 'exposed',
      attributes: {
        flagKey,
        reason,
        ruleId,
        value,
        ...attributes,
      },
    });
  }

  private createClientListener(
    key: string,
  ): ChangeListener<SupportedFlagTypes> {
    const clientListener = (
      current: SupportedFlagTypes,
      previous: SupportedFlagTypes,
    ) => {
      if (Object.prototype.hasOwnProperty.call(this.changeListeners, key)) {
        if (typeof this.getOverride(key) === 'undefined') {
          for (const listener of this.changeListeners[key]) {
            listener(current, previous);
          }
        } else {
          console.warn(
            `Ignoring feature flag change event for "${key}" from server due to local override`,
          );
        }
      }
    };

    // @ts-ignore
    return clientListener;
  }

  on = <T extends SupportedFlagTypes>(
    key: string,
    defaultValue: T,
    callback: ChangeListener<T>,
  ) => {
    if (
      typeof defaultValue === 'function' &&
      process.env.NODE_ENV === 'development'
    ) {
      console.warn(
        `Flag subscription now requires a default value as the second argument to .on(). Please ensure a default value as the second argument when subscribing to ${key}`,
      );
    }
    if (Object.prototype.hasOwnProperty.call(this.changeListeners, key)) {
      // @ts-ignore
      this.changeListeners[key].push(callback);
    } else {
      // Create the first change listener
      // @ts-ignore
      this.changeListeners[key] = [callback];

      const unsubscriber = this.atlassianClient.on(
        key,
        defaultValue,
        this.createClientListener(key),
      );
      this.atlassianClientUnsubscribers[key] = unsubscriber;
    }
  };

  off = (key: string, callback: ChangeListener<SupportedFlagTypes>) => {
    if (Object.prototype.hasOwnProperty.call(this.changeListeners, key)) {
      const idx = this.changeListeners[key].indexOf(callback);

      if (idx > -1) {
        this.changeListeners[key].splice(idx, 1);
      }

      if (this.changeListeners[key].length === 0) {
        // Unsubscribe from atlassianClient
        this.atlassianClientUnsubscribers[key]?.();
        delete this.atlassianClientUnsubscribers[key];
      }
    }
  };

  ready = () => {
    return this.atlassianClient.ready();
  };

  private getOverride(key: string): SupportedFlagTypes | undefined {
    const overrides: FlagSet = TrelloStorage.get(OVERRIDES_STORAGE_KEY);
    if (overrides && Object.prototype.hasOwnProperty.call(overrides, key)) {
      return overrides[key];
    }
  }

  setOverride<T extends SupportedFlagTypes>(
    key: string,
    value: T,
    defaultValue: T = value,
  ): void {
    const originalValue = this.get(key, defaultValue);
    const existingOverrides: FlagSet =
      TrelloStorage.get(OVERRIDES_STORAGE_KEY) || {};

    TrelloStorage.set(OVERRIDES_STORAGE_KEY, {
      ...existingOverrides,
      [key]: value,
    });

    if (Object.prototype.hasOwnProperty.call(this.changeListeners, key)) {
      // Call all change listeners for this feature flag
      for (const listener of this.changeListeners[key]) {
        listener(value, originalValue);
      }
    }
  }

  removeOverride<T extends SupportedFlagTypes>(
    key: string,
    defaultValue: T,
  ): void {
    const originalValue = this.get(key, defaultValue);
    const existingOverrides: FlagSet =
      TrelloStorage.get(OVERRIDES_STORAGE_KEY) || {};

    delete existingOverrides[key];

    TrelloStorage.set(OVERRIDES_STORAGE_KEY, existingOverrides);

    if (Object.prototype.hasOwnProperty.call(this.changeListeners, key)) {
      // Call all change listeners for this feature flag
      for (const listener of this.changeListeners[key]) {
        listener(this.get(key, false), originalValue);
      }
    }
  }

  resetOverrides(): void {
    const overrides: FlagSet = TrelloStorage.get(OVERRIDES_STORAGE_KEY) || {};
    TrelloStorage.set(OVERRIDES_STORAGE_KEY, {});

    // Call change listeners for all overrides that were just reset
    Object.entries(overrides).forEach(([key, originalValue]) => {
      if (Object.prototype.hasOwnProperty.call(this.changeListeners, key)) {
        for (const listener of this.changeListeners[key]) {
          listener(this.get(key, false), originalValue);
        }
      }
    });
  }
}

// eslint-disable-next-line @trello/no-module-logic
export const featureFlagClient = new FeatureFlagClient();
