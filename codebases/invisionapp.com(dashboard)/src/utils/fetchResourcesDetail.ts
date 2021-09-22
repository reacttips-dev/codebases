import fetchSpacesIds from "./fetchSpacesIds";
import fetchProjectsIds from "./fetchProjectsIds";
import fetchFreehandMetadata from "./fetchFreehandMetadata";

import {
  ISearchResource,
  ISearchFreehandMetadata,
  ISearchIndexedFreehandMetadata,
} from "../types/SearchResults/ISearchResource";

const fetchResourcesDetail = async (resources?: Array<ISearchResource>) => {
  if (!resources || resources.length === 0) {
    return {
      resources: [],
      fetchSpacesIdsRequestTime: 0,
      fetchFreehandMetadataRequestTime: 0,
    };
  }

  const freehandDocumentIds = resources.reduce(
    (queries: Array<Array<string>>, resource) => {
      if (resource.resourceType === "freehand") {
        queries.push(["ids", resource.id]);
      }
      return queries;
    },
    []
  );

  let spaceIds: Array<string> = [];
  let projectIds: Array<string> = [];

  const filterByType = (
    resourceType: string,
    resources: Array<ISearchResource>
  ) => {
    return resources
      .filter(
        (resource) =>
          resource && resource.id && resource?.resourceType === resourceType
      )
      .map((resource) => resource?.id);
  };

  if (resources && resources.length > 0) {
    spaceIds = filterByType("space", resources);
    projectIds = filterByType("project", resources);
  }

  const fetchFreehandMetadataPromise =
    freehandDocumentIds.length > 0
      ? fetchFreehandMetadata(freehandDocumentIds)
      : Promise.resolve({ requestTime: 0 });

  const fetchSpaceIdsPromise =
    spaceIds.length > 0
      ? fetchSpacesIds(spaceIds)
      : Promise.resolve({ requestTime: 0 });

  const fetchProjectsIdsPromise =
    projectIds.length > 0
      ? fetchProjectsIds(projectIds)
      : Promise.resolve({ requestTime: 0 });

  return Promise.all([
    fetchSpaceIdsPromise,
    fetchProjectsIdsPromise,
    fetchFreehandMetadataPromise,
  ])
    .then(([spacesIdsData, projectsIdsData, freehandMetadataData]) => {
      let updatedResources: Array<ISearchResource> = resources;

      const spacesIdsDetails = spacesIdsData?.data || {};
      const projectsIdsDetails = projectsIdsData?.data || {};
      let indexedFreehandMetadata = {};
      if (freehandMetadataData?.documents) {
        indexedFreehandMetadata = freehandMetadataData?.documents.reduce(
          (
            indexed: ISearchIndexedFreehandMetadata,
            item: ISearchFreehandMetadata
          ) => {
            return {
              [item.id]: item,
              ...indexed,
            };
          },
          {}
        );
      }

      // If we have space details, update the resources. Otherwise return the original.
      if (
        Object.keys(spacesIdsDetails).length > 0 ||
        Object.keys(projectsIdsDetails).length > 0 ||
        Object.keys(indexedFreehandMetadata).length > 0
      ) {
        updatedResources = resources.map<ISearchResource>((resource) => {
          // Push in spaces details data
          if (spacesIdsDetails && spacesIdsDetails[resource.id]) {
            resource.documentCount =
              spacesIdsDetails[resource.id].documentCount;
          }

          // Push in projects details data
          if (projectsIdsDetails && projectsIdsDetails[resource.id]) {
            resource.documentCount =
              projectsIdsDetails[resource.id].documentCount;
          }

          // Push in freehand metadata data
          if (indexedFreehandMetadata && resource.resourceType === "freehand") {
            resource.freehandMetadata =
              indexedFreehandMetadata[
                resource.id as keyof typeof indexedFreehandMetadata
              ];
          }
          return resource;
        });
      }

      return {
        fetchSpacesIdsRequestTime:
          spacesIdsData?.requestTime !== undefined
            ? spacesIdsData.requestTime
            : -1,
        fetchProjectsIdsRequestTime:
          projectsIdsData?.requestTime !== undefined
            ? projectsIdsData.requestTime
            : -1,
        fetchFreehandMetadataRequestTime:
          freehandMetadataData?.requestTime !== undefined
            ? freehandMetadataData.requestTime
            : -1,
        resources: updatedResources,
      };
    })
    .catch((error) => {
      return {
        error,
        resources: [],
        fetchSpacesIdsRequestTime: -1,
        fetchProjectsIdsRequestTime: -1,
        fetchFreehandMetadataRequestTime: -1,
      };
    });
};

export default fetchResourcesDetail;
