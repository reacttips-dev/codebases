import React from 'react';
import { IntersectionObserverProps } from 'react-intersection-observer';

import ABTest from 'components/common/ABTest';
import IntersectionObserver from 'components/common/IntersectionObserver';

interface Props {
  options?: Partial<IntersectionObserverProps>;
  test: string;
  control?: () => JSX.Element | null;
  treatment?: () => JSX.Element;
  treatments?: (() => JSX.Element)[];
  triggerCondition: boolean;
}

const LazyABTest = ({ options = {}, ...rest }: Props) => (
  <IntersectionObserver options={options}>
    <ABTest {...rest} />
  </IntersectionObserver>
);

export default LazyABTest;
