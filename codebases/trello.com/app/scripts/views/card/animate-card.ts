const getRect = ($el: HTMLElement) => {
  const rect = $el.getBoundingClientRect();

  return {
    top: `${Math.round(rect.top)}px`,
    left: `${Math.round(rect.left)}px`,
    width: `${Math.round(rect.width)}px`,
    height: `${Math.round(rect.height)}px`,
  };
};

interface Rect {
  top: string;
  left: string;
  width: string;
  height: string;
}
interface CardBackView {
  model: { get(str: string): string };
  $card: HTMLElement;
  $overlay: HTMLElement;
  $originalCardBack: HTMLElement;
  $animatedCardBack: HTMLElement;
  rects: { source: Rect; target: Rect };
}
export const animateRender = (cardBackView: CardBackView) => {
  const $card = document.querySelector(
    `.list-card[href^="/c/${cardBackView.model.get('shortLink')}"]`,
  ) as HTMLElement;
  const $overlay = document.querySelector('.window-overlay') as HTMLElement;
  const $originalCardBack = document.querySelector('.window') as HTMLElement;

  if (!$card || !$overlay || !$originalCardBack) {
    return;
  }

  Object.assign(cardBackView, { $card, $overlay, $originalCardBack });

  $originalCardBack.style.opacity = '0';

  $overlay.classList.add('overlayAnimatedStart');

  const startAnimation = () => {
    const $animatedCardBack = $originalCardBack.cloneNode() as HTMLElement;

    Object.assign(cardBackView, { $animatedCardBack });

    const $cover = $originalCardBack
      .querySelector('.window-cover')!
      .cloneNode(true) as HTMLElement;
    const $header = $originalCardBack
      .querySelector('.window-header')!
      .cloneNode(true) as HTMLElement;

    $animatedCardBack.appendChild($cover);
    $animatedCardBack.appendChild($header);

    const rects = {
      target: getRect($originalCardBack),
      source: getRect($card),
    };

    cardBackView.rects = rects;

    $animatedCardBack.setAttribute(
      'style',
      `
      top: ${rects.source.top};
      left: ${rects.source.left};
      width: ${rects.source.width};
      height: ${rects.source.height};
    `,
    );

    $animatedCardBack.classList.add('cardBackAnimated');

    document.body.appendChild($animatedCardBack);

    setTimeout(() => {
      $card.classList.add('cardListAnimated');
      $animatedCardBack.setAttribute(
        'style',
        `
          top: ${rects.target.top};
          left: ${rects.target.left};
          width: ${rects.target.width};
          height: ${rects.target.height};
        `,
      );
      $overlay.classList.add('overlayAnimatedEnd');
    });

    setTimeout(() => {
      $animatedCardBack.style.display = 'none';
      $originalCardBack.style.opacity = '1';
      $overlay.classList.remove('overlayAnimatedStart', 'overlayAnimatedEnd');
    }, 250);
  };

  setTimeout(startAnimation);
};

export const animateRemove = (cardBackView: CardBackView) => {
  cardBackView.$overlay.classList.remove('overlayAnimatedEnd');
  cardBackView.$animatedCardBack.style.display = 'block';

  setTimeout(() => {
    cardBackView.$animatedCardBack.setAttribute(
      'style',
      `
        top: ${cardBackView.rects.source.top};
        left: ${cardBackView.rects.source.left};
        width: ${cardBackView.rects.source.width};
        height: ${cardBackView.rects.source.height};
      `,
    );
  });

  setTimeout(() => {
    cardBackView.$card.classList.remove('cardListAnimated');
    cardBackView.$animatedCardBack.remove();
    // @ts-expect-error
    delete cardBackView.$animatedCardBack;
  }, 250);
};
