import trackScreenView from './trackScreenView';

export default trackPopupView;

function trackPopupView(type, route) {
  trackScreenView('popup_modal', {
    type,
    path: route && route.pathname,
  });
}
