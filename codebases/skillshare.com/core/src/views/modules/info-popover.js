import PopoverView from 'core/src/views/modules/popover';
import PopoverTemplate from 'text!core/src/templates/popovers/popover-content.mustache';

/**
   * Creates a general information popover.
   *
   * Set the data-title attribute onto the popover anchor element if you need to
   * display plain text.
   *
   * If you need to display html, then set data-html to true and include the html
   * contents inside of an element with class "info-popover-content" that is a child
   * of the anchor.
   *
   * Alternatively, if you're dealing with extensive html, chances are you're going to use tags that
   * will unintentionally break your popover. E.g. If your anchro is an <a> and you use <a's> in your html.
   * In these cases, create and info-popover-content el outside of your anchor with and id="my-popover-id"
   * and add data-ss-popover-id="my-popover-id" to your anchor.
   */
const InfoPopoverView = PopoverView.extend({

  className: 'popover info-popover',

  showOnHover: true,

  addShadow: true,

  template: PopoverTemplate,

  render: function() {
    PopoverView.prototype.render.apply(this, arguments);
    let html = '';
    if (this.anchor.data('title')) {
      html = this.anchor.data('title');
    } else {
      const $content = this.anchor.find('.info-popover-content');
      if ($content.length > 0) {
        html = $content.html();
      } else {
        html = $('#' + this.anchor.data('ss-popover-id') + '-content').html();
      }
    }
    this.contentEl.html(html);
  },

});

export default InfoPopoverView;

