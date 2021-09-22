// tracking wrapper for CUI button to be used for tracking buttons on authoring

import { compose, setDisplayName } from 'recompose';
import type { TrackingProps } from 'bundles/common/components/withSingleTracked';
import withSingleTracked from 'bundles/common/components/withSingleTracked';
import { Button } from '@coursera/coursera-ui';

type PropsFromCaller = {
  rootClassName: string;
  onClick?: () => void;
  type?: string;
  disabled?: boolean;
  label?: string;
} & TrackingProps;

export default compose<{}, PropsFromCaller>(
  setDisplayName('AuthoringTrackedButton'),
  withSingleTracked({ type: 'BUTTON' })
)(Button);
