interface WebkitNavigator extends Navigator {
  webkitGetUserMedia?: Navigator['getUserMedia'];
}

declare const navigator: WebkitNavigator;

export let getUserMedia:
  | Navigator['mediaDevices']['getUserMedia']
  | Navigator['getUserMedia']
  | WebkitNavigator['webkitGetUserMedia']
  | null = null;

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  // navigator.mediaDevices.getUserMedia has a promise-based API,
  // unlike the deprecated methods
  getUserMedia = (
    constraints: MediaStreamConstraints,
    successCallback: NavigatorUserMediaSuccessCallback,
    errorCallback: NavigatorUserMediaErrorCallback,
  ) => {
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(successCallback)
      .catch(errorCallback);
  };
} else if (navigator.getUserMedia) {
  // eslint-disable-next-line @trello/no-module-logic
  getUserMedia = navigator.getUserMedia.bind(
    navigator,
  ) as Navigator['getUserMedia'];
} else if (navigator.webkitGetUserMedia) {
  // eslint-disable-next-line @trello/no-module-logic
  getUserMedia = navigator.webkitGetUserMedia.bind(
    navigator,
  ) as WebkitNavigator['webkitGetUserMedia'];
}
