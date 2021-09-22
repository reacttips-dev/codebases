import type ItemResponseShape from 'owa-service/lib/contract/ItemResponseShape';
import { isFeatureEnabled } from 'owa-feature-flags';
import extendedPropertyUri from 'owa-service/lib/factory/extendedPropertyUri';

export function configItemResponseShapeForCLP(shape: ItemResponseShape): void {
    if (isFeatureEnabled('cmp-clp')) {
        shape.AdditionalProperties?.push(
            extendedPropertyUri({
                PropertyName: 'msip_labels',
                DistinguishedPropertySetId: 'InternetHeaders',
                PropertyType: 'String',
            })
        );
    }
}
