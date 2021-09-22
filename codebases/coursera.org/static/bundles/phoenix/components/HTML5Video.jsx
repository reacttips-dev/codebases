import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import { languageCodeToName } from 'js/lib/language';

class Html5Video extends React.Component {
  static propTypes = {
    autoPlay: PropTypes.bool.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    sources: PropTypes.object.isRequired,
    tracks: PropTypes.object,
    poster: PropTypes.string,
    duration: PropTypes.number,
  };

  render() {
    const { autoPlay, width, height, sources, tracks, poster } = this.props;
    const classes = classNames(
      'video-js',
      'vjs-circle-play-centered',
      'vjs-coursera-phoenix-skin',
      'vjs-fluid',
      'vjs-coursera-skin'
    );

    return (
      <video className={classes} autoPlay={autoPlay} width={width} height={height} preload="auto" poster={poster}>
        {_.reduce(
          sources,
          (sourceArray, sourcesByResolution, resolution) => {
            return sourceArray.concat(
              sourcesByResolution.map((source, index) => (
                <source key={`${resolution}_${index}`} src={source.src} type={source.type} />
              ))
            );
          },
          []
        )}

        {_.map(tracks, (src, srcLang) => (
          <track kind="subtitles" label={languageCodeToName(srcLang)} srcLang={srcLang} src={src} key={src} />
        ))}
      </video>
    );
  }
}

export default Html5Video;
