import {stackDecision, siteSearch} from '../shared/resolvers';
export default searchIndex => {
  return {
    ...stackDecision,
    Query: {
      ...siteSearch(searchIndex)
    }
  };
};
