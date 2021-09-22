import { isFeatureEnabled } from 'owa-feature-flags';
import type ItemResponseShape from 'owa-service/lib/contract/ItemResponseShape';
import extendedPropertyUri from 'owa-service/lib/factory/extendedPropertyUri';

export function configItemResponseShapeForRevocation(shape: ItemResponseShape): void {
    if (isFeatureEnabled('rp-omeRevocation')) {
        shape.AdditionalProperties.push(
            extendedPropertyUri({
                PropertyName: 'x-ms-exchange-organization-ome-messagestate',
                DistinguishedPropertySetId: 'InternetHeaders',
                PropertyType: 'String',
            })
        );
    }
}
