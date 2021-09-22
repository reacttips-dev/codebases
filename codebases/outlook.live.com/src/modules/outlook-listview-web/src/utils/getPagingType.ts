import type BasePagingType from 'owa-service/lib/contract/BasePagingType';
import indexedPageView from 'owa-service/lib/factory/indexedPageView';
import constant from 'owa-service/lib/factory/constant';
import fieldURIOrConstantType from 'owa-service/lib/factory/fieldURIOrConstantType';
import isEqualTo from 'owa-service/lib/factory/isEqualTo';
import propertyUri from 'owa-service/lib/factory/propertyUri';
import restrictionType from 'owa-service/lib/factory/restrictionType';
import seekToConditionPageView from 'owa-service/lib/factory/seekToConditionPageView';

export function getPagingType(
    rowsToLoad: number,
    instanceKey: string | null | undefined,
    isConversationView: boolean
): BasePagingType {
    // If an instance key was specified, we are loading subsequent rows,
    // so use a SeekToCondition page view
    // otherwise, we are loading the first page of rows,
    // so use an indexed page view.
    if (instanceKey) {
        const instanceKeyRestriction = isEqualTo({
            FieldURIOrConstant: fieldURIOrConstantType({
                Item: constant({
                    Value: instanceKey,
                }),
            }),
            Item: propertyUri({
                FieldURI: isConversationView ? 'ConversationInstanceKey' : 'InstanceKey',
            }),
        });

        const seekToCondition = restrictionType({
            Item: instanceKeyRestriction,
        });

        return seekToConditionPageView({
            BasePoint: 'Beginning',
            Condition: seekToCondition,
            MaxEntriesReturned: rowsToLoad,
        });
    } else {
        return indexedPageView({
            BasePoint: 'Beginning',
            Offset: 0,
            MaxEntriesReturned: rowsToLoad,
        });
    }
}
