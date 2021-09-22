/* eslint-disable no-process-env */
import { NEXT_APP_NAME } from 'bundles/next/constants';
import config from 'js/app/config';

declare const COURSERA_APP_NAME: string;

export const isDev = process.env.NODE_ENV === 'development' || config?.environment === 'development';

// Get server-side root directory for next runtime.
export const getServerBaseDir = () => {
  // All Next.js compiled code lives in .../prod. To access the base of the application,
  // navigate to the the parent directory of .../prod.
  return __filename.substr(0, __filename.lastIndexOf('/prod'));
};

// Will be grepping for this in the future
export const isNextJSApp = COURSERA_APP_NAME === NEXT_APP_NAME;

// Only use this outside of a react component as it can cause SSR mismatches.
export const inServerContext = typeof window === 'undefined';

export default {
  isDev,
  isNextJSApp,
  inServerContext,
  getServerBaseDir,
};
