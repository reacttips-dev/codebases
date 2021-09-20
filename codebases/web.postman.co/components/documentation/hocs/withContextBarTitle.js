import React from 'react';
import AnalyticsService from '../../js/modules/services/AnalyticsService';
import DocumentationEntityTitle from '../components/entity/DocumentationEntityTitle/DocumentationEntityTitle';
import { DOCUMENTATION_ANALYTICS, DOCUMENTATION_ENTITY, DOCUMENTATION_ORIGIN } from '../constants';
import { isPublicWorkspace } from '../utils/utils';

/**
 * Higher Order Component to wrap the component with context bar title. If the
 * underlying component throws an error, this the entity title would be visible
 *
 * @param {React.Component} WrappingComponent - The component to be wrapped
 */
export default function withContextBarTitle (WrappingComponent) {
  class WrappedComponent extends React.Component {
    handleContextBarClose = () => {
      let { contextData, controller } = this.props,
        { entityUid } = controller,
        { type: entityType, id: entityId } = contextData;

      AnalyticsService.addEventV2({
        category: DOCUMENTATION_ANALYTICS.CATEGORY,
        action: 'close',
        label: isPublicWorkspace() ? DOCUMENTATION_ANALYTICS.LABEL.PUBLIC_CONTEXTBAR : DOCUMENTATION_ANALYTICS.LABEL.PRIVATE_CONTEXTBAR,
        entityType,
        entityId: entityType === DOCUMENTATION_ENTITY.COLLECTION ? entityUid : entityId
      });

      this.props.onClose();
    }

    render () {
      return (
        <div
          className='documentation-context-view'
        >
          <DocumentationEntityTitle
            {...this.props}
            onClose={this.handleContextBarClose}
            source={DOCUMENTATION_ORIGIN.CONTEXT_VIEW}
          />
          <WrappingComponent {...this.props} />
        </div>
      );
    }
  }

  WrappedComponent.displayName = `withContextBarTitle(${WrappingComponent.displayName || WrappingComponent.name})`;

  return WrappedComponent;
}
