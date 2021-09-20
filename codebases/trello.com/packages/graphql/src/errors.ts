export class NoRootIdArgumentError extends Error {
  constructor(rootFieldName: string) {
    const message = `No 'id' argument supplied to ${rootFieldName}. A root node id is required to generate the URL for a query. The root of your query should look like: '${rootFieldName}(id: "abc123") {'`;
    super(message);
    this.name = 'NoRootIdArgumentError';
  }
}

export class NoRootIdsArgumentError extends Error {
  constructor(rootFieldName: string) {
    const message = `No 'ids' argument supplied to ${rootFieldName}. A root node id is required to generate the URL for a query. The root of your query should look like: '${rootFieldName}(ids: ["abc123", "def456"]) {'`;
    super(message);
    this.name = 'NoRootIdsArgumentError';
  }
}

export class UnsupportedNestedResourcePathError extends Error {
  constructor(path: string[]) {
    const message = `API URL could not be generated because [${path.join(
      ' -> ',
    )}] is not specified in the VALID_NESTED_RESOURCES tree.`;
    super(message);
    this.name = 'UnsupportedNestedResourcePathError';
  }
}

export class UnsupportedFieldError extends Error {
  constructor(path: string[], fieldName: string) {
    const message = `API URL could not be generated because selecting '${fieldName}' on the nested resource path: [${path.join(
      ' -> ',
    )}] is not supported by the server, so would always return 'null'.`;
    super(message);
    this.name = 'UnsupportedFieldError';
  }
}

export class InvalidIDError extends Error {
  constructor(id: string) {
    const message = `
      ${id} is not a valid id.
      This query is resolved by only using custom resolvers, and so fetching the parent entity is unnecessary.
      To avoid this unnecessary fetch you should pass an actual ID like '5b7c27b2bba2ee026d90410f' as the id argument.
      If the real id is not available, you should add 'id' to the requested fields of the top level entity to
      ensure it is actually fetched.
    `;
    super(message);
    this.name = 'InvalidIDError';
  }
}

export class InvalidArgumentNodeError extends Error {
  constructor(kind: string) {
    const message = `Could not get value from ValueNode kind ${kind}`;
    super(message);
    this.name = 'InvalidArgumentNodeError';
  }
}

export class MissingQueryVariableError extends Error {
  constructor(variableName: string) {
    const message = `
      Could not get the value for variable '${variableName}' from the provided query arguments.
      Due to a limitation of our client-side graphql implementation, we can only access the values for variables if they are used in the root node of your query
    `;
    super(message);
    this.name = 'MissingQueryVariableError';
  }
}

export class MissingClientDirectiveError extends Error {
  constructor() {
    const message = `
      Your query/mutation needs to include the '@client' directive. eg:

      query {
        member(id: "me") @client {
          id
          avatarSource
          gravatarHash
          initials
          uploadedAvatarUrl
        }
      }
    `;
    super(message);
    this.name = 'MissingClientDirectiveError';
  }
}

export class InvalidGraphiQLQueryError extends Error {
  constructor() {
    const message = `Could not executed this Query in GraphiQL. Please ensure you are executing a single Mutation or Query`;
    super(message);
    this.name = 'InvalidGraphiQLQueryError';
  }
}

export class InvalidTypenameError extends Error {
  constructor(typename: string) {
    const message = `${typename} was not recognized as a valid ObjectType in the GraphQL schema`;
    super(message);
    this.name = 'InvalidTypenameError';
  }
}

export class InvalidRootFieldError extends Error {
  constructor(fieldName: string) {
    const message = `${fieldName} was not recognized as a field on the Query or Mutation types. If this field uses a custom resolver under a type, make sure to pass the parentTypename to prepareDataForApolloCache`;
    super(message);
    this.name = 'InvalidRootFieldError';
  }
}

export class MissingSelectionSetError extends Error {
  constructor(typename: string) {
    const message = `Expected to find a selectionSet (child fields) for ${typename} in the query. Could not filter the results by the supplied query.`;
    super(message);
    this.name = 'MissingSelectionSetError';
  }
}

export class AddTypenamesError extends Error {
  constructor(rootTypename: string, fieldName: string) {
    const message = `Could not add typenames to data. Ensure that ${rootTypename} -> ${fieldName} is correctly defined in the GraphQL Schema`;
    super(message);
    this.name = 'AddTypenamesError';
  }
}

export class PrimitiveValueParsingError extends Error {
  constructor(nodeKind: string) {
    const message = `Could not get primitive value from ValueNode kind ${nodeKind}`;
    super(message);
    this.name = 'PrimitiveValueParsingError';
  }
}

export class StringValueParsingError extends Error {
  constructor(nodeKind: string) {
    const message = `Could not get string value from ValueNode kind ${nodeKind}`;
    super(message);
    this.name = 'StringValueParsingError';
  }
}
