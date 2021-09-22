import { createStore } from 'satcheljs';
import type { UpsellBannerState } from './schema/UpsellBannerState';
import { BannerType } from '../utils/BannerType';

export let upsellBannerStore = createStore<UpsellBannerState>('UpsellBannerState', {
    upsellBannerType: BannerType.None,
})();
