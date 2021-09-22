import Q from 'q';
import API from 'bundles/phoenix/lib/apiWrapper';
import URI from 'jsuri';
import { naptimeForumTypes } from 'bundles/discussions/constants';

const courseForumApi = API('/api/courseForumSearches.v1', { type: 'rest' });
const mentorForumApi = API('/api/mentorForumSearches.v1', { type: 'rest' });
const groupForumApi = API('/api/groupForumSearches.v1', { type: 'rest' });

const profilesFields = ['userId', 'externalUserId', 'fullName', 'photoUrl', 'courseRole'];

const searchFields = ['title', 'content', 'snippet', 'creatorId', 'createdAt', 'parentForumAnswerId'];

const searchFieldsWithIncludes = [...searchFields, `onDemandSocialProfiles.v1(${profilesFields.join(',')})`];

function zeroBaseIndexFromOneBaseIndex(inputNum) {
  return inputNum >= 1 ? inputNum - 1 : 0;
}

const SearchApi = {
  searchFor({ query, filterQueryString, forumType, contextId, forumId, pageNum, includeDeleted }) {
    const uri = new URI()
      .addQueryParam('query', query)
      .addQueryParam('q', 'search')
      .addQueryParam('shouldAggregate', 'true')
      .addQueryParam('includes', 'profiles')
      .addQueryParam('start', zeroBaseIndexFromOneBaseIndex(pageNum)) // the api uses a 0 index, but pagination starts at 1
      .addQueryParam('includeDeleted', includeDeleted ? 'true' : 'false');

    let searchApi;
    let fields;
    if (forumType === naptimeForumTypes.mentorForumType) {
      searchApi = mentorForumApi;
      uri.addQueryParam('mentorForumId', contextId + '~' + forumId);
      fields = [...searchFieldsWithIncludes, 'mentorForumQuestionId', 'mentorForumAnswerId'];
    } else if (forumType === naptimeForumTypes.groupForumType) {
      searchApi = groupForumApi;
      uri.addQueryParam('groupForumId', contextId + '~' + forumId);
      fields = [...searchFieldsWithIncludes, 'groupForumQuestionId', 'groupForumAnswerId'];
    } else {
      searchApi = courseForumApi;
      uri.addQueryParam('courseForumId', contextId + '~' + forumId);
      fields = [...searchFieldsWithIncludes, 'courseForumQuestionId', 'courseForumAnswerId'];
      if (filterQueryString) {
        uri.addQueryParam('sessionFilter', filterQueryString);
      }
    }
    uri.addQueryParam('fields', fields.join(','));
    return Q(searchApi.get(uri.toString()));
  },
};

export default SearchApi;

export const { searchFor } = SearchApi;
