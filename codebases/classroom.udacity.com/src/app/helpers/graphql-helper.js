export const createMapQueryWithAlias = function(type, list, returnFields) {
    const itemQueries = _.map(list, (item, index) => {
        const args = _.chain(item)
            .keys()
            .map((key) => {
                if (item[key]) {
                    return `${key}: \"${item[key]}\"`;
                }
            })
            .join(', ');

        return `
      query${index}: ${type}(${args}){
        ${returnFields.join(' ')}
      }
    `;
    });

    return `
    query ${type}Query {
      ${itemQueries.join(' ')}
    }
  `;
};