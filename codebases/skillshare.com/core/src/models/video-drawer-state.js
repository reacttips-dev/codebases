/**
 * VideoDrawerState
 * It's literally just a normal BB model, but we're using it so we can watch changes
 * and react to session changes (which tells the subclass of VideoDrawer it needs to rerender,
 * probably to display new content for a new video)
 */

const VideoDrawerState = Backbone.Model.extend({});
export default VideoDrawerState;

