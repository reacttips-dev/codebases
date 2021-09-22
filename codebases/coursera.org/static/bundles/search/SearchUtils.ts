import gql from 'graphql-tag';
import epic from 'bundles/epic/client';
import inServerContext from 'bundles/ssr/util/inServerContext';
import _ from 'lodash';
import {
  INDEX_TYPE_TO_NAME_EXPERIMENT_PARAMETER_NAME,
  ALL_PRODUCTS_INDEX_TYPE,
} from 'bundles/catalog-search/components/algolia/AlgoliaConstants';
import {
  RECENTLY_VIEWED_LOCAL_STORAGE_NAME,
  RECENT_SEARCHES_LOCAL_STORAGE_NAME,
  RECENT_ITEM_NUMBER_OF_DAYS_TO_LAST,
  UCI_APM_IMAGE_URL,
  UCI_APM_OBJECT_ID,
} from 'bundles/search/SearchConstants';
import localStorageEx from 'bundles/common/utils/localStorageEx';

import {
  CollectionRecommendations,
  BrowseCollectionsV1Course,
  BrowseCollectionsV1S12n,
  BrowseCollectionsV1Entry,
} from 'bundles/search/types/collection-recommendation';
import { Hits, UserSearch, Viewed, RecentlyViewed } from 'bundles/search/types/autocomplete';

export const ALGOLIA_PROD_RESULTS_INDEX = 'prod_all_launched_products_term_optimization';
export const ALGOLIA_PROD_RESULTS_WITH_GROUPING_INDEX = 'prod_all_products_term_optimization_grouping';
export const ALGOLIA_PROD_COURSE_CATALOG = 'prod_course_catalog';
export const COURSE_CATALOG_QUERY = 'course catalog';

export const pickOnlyKeysWithValues = (refinementsObj: Record<string, string | string[]>) =>
  _.pickBy(refinementsObj, (value) => value !== '');

export const getIndexTypeToNameMap = (): Record<string, string> =>
  epic.get('GrowthDiscovery', INDEX_TYPE_TO_NAME_EXPERIMENT_PARAMETER_NAME);

export const getAllTabIndexName = () => getIndexTypeToNameMap()?.all ?? ALGOLIA_PROD_RESULTS_INDEX;

export const getNumberOfSearchResults = (
  currentTab: string,
  allSearchResults: Record<string, { nbHits: number }>,
  courseCatalog = ''
) => {
  const indexTypeToNameMap = getIndexTypeToNameMap();
  let indexName = currentTab === ALL_PRODUCTS_INDEX_TYPE ? getAllTabIndexName() : indexTypeToNameMap[currentTab];
  if (courseCatalog.toLowerCase() === COURSE_CATALOG_QUERY) {
    indexName = ALGOLIA_PROD_COURSE_CATALOG;
  }
  return allSearchResults[indexName]?.nbHits;
};

// TODO(htran) remove after UCI APM Contentful migration is done in GNG-1259
export const getSearchCardImageUrl = (hit?: {
  objectID: string;
  imageUrl?: string;
  partnerLogos?: Array<string>;
}): string => {
  if (!hit) {
    return '';
  } else if (hit.objectID === UCI_APM_OBJECT_ID) {
    return UCI_APM_IMAGE_URL;
  } else {
    const productImage = hit?.imageUrl || '';

    // If image is a gif it is detrimental to performance, serve the partner logo instead.
    if (/\.gif/.test(productImage)) {
      return hit?.partnerLogos ? hit.partnerLogos[0] : productImage;
    } else {
      return productImage;
    }
  }
};

export const getUserLanguageRoot = () => {
  if (!inServerContext) {
    let userLanguage = navigator ? navigator.language : undefined;
    userLanguage = userLanguage?.split('-')[0];
    return userLanguage;
  }
  return undefined;
};

export function getItemsListFromLocalStorageByKeyAndTrimOutdated(
  keyName: typeof RECENT_SEARCHES_LOCAL_STORAGE_NAME
): string[];

export function getItemsListFromLocalStorageByKeyAndTrimOutdated(
  keyName: typeof RECENTLY_VIEWED_LOCAL_STORAGE_NAME
): Viewed[];

export function getItemsListFromLocalStorageByKeyAndTrimOutdated(keyName: string): string[] | Viewed[] {
  if (!inServerContext && localStorageEx.isAvailable()) {
    const localStorageItems: RecentlyViewed[] = localStorageEx.getItem(keyName, JSON.parse, []);
    const now = new Date();
    const filteredLocalStorageItems = localStorageItems.filter((item: RecentlyViewed) => {
      const dateSaved = new Date(item.dateSaved);
      const millisecondsPerDay = 1000 * 60 * 60 * 24;
      return (
        dateSaved && (now.getTime() - dateSaved.getTime()) / millisecondsPerDay < RECENT_ITEM_NUMBER_OF_DAYS_TO_LAST
      );
    });

    localStorageEx.setItem(keyName, filteredLocalStorageItems, JSON.stringify);
    return filteredLocalStorageItems.map((item: RecentlyViewed) => item.suggestion);
  } else {
    return [];
  }
}

export const saveUserSearch = (searchTerm: string) => {
  const recentSearches = getItemsListFromLocalStorageByKeyAndTrimOutdated(RECENT_SEARCHES_LOCAL_STORAGE_NAME);
  // As an UX optimization we don't add duplicates & empty space
  const trimmedSearchTerm = searchTerm.trim();
  const elementIndex = recentSearches.findIndex((storedItem) => storedItem === trimmedSearchTerm);
  if (elementIndex !== -1) {
    recentSearches.splice(elementIndex, 1);
  }
  if (!inServerContext && trimmedSearchTerm && localStorageEx.isAvailable()) {
    recentSearches.unshift(searchTerm);
    const now = new Date();
    const recentSearchesWithTimestamp: UserSearch[] = recentSearches.map((suggestion: string) => ({
      suggestion,
      dateSaved: now,
    }));
    localStorageEx.setItem(RECENT_SEARCHES_LOCAL_STORAGE_NAME, recentSearchesWithTimestamp, JSON.stringify);
  }
};

export const saveRecentlyViewed = ({
  name,
  slug,
  path,
  imageIconWithSize,
  partnerName,
}: {
  name: string;
  slug?: string;
  path: string;
  imageIconWithSize: {
    imageUrl: string;
    size: number;
  };
  partnerName?: string;
}) => {
  if (!inServerContext && localStorageEx.isAvailable()) {
    const recentlyViewed = getItemsListFromLocalStorageByKeyAndTrimOutdated(RECENTLY_VIEWED_LOCAL_STORAGE_NAME);
    const elementIndex = recentlyViewed.findIndex((storedItem: Viewed) => storedItem.name === name);
    if (elementIndex !== -1) {
      recentlyViewed.splice(elementIndex, 1);
    }
    recentlyViewed.unshift({ name, slug, path, image: imageIconWithSize, partnerName: partnerName || null });
    const now = new Date();
    const recentlyViewedWithTimestamp = recentlyViewed.map((suggestion: Viewed) => ({ suggestion, dateSaved: now }));
    localStorageEx.setItem(RECENTLY_VIEWED_LOCAL_STORAGE_NAME, recentlyViewedWithTimestamp, JSON.stringify);
  }
};

export const combineCourseAndS12nData = (recommendationsData?: CollectionRecommendations) => {
  if (!recommendationsData || _.isEmpty(recommendationsData)) return [];
  const { courses, s12ns, rankedRecommendations } = recommendationsData;

  const courseItems =
    (courses &&
      courses.map((course: BrowseCollectionsV1Course, itemPosition: number) => ({
        id: course.id,
        objectID: `course~${course.id}`,
        name: course.name,
        rating: course.courseDerivatives && course.courseDerivatives.averageFiveStarRating,
        tagline: _.truncate(course.description, { length: 300 }),
        partners: [course.partners?.elements[0]?.name],
        partnerLogos: [course.partners?.elements[0]?.squareLogo],
        objectUrl: `/learn/${course.slug}`,
        imageUrl: course.photoUrl,
        indexPosition: 1,
        hitPosition: itemPosition,
      }))) ||
    [];
  const s12nItems =
    (s12ns &&
      s12ns.map((s12n: BrowseCollectionsV1S12n, itemPosition: number) => ({
        id: s12n.id,
        objectID: `s12n~${s12n.id}`,
        name: s12n.name,
        rating: s12n.derivative && s12n.derivative.averageFiveStarRating,
        tagline: _.truncate(s12n.description, { length: 300 }),
        partners: [s12n.partners?.elements[0]?.name],
        partnerLogos: [s12n.partners?.elements[0]?.squareLogo],
        objectUrl: `/specializations/${s12n.slug}`,
        imageUrl: s12n.photoUrl,
        indexPosition: 1,
        hitPosition: itemPosition,
      }))) ||
    [];

  // This is done to return the merged results in the order that the collection recommendations was returned as
  const combinedData = (rankedRecommendations || []).map((rankedRecommendation: BrowseCollectionsV1Entry) =>
    [...courseItems, ...s12nItems].find((item) => item.id === rankedRecommendation.id)
  );

  return combinedData;
};

export const getS12nData = (recommendationsData?: CollectionRecommendations) => {
  if (!recommendationsData || _.isEmpty(recommendationsData)) return [];
  const { s12ns, rankedRecommendations } = recommendationsData;
  const s12nItems =
    (s12ns &&
      s12ns.map((s12n: BrowseCollectionsV1S12n, itemPosition: number) => ({
        id: s12n.id,
        objectID: `s12n~${s12n.id}`,
        name: s12n.name,
        rating: s12n.derivative && s12n.derivative.averageFiveStarRating,
        tagline: _.truncate(s12n.description, { length: 300 }),
        partners: [s12n.partners?.elements[0]?.name],
        partnerLogos: [s12n.partners?.elements[0]?.squareLogo],
        objectUrl: `/specializations/${s12n.slug}`,
        imageUrl: s12n.photoUrl,
        indexPosition: 1,
        hitPosition: itemPosition,
      }))) ||
    [];

  // This is done to return the results in the order that the collection recommendations was returned as
  const s12nData = (rankedRecommendations || []).map((rankedRecommendation: BrowseCollectionsV1Entry) =>
    [...s12nItems].find((item) => item.id === rankedRecommendation.id)
  );

  return s12nData;
};

const CourseFragment = gql`
  fragment CourseFragment on CoursesV1 {
    id
    slug
    photoUrl
    description
    name
    courseDerivatives {
      id
      averageFiveStarRating
    }
    partners {
      elements {
        id
        name
        squareLogo
      }
    }
  }
`;

const S12nFragment = gql`
  fragment S12nFragment on OnDemandSpecializationsV1 {
    id
    slug
    photoUrl: logo
    description
    derivative {
      id
      averageFiveStarRating
    }
    name
    partners {
      elements {
        id
        name
        squareLogo
      }
    }
  }
`;

export const CollectionRecommendationsQuery = gql`
  query CollectionRecommendationsQuery($contextType: String!, $contextId: String!, $numEntriesPerCollection: Int) {
    BrowseCollectionsV1Resource {
      byCollections(
        contextType: $contextType
        contextId: $contextId
        numEntriesPerCollection: $numEntriesPerCollection
      ) {
        elements {
          id
          entries {
            id
          }
          courses {
            elements {
              ...CourseFragment
            }
          }
          s12ns {
            elements {
              ...S12nFragment
            }
          }
        }
      }
    }
  }
  ${CourseFragment}
  ${S12nFragment}
`;

export const getDataToTrackFromHit = (hit: Hits) => {
  const { indexPosition, hitPosition, indexName, objectID } = hit;
  return { indexPosition, hitPosition, indexName, objectID };
};

export const getNameFromDomainOrSubdomainId = (id: string) => {
  const name = id
    .split('-')
    .map((word: string) => word[0].toUpperCase() + word.substring(1))
    .join(' ');
  return name;
};
