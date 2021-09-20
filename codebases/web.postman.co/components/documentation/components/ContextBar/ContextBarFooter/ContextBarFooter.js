import React from 'react';
import { Icon } from '@postman/aether';
import Link from '../../../../appsdk/components/link/Link';
import { DOCUMENTATION_ENTITY } from '../../../constants';
import XPath from '../../../../js/components/base/XPaths/XPath';

/**
 * A footer to be displayed at the bottom of the context bar, allowing the user to
 * access persistent capabilities, like the full documentation view.
 */
export default function ContextBarFooter (props) {
  let { id, type, collectionUid } = props,
    entity;

  if (type !== DOCUMENTATION_ENTITY.COLLECTION) {
    entity = `${type}-${id}`;
  }

  return (
    <XPath identifier='viewFullDocumentation'>
      <Link
        to={{
          routeIdentifier: 'build.documentation',
          routeParams: { collectionUid },
          ...(entity && { queryParams: { entity } })
        }}
        className='documentation-context-bar-footer'
        onClick={props.onOpenCollection}
      >
        <span className='documentation-context-bar-footer__expand-cta'>View complete collection documentation</span>
        <Icon
          name='icon-direction-forward'
          color='content-color-link'
        />
      </Link>
    </XPath>
  );
}
