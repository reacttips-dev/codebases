import { ConvertableIdFormat } from '../schema';
import { isConsumer } from 'owa-session-store';
import { isFeatureEnabled } from 'owa-feature-flags';
import getIsImmutableIdFeatureOnForConnectedAccount from '../selectors/getIsImmutableIdFeatureOnForConnectedAccount';

export function getTargetFormat(userId: string): ConvertableIdFormat {
    if (isConsumer(userId)) {
        return getIsImmutableIdFeatureOnForConnectedAccount()
            ? ConvertableIdFormat.EwsImmutableId
            : ConvertableIdFormat.EwsId;
    } else {
        return isFeatureEnabled('fwk-immutable-ids')
            ? ConvertableIdFormat.EwsImmutableId
            : ConvertableIdFormat.EwsId;
    }
}
