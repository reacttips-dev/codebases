/* eslint-disable @trello/disallow-filenames */
import {
  createJoinableSitesProvider,
  DataProvider,
} from '@atlaskit/atlassian-switcher';

export enum ProductKey {
  CONFLUENCE = 'confluence.ondemand',
  JIRA_SOFTWARE = 'jira-software.ondemand',
}

export enum ProductName {
  JIRA = 'Jira',
  CONFLUENCE = 'Confluence',
}
export interface JoinableSiteUser {
  id: string;
  accountId: string;
  avatarUrl: string;
  displayName: string;
}

export interface JoinableProductDetails {
  collaborators: JoinableSiteUser[];
  productUrl: string;
}

export interface JoinableProductsWithProductUrl {
  [key: string]: JoinableProductDetails;
}

export interface JoinableSiteProduct {
  cloudId: string;
  resourceId?: string;
  displayName: string;
  url: string;
  avatarUrl?: string;
  relevance?: number;
  products: JoinableProductsWithProductUrl;
  userAccessLevel?: string;
  roleAri?: string;
  isInternalProductRecommendation?: boolean;
}

export interface JoinableSiteProductsRequest {
  products: {
    productKeys: string[];
    accessType: string[];
  };
  collaborators: {
    userIds: string[];
  };
  context: {
    product: string;
    experience: string;
  };
}

export interface JoinableSiteProductsResponse {
  sites: JoinableSiteProduct[];
}

export interface JoinableProductsRequestPayload {
  collaborators: string[];
  products: ProductKey[];
}

export type JoinableProductDataProvider = DataProvider<JoinableSiteProductsResponse>;

/** CACHE TYPES  */

export type CachedJoinableProductDetails = Omit<
  JoinableProductDetails,
  'collaborators'
> & {
  collaborators: { [collaboratorAaId: string]: string };
};

export interface CachedJoinableProductsWithProductUrl {
  [key: string]: CachedJoinableProductDetails;
}

export type CachedJoinableSiteProduct = Omit<
  JoinableSiteProduct,
  'products'
> & {
  products: CachedJoinableProductsWithProductUrl;
};

export interface CachedBoardProduct {
  productUrl: string;
  relevance: number;
}

export interface CachedBoardInfo {
  joinableProducts: CachedBoardProduct[];
  collaboratorStamp: string;
  invalidated?: boolean;
  lastCached?: number;
}

export interface LastVisitedBoard {
  id: string | null;
  collaboratorStamp: string | null;
}
export interface JoinableSiteProductsCache {
  boards: {
    [boardId: string]: CachedBoardInfo;
  };
  collaborators: {
    [collaboratorAaId: string]: JoinableSiteUser;
  };
  sites: {
    [siteProductUrl: string]: CachedJoinableSiteProduct;
  };
  optimisticCardDismiss?: boolean;
  featureExposed: boolean;
  lastVisitedBoard: LastVisitedBoard;
  version: 1;
}

export type JoinableSitesDataProvider =
  | ReturnType<typeof createJoinableSitesProvider>
  | undefined;
export interface CollaboratorMap {
  [aaId: string]: JoinableSiteUser;
}

/**
 * New Joinable Sites API Response
 *
 * See
 * https://sourcegraph-frontend.internal.shared-prod.us-west-2.kitt-inf.net/bitbucket.org/atlassian/xflow/-/blob/lib/modules/joinable-products/types.ts#L52
 * https://hello.atlassian.net/wiki/spaces/PGT/pages/1047421988/Cross-join+Recommendations+-+API+Design#Response
 * for Types
 */

export interface JoinableSitesProductResponse {
  joinableProducts: JoinableProductsResult[];
}

export interface JoinableProductsResult {
  ari: string;
  cloudId?: string;
  siteUrl: string;
  displayName: string;
  productKey: string;
  avatarUrl: string;
  productUrl: string;
  collaborators?: UserProfile[];
  accessType: string;
  relevance: number;
}

export interface UserProfile {
  userId: string;
  displayName?: string;
  avatarUrl?: string;
}
