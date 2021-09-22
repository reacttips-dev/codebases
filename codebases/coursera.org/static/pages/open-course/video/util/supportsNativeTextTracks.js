import videojs from 'video.js';
import userAgent from 'js/constants/userAgent';

// patch for including native video subtitles
const supportsNativeTextTracks = () => {
  let supportsTextTracks;
  const Html5 = videojs.getTech('html5');

  if (!Html5.TEST_VID || !userAgent.browser) {
    return false;
  }

  supportsTextTracks = !!Html5.TEST_VID.textTracks;
  if (supportsTextTracks && Html5.TEST_VID.textTracks.length > 0) {
    supportsTextTracks = typeof Html5.TEST_VID.textTracks[0].mode !== 'number';
  }
  if (supportsTextTracks && !('onremovetrack' in Html5.TEST_VID.textTracks)) {
    supportsTextTracks = false;
  }
  return supportsTextTracks;
};

export default supportsNativeTextTracks;
