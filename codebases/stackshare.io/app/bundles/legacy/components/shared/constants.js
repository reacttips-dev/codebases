export const IMG_HOST = 'https://img.stackshare.io';

export const IMG_NO_IMG = `${IMG_HOST}/fe/no-img.svg`;
export const IMG_NEW_COMPANY = `${IMG_HOST}/fe/onboarding/add-company.png`;
export const IMG_SPINNER = `${IMG_HOST}/fe/spinner.svg`;
export const IMG_NO_IMG_TOOL = `${IMG_HOST}/fe/onboarding/pending_approval.png`;
export const IMG_BACK_ARROW = `${IMG_HOST}/fe/onboarding/back-arrow.svg`;
export const IMG_RIGHT_ARROW = `${IMG_HOST}/fe/onboarding/right-arrow.svg`;
export const IMG_LOGO_TEXTLESS = `${IMG_HOST}/fe/ss-logo-textless.png`;

// I DO NOT RECCOMMEND OVERRIDING THESE IN OTHER CONSTANT FILES!! - Coda
export const Savable = 'Save',
  Saving = 'Saving...',
  Saved = 'Saved';

export const NotFound = 'Not Found';

export function defaultImage(img) {
  return img !== '' && img ? img : IMG_NO_IMG;
}
