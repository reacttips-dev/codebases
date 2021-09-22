import _ from 'lodash';
import AssetManager from 'js/lib/AssetManager';

/**
 * Load transformed data for rendering the video player.
 * TODO: clean this up once we use unified rendering which already provides this data in the renderable html
 * @param {string} id Asset id
 * @param {function} callback Method to call with the transformed data.
 */
const loadAssetVideoData = (id, callback) => {
  const assetManager = new AssetManager();

  assetManager.getAssetMap([id]).then((assetMap) => {
    const asset = assetMap[id];

    const { videoSourceUrls, videoThumbnailUrls } = asset;

    const byResolution = {};
    const videoSources = {};

    _.forEach(videoSourceUrls, (source, resolution) => {
      const mp4VideoUrl = source['video/mp4'].url;
      const webMVideoUrl = source['video/webm'].url;
      const previewImageUrl = videoThumbnailUrls[resolution][0].url;

      byResolution[resolution] = { previewImageUrl, mp4VideoUrl, webMVideoUrl };

      videoSources[resolution] = [
        {
          src: mp4VideoUrl,
          type: 'video/mp4',
        },

        {
          src: webMVideoUrl,
          type: 'video/webm',
        },
      ];
    });

    const video = {
      sources: { byResolution },
      subtitles: {},
      subtitlesVtt: {},
    };

    callback({ video, videoSources });
  });
};

export default loadAssetVideoData;
