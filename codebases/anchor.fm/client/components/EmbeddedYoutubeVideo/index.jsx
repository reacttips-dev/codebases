import React from 'react';
import PropTypes from 'prop-types';

import Box from '../../shared/Box';

const getYoutubeEmbedParameters = parameterObject => {
  if (!parameterObject) return null;
  const parameterKeys = Object.keys(parameterObject);
  return parameterKeys.map(key => `${key}=${parameterObject[key]}&`).join('');
};

const getYoutubeBaseUrl = ({ youtubeVideoId, youtubePlaylistId }) => {
  if (youtubePlaylistId)
    return `https://www.youtube.com/embed/videoseries?list=${youtubePlaylistId}&`;
  if (youtubeVideoId) return `https://www.youtube.com/embed/${youtubeVideoId}?`;
  return null;
};

const EmbeddedYoutubeVideo = ({
  youtubeVideoId,
  youtubePlaylistId,
  paddingBottomOffset,
  youtubeEmbedParameters,
  title,
}) => (
  <Box
    dangerouslySetInlineStyle={{
      // these styles (combined with the iframe styles) preserve the aspect ratio
      // https://fettblog.eu/blog/2013/06/16/preserving-aspect-ratio-for-embedded-iframes/
      position: 'relative',
      width: '100%',
      height: 0,
      paddingBottom: paddingBottomOffset,
    }}
    color="#000"
  >
    <iframe
      title={title}
      src={`${getYoutubeBaseUrl({
        youtubeVideoId,
        youtubePlaylistId,
      })}${getYoutubeEmbedParameters(youtubeEmbedParameters)}`}
      frameBorder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      scrolling="no"
      style={{
        // these styles (combined with the parent) preserve the aspect ratio
        // https://fettblog.eu/blog/2013/06/16/preserving-aspect-ratio-for-embedded-iframes/
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
      }}
    />
  </Box>
);

EmbeddedYoutubeVideo.defaultProps = {
  paddingBottomOffset: '51%',
  youtubeEmbedParameters: null,
  youtubeVideoId: null,
  youtubePlaylistId: null,
};

EmbeddedYoutubeVideo.propTypes = {
  title: PropTypes.string.isRequired,
  youtubeVideoId: PropTypes.string,
  youtubePlaylistId: PropTypes.string,
  youtubeEmbedParameters: PropTypes.shape({
    autoplay: PropTypes.number,
    controls: PropTypes.number,
    modestbranding: PropTypes.number,
    loop: PropTypes.number,
    playlist: PropTypes.string,
    cc_load_policy: PropTypes.number,
    mute: PropTypes.number,
    rel: PropTypes.number,
  }),
  paddingBottomOffset: PropTypes.string,
};

export { EmbeddedYoutubeVideo };
