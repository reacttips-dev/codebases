import {flattenEdges} from '../../shared/utils/graphql';

export const toolFooterPresenter = tool => {
  const similarTools = flattenEdges(tool.footerAlternateTools);
  const newTools = flattenEdges(tool.footerNewTools);
  const topTools = flattenEdges(tool.footerTopTools);
  const trendingComparisons = flattenEdges(tool.footerRelatedStackups);
  let footerColumns = [];
  if (similarTools.length !== 0) {
    footerColumns.push({title: 'Similar Tools', items: similarTools});
  }
  if (newTools.length !== 0) {
    footerColumns.push({title: 'New Tools', items: newTools});
  }
  if (topTools.length !== 0) {
    footerColumns.push({title: 'Top Tools', items: topTools});
  }
  if (trendingComparisons.length !== 0) {
    footerColumns.push({title: 'Trending Comparisons', items: trendingComparisons});
  }
  return footerColumns;
};
