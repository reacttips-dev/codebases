import React, { useCallback, useState } from 'react';
import cn from 'classnames';

import { MODAL_BUTTON_CLICK, MODAL_CLOSE, MODAL_KEY_PRESS, MODAL_NEXT_ITEM, MODAL_PREVIOUS_ITEM, MODAL_SWIPE } from 'constants/amethystModalTypes';
import useEvent from 'hooks/useEvent';
import useSwipe from 'hooks/useSwipe';
import MelodyModal from 'components/common/MelodyModal';
import { track } from 'apis/amethyst';
import { evModalInteraction } from 'events/modal';
import useMartyContext from 'hooks/useMartyContext';

import css from 'styles/components/common/melodyModalGallery.scss';

interface Props<T>{
  bodyClass?: string;
  buttonTestId?: string;
  className?: string;
  children: (item: T) => React.ReactNode;
  clickedIndex: number | null | undefined;
  data?: Record<string, string>;
  eventModalType?: string;
  galleryRenderer?: () => React.ReactNode;
  heading: string;
  items: T[];
  itemName: string;
  isOpen: boolean;
  onRequestClose?: () => any;
  onPaginate?: () => any;
}

function MelodyModalGallery <T>({
  bodyClass,
  children,
  className,
  clickedIndex = null,
  eventModalType,
  itemName = 'Items',
  items,
  isOpen,
  onPaginate = () => {},
  onRequestClose: innerOnClose = () => {},
  galleryRenderer,
  ...rest
}: Props<T>) {
  const { testId } = useMartyContext();
  const [stateModalIndex, setModalIndex] = useState(clickedIndex || null);
  const modalIndex =
    stateModalIndex !== null
      ? stateModalIndex
      : clickedIndex !== null
        ? clickedIndex
        : 0;

  const hasPrev = modalIndex > 0;
  const hasNext = modalIndex < items.length - 1;
  const interactions = {
    [MODAL_NEXT_ITEM]: useCallback(() => {
      if (hasNext) {
        setModalIndex(modalIndex + 1);
        onPaginate();
      }
    }, [hasNext, modalIndex, onPaginate]),
    [MODAL_PREVIOUS_ITEM]: useCallback(() => {
      if (hasPrev) {
        setModalIndex(modalIndex - 1);
        onPaginate();
      }
    }, [hasPrev, modalIndex, onPaginate]),
    [MODAL_CLOSE]: useCallback(() => {
      setModalIndex(null);
      innerOnClose();
    }, [innerOnClose])
  };

  const trackInteraction = (type: keyof typeof interactions, method: string) =>
    track(() => [evModalInteraction, { modal: eventModalType, type, method }]);

  const doAndTrack = (type: keyof typeof interactions, method: string) => {
    interactions[type]();
    trackInteraction(type, method);
  };

  const swipeElementRef = useSwipe({
    onLeft: hasNext ? (() => doAndTrack(MODAL_NEXT_ITEM, MODAL_SWIPE)) : undefined,
    onRight: hasPrev ? (() => doAndTrack(MODAL_PREVIOUS_ITEM, MODAL_SWIPE)) : undefined
  });

  useEvent(document, 'keydown', ((event: KeyboardEvent) => {
    if (isOpen && event) {
      switch (event.key) {
        case 'ArrowLeft':
          doAndTrack(MODAL_PREVIOUS_ITEM, MODAL_KEY_PRESS);
          break;
        case 'ArrowRight':
          doAndTrack(MODAL_NEXT_ITEM, MODAL_KEY_PRESS);
          break;
        case 'Escape':
          doAndTrack(MODAL_CLOSE, MODAL_KEY_PRESS);
          break;
      }
    }
  }) as EventListener);
  return (
    <MelodyModal
      className={cn(css.modalContainer, className)}
      isOpen={isOpen}
      shouldCloseOnEsc={false} // we'll handle this ourselves so we get the right event params
      onRequestClose={() => doAndTrack(MODAL_CLOSE, MODAL_BUTTON_CLICK)}
      wrapperTestId="galleryModal"
      {...rest}
    >
      {typeof clickedIndex !== 'number' && galleryRenderer
        ? galleryRenderer()
        : (
          <>
          <div data-test-id={testId('galleryBody')} className={cn(css.body, bodyClass)} ref={swipeElementRef}>
            {children(items[modalIndex])}
          </div>
        <div className={css.footer}>
          <button
            aria-keyshortcuts="ArrowLeft"
            aria-label="Previous"
            className={css.prevBtn}
            type="button"
            disabled={!hasPrev}
            onClick={() => doAndTrack(MODAL_PREVIOUS_ITEM, MODAL_BUTTON_CLICK)}
            data-test-id={testId('galleryPrevious')}
          />
          <span className={css.modalIndicator} data-test-id={testId('paginationText')}>{`${modalIndex + 1}/${
            items.length
          } ${itemName}`}</span>
          <button
            aria-keyshortcuts="ArrowRight"
            aria-label="Next"
            className={css.nextBtn}
            type="button"
            disabled={!hasNext}
            onClick={() => doAndTrack(MODAL_NEXT_ITEM, MODAL_BUTTON_CLICK)}
            data-test-id={testId('galleryNext')}
          />
        </div>
          </>
        )
      }
    </MelodyModal>
  );
}

export default MelodyModalGallery;
