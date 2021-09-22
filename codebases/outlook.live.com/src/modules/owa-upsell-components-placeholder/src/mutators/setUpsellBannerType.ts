import { upsellBannerStore } from '../store/UpsellBannerStore';
import { mutatorAction } from 'satcheljs';
import type { BannerType } from '../utils/BannerType';

export default mutatorAction('setUpsellBannerType', (bannerType: BannerType) => {
    upsellBannerStore.upsellBannerType = bannerType;
});
