import React from 'react';
import PropTypes from 'prop-types';

import { handleAccessibilityAnchorsFocus } from 'helpers/a11yUtils';

import css from 'styles/components/common/skiplinks.scss';

const SkipLinks = ({ links }) => {
  if (links?.length) {
    return (
      <div className={css.ariaSkipLinksContainer}>
        {links.map(link => {
          const { id, value, callback } = link;
          if (value) {
            return <a
              key={id}
              href={`#${id}`}
              onClick={event => {
                handleAccessibilityAnchorsFocus(event, id);
                if (typeof callback === 'function') {
                  callback();
                }
              }}>{value}</a>;
          }
        })}
      </div>
    );
  }
  return null;
};

SkipLinks.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      value: PropTypes.string,
      callback: PropTypes.func
    })
  ).isRequired
};

export default SkipLinks;
