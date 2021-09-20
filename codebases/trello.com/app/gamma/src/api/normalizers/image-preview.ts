import {
  PreviewFromServer,
  CardCoverResponse,
} from 'app/gamma/src/types/responses';
import { CoverPhotoModel, ImagePreviewModel } from 'app/gamma/src/types/models';
import genericNormalizer from './generic';

const sortPreviews = (previews: ImagePreviewModel[]) => {
  return previews
    ? previews.slice().sort((a, b) => a.width - b.width)
    : previews;
};

// eslint-disable-next-line @trello/no-module-logic
export const normalizeImagePreview = genericNormalizer<
  PreviewFromServer,
  ImagePreviewModel
>(({ from }) => ({
  scaled: from('scaled'),
  height: from('height'),
  url: from('url'),
  width: from('width'),
}));

export const normalizeImagePreviews = (previews: PreviewFromServer[]) => {
  return sortPreviews(
    previews.map((preview) => normalizeImagePreview(preview)),
  );
};

// eslint-disable-next-line @trello/no-module-logic
export const normalizeCoverPhoto = genericNormalizer<
  CardCoverResponse,
  CoverPhotoModel
>(({ from, has }) => ({
  url: has(
    'scaled',
    (scaled) =>
      (scaled && scaled[scaled.length - 1] && scaled[scaled.length - 1].url) ||
      '',
  ),
  edgeColor: has('edgeColor', (edgeColor) => edgeColor || 'transparent'),
  previews: has('scaled', normalizeImagePreviews),
  sharedSourceUrl: from('sharedSourceUrl'),
  color: from('color'),
  size: from('size'),
  brightness: from('brightness'),
}));
