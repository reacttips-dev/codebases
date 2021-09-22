import BaseView from 'core/src/views/base/base-view';

const SelectView = BaseView.extend({

  events: {
    'change': 'onChange',
    'keyup': 'updateVal',
    'focus': 'updateActive',
    'blur': 'updateInActive',
  },

  autoRender: true,

  render: function() {

    // Construct custom select menu
    this.$el.wrap('<div class="ss-select-wrapper" />');
    const arrow = '<svg class="arrow ss-svg-icon"><use xlink:href="#down"></use></svg>';
    const span = $(`<span class="ss-select" aria-hidden="true">${arrow}<span class="label"></span></span>`);
    this.$el.after(span);

    // Assign properties
    this.wrapperEl = this.$el.parent();
    this.selectEl = this.wrapperEl.find('.ss-select');
    this.labelEl = this.selectEl.find('.label');

    // Reset to first option if needed
    if (this.$el.attr('data-ss-always-reset')) {
      this.$('option:first').attr('selected', 'selected');
    }

    // we need the element to exist in the DOM and visible in order to
    // perform `width` calculation, e.g. But SelectViews shouldn't assume
    // they're in the DOM already for speed and cleanliness
    const isVisible = this.$el.is(':visible');
    if (!isVisible) {
      $('body').append(this.$el);
    }

    if (this.$el.hasClass('no-box')) {
      this.selectEl.addClass('no-box');
      this.selectEl.find('.arrow').removeClass('icon-chevron')
        .addClass('icon-navigate-down');
    }

    // Not the most ideal way to transfer classes from markup to the actual stylable el
    if (this.$el.hasClass('small')) {
      this.selectEl.addClass('small');
    }

    // Update width of custom select to that of actual
    // Based on full width flag
    if (this.$el.hasClass('full-width')) {
      this.selectEl.width(this.$el.width() - 49);
    } else {
      let w = this.$el.width();
      if (this.$el.hasClass('no-box')) {
        w = this.$el.width() + 4;
        this.$el.height('auto');
      }
      // Width relative
      this.selectEl.width(w);
      // Now update width of actual select so we get full hit area
      this.$el.width(this.selectEl.outerWidth());
    }

    // if el isn't visible, append to its previous parent
    // (will be detached into a documentFragment if had no previous parent)
    if (!isVisible) {
      this.$el.appendTo(this.wrapperEl);
    }

    this.updateVal();
  },

  onChange: function(e) {
    if (this.$el.hasClass('js-jump-on-change')) {
      //         if ($el.attr('data-ss-always-reset')) $el.selectmenu('index', 0);
      window.location = $(e.currentTarget).val();
    } else {
      this.updateVal();
    }
  },

  updateVal: function() {
    // Set up with the selected option
    const optionEl = this.$('option:selected');
    let html;
    const value = optionEl.attr('value');
    if (value === '') {
      html = '<span class="prompt">' + optionEl.html() + '</span>';
    } else if (value === 'all' || value === 'recommended') {
      html = optionEl.html();
    } else if (this.$el.hasClass('categories')) {
      html = "Online " + optionEl.html() + " Classes";
    } else {
      html = optionEl.html();
    }
    this.labelEl.html(html);
  },

  updateActive: function () {
    this.selectEl.addClass('active');
  },

  updateInActive: function () {
    this.selectEl.removeClass('active');
  },
});

export default SelectView;

