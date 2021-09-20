import React, { FunctionComponent, KeyboardEvent, useCallback } from 'react';
import { Analytics } from '@trello/atlassian-analytics';
import { Dialog } from 'app/src/components/Wizard';
import { forNamespace } from '@trello/i18n';

/* Borrowing this already translated string to email hygiene */
const format = forNamespace(['email hygiene wizard', 'dialog'], {
  shouldEscapeStrings: false,
});

const analyticsSource = 'atlassianAccountAutomaticOnboardingBanner';

interface AutoOnboardingDialogProps {
  title: React.ReactNode;
  closeDialog?: () => void;
  isCentered?: boolean;
  image?: HTMLElement;
  mobileImage?: HTMLElement;
  onKeyPressCapture?: (e: KeyboardEvent) => void;
  className?: string;
}

export const AutoOnboardingDialog: FunctionComponent<AutoOnboardingDialogProps> = ({
  title,
  children,
  closeDialog,
  isCentered,
  image,
  mobileImage,
  onKeyPressCapture,
  className,
}) => {
  const onClickLink = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: 'atlassianAutoOnboardingHelpLink',
      source: analyticsSource,
    });
  }, []);

  const onCloseDialog = useCallback(() => {
    if (closeDialog) {
      closeDialog();
    }
    Analytics.sendClickedButtonEvent({
      source: analyticsSource,
      buttonName: 'atlassianAutomaticAccountOnboardingOverlayCloseButton',
    });
  }, [closeDialog]);

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
      imageClassName={className}
    >
      {children}
    </Dialog>
  );
};
