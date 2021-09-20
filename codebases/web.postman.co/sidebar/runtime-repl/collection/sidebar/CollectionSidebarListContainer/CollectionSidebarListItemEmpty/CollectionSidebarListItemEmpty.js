import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import classnames from 'classnames';
import { Button } from '@postman-app-monolith/renderer/js/components/base/Buttons';
import { COLLECTION } from '../../../../_common/ModelConstant';

const friendlyTypeMap = {
  collection: 'collection',
  folder: 'folder',
  'transient-collection': 'collection',
  'transient-folder': 'folder'
};

export default class CollectionSidebarListItemEmpty extends Component {
  componentDidMount () {
    this.selfNode = findDOMNode(this);

    // Starts observing element
    this.props.observeSizeChange && this.props.observeSizeChange(this.selfNode);
  }

  componentWillUnmount () {
    this.props.unobserveSizeChange && this.props.unobserveSizeChange(this.selfNode, this.props.index);
  }

  render () {
    const { parent } = this.props,
      isCollection = (parent.type === COLLECTION);

    return (
      <div
        className='collection-sidebar-list-item__body--empty'
        data-index={this.props.index}
      >
        {
          _.times(this.props.depth, (index) => (
            <div
              key={`indent-${index}`}
              className={classnames('collection-sidebar__indent',
                {
                  'active-indent': (index === Number(this.props.activeIndent.depth)) && this.props.activeIndent.show
                })}
            />
          ))
        }
        <div className={classnames('collection-sidebar-list__empty-item__content',
          {
            'collection-sidebar-list__empty-item__content__for-collection': isCollection
          })}
        >
          {`This ${friendlyTypeMap[parent.type] || parent.type} is empty`}
          {
            this.props.canAddRequest && (
              <div>
                <Button
                  type='text'
                  className='learn-more-link'
                  onClick={() => this.props.onAddRequest(this.props.parent)}
                >
                  Add a request
                </Button>
                to start working.
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

CollectionSidebarListItemEmpty.defaultProps = {
  observeSizeChange: null,
  unobserveSizeChange: null,
  onAddRequest: _.noop,
  canAddRequest: false
};

CollectionSidebarListItemEmpty.propTypes = {
  parent: PropTypes.object.isRequired,
  activeIndent: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  depth: PropTypes.number.isRequired,
  observeSizeChange: PropTypes.func,
  unobserveSizeChange: PropTypes.func,
  onAddRequest: PropTypes.func,
  canAddRequest: PropTypes.bool
};
