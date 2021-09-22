import { ProductDiscountPromoBannerProps } from 'bundles/page/types/Program';

export const showBanner = ({
  productDiscountPromoBannerProps,
}: {
  productDiscountPromoBannerProps?: ProductDiscountPromoBannerProps;
}) => {
  if (!productDiscountPromoBannerProps) {
    return false;
  }
  const { s12nSlug, courseSlug, masterTrackSlug } = productDiscountPromoBannerProps;
  return s12nSlug || courseSlug || masterTrackSlug;
};

export default {
  showBanner,
};
