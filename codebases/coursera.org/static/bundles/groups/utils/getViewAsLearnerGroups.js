/**
 * note: this method is imported in the website header so is isolated here to minimize dependencies
 */
import API from 'js/lib/api';
import URI from 'jsuri';
import Q from 'q';

const groupAPI = API('/api/groups.v1/', { type: 'rest' });

export const getViewAsLearnerGroups = (courseId) => {
  const uri = new URI()
    .addQueryParam('q', 'viewableAsLearnerPrivateCommunityGroups')
    .addQueryParam('scopeId', `course~${courseId}`);

  return Q(groupAPI.get(uri.toString())).then((response) => {
    return response.elements.map((group) => ({
      scopeId: group.definition.scopeId.id,
      scopeType: group.definition.scopeId.name,
      isArchived: !!group.definition.archivedAt,
      name: group.definition.name,
      id: group.id,
      slug: group.definition.slug,
    }));
  });
};

export default { getViewAsLearnerGroups };
