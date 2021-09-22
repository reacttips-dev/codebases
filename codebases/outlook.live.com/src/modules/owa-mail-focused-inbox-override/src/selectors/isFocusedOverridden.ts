import { getStore } from '../store/store';

/**
 * Gets whether there is focused override set by the admin on the item.
 * Derives this property from the FocusedOverride bit flag integer.
 * @param itemId Id of the item for which to get the flag
 */
export function isFocusedOverridden(itemId: string): boolean {
    const inferenceClassificationResultValue = getStore().inferenceClassificationResultMap.get(
        itemId
    );

    if (!inferenceClassificationResultValue) {
        return false;
    }

    // See substrate code - sources/dev/FocusedInbox/src/Models/HeuristicsModel/FocusedInboxEnums.cs for more details on how the property is stored.
    // See Enum - FocusedInboxClassificationResult and InferenceBypassedByTransportRuleOverride which is stored at bit 0x100
    const focusedOverrideBit = inferenceClassificationResultValue & (1 << 8);
    return !!focusedOverrideBit;
}
