import $ from 'jquery';
import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';

// TODO(ankit): Move this out of phoenix-cdp into phoenix/
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { loadVideoJS } from 'bundles/phoenix/utils/videoSetupUtils';

import 'css!video.js/dist/video-js.css';
import 'css!pages/open-course/video/styl/video';
import 'css!bundles/videojs/css/coursera';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
const loadVideoJSPlayer = () => import('pages/open-course/video/util/video');

type Props = {
  children: JSX.Element;
};

/**
 * Wrapper that replaces all child video asset nodes with an interactive video player via videoJS
 * This is essentially the same as CMLVideoJS but it just fetches the video data already available in the html
 * rather than making another API call to fetch it, thanks to unified rendering
 * */
class CMLVideoJSV2 extends React.Component<Props> {
  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;

    loadVideoJSPlayer().then((VideoJSPlayerModule) => {
      const VideoJSPlayer = VideoJSPlayerModule.default;
      if (this._isMounted) {
        // eslint-disable-next-line react/no-find-dom-node
        const dom = ReactDOM.findDOMNode(this);

        if (!dom) {
          return;
        }

        const videoAssetNodes = (dom as Element).querySelectorAll('.cml-asset-video');

        // for each found asset node, fetch the video data from its attributes and render a videoJS player
        _.map(videoAssetNodes, (assetEl: HTMLElement) => {
          const videoSourcesByResolution: Record<string, {}> = {};
          const videoSources: Record<string, {}> = {};

          // build the video data in the format required by videoJS for `loadVideoJS()` below
          ['360p', '540p', '720p'].forEach((resolution: string) => {
            const mp4VideoUrl = assetEl.getAttribute(`data-resolution-${resolution}-mp4`);
            const webMVideoUrl = assetEl.getAttribute(`data-resolution-${resolution}-webm`);
            const previewImageUrl = assetEl.getAttribute(`data-preview-thumbnail-${resolution}`);

            videoSourcesByResolution[resolution] = { previewImageUrl, mp4VideoUrl, webMVideoUrl };
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
            sources: { byResolution: videoSourcesByResolution },
            subtitles: {},
            subtitlesVtt: {},
          };

          const videoJs = loadVideoJS(VideoJSPlayer, video, videoSources);

          // retain ariaLabel so it can be added back after the DOM is replaced
          const ariaLabel = $(assetEl.childNodes[0]).attr('aria-label');
          assetEl.innerHTML = ''; // eslint-disable-line no-param-reassign
          assetEl.appendChild(videoJs.el());

          if (ariaLabel) {
            // set the previously retained ariaLabel
            $(assetEl.childNodes[0]).attr('aria-label', ariaLabel);
          }
        });
      }
    });
  }

  shouldComponentUpdate() {
    return false;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return this.props.children;
  }
}

export default CMLVideoJSV2;
