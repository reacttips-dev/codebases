import { SET_RECOMMENDED_FIT } from 'constants/reduxActions';

export function setRecommendedFit(recommendedFit: string) {
  return {
    type: SET_RECOMMENDED_FIT,
    recommendedFit
  } as const;
}

export type SizingChooserAction =
  | ReturnType<typeof setRecommendedFit>;
