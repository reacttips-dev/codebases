import Q from 'q';
import API from 'js/lib/api';
import URI from 'jsuri';
import type AuthoringCourseBranch from 'bundles/author-common/models/AuthoringCourseBranch';
import type { ConflictMetadata } from 'bundles/author-branches/types/BranchProperties';

const authoringBranchPropertiesAPI = API('/api/authoringBranchProperties.v1/', {
  type: 'rest',
});

const BranchPropertiesApiUtils = {
  getBranchProperties(branchId: string) {
    const uri = new URI(branchId).addQueryParam('fields', 'properties,conflictMetadata');

    return Q(authoringBranchPropertiesAPI.get(uri.toString()));
  },

  getBranchPropertiesByCourse(courseId: string) {
    const uri = new URI()
      .addQueryParam('q', 'course')
      .addQueryParam('courseId', courseId)
      .addQueryParam('fields', 'properties,conflictMetadata');

    return Q(authoringBranchPropertiesAPI.get(uri.toString()));
  },

  updateBranchProperties(branchId: string, properties: AuthoringCourseBranch, conflictMetadata: ConflictMetadata) {
    const data = {
      properties,
      conflictMetadata,
    };

    const uri = new URI(branchId).addQueryParam('fields', 'properties,conflictMetadata');

    return Q(authoringBranchPropertiesAPI.put(uri.toString(), { data }));
  },
};

export default BranchPropertiesApiUtils;

export const { getBranchProperties, getBranchPropertiesByCourse, updateBranchProperties } = BranchPropertiesApiUtils;
