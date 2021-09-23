import React from 'react';
import PropTypes from 'prop-types';
import styles from './TypeaheadOption.sass';

const TypeaheadOption = ({ image, podcastName, authorName }) => (
  <div className={styles.typeaheadResult}>
    <img
      src={image}
      height={80}
      width={80}
      alt={`Cover for the podcast ${podcastName}`}
    />
    <div>
      <h5>{podcastName}</h5>
      <p>{authorName}</p>
    </div>
  </div>
);

TypeaheadOption.propTypes = {
  image: PropTypes.string.isRequired,
  podcastName: PropTypes.string.isRequired,
  authorName: PropTypes.string.isRequired,
};

export default TypeaheadOption;
