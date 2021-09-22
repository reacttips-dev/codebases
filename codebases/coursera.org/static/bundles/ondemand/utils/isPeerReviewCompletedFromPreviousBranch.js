export default (itemMetadata, itemGrade) => {
  return itemMetadata.isPeerReview() && itemGrade && itemGrade.get('overallOutcome').grade !== undefined;
};
