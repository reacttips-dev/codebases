import React, { FunctionComponent, KeyboardEvent, useCallback } from 'react';
import { Analytics, SourceType } from '@trello/atlassian-analytics';
import { Dialog } from 'app/src/components/Wizard';
import { forNamespace } from '@trello/i18n';

const format = forNamespace(['email hygiene wizard', 'dialog'], {
  shouldEscapeStrings: false,
});

interface EmailHygieneDialogProps {
  title: React.ReactNode;
  closeDialog?: () => void;
  isCentered?: boolean;
  image?: HTMLElement;
  mobileImage?: HTMLElement;
  onKeyPressCapture?: (e: KeyboardEvent) => void;
  analyticsContext: object;
  analyticsSource: SourceType;
}

export const EmailHygieneDialog: FunctionComponent<EmailHygieneDialogProps> = ({
  title,
  children,
  closeDialog,
  isCentered,
  image,
  mobileImage,
  onKeyPressCapture,
  analyticsContext,
  analyticsSource,
}) => {
  const onClickLink = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: 'emailHygieneTransferBoardsFooterLink',
      source: analyticsSource,
      attributes: analyticsContext,
    });
  }, [analyticsSource, analyticsContext]);

  const onCloseDialog = useCallback(() => {
    if (closeDialog) {
      closeDialog();
      Analytics.sendClosedComponentEvent({
        componentType: 'overlay',
        componentName: 'emailHygieneWizard',
        source: analyticsSource,
        attributes: analyticsContext,
      });
    }
  }, [closeDialog, analyticsSource, analyticsContext]);

  return (
    <Dialog
      title={title}
      tip={
        <>
          {format('tip-text', {
            transferYourBoardsLink: (
              <a
                href="/support/transfer-boards"
                key="transfer-link"
                onClick={onClickLink}
                target="_blank"
              >
                {format('transfer-your-boards-link')}
              </a>
            ),
          })}
        </>
      }
      closeDialog={closeDialog && onCloseDialog}
      isCentered={isCentered}
      image={image}
      mobileImage={mobileImage}
      onKeyPressCapture={onKeyPressCapture}
    >
      {children}
    </Dialog>
  );
};
