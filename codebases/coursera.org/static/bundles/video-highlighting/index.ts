import VideoHighlightSidebar from 'bundles/video-highlighting/components/v1/VideoHighlightSidebar';
import HighlightSidebarTogglePanel from 'bundles/video-highlighting/components/v1/HighlightSidebarTogglePanel';
import HighlightCapturePreview from 'bundles/video-highlighting/components/v1/HighlightCapturePreview';
import VideoHighlights from 'bundles/video-highlighting/components/v1/VideoHighlights';

export {
  getHighlights,
  updateHighlight,
  deleteHighlight,
  createHighlight,
  compareHighlightsByStartTimestamp,
} from 'bundles/video-highlighting/utils/highlightAPIUtils';
export {
  getUIPanelVisibilityPreference,
  setUIPanelEnabled,
} from 'bundles/video-highlighting/utils/highlightingUIPreferenceUtils';
export type { Highlight, TranscriptSelection } from 'bundles/video-highlighting/types';
export { isVideoHighlightingEnabled } from 'bundles/video-highlighting/utils/highlightingFeatureToggles';
export { generateHighlightFromCaptureButton } from 'bundles/video-highlighting/utils/highlightUtils';

export { VideoHighlightSidebar, HighlightCapturePreview, HighlightSidebarTogglePanel, VideoHighlights };
