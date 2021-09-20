import BluebirdPromise from 'bluebird';
import { navigationState } from 'app/gamma/src/components/header/navigationState';

export const getSpinner = () => {
  navigationState.setValue({
    isNavigating: true,
  });

  return BluebirdPromise.resolve().disposer(function () {
    navigationState.setValue({
      isNavigating: false,
    });
  });
};
