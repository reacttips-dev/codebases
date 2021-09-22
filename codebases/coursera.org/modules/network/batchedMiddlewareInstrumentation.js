import { ApolloLink } from 'apollo-link';

export const instrumentationMiddlewareLink = new ApolloLink((operation, forward) => {
  let batchedQueryName;

  const queryNames = operation.query.definitions.filter(
    definition => definition.kind === 'OperationDefinition'
  ).map(definition => definition.name && definition.name.value);

  const variables = operation.variables;

  const unnamedQueryCount = queryNames.length -
    queryNames.filter(Boolean).length;

  if (unnamedQueryCount === queryNames.length) {
    batchedQueryName = `${unnamedQueryCount}UnnamedQueries`;
  } else {
    const namedQueries = queryNames.filter(Boolean).sort().join(',');
    const unnamedQueries = unnamedQueryCount > 0 ?
      `+${unnamedQueryCount}` :
      '';
    batchedQueryName = `${namedQueries}${unnamedQueries}`;
  }

  operation.setContext({ 
    instrumentation: {
      start: process.hrtime(),
      batchedQueryName,
      variables
    } 
  });

  return forward(operation);
});

export const getInstrumentationAfterwareLink = (queryTimingLog) => {
  return new ApolloLink((operation, forward) => {
    return forward(operation).map((response) => {
      const { instrumentation: { start, batchedQueryName, variables } } = operation.getContext();
      const [seconds, nanoseconds] = process.hrtime(start);
      const milliseconds = seconds * 1e3 + nanoseconds * 1e-6;
      queryTimingLog.logTiming(batchedQueryName, milliseconds, variables);
      return response;
    })
  });
};
