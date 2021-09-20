import { uniqueId } from 'underscore';
import { Analytics, getScreenFromUrl } from '@trello/atlassian-analytics';

import { resolveResourceUrls, getProviders } from './requests';
import {
  URL,
  ResolveResponse,
  ResolvedURL,
  BatchResolveResponse,
  ResolveResponseCacheEntry,
  QueuedFetch,
  ProviderResponse,
  ObjectResolverProvider,
} from './types';

// This is a hard limit on the batch API.
const MAX_URLS_PER_BATCH = 50;
// Object resolver service uses Forge to resolve third party URLs - a user
// may only run 100 concurrent Forge requests (they use lambda) before they are
// limited.
const MAX_CONCURRENT_URLS = 100;
// Time to debounce fetches while `resolveUrl` is called.
const DEBOUNCE_FETCH_MS = 100;
// Time to keep resolved URLs in the cache.
// Note: the cache also caches negative hits (nulls).
const RESOLVE_CACHE_EXPIRY_MS = 15 * 60 * 1000; // 15 mins

interface Options {
  // Allows seeding unformatted providers for testing
  providers?: ProviderResponse[];
  maxUrlsPerBatch?: number;
  maxConcurrentUrls?: number;
  resolve?: (resourceUrls: string[]) => Promise<BatchResolveResponse[]>;
}

interface ResolveUrlOptions {
  sourceComponent?:
    | 'friendly-links'
    | 'attachments'
    | 'link-card'
    | 'atlaskit-smart-card';
  forceFetch?: boolean;
}

export class ObjectResolverClient {
  private isEnabled: boolean = true;
  private resolveCache: Map<URL, ResolveResponseCacheEntry> = new Map();
  private seedProviders: ProviderResponse[] | undefined;
  private providers: Promise<ObjectResolverProvider[]>;
  private maxUrlsPerBatch: number;
  private maxConcurrentUrls: number;
  private inFlightResolutions: number;
  private inFlightRequests: Map<string, Promise<BatchResolveResponse[]>>;
  private resolve: (resourceUrls: string[]) => Promise<BatchResolveResponse[]>;
  private getProvidersPromise: Promise<ProviderResponse[]> | undefined;

  constructor({
    providers,
    maxUrlsPerBatch = MAX_URLS_PER_BATCH,
    maxConcurrentUrls = MAX_CONCURRENT_URLS,
    resolve = resolveResourceUrls,
  }: Options = {}) {
    this.seedProviders = providers;
    this.maxUrlsPerBatch = maxUrlsPerBatch;
    this.maxConcurrentUrls = maxConcurrentUrls;
    this.inFlightResolutions = 0;
    this.inFlightRequests = new Map();
    this.resolve = resolve;
  }

  private async formatProviders(): Promise<ObjectResolverProvider[]> {
    let providers = this.seedProviders;
    if (!this.seedProviders) {
      try {
        if (!this.getProvidersPromise) {
          this.getProvidersPromise = getProviders();
        }
        providers = await this.getProvidersPromise;
      } catch (e) {
        // Disable the object-resolver if we can't fetch providers, maybe the
        // account is not Aa, doesn't have an active session, or the service is
        // down.
        this.isEnabled = false;
        return [];
      }
    }

    // Pre-compile the regexes, so matching is faster
    return (providers ?? []).map((provider) => {
      const objectResolverProvider = {
        key: provider.key,
        patterns: provider.patterns.map(
          (pattern) => new RegExp(pattern.source, pattern.flags),
        ),
        fetchQueue: new Map<URL, QueuedFetch[]>(),
      };

      // Add a catch-all regex to the iframely provider - all non-provider links
      // are sent to iframely by ORS now, and we want to preserve our
      // per-provider batching. Ideally, ORS would just include this regex in
      // the providers response, but at the time of writing, they do not.
      if (provider.key === 'iframely-object-provider') {
        objectResolverProvider.patterns.push(
          new RegExp('^https?:\\/\\/.*\\.([A-Za-z0-9_-]+)(\\/?$|\\/.*)', ''),
        );
      }

      return objectResolverProvider;
    });
  }

  private async getProvider(
    url: URL,
  ): Promise<ObjectResolverProvider | undefined> {
    if (!this.providers) {
      this.providers = this.formatProviders();
    }
    const providers = await this.providers;
    return providers.find(({ patterns }) =>
      patterns.some((regex) => regex.test(url)),
    );
  }

  private scheduleFetch(provider: ObjectResolverProvider) {
    provider.nextFetch = setTimeout(
      () => this.batchFetch(provider),
      DEBOUNCE_FETCH_MS,
    );
  }

  /**
   * Makes a request to the object-resolver-serivce when there is room to make
   * the request based on currently in-flight URL resolutions.
   */
  private async makeBatchFetchRequest(
    resourceUrls: string[],
    providerKey: string = '',
  ): Promise<BatchResolveResponse[]> {
    const requiredHeadroom = resourceUrls.length;

    if (requiredHeadroom > this.maxConcurrentUrls) {
      throw new Error('Required headroom will never be available');
    }
    if (this.inFlightResolutions + requiredHeadroom > this.maxConcurrentUrls) {
      await Promise.race(Array.from(this.inFlightRequests.values()));
      return this.makeBatchFetchRequest(resourceUrls, providerKey);
    }
    this.inFlightResolutions += requiredHeadroom;
    const requestId = uniqueId();
    try {
      const start = Date.now();
      const req = this.resolve(resourceUrls);
      this.inFlightRequests.set(requestId, req);
      const res = await req;
      this.trackRequestCompleted(providerKey, start, requiredHeadroom);
      return res;
    } finally {
      this.inFlightRequests.delete(requestId);
      this.inFlightResolutions -= requiredHeadroom;
    }
  }

  private async batchFetch(provider: ObjectResolverProvider) {
    provider.nextFetch = undefined;

    // Copy queue up front, in case new URLs are queued in-flight.
    const queue = new Map<URL, QueuedFetch[]>(provider.fetchQueue);
    provider.fetchQueue.clear();

    const resourceUrls = [...queue.keys()];
    let batchResponse: BatchResolveResponse[];
    try {
      batchResponse = await this.makeBatchFetchRequest(
        resourceUrls,
        provider.key,
      );
      // Do a sanity check on the response; we should always get back a
      // response with one entry for each url we requested to unfurl.
      if (resourceUrls.length !== batchResponse.length) {
        throw new Error('Unexpected response length');
      }
    } catch (e) {
      // This means the batch request failed for some reason - we're going
      // to empty the fetch queue, so we don't keep retrying endlessly with
      // the same URLs, in case there's a "poison pill" URL.
      queue.forEach((promises) => promises.forEach(({ reject }) => reject()));
      this.trackRequestError(provider, e.message);
      return;
    }

    // ES6 Map iterators don't include index.
    let i = 0;
    queue.forEach((promises) => {
      const response = batchResponse[i];
      if (response.status === 200 && response.body) {
        promises.forEach(({ resolve }) => resolve(response.body));
      } else {
        promises.forEach(({ reject }) => reject());
      }
      i++;
    });
  }

  async queueFetch(provider: ObjectResolverProvider, url: URL): ResolvedURL {
    return new Promise((resolve, reject) => {
      if (provider.nextFetch) {
        clearTimeout(provider.nextFetch);
      }

      // The fetchQueue may contain fetches for the same URL multiple times
      // This can happen if the same URL is for example in a card comment
      // and also attached to a card (multiple places want to unfurl the same
      // thing). We only want to send the URL to the object-resolver service
      // once though, so dedupe fetchQueue, while ensuring we still resolve
      // all the promises.
      const queueEntry = provider.fetchQueue.get(url);
      if (queueEntry) {
        queueEntry.push({ resolve, reject });
      } else {
        provider.fetchQueue.set(url, [{ resolve, reject }]);
      }

      if (provider.fetchQueue.size < this.maxUrlsPerBatch) {
        this.scheduleFetch(provider);
      } else {
        // If we're at the limit, immediately run the fetch to flush the queue
        this.batchFetch(provider);
      }
    });
  }

  private async _resolveUrl(
    url: URL,
    options: ResolveUrlOptions = {},
  ): ResolvedURL {
    const provider = await this.getProvider(url);
    if (!provider) {
      return null;
    }

    try {
      const resolvedUrl = await this.queueFetch(provider, url);

      // Remove updated and created dates from the resolved object so that the Smart Card won't show
      // untranslated text in the byline.
      if (resolvedUrl?.data.updated) {
        delete resolvedUrl.data.updated;
      }

      if (resolvedUrl?.data['schema:dateCreated']) {
        delete resolvedUrl.data['schema:dateCreated'];
      }

      this.resolveCache.set(url, {
        response: resolvedUrl,
        timestamp: Date.now(),
        providerKey: provider.key,
      });
      return resolvedUrl;
    } catch (e) {
      this.resolveCache.set(url, {
        response: null,
        timestamp: Date.now(),
        providerKey: provider.key,
      });
      return null;
    }
  }

  expireResolveCache(now: number): void {
    this.resolveCache.forEach((entry, key) => {
      if (entry.timestamp + RESOLVE_CACHE_EXPIRY_MS < now) {
        this.resolveCache.delete(key);
      }
    });
  }

  async resolveUrl(url: URL, options: ResolveUrlOptions = {}): ResolvedURL {
    if (!this.isEnabled) {
      return null;
    }
    const start = Date.now();
    this.expireResolveCache(start);

    let resolvedUrl = null;
    let cached = false;

    const { sourceComponent, forceFetch } = options;

    const cachedResolve = forceFetch ? undefined : this.resolveCache.get(url);

    if (cachedResolve) {
      resolvedUrl = cachedResolve.response;
      cached = true;
    } else {
      resolvedUrl = await this._resolveUrl(url, options);
    }
    if (resolvedUrl?.data?.name) {
      this.trackUrlResolved({
        resolvedUrl,
        cached,
        start,
        sourceComponent,
      });
    } else if (this.shouldTrackUnresolved(resolvedUrl?.data?.generator?.name)) {
      this.trackUrlResolved({
        resolvedUrl,
        cached,
        start,
        sourceComponent,
        action: 'unresolved',
      });
    }

    // This is a temporary hack fix the inconsistent in confluence visibility problem
    // this will be removed once the backend returns the expected visibility.
    // When jira link is direct access or request access permission, the visibility
    // will be restricted. However, for confluence it returns not_found which causes the
    // media smart card unable to render it correctly
    const urlMeta = resolvedUrl?.meta;
    if (
      urlMeta?.definitionId === 'confluence-object-provider' &&
      urlMeta?.access === 'forbidden' &&
      urlMeta?.requestAccess?.accessType
    ) {
      urlMeta.visibility = 'restricted';
    }

    return resolvedUrl;
  }

  isCached(url: URL): boolean {
    return this.resolveCache.has(url);
  }

  private shouldTrackUnresolved(application: string | undefined): boolean {
    return (
      application === 'Jira' ||
      application === 'Confluence' ||
      application === 'Bitbucket'
    );
  }

  private trackUrlResolved({
    resolvedUrl,
    cached,
    start,
    sourceComponent,
    action = 'resolved',
  }: {
    resolvedUrl: ResolveResponse | null;
    cached: boolean;
    start: number;
    sourceComponent?: ResolveUrlOptions['sourceComponent'];
    action?: 'resolved' | 'unresolved';
  }) {
    const smartLinkCohort =
      resolvedUrl?.meta?.requestAccess
        ?.smartLinksAccessMetadataExperimentCohort;
    const cloudId = resolvedUrl?.meta?.requestAccess?.cloudId;
    Analytics.sendOperationalEvent({
      action,
      actionSubject: 'url',
      actionSubjectId: 'objectResolverClient',
      source: getScreenFromUrl(),
      attributes: {
        timing: Date.now() - start,
        cached,
        urlType: resolvedUrl?.data?.generator?.name,
        sourceComponent,
        urlAccess: resolvedUrl?.meta?.access,
        accessType: resolvedUrl?.meta?.requestAccess?.accessType,
        resourceType: resolvedUrl?.meta?.resourceType,
        visibility: resolvedUrl?.meta?.visibility,
        smartLinkCohort,
        cloudId,
        providerKey: resolvedUrl?.meta?.key || resolvedUrl?.meta?.definitionId,
      },
    });
  }

  private trackRequestCompleted(
    providerKey: string,
    start: number,
    queueSize: number,
  ) {
    Analytics.sendOperationalEvent({
      action: 'completed',
      actionSubject: 'request',
      actionSubjectId: 'objectResolverClient',
      source: getScreenFromUrl(),
      attributes: {
        timing: Date.now() - start,
        provider: providerKey,
        queueSize,
      },
    });
  }

  private trackRequestError(provider: ObjectResolverProvider, error: string) {
    Analytics.sendOperationalEvent({
      action: 'errored',
      actionSubject: 'request',
      actionSubjectId: 'objectResolverClient',
      source: getScreenFromUrl(),
      attributes: {
        error,
        provider: provider.key,
      },
    });
  }
}

// eslint-disable-next-line @trello/no-module-logic
export const objectResolverClient = new ObjectResolverClient();
