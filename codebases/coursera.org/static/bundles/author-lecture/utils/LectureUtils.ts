import LectureStore from 'bundles/author-lecture/stores/LectureStore';
import LectureAPIUtils from 'bundles/author-lecture/utils/LectureAPIUtils';
import lodash from 'lodash';

const LectureUtils = {
  // [fe-tech-debt] refactor this args list to be an object instead to avoid passing "null" and only
  // using the fields that are needed for the usage
  save(
    videoAssetId: string | null,
    updatedSubtitles: Map<string, string> | null,
    deletedSubtitles: string[] | null,
    doneCallback: (() => void) | null | undefined,
    stagedSubtitleDrafts: string[] = []
  ) {
    const updates = Object.assign({}, LectureStore.getLecture(), {
      name: LectureStore.getName(),
      metadata: LectureStore.getLectureDraftMetadata(),
      updatedSubtitles: updatedSubtitles || {},
      deletedSubtitles: deletedSubtitles || [],
      writeAccessToken: LectureStore.getWriteAccessToken(),
      stagedSubtitleDrafts,
    });

    if (videoAssetId) {
      updates.videoAssetId = videoAssetId;
    }

    return LectureAPIUtils.updateAndCreateIfNeeded(LectureStore.getLectureDraftId(), updates, doneCallback);
  },

  getAssetIdFromUrl(url: string): string | undefined {
    // See https://github.com/webedx-spark/infra-services/blob/c6f54738144a637537c46c4a3cd8cd22faccc293/services/assetService/conf/routes#L17
    // This extracts the assetId from a url, e.g. `https://www.coursera.org/api/subtitleAssetProxy.v1/QjD2jLvDEeWHhw4MvaB3nw?expiry=1453334400000&hmac=5P4VtKI07CO3VZjbTijvrSFHSRpWJNZbaPC12sB7CdI&fileExtension=vtt`
    return lodash.last(url.split('/'))?.split('?')[0];
  },
};

export default LectureUtils;

export const { save, getAssetIdFromUrl } = LectureUtils;
