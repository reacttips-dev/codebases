import React from 'react'
import LazyLoad from 'react-lazyload'
import { IProps } from './index'

export class VideoPlayer extends React.PureComponent<IProps> {
  render() {
    const { posterImage, videoUrl, videoWebmUrl, captionTrack } = this.props
    return (
      <LazyLoad offset={300} once>
        {/* eslint-disable-next-line */}
        <video
          className="video-player"
          preload="metadata"
          poster={posterImage}
          autoPlay
          loop
          playsInline
          key={videoUrl}
        >
          <source src={videoUrl} />
          <source type="video/webm" src={videoWebmUrl} />
          {captionTrack && (
            <track
              default
              src={captionTrack.src}
              kind={captionTrack.kind || 'captions'}
              srcLang={captionTrack.srcLang || 'en'}
              label={captionTrack.label || 'English'}
            />
          )}
          <style jsx>
            {`
              .video-player {
                display: block;
                width: 100%;
              }
            `}
          </style>
        </video>
      </LazyLoad>
    )
  }
}
