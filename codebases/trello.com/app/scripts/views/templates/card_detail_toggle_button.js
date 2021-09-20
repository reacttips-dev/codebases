const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'card_detail_toggle_button',
);

module.exports = t.renderable(
  ({ isOn, selectorOn, selectorOff, title, text, icon, disabled }) => {
    if (disabled) {
      return;
    }
    const classes = {
      'button-link toggle-button': true,
      'is-on': isOn,
      [selectorOff]: !isOn,
      [selectorOn]: isOn,
    };

    t.a(
      {
        class: t.classify(classes),
        title: t.l(title || text),
        href: '#',
        role: 'button',
        'aria-pressed': isOn ? 'true' : 'false',
      },
      () => {
        t.icon(icon);
        t.span(() => t.format(text));
        t.span('.on', () => t.icon('check', { class: 'light' }));
      },
    );
  },
);
