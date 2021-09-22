import { getStore } from '../store/store';
import type Item from 'owa-service/lib/contract/Item';
import { mutatorAction } from 'satcheljs';
import { INFERENCE_CLASSIFICATION_RESULT_PROPERTY_NAME } from '../constants';

/**
 * Sets the InferenceClassificationResult property value for the item
 */
export const setInferenceClassificationResultForItem = mutatorAction(
    'SET_INFERENCE_CLASSIFICATION_PROPERTY',
    function setInferenceClassificationResultForItem(item: Item) {
        const itemId = item.ItemId.Id;
        const extendedProperties = item.ExtendedProperty;
        if (extendedProperties) {
            const filteredProperties = extendedProperties.filter(
                property =>
                    property.ExtendedFieldURI.PropertyName ===
                    INFERENCE_CLASSIFICATION_RESULT_PROPERTY_NAME
            );

            if (filteredProperties.length > 0) {
                getStore().inferenceClassificationResultMap.set(
                    itemId,
                    parseInt(filteredProperties[0].Value)
                );
            }
        }
    }
);
