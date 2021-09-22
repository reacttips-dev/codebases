import ClassSectionView from 'core/src/views/class-details/logged-in/section';
import template from 'text!core/src/templates/class-details/shared/_transcripts-section.mustache';
import adapter from 'core/src/base/remote-script-adapter';

const TranscriptsSectionView = ClassSectionView.extend({

  lessonId: null,
  template: template,
  notificationTypes: {
    ERROR: 'error',
    UNAVAILABLE: 'unavailable',
  },

  templateData: function() {
    return this.model.attributes;
  },

  initialize: function() {
    ClassSectionView.prototype.initialize.apply(this, arguments);

    this.on('prerendered', ()=> {
      this.getVerbitWidget();
    });
  },

  afterRender: function() {
    this.getVerbitWidget();
  },

  getVerbitWidget: function() {
    if(!this.verbitWidgetInstance) {
      this.lessonId = this.model?.lessonId;

      adapter.verbitWidget(() => {
        window.VerbitWidget.renderAndInit('transcripts-wrapper', 'vjs_video_3_html5_api', (w) => {
          this.verbitWidgetInstance = w;

          this.updateLessonTranscript();
        });
      }, () => {
        this.setNotification(this.notificationTypes.ERROR);
      });

    } else {
      this.updateLessonTranscript();
    }
  },

  updateLessonTranscript: function() {
    const transcriptsData = this.model.get('transcriptCuesArray');

    if(transcriptsData[this.lessonId]) {

      const content = transcriptsData[this.lessonId].content;
      if (content.length > 0) {
        this.resetNotification();
        // This double-call is intentional to prevent caching-like behavior.
        // We are checking in with Verbit on a fix for this.
        this.verbitWidgetInstance.renderCaptionsData(content);
        this.verbitWidgetInstance.renderCaptionsData(content);
        this.verbitWidgetInstance.$words.off('click');
      } else {
        this.setNotification(this.notificationTypes.UNAVAILABLE);
      }
    }
  },

  onSessionChange: function(session) {
    this.lessonId = session?.id;
    this.updateLessonTranscript();
  },

  setNotification: function(type) {
    this.resetNotification();
    this.$('.js-transcripts-wrapper').hide();
    this.$('.js-transcript-notify').addClass(type);
  },

  resetNotification: function() {
    this.$('.js-transcripts-wrapper').show();
    this.$('.js-transcript-notify').removeClass('unavailable').removeClass('error');
  }

});

export default TranscriptsSectionView;
