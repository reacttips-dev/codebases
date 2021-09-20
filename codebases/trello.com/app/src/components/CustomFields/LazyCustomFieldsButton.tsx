import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';

import { CustomFieldsButtonProps } from './CustomFieldsButton';

export const LazyCustomFieldsButton: React.FunctionComponent<CustomFieldsButtonProps> = (
  props,
) => {
  const CustomFieldsButton = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "custom-fields-button" */ './CustomFieldsButton'
      ),
    { namedImport: 'CustomFieldsButton' },
  );
  return (
    <ComponentWrapper key="custom-fields-button">
      <Suspense fallback={null}>
        <CustomFieldsButton {...props} />
      </Suspense>
    </ComponentWrapper>
  );
};
