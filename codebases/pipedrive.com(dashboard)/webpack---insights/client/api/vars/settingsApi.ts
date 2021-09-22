import { makeVar } from '@apollo/client';

import { SelectedItem } from '../../types/apollo-query-types';
import { selectedItemFromUrl } from '../../utils/helpers';

export const snackbarMessageVar = makeVar('');
export const isDraggingReportVar = makeVar(false);
export const isViewInFocusVar = makeVar(false);
export const trackingParamsVar = makeVar({
	source: '',
	entryPoint: '',
});
export const selectedItemVar = makeVar<SelectedItem>({
	// because of hoisting the function is undefined when running tests
	// we are not testing Apollo Client right now, so it should not be a problem
	...(typeof selectedItemFromUrl === 'function' && {
		...selectedItemFromUrl(),
	}),
});
