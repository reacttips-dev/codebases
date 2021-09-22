import $ from 'jquery';
import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from 'react-dom/server';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore TS7016 Untyped import http://go.dkandu.me/strict-ts-migration#TS7016
const loadVideojsForAudio = () => import('bundles/phoenix/utils/loadVideojsForAudio');

type AudioNodeProps = {
  src: string;
  extension: string;
  name: string;
  ariaLabel?: string;
};

const AudioNode: React.FunctionComponent<AudioNodeProps> = ({ src, extension, name, ariaLabel }) => {
  return (
    // disable a11y lint recommendation for <track> as we don't have that feature available for audio yet.
    // eslint-disable-next-line
    <audio controls={true} className="vjs-coursera-phoenix-audio-skin" preload="metadata">
      <source src={src} type={`audio/${extension}`} />
      {/* fallback to link for any unsupported cases */}
      <a href={src} className="cml-asset-link" target="_blank" aria-label={ariaLabel} rel="noopener noreferrer">
        {name}
      </a>
    </audio>
  );
};

type Props = {
  children: JSX.Element;
};

/**
 * Wrapper that replaces all child audio asset nodes with an interactive audio player via videoJS
 * */
class CMLAudioJS extends React.Component<Props> {
  _isMounted = false;

  componentDidMount() {
    this._isMounted = true;

    loadVideojsForAudio().then((videojsModule) => {
      const videojs = videojsModule.default;
      if (this._isMounted) {
        // eslint-disable-next-line react/no-find-dom-node
        const dom = ReactDOM.findDOMNode(this);

        if (!dom) {
          return;
        }

        const audio = $(dom).find('.cml-asset-audio');

        _.map(audio, (assetEl: HTMLElement) => {
          const src = assetEl.getAttribute('data-url');
          const extension = assetEl.getAttribute('data-extension');
          const name = assetEl.getAttribute('data-name') as string;

          if (src && extension) {
            // retain ariaLabel so it can be added back after the DOM is replaced
            const ariaLabel = $(assetEl.childNodes[0]).attr('aria-label');
            const audioNode = $(
              ReactDOMServer.renderToStaticMarkup(
                <AudioNode src={src} name={name} extension={extension} ariaLabel={ariaLabel} />
              )
            ).get(0);

            const audioControlChildren = {
              width: '100%',
              height: '28px',
              children: [
                'mediaLoader',
                'errorDisplay',
                {
                  name: 'controlBar',
                  children: [
                    {
                      name: 'cPlayToggle',
                      isAudio: true,
                    },
                    'progressControl',
                    'CountdownDisplay',
                  ],
                },
              ],
            };

            // eslint-disable-next-line
            assetEl.innerHTML = '';

            assetEl.appendChild(audioNode);

            if (ariaLabel) {
              // set the previously retained ariaLabel
              $(assetEl.childNodes[0]).attr('aria-label', ariaLabel);
            }

            videojs(audioNode, audioControlChildren);
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

export default CMLAudioJS;
