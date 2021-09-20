import { Client, ResolveResponse, APIError } from '@atlaskit/smart-card';
import { SharedState } from '@trello/shared-state';
import { objectResolverClient } from '../object-resolver-client';

class TrelloSmartCardClient extends Client {
  private unauthorizedUrls: Set<string> = new Set();
  public authorizedProviders = new SharedState<Set<string>>(new Set());

  // We don't need prefetching since we already do it manually in LinkCard.
  public async prefetchData() {
    return undefined;
  }

  public async fetchData(url: string) {
    const resolvedObject = await objectResolverClient.resolveUrl(url, {
      forceFetch: this.unauthorizedUrls.has(url),
      sourceComponent: 'link-card',
    });

    if (!resolvedObject) {
      throw new APIError(
        'error',
        '',
        'Could not resolve URL.',
        'ResolveUnsupportedError',
      );
    }

    if (resolvedObject.meta.access === 'unauthorized') {
      this.unauthorizedUrls.add(url);
    } else {
      if (this.unauthorizedUrls.has(url)) {
        this.unauthorizedUrls.delete(url);
      }

      if (
        !this.authorizedProviders.value.has(resolvedObject.meta.definitionId)
      ) {
        this.authorizedProviders.setValue((prevValue) => {
          const newValue = new Set(prevValue);
          newValue.add(resolvedObject.meta.definitionId);
          return newValue;
        });
      }
    }

    // TODO: we need to consolidate ResolveResponse and ResolvedURL types.
    return (resolvedObject as unknown) as ResolveResponse;
  }
}

// eslint-disable-next-line @trello/no-module-logic
export const smartCardClient = new TrelloSmartCardClient();
