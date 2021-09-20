import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

/**
 *
 * @param {Object} props
 */
function CollectionSidebarListItemLoading (props) {
  return (
    <div className='collection-sidebar-list-item__loading'>
      {
        _.times(props.depth, (index) => (
          <div
            key={`indent-${index}`}
            className={classnames('collection-sidebar__indent',
              {
                'active-indent': (index === Number(props.activeIndent.depth)) && props.activeIndent.show
              })}
          />
        ))
      }
      <div className='sidebar-loading-state--item'>
        <div className={classnames('has', 'sidebar-loading-state__icon')} />
        <div className='sidebar-loading-state__info' />
      </div>
    </div>
  );
}

CollectionSidebarListItemLoading.propTypes = {
  activeIndent: PropTypes.object.isRequired,
  depth: PropTypes.number.isRequired
};

export default CollectionSidebarListItemLoading;
