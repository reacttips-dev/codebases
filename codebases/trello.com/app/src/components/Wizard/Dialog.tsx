import React, {
  FunctionComponent,
  useEffect,
  useRef,
  KeyboardEvent,
} from 'react';
import { CloseIcon } from '@trello/nachos/icons/close';
import { Button } from '@trello/nachos/button';
import classNames from 'classnames';
import styles from './Dialog.less';

interface DialogProps {
  title: React.ReactNode;
  tip?: React.ReactNode;
  closeDialog?: () => void;
  isCentered?: boolean;
  image?: HTMLElement;
  mobileImage?: HTMLElement;
  onKeyPressCapture?: (e: KeyboardEvent) => void;
  imageClassName?: string;
}

export const Dialog: FunctionComponent<DialogProps> = ({
  title,
  tip,
  children,
  closeDialog,
  isCentered,
  image,
  mobileImage,
  onKeyPressCapture,
  imageClassName,
}) => {
  const refIllustrationFull = useRef<HTMLDivElement>(null);
  const refIllustrationMobile = useRef<HTMLDivElement>(null);

  // Append pre-loaded image on mount
  useEffect(() => {
    if (refIllustrationFull.current && image) {
      refIllustrationFull.current.appendChild(image);
    }
    if (refIllustrationMobile.current && mobileImage) {
      refIllustrationMobile.current.appendChild(mobileImage);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dialogDivRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (dialogDivRef.current !== null) {
      dialogDivRef.current.focus();
    }
  }, []);

  return (
    <div
      /* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */
      tabIndex={0}
      // auto-focusing so that we can receive keypress events
      ref={dialogDivRef}
      className={classNames(
        styles.wrapper,
        isCentered ? styles.centered : undefined,
      )}
      onKeyPressCapture={onKeyPressCapture}
    >
      <div
        className={classNames(
          styles.dialog,
          isCentered ? styles.centeredDialog : undefined,
        )}
      >
        {mobileImage && (
          <div
            className={styles.illustrationMobile}
            ref={refIllustrationMobile}
          ></div>
        )}
        <div className={styles.controls}>
          {closeDialog && (
            <Button
              iconBefore={<CloseIcon size="large" />}
              className={styles.icon}
              onClick={closeDialog}
            ></Button>
          )}
        </div>
        <div
          className={
            image ? styles.contentWithImage : styles.contentWithoutImage
          }
        >
          <header className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
          </header>
          <div>{children}</div>
        </div>
        <div
          className={classNames(styles.illustrationFull, imageClassName)}
          ref={refIllustrationFull}
        ></div>
      </div>
      {tip && (
        <div className={styles.tip}>
          <span role="img" aria-label="tip">
            💡
          </span>
          <span>{tip}</span>
        </div>
      )}
    </div>
  );
};
