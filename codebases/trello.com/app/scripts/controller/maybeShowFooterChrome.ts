import $ from 'jquery';
import { isEmbeddedDocument } from '@trello/browser';
import { Footer } from 'app/scripts/views/footer';

import { currentModelManager } from 'app/scripts/controller/currentModelManager';

export function maybeShowFooterChrome(url: string) {
  const $el = $('#footer-chrome');
  $el.hide();

  if (isEmbeddedDocument() && currentModelManager.onAnyBoardView()) {
    $el.show();
    const footerView = new Footer({ url });
    return $el.html(footerView.render().el);
  }
}
