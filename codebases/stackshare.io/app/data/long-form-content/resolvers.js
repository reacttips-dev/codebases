import {stackDecision, toolSearch, topicSearch, siteSearch} from '../shared/resolvers';
export default searchIndex => {
  return {
    ...stackDecision,
    Query: {
      ...siteSearch(searchIndex),
      ...toolSearch(searchIndex),
      ...topicSearch(searchIndex)
    }
  };
};
