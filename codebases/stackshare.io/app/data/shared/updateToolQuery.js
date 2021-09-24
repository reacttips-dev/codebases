// this updateQuery function is used to merge new data with the existing data in tool-alternatives and tool-stackups bundles,
// which will cause a re-render of the UI component with an expanded list.

export const updateQuery = (previousResult, {fetchMoreResult}) => {
  if (!fetchMoreResult) {
    return previousResult;
  }

  let itemName = Object.keys(previousResult.tool)[0];

  if (itemName === 'id') itemName = Object.keys(previousResult.tool)[1];

  return {
    ...previousResult,
    tool: {
      ...previousResult.tool,
      [itemName]: {
        ...previousResult[itemName],
        ...fetchMoreResult.tool[itemName],
        edges: [...previousResult.tool[itemName].edges, ...fetchMoreResult.tool[itemName].edges]
      }
    }
  };
};
