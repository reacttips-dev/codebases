import isSmimeAdapterInitialized from './isSmimeAdapterInitialized';
import isSmimeAdapterUsable from './isSmimeAdapterUsable';

/**
 * Returns whether the S/MIME adapter is in an erroneous state
 */
const isAdapterInErrorState = () => (isSmimeAdapterInitialized() ? !isSmimeAdapterUsable() : false);

export default isAdapterInErrorState;
