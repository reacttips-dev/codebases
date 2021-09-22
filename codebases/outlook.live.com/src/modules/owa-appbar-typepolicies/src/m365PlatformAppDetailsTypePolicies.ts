import { TypedTypePolicies } from 'owa-graph-schema-type-policies';

export const m365PlatformAppDetailsTypePolicies: TypedTypePolicies = {
    AppDefinition: {
        keyFields: ['id'],
    },
    Query: {
        fields: {
            m365PlatformAppDetails(_, { args, toReference }) {
                return toReference({
                    __typename: 'M365PlatformApplication',
                    id: args?.id,
                });
            },
        },
    },
};
