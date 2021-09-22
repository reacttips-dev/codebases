/**
 * VideoDrawer
 * VideoDrawer is a class designed to be subclasseed,
 *   currently by LearnModeView and TranscriptView
 * Subclasses are displayed in an animated drawer below the video player.
 *
 * For an example subclass implementation, look at LearnModeView or TranscriptView
 *
 * @author Matt Condon
 * @since 2017-07-15
 */
import SSView from 'core/src/views/base/ss-view';
import VideoDrawerState from 'core/src/models/video-drawer-state';
import Common from 'core/src/common';

const VIDEO_DRAWER_TRANSITION_TIME = 100;

const VideoDrawer = SSView.extend({

  // general container class
  className: 'video-drawer',

  // MARK: Subclassed Methods

  /**
     * #initComponent
     * Use this lifecycle method to initialize your component
     *   - set up event listeners with .listenTo,
     *   - request any initial data
     */
  initComponent: function() {},

  /**
     * #onStateChange
     * this lifecycle method is called when the backing Session object has changed
     * you should use this method to refresh your component
     *   - load new data specific to a session (aka video) instance
     *   - then repopulate your view
     */
  onStateChange: function() {},

  /**
     * @state
     * subclasses should also use the @state property to access the current session_id
     */

  /**
     * #afterRender
     * if you need references to the dom (and only render once per view lifecycle)
     *   grab those references here
     */
  afterRender: function() {
    Common.initNewTooltips(this.$el);

    SSView.prototype.afterRender.apply(this, arguments);
  },


  // use a method for easy extension
  events: function() {
    return {
      'click .close-button': 'closeDrawer',
    };
  },

  initialize: function(options) {
    // 1) Add relevant properties to the view that each subclass will most likely use
    _.extend(this, _.pick(options, [
      'videoPlayer',
      'session',
    ]));


    // 2) Throw if we don't get a videoPlayer or a session
    // (the currect set of subclasses require these components)
    if (!this.videoPlayer) {
      throw new Error('A Video Player is required for this view');
    }

    if (!this.session) {
      throw new Error('A session model is required for this view');
    }

    this.player = this.videoPlayer.videoPlayer;

    // 3) Create the VideoDrawerState
    // (used to trigger re-render)
    this.state = new VideoDrawerState({
      session_id: this.session.id,
    });

    // 4) Listen for any changes on the VideoDrawerState and notify the subclass
    this.listenTo(this.state, 'change:session_id', this.onStateChange);

    // 5) Initialize the component
    this.initComponent(options);

    SSView.prototype.initialize.apply(this, arguments);
  },

  closeDrawer: function() {
    // tell the parent we've closed the drawer via the close-button
    this.trigger('toggle:drawer', 'close-button');
  },

  updateSession: function(session) {
    this.session = session;
    this.state.set('session_id', this.session.id);
  },

  open: function(options) {

    // force the browser to render this element with 0 opacity
    // https://timtaubert.de/blog/2012/09/css-transitions-for-dynamically-created-dom-elements/
    this.$el.css('opacity');

    // then animate it in
    // min-height is set to whatever the current page content height is
    this.$el.css({
      minHeight: options.minHeight,
      opacity: 1,
    });

    // Once the css transition is complete,
    //   we set the max-height to it's default value so that all of the content
    //   within $el will display without being hidden.
    // If we do this immediately, then the section will not animate.
    const _this = this;
    setTimeout(function() {
      _this.$el.css('maxHeight', 'none');
    }, VIDEO_DRAWER_TRANSITION_TIME);
  },

  close: function(cb) {
    Common.destroyTooltips(this.$el);
    // max-height is set to 0 because we don't want the learn mode content to display at all, we're using
    this.$el.css({
      maxHeight: 0,
      opacity: 0,
    });

    if (cb) {
      // This is a hack, but 99.9% of the time it'll be fine
      // We just want to delay the callback until the drawer has finished closing
      //   on the UI side.
      // Please keep in sync with _video-drawer.scss#L15
      setTimeout(cb, VIDEO_DRAWER_TRANSITION_TIME);
    }
  },

  startLoading: function() {
    this.state.set('error', false);
    this.state.set('loading', true);
  },

  endLoading: function() {
    this.state.set('loading', false);
  },

});

export default VideoDrawer;

