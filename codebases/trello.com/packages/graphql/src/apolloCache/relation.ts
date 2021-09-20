import { FieldFunctionOptions, gql } from '@apollo/client';
import { Reference, StoreObject } from '@apollo/client/utilities';
import { firstLetterToLower } from '../stringOperations';
import { OneToManyRelation } from './relation.types';

export const boardToCardsRelation: OneToManyRelation = {
  parentType: 'Board',
  childType: 'Card',
};
export const listToCardsRelation: OneToManyRelation = {
  parentType: 'List',
  childType: 'Card',
};

export const addChildrenToParentConnection = (
  children: (Reference | StoreObject)[],
  parentId: string,
  relation: OneToManyRelation,
  options: FieldFunctionOptions,
) => {
  const { cache, readField, toReference, isReference } = options;
  const { childType, parentType } = relation;
  const parentRef = toReference(`${parentType}:${parentId}`);
  const parentIdFieldName = `id${parentType}`;
  const parentRefFieldName = `${firstLetterToLower(parentType)}`;

  if (parentRef === undefined) {
    // No parent in cache yet
    return;
  }
  children.forEach((child) => {
    if (!readField('id', child)) {
      // object cannot be identified
      return;
    }
    if (!isReference(child) && !child.__typename) {
      child = { ...child, __typename: childType };
    }
    const currentparentId = readField(parentIdFieldName, child);
    if (currentparentId === parentId) {
      // Connection already exists, nothing to change
      return;
    }

    // Constructing a fragment like:
    //   gql`
    //     fragment BoardForCard on Card {
    //       idBoard
    //       board
    //     }
    //   `
    const fragment = gql`
      fragment ${parentType}For${childType} on ${childType} {
        ${parentIdFieldName}
        ${parentRefFieldName}
      }
    `;
    cache.writeFragment({
      id: cache.identify(child),
      fragment,
      data: {
        [parentIdFieldName]: parentId,
        [parentRefFieldName]: parentRef,
      },
    });
  });
};
