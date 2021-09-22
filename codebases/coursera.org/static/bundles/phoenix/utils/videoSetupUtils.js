import React from 'react';
import ReactDOMServer from 'react-dom/server';
import $ from 'jquery';
import _ from 'lodash';
import Html5Video from 'bundles/phoenix/components/HTML5Video';

const DEFAULT_WIDTH = 680;
const DEFAULT_HEIGHT = 400;

const getPlayerOptions = (sources) => {
  const playerOptions = {
    inactivityTimeout: 1000, // Hide controls bar after 1 sec of inactivity
  };

  if (sources) {
    playerOptions.plugins = {
      resolutions: {
        sourcesByResolution: sources,
        resolution: '540p',
      },
    };
  }

  return playerOptions;
};

const getVideoJsNode = (sources, tracks, poster, options = {}) => {
  return $(
    ReactDOMServer.renderToStaticMarkup(
      <Html5Video
        autoPlay={options.autoPlay || false}
        width={options.width || DEFAULT_WIDTH}
        height={options.height || DEFAULT_HEIGHT}
        sources={sources}
        tracks={tracks}
        poster={poster}
      />
    )
  ).get(0);
};

const convertVideoSource = (video) =>
  _.fromPairs(
    _.map(video && video.sources && video.sources.byResolution, (urls, resolution) => [
      resolution,
      _.compact(
        _.map(urls, (src, urlType) => {
          if (urlType === 'previewImageUrl') {
            return undefined; // filter out previewImageUrl
          }
          const format = urlType.replace(/VideoUrl/, '').toLowerCase();
          return {
            src,
            type: `video/${format}`,
          };
        })
      ),
    ])
  );

const getPoster = (video) => {
  const optimalRes = '540p';
  const videoPoster = video && video.sources.byResolution[optimalRes].previewImageUrl;
  return videoPoster;
};

const loadVideoJS = (VideoJSPlayer, video, videoBySources, options = {}) => {
  const width = options.width || DEFAULT_WIDTH;
  const height = options.height || DEFAULT_HEIGHT;
  const videoPoster = getPoster(video);
  const subtitles = video.subtitlesVtt;
  const videoJsOptions = {
    height,
    width,
  };

  const videoNode = getVideoJsNode(videoBySources, subtitles, videoPoster, videoJsOptions);

  const playerOptions = getPlayerOptions(videoBySources);
  const videoJs = new VideoJSPlayer(videoNode, playerOptions);

  return videoJs;
};

export default {
  convertVideoSource,
  loadVideoJS,
};

export { convertVideoSource, loadVideoJS };
