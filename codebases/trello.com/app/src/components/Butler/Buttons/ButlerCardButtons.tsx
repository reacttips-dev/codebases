import React, { Suspense } from 'react';
import cx from 'classnames';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { EditIcon } from '@trello/nachos/icons/edit';
import { InformationIcon } from '@trello/nachos/icons/information';
import { usePopover, Popover } from '@trello/nachos/popover';
import { useLazyComponent } from '@trello/use-lazy-component';
import { Button } from '@trello/nachos/button';
import { forNamespace } from '@trello/i18n';
import { useUpgradePromptRules } from 'app/src/components/UpgradePrompts';
import { Urls } from 'app/scripts/controller/urls';
const { getBoardUrl } = Urls;
import { showButlerAlert, ButlerAlert } from '../showButlerAlert';
import { showButlerDirectory, ButlerTab } from '../showButlerDirectory';
import { useHasButlerAccess } from '../useHasButlerAccess';
import { ButlerCardButton } from './ButlerCardButton';
import { useButlerButtons } from './useButlerButtons';
import styles from './ButlerCardButtons.less';

const format = forNamespace('butler');

export interface ButlerCardButtonsProps {
  idCard: string;
  idBoard: string;
  idOrganization: string;
  isDisabled?: boolean;
}

// Classes lifted from plugin-card-buttons-view directly.
export const ButlerCardButtons: React.FunctionComponent<ButlerCardButtonsProps> = ({
  idCard,
  idBoard,
  idOrganization,
  isDisabled,
}) => {
  const { buttons, limit } = useButlerButtons({
    type: 'card-button',
    idBoard,
    idOrganization,
  });

  const { shouldDisplayUpgradePrompt } = useUpgradePromptRules(idOrganization);
  const UpgradeSmartComponent = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "upgrade-smart-component" */ 'app/src/components/UpgradePrompts/UpgradeSmartComponent'
      ),
    { namedImport: 'UpgradeSmartComponent' },
  );
  const {
    popoverProps: upsellPopoverProps,
    triggerRef: upsellPopoverTriggerRef,
    show: showUpsellPopover,
    hide: hideUpsellPopover,
  } = usePopover<HTMLDivElement>({
    onShow: () => {
      Analytics.sendScreenEvent({
        name: 'butlerUpsellInlineDialog',
        containers: formatContainers({ idCard, idBoard, idOrganization }),
      });
    },
  });

  const {
    popoverProps: aboutButlerPopoverProps,
    triggerRef: aboutButlerPopoverTriggerRef,
    toggle: toggleAboutButlerPopover,
  } = usePopover<HTMLAnchorElement>({
    onShow: () => {
      Analytics.sendScreenEvent({
        name: 'aboutButlerInlineDialog',
        containers: formatContainers({ idCard, idBoard, idOrganization }),
        attributes: {
          numCardButtons: buttons.length,
        },
      });
    },
  });

  const AddCardButtonPopover = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "add-card-button-popover" */ './AddCardButtonPopover'
      ),
    { namedImport: 'AddCardButtonPopover' },
  );
  const {
    popoverProps: addCardButtonPopoverProps,
    triggerRef: addCardButtonTriggerRef,
    toggle: toggleAddCardButtonPopover,
    push: pushAddCardButtonPopoverScreen,
    pop: popAddCardButtonPopoverScreen,
    hide: hideAddCardButtonPopover,
  } = usePopover<HTMLAnchorElement>({
    onShow: () => {
      Analytics.sendScreenEvent({
        name: 'addButlerCardButtonInlineDialog',
        containers: formatContainers({ idCard, idBoard, idOrganization }),
        attributes: {
          numCardButtons: buttons.length,
        },
      });
    },
  });

  const EditCardButtonPopover = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "edit-card-button-popover" */ './EditCardButtonPopover'
      ),
    { namedImport: 'EditCardButtonPopover' },
  );
  const {
    popoverProps: editCardButtonPopoverProps,
    triggerRef: editCardButtonTriggerRef,
    toggle: toggleEditCardButtonPopover,
    push: pushEditCardButtonPopoverScreen,
    pop: popEditCardButtonPopoverScreen,
    hide: hideEditCardButtonPopover,
  } = usePopover<HTMLAnchorElement>({
    onShow: () => {
      Analytics.sendScreenEvent({
        name: 'editButlerCardButtonInlineDialog',
        containers: formatContainers({ idCard, idBoard, idOrganization }),
        attributes: {
          numCardButtons: buttons.length,
        },
      });
    },
  });

  const hasButlerAccess = useHasButlerAccess(idBoard);

  const isTooltipEnabled = useFeatureFlag(
    'workflowers.butler-card-button-tooltips',
    false,
    { sendExposureEvent: true },
  );

  const cardButtonCallback = ({
    idButton,
    alert,
  }: { idButton?: string; alert?: ButlerAlert } = {}) => {
    if (
      alert === ButlerAlert.PowerupUsageExceeded &&
      shouldDisplayUpgradePrompt
    ) {
      showUpsellPopover();
    } else if (alert === ButlerAlert.RunButtonError && idButton) {
      showButlerAlert(alert, {
        actionUrl: getBoardUrl(idBoard, 'butler', ['log', idButton]),
      });
    } else if (alert) {
      showButlerAlert(alert);
    }
  };

  const goToButlerDirectoryFromPopover = ({
    source,
    butlerTab,
    butlerCmdEdit,
  }: {
    source?: 'aboutButlerInlineDialog' | 'butlerUpsellInlineDialog' | null;
    butlerTab?: ButlerTab;
    butlerCmdEdit?: string;
  }) => {
    if (source) {
      Analytics.sendClickedLinkEvent({
        linkName: 'openButlerLink',
        source,
        containers: formatContainers({ idCard, idBoard, idOrganization }),
      });
    }
    showButlerDirectory(idBoard, butlerTab, butlerCmdEdit);
  };

  const addCardButton = (viaKeypress = false) => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'addButlerCardButtonButton',
      source: 'cardDetailScreen',
      containers: formatContainers({ idCard, idBoard, idOrganization }),
      attributes: {
        numCardButtons: buttons.length,
        viaKeypress,
      },
    });
    if (buttons.length >= limit) {
      showButlerAlert(ButlerAlert.ButtonLimitMet);
    } else if (!hasButlerAccess) {
      // If the user doesn't have access to the Butler UI, the Butler directory
      // will indicate that their enterprise has restricted access to admins.
      showButlerDirectory(idBoard);
    } else {
      toggleAddCardButtonPopover();
    }
  };

  const trackFeedbackLinkClicked = (viaKeypress = false) => {
    Analytics.sendClickedLinkEvent({
      linkName: 'giveFeedbackLink',
      source: 'aboutButlerInlineDialog',
      containers: formatContainers({ idCard, idBoard, idOrganization }),
      attributes: {
        viaKeypress,
      },
    });
  };

  const isEditCardButtonEnabled = useFeatureFlag(
    'workflowers.butler-edit-card-button-popover',
    false,
  );

  return (
    <div className="window-module u-clearfix" ref={upsellPopoverTriggerRef}>
      <div className={styles.header}>
        <h3 className="mod-no-top-margin">{format('automation')}</h3>
        {isEditCardButtonEnabled ? (
          <a
            className={cx(['button-link', styles.editIcon])}
            onClick={toggleEditCardButtonPopover}
            ref={editCardButtonTriggerRef}
            role="button"
            tabIndex={0}
          >
            <EditIcon size="small" />
          </a>
        ) : (
          <a
            className={cx(['button-link', styles.editIcon])}
            onClick={toggleAboutButlerPopover}
            ref={aboutButlerPopoverTriggerRef}
            role="button"
            tabIndex={0}
          >
            <InformationIcon size="small" />
          </a>
        )}
      </div>
      <div className="u-clearfix">
        {buttons.map((button) => (
          <ButlerCardButton
            key={button.id}
            button={button}
            idCard={idCard}
            idBoard={idBoard}
            idOrganization={idOrganization}
            // eslint-disable-next-line react/jsx-no-bind
            cardButtonCallback={cardButtonCallback}
            isTooltipEnabled={isTooltipEnabled}
            isDisabled={isDisabled}
          />
        ))}
        <div>
          <a
            className="button-link add-button-link"
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => addCardButton()}
            role="button"
            ref={addCardButtonTriggerRef}
            tabIndex={0}
            title={format('add button')}
          >
            {format('add button')}
          </a>
        </div>
      </div>

      {addCardButtonPopoverProps.isVisible ? (
        <Suspense fallback={null}>
          <AddCardButtonPopover
            idCard={idCard}
            idBoard={idBoard}
            idOrganization={idOrganization}
            popoverProps={addCardButtonPopoverProps}
            push={pushAddCardButtonPopoverScreen}
            pop={popAddCardButtonPopoverScreen}
            hide={hideAddCardButtonPopover}
            // eslint-disable-next-line react/jsx-no-bind
            goToButlerDirectory={(butlerTab, butlerCmdEdit) => {
              // AddCardButtonPopover will track its own events.
              goToButlerDirectoryFromPopover({
                butlerTab,
                butlerCmdEdit,
              });
              hideAddCardButtonPopover();
            }}
          />
        </Suspense>
      ) : null}

      <Suspense fallback={null}>
        <UpgradeSmartComponent
          orgId={idOrganization}
          promptId="butlerUpsellPopoverPromptFull"
          additionalProps={{
            popoverProps: upsellPopoverProps,
            goToButler: () => {
              goToButlerDirectoryFromPopover({
                source: 'butlerUpsellInlineDialog',
              });
              hideUpsellPopover();
            },
            ctaOnClick: hideUpsellPopover,
          }}
        />
      </Suspense>
      {isEditCardButtonEnabled ? (
        <Suspense fallback={null}>
          <EditCardButtonPopover
            idCard={idCard}
            idBoard={idBoard}
            idOrganization={idOrganization}
            popoverProps={editCardButtonPopoverProps}
            push={pushEditCardButtonPopoverScreen}
            pop={popEditCardButtonPopoverScreen}
            hide={hideEditCardButtonPopover}
            // eslint-disable-next-line react/jsx-no-bind
            goToButlerDirectory={(butlerTab, butlerCmdEdit) => {
              // EditcardButtonPopover will track its own events.
              goToButlerDirectoryFromPopover({
                butlerTab,
                butlerCmdEdit,
              });
              hideEditCardButtonPopover();
            }}
          />
        </Suspense>
      ) : (
        <Popover {...aboutButlerPopoverProps} title={format('about butler')}>
          <div className={styles.aboutButlerPopoverContent}>
            <p>{format('about butler description 1')}</p>
            <p>{format('about butler description 2')}</p>
          </div>
          <Button
            appearance="primary"
            size="fullwidth"
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() =>
              goToButlerDirectoryFromPopover({
                source: 'aboutButlerInlineDialog',
              })
            }
            tabIndex={0}
          >
            {format('go to the butler directory')}
          </Button>
          <div className={styles.feedbackLinkContainer}>
            <a
              href="https://trello.typeform.com/to/VVTrq577"
              target="_blank"
              className={styles.feedbackLink}
              // eslint-disable-next-line react/jsx-no-bind
              onClick={() => trackFeedbackLinkClicked()}
            >
              {format('give us feedback')}
            </a>
          </div>
        </Popover>
      )}
    </div>
  );
};
