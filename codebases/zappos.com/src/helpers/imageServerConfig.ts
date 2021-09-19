import { AppState } from 'types/app';

/**
 * Get the Image Server Config from the store
 * @param  {object} state application state
 * @return {object}       image server base url for building absolute URLs
 */
export default (state: AppState) => {
  const { environmentConfig: { imageServer: { url } } } = state;
  return { imageServerUrl: url } as { imageServerUrl: string };
};
