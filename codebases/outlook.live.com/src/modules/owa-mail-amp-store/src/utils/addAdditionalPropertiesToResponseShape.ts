import type PropertyUri from 'owa-service/lib/contract/PropertyUri';
import type ItemResponseShape from 'owa-service/lib/contract/ItemResponseShape';

/**
 * Add additional properties to the response shape
 */
export default function addAdditionalPropertiesToResponseShape(
    itemResponseShape: ItemResponseShape,
    properties: PropertyUri[]
) {
    if (itemResponseShape && properties) {
        if (!itemResponseShape.AdditionalProperties) {
            itemResponseShape.AdditionalProperties = [];
        }
        itemResponseShape.AdditionalProperties.push(...properties);
    }
}
