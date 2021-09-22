import $ from 'jquery';
import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';

// TODO(ankit): Move this out of phoenix-cdp into phoenix/
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import { loadVideoJS } from 'bundles/phoenix/utils/videoSetupUtils';
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
import loadAssetVideoData from 'bundles/phoenix/utils/loadAssetVideoData';
import type { VideoSources } from 'bundles/naptimejs/resources/__generated__/OnDemandVideosV1';

// eslint-disable-next-line
import 'css!video.js/dist/video-js.css';
import 'css!pages/open-course/video/styl/video';
// eslint-disable-next-line no-restricted-syntax
import 'css!bundles/videojs/css/coursera';

// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
const loadVideoJSPlayer = () => import('pages/open-course/video/util/video');

type Props = {
  children: JSX.Element;
};

type VideoData = {
  video: {
    sources: VideoSources;
    subtitles: Record<string, string>;
    subtitlesTxt: Record<string, string>;
    subtitlesVtt: Record<string, string>;
  };
  videoSources: VideoSources;
};

/**
 * wrapper that replaces all child video asset nodes with an interactive video player via videoJS
 *
 * */
class CMLVideoJS extends React.Component<Props> {
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

        const video = $(dom).find('.cml-asset-video');

        _.map(video, (assetEl: HTMLElement) => {
          const id = assetEl.getAttribute('data-id');

          loadAssetVideoData(id, (data: VideoData) => {
            // retain ariaLabel so it can be added back after the DOM is replaced
            const ariaLabel = $(assetEl.childNodes[0]).attr('aria-label');

            const videoJs = loadVideoJS(VideoJSPlayer, data.video, data.videoSources);

            assetEl.innerHTML = ''; // eslint-disable-line no-param-reassign
            assetEl.appendChild(videoJs.el());

            if (ariaLabel) {
              // set the previously retained ariaLabel
              $(assetEl.childNodes[0]).attr('aria-label', ariaLabel);
            }
          });
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

export default CMLVideoJS;
