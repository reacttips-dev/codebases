import AbstractPopupView from 'core/src/views/popups/abstract-popup';
import template from 'text!core/src/templates/popups/image-popup.html';

const ImagePopupView = AbstractPopupView.extend({

  templateFunc: _.template(template),

  templateData: function() {
    return this.options;
  },

  className: 'image-popup-view',

  render: function() {
    AbstractPopupView.prototype.render.apply(this, arguments);
    this.centerImage();
    this.openPopup();
  },

  centerImage: function() {
    const _this = this;
    this.$('img').load(function(event) {
      const img = $(event.target);
      //  Setup img
      const elHeight = _this.$el.height();
      const padding = 80;
      const maxHeight = $(window).height() - (padding * 2);
      const maxWidth = $(window).width() - (padding * 2);
      //  See if the img is too tall
      if (elHeight > maxHeight) {
        //  If so, set css height to max instead of with
        img.css({
          'max-height': maxHeight + 'px',
          'max-width': 'inherit',
          'width': 'auto',
        });
      } else {
        img.css({
          'max-width': maxWidth,
          'height': 'auto',
        });
      }

      _this.$el.css({
        'width': img.width(),
        'height': img.height(),
      });

      _this.centerPopup();
    });
  },
});

export default ImagePopupView;

