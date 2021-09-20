import { useEffect, useState } from 'react';
import { JoinableProductDataProvider, ProductKey, ProductName } from './types';

export const MAX_JOINABLE_PRODUCTS = 3;
export const PRODUCT_NAME_MAP: Record<string, ProductName> = {
  [ProductKey.JIRA_SOFTWARE]: ProductName.JIRA,
  [ProductKey.CONFLUENCE]: ProductName.CONFLUENCE,
};

interface UnwrappedProviderResult {
  cloudId?: string;
  overlappingCollaborators?: string[];
  productName?: ProductName;
  productUrl?: string;
  providerLoading: boolean;
}

/** Unwraps a provider to extract switcher spotlight needed data */
export const useUnwrapProvider = (
  provider: JoinableProductDataProvider,
  skip: boolean,
) => {
  const [response, setResponse] = useState<UnwrappedProviderResult>({
    providerLoading: false,
  });

  useEffect(() => {
    if (skip || !provider?.fetchMethod) {
      setResponse({ providerLoading: false });
      return;
    }

    setResponse({ providerLoading: true });
    const unwrap = async () => {
      try {
        const { sites } = await provider.fetchMethod({});
        const [site] = sites;
        const products = site?.products;

        if (!products) {
          setResponse({ providerLoading: false });
          return;
        }

        // Server only puts one product per site
        const [[joinableProductKey, joinableProduct]] = Object.entries(
          products,
        );

        if (!PRODUCT_NAME_MAP[joinableProductKey]) {
          setResponse({ providerLoading: false });
          return;
        }

        const productName = PRODUCT_NAME_MAP[joinableProductKey];
        const overlappingCollaborators = joinableProduct.collaborators.map(
          ({ id }) => id,
        );
        const { cloudId } = site;
        const { productUrl } = joinableProduct;

        setResponse({
          cloudId,
          overlappingCollaborators,
          productName,
          productUrl,
          providerLoading: false,
        });
      } catch (e) {
        // TODO: Add error analytic
      }
    };

    unwrap();
  }, [provider, skip]);

  return response;
};
