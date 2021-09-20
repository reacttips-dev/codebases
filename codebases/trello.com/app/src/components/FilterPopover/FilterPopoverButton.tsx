import React, { Suspense, useCallback, useState } from 'react';
import cx from 'classnames';
import { forNamespace } from '@trello/i18n';
import { Button, ButtonProps } from '@trello/nachos/button';
import { FilterIcon } from '@trello/nachos/icons/filter';
import { usePopover, PopoverPlacement } from '@trello/nachos/popover';
import { useLazyComponent } from '@trello/use-lazy-component';
import { Feature } from 'app/scripts/debug/constants';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import type { ViewFiltersSourceEditable } from 'app/src/components/ViewFilters';
import styles from './FilterPopoverButton.less';

const format = forNamespace('filter popover');

interface FilterPopoverButtonProps extends Partial<ButtonProps> {
  idOrganization?: string;
  viewFilters: ViewFiltersSourceEditable;
  isDisabled?: boolean;
}

export const FilterPopoverButton: React.FunctionComponent<FilterPopoverButtonProps> = ({
  className,
  idOrganization,
  viewFilters,
  isDisabled,
  ...rest
}) => {
  const FilterPopover = useLazyComponent(
    () => import(/* webpackChunkName: "filter-popover" */ './FilterPopover'),
    { namedImport: 'FilterPopover' },
  );

  // Suspend the popover until it has been lazily loaded at least once.
  const [isPopoverLoaded, setIsPopoverLoaded] = useState(false);
  const usePopoverResult = usePopover<HTMLButtonElement>({
    placement: PopoverPlacement.BOTTOM_END,
  });
  const {
    toggle,
    triggerRef,
    popoverProps: { isVisible: isPopoverVisible },
  } = usePopoverResult;

  const togglePopover = useCallback(() => {
    setIsPopoverLoaded(true);
    toggle();
  }, [setIsPopoverLoaded, toggle]);

  return (
    <ErrorBoundary
      tags={{
        ownershipArea: 'trello-panorama',
        feature: Feature.ProjectBrita,
      }}
    >
      <Button
        className={cx(isPopoverVisible && styles.active, className)}
        iconBefore={<FilterIcon size="small" />}
        isDisabled={isDisabled}
        onClick={togglePopover}
        ref={triggerRef}
        {...rest}
      >
        {format('filter')}
      </Button>
      {isPopoverLoaded && (
        <Suspense fallback={null}>
          <FilterPopover
            idOrganization={idOrganization}
            viewFilters={viewFilters}
            {...usePopoverResult}
          />
        </Suspense>
      )}
    </ErrorBoundary>
  );
};
