import NavigationService from '../../js/services/NavigationService';
import { checkContextAndNavigate } from '../../appsdk/utils/NavigationUtils';

export function openPublicProfile (publicHandle, isPublic) {
  if (window.SDK_PLATFORM === 'browser') {
    return checkContextAndNavigate(`${window.postman_explore_url}/${publicHandle}`);
  }

  if (isPublic)
    return NavigationService.transitionTo('publicProfile', { publicProfileHandle: publicHandle });
  else {
    return NavigationService.transitionTo('home');
  }
}

