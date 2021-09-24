$('[data-track]').each((i, link) => {
  const $link = $(link);
  $link.click(() => {
    trackEvent($link.data('track'), $link.data('track-props'));
  });
});
