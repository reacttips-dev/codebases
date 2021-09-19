import { PropTypes } from 'prop-types';

import JsonLd from 'components/common/JsonLd';
import { pick } from 'helpers/lodashReplacement';

// https://developers.google.com/search/docs/data-types/video
export const StructuredVideoObject = props => {
  const videoObjectData = {
    '@type' : 'VideoObject',
    ...pick(props, Object.keys(videoObjectPropTypes)) // only add the defined proptypes as values to the json+ld data
  };
  return <JsonLd data={videoObjectData} videoAsMeta={true} />;
};

export const videoObjectPropTypes = {
  name : PropTypes.string.isRequired,
  description : PropTypes.string.isRequired,
  thumbnailUrl : PropTypes.string.isRequired,
  uploadDate : PropTypes.string.isRequired,
  contentUrl : PropTypes.string,
  duration : PropTypes.string,
  interactionCount : PropTypes.string,
  embedUrl : PropTypes.string
};

StructuredVideoObject.propTypes = videoObjectPropTypes;
