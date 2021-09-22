import type * as Schema from 'owa-graph-schema';
import UnifiedGroupAccessType from 'owa-service/lib/contract/UnifiedGroupAccessType';

export default function mapGqlAccessTypeToStore(
    gqlAccessType: Schema.GroupAccessType
): UnifiedGroupAccessType | undefined {
    let accessType: UnifiedGroupAccessType | undefined = undefined;
    switch (gqlAccessType) {
        case 'None':
            accessType = UnifiedGroupAccessType.None;
            break;
        case 'Private':
            accessType = UnifiedGroupAccessType.Private;
            break;
        case 'Secret':
            accessType = UnifiedGroupAccessType.Secret;
            break;
        case 'Public':
            accessType = UnifiedGroupAccessType.Public;
            break;
    }
    return accessType;
}
