// utils for bundles/item-lecture/components/toolbar/DownloadsDropdown.jsx
import Q from 'q';
import API from 'js/lib/api';

import language from 'js/lib/language';
import redirect from 'js/lib/coursera.redirect';

import lectureAssetsApi from 'bundles/item-lecture/utils/lectureAssetsApi';

import { isBlacklistedInEpic } from 'pages/open-course/common/utils/experiment';

import _t from 'i18n!nls/item-lecture';

export const getLanguageCode = (itemMetadata, videoPlayer, videoContentModel) => {
  const course = itemMetadata && itemMetadata.get('course');
  const primaryLanguageCodes = course && course.get('course.primaryLanguageCodes');
  let languageCode = (primaryLanguageCodes && primaryLanguageCodes[0]) || 'en';
  const currentTrack = videoPlayer && videoPlayer.currentTrack();

  if (currentTrack) {
    // The user has a subtitles track selected. Allow them to download resources for that language.
    languageCode = currentTrack.language;
  } else {
    // There is no subtitles track selected. See if there are subtitles for the user's account language.
    const accountLanguageCode = language.getLanguageCode();

    if (videoContentModel) {
      const hasSourceForLanguage = !!videoContentModel.getCaptionForLanguage(accountLanguageCode);

      if (hasSourceForLanguage) {
        languageCode = accountLanguageCode;
      }
    }
  }

  return languageCode;
};

export const fetchLectureAssets = (itemMetadata) => {
  const api = API('', { type: 'rest' });

  return new Q.Promise((resolve, reject) => {
    Q(lectureAssetsApi.getLectureAssets(itemMetadata.get('course').get('id'), itemMetadata.get('id'))).then(
      (lectureAssets) => {
        Q.all(
          lectureAssets.linked['openCourseAssets.v1'].map((asset) => {
            return Q(api.get('/api/openCourseAssets.v1/' + redirect.unversionUrl(asset.id)));
          })
        ).then((results) => {
          return Q.all(
            results.map((result) => {
              const assetData = result.elements[0];

              if (!assetData) {
                return false;
              }

              const { typeName } = assetData;

              if (typeName === 'url') {
                const {
                  definition: { url, name },
                } = assetData;

                return Q().then(() => {
                  return {
                    typeName,
                    url,
                    itemName: name,
                    fileType: _t('Link'),
                  };
                });
              } else {
                const {
                  definition: { assetId },
                } = assetData;

                return Q(api.get(`api/assets.v1/${assetId}`, { data: { fields: 'fileExtension' } })).then(
                  (assetsResult) => {
                    const assetSource = assetsResult.elements[0];
                    const {
                      url: { url },
                      name,
                    } = assetSource;

                    const { fileExtension } = assetSource;
                    const assetName = assetData.definition.name || name;

                    return {
                      typeName,
                      url,
                      itemName: assetName,
                      fileType: fileExtension,
                    };
                  }
                );
              }
            })
          ).then((assetSources) => {
            resolve(assetSources);
          });
        });
      }
    );
  });
};

export const areDownloadsEnabled = (courseId) => {
  return !isBlacklistedInEpic('siteOnDemandCompletion', 'itemVideoDownloadBlacklist', courseId);
};
