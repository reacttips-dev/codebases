import { toGlobalId } from '@adeira/graphql-global-id';

// @TODO: Workaround to cover webapp socket updates of activities
// This should be properly implemented as BE subscription which should be the only
// system which knows how to generate global ID.
export const toNodeId_DO_NOT_USE = (label: string, id: string | number) => toGlobalId(label, id);
