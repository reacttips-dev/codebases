import View from 'app/scripts/views/internal/view';

import template from 'app/scripts/views/templates/footer_chrome';

class Footer extends View<{ url: string }> {
  static initClass() {
    this.prototype.className = 'embedded-board-footer';
  }

  render() {
    this.$el.html(
      template({
        url: this.options.url,
      }),
    );
    return this;
  }
}

Footer.initClass();

export { Footer };
