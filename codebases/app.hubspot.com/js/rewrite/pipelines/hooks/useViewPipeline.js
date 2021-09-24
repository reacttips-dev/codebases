'use es6';

import { usePipelineById } from './usePipelineById';
import { useCurrentView } from '../../views/hooks/useCurrentView';
import getIn from 'transmute/getIn';
export var useViewPipeline = function useViewPipeline() {
  var view = useCurrentView();
  var viewPipelineId = getIn(['state', 'pipelineId'], view);
  return usePipelineById(viewPipelineId);
};