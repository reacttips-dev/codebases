import TakeoverPopupView from 'core/src/views/popups/takeover-popup';
import template from 'text!core/src/templates/popups/leave-a-review-popup.mustache';

const LeaveAReviewPopup = TakeoverPopupView.extend({

  disabled: false,

  className: 'leave-a-review-popup',

  template: template,

  templateData: function() {
    return this.options;
  },

  bindings: {
    '.testimonial': 'testimonial',
  },

  events: function() {
    return _.extend(TakeoverPopupView.prototype.events.call(this), {
      'click .submit-review-button': 'onSubmit',
    });
  },

  initialize: function(options = {}) {
    this.options = _.extend({}, options, {
      aboutDataTrunc: this.getTruncatedAboutCopy(this.options.aboutData),
    });

    TakeoverPopupView.prototype.initialize.apply(this, arguments);
    _.bindAll(this, 'onSubmitSuccess', 'onSubmitError', 'onReadMore', 'onReadLess', 'onSingleClick', 'onToggleClick');
  },

  afterRender: function() {
    TakeoverPopupView.prototype.afterRender.apply(this, arguments);

    this.$submitButton = this.$('.submit-review-button');
    this.$errorMessage = this.$('.error-message');

    // toggle submission button
    this.isEditingReview = !this.model.isNew();
    if (this.isEditingReview) {
      this.$submitButton.val('Edit Review');
    }

    this.stickit();

    this.$('.read-more').on('click', this.onReadMore);
    this.$('.read-less').on('click', this.onReadLess);

    this.$('.single').on('click', this.onSingleClick);
    this.$('.toggle').on('click', this.onToggleClick);

    this.updateFields(this.model.attributes);

    SS.events.trigger('takeover:video:pause');

    // small hack to address scrolling issues between nested fixed divs in chrome
    setTimeout(function(){
      $('#click-off-overlay').css('height', '99.9%');
    }, 500);
  },

  updateFields: function(reviewData) {
    this.$(`.overall_rating .single[data-value="${reviewData.overall_rating}"]`).addClass('active');
    this.$(`.leveling_rating .single[data-value="${reviewData.leveling_rating}"]`).addClass('active');
    for(const i in reviewData.tags) {
      this.$(`.toggle[data-value="${reviewData.tags[i]}"]`).addClass('active');
    }

    this.$('#review-comments').val(reviewData.testimonial);
  },

  onSingleClick: function(e) {
    e.preventDefault();
    $(e.currentTarget).addClass('active');
    $(e.currentTarget).siblings('.single')
      .removeClass('active');
    const elementData = this.getTypeValueData(e.currentTarget);
    this.model.set(elementData.type, elementData.value);
    this.clearPanelError(`.${elementData.type}`);
  },

  onToggleClick: function(e) {
    e.preventDefault();
    $(e.currentTarget).toggleClass('active');
    const elementData = this.getTypeValueData(e.currentTarget);
    const typeArray = [];
    this.$(`.${elementData.type} .toggle.active`).each(function(){
      typeArray.push($(this).data('value'));
    });
    this.model.set(elementData.type, typeArray);
  },

  getTypeValueData: function(target) {
    return { type: $(target).data('type'), value: $(target).data('value') };
  },

  onSubmit: function(ev) {
    ev.preventDefault();
    this.model.set('testimonial', $('#review-comments').val());
    if(this.validate()) {
      this.model.save()
        .success(this.onSubmitSuccess)
        .error(this.onSubmitError);
    }
  },
  onSubmitSuccess: function(response) {
    this.model.set(response.review);

    const action = this.isEditingReview ? 'edited' : 'submitted';

    SS.events.trigger('alerts:create', {
      title: `Your review has been ${action}!`,
      type: 'success',
    });

    this.trigger('review:create');

    this.closePopup();

    //TODO: determine new criteria for share popover after review is submitted
  },

  onSubmitError: function() {
    this.enable();
  },

  validate: function() {
    let valid = true;
    this.clearPanelError('.overall_rating, .leveling_rating');
    if(this.$('.overall_rating .active').length === 0) {
      this.$('.overall_rating').addClass('error');
      valid = false;
    }
    if(this.$('.leveling_rating .active').length === 0) {
      this.$('.leveling_rating').addClass('error');
      valid = false;
    }
    if(!valid) {
      $('#click-off-overlay').animate({ scrollTop: 0 }, 500);
    }
    return valid;
  },

  clearPanelError: function(panel) {
    this.$(panel).removeClass('error');
  },

  onReadMore: function() {
    this.$('.about-copy-trunc').addClass('hide');
    this.$('.about-copy-full').removeClass('hide');
  },

  onReadLess: function() {
    this.$('.about-copy-trunc').removeClass('hide');
    this.$('.about-copy-full').addClass('hide');
  },

  enable: function() {
    this.disabled = false;
    this.$submitButton.removeClass('disabled');
  },

  disable: function() {
    this.disabled = true;
    this.$submitButton.addClass('disabled');
  },

  getTruncatedAboutCopy: function(copy) {
    const closingTagIndex = copy.indexOf('</p>');
    return copy.substring(0, closingTagIndex);
  },

});

export default LeaveAReviewPopup;
