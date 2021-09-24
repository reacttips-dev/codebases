import {
  stackDecision,
  toolSearch,
  topicSearch,
  companySearch,
  siteSearch
} from '../shared/resolvers';
export default (searchIndex, topicIndex) => {
  return {
    ...stackDecision,
    Query: {
      ...siteSearch(searchIndex),
      ...toolSearch(searchIndex),
      ...topicSearch(topicIndex),
      ...companySearch(searchIndex)
    }
  };
};
