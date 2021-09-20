import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';

export enum Choice {
  StartDate,
  DueDate,
}

export const LazyDateRangePicker: React.FunctionComponent<{
  due?: string | null;
  start?: string | null;
  dueReminder?: number | null;
  idCard: string;
  idBoard?: string;
  idOrg?: string;
  hidePopover: () => void;
  initialChoice?: Choice;
}> = (props) => {
  const DateRangePicker = useLazyComponent(
    () =>
      import(/* webpackChunkName: "date-range-picker" */ './DateRangePicker'),
    { namedImport: 'DateRangePicker' },
  );
  return (
    <ComponentWrapper key="date-range-picker">
      <Suspense fallback={null}>
        <DateRangePicker {...props} />
      </Suspense>
    </ComponentWrapper>
  );
};
