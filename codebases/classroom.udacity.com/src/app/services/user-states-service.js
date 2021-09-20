import ApiService from './api-service';
import Queries from './_queries';

function createPutUserStateMutation({
    rootKey,
    rootId,
    nodeKey,
    nodeId,
    data,
}) {
    let rootIdTypeString, rootIdParamString;

    if (rootId) {
        rootIdTypeString = ', $root_id: Int!';
        rootIdParamString = ', root_id: $root_id';
    }

    return [
        `
      mutation UserStateMutation ($input: InputUserState, $root_key: String! ${
        rootIdTypeString || ''
      }) {
        putUserState (input: $input, root_key: $root_key ${
          rootIdParamString || ''
        }) {
          ${Queries.userState}
        }
      }
    `,
        {
            input: {
                node_key: nodeKey,
                node_id: nodeId,
                ...data,
            },
            root_key: rootKey,
            root_id: rootId,
        },
    ];
}

export default {
    update({
        rootKey,
        rootId,
        nodeKey,
        nodeId,
        data
    }) {
        return ApiService.gql(
            ...createPutUserStateMutation({
                rootKey,
                rootId,
                nodeKey,
                nodeId,
                data
            })
        ).then((mutationResponse) => {
            return mutationResponse.data.putUserState;
        });
    },
};