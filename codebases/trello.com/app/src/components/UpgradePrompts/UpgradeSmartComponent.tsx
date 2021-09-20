import React from 'react';
import classNames from 'classnames';
import { Popover } from '@trello/nachos/popover';
import { UpgradePromptTestIds } from '@trello/test-ids';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';
import { UpgradePromptFullBase } from './UpgradePromptFullBase';
import { UpgradePromptPillBase } from './UpgradePromptPillBase';
import { UpgradePromptButtonBase } from './UpgradePromptButtonBase';
import { useUpgradePromptRules, Product } from './useUpgradePromptRules';
import { useFreeTrialEligibilityRules } from 'app/src/components/FreeTrial';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary/ErrorBoundary';
import { BusinessClassIcon } from '@trello/nachos/icons/business-class';
import { Button } from '@trello/nachos/button';
import { forNamespace, forTemplate } from '@trello/i18n';
import { Analytics } from '@trello/atlassian-analytics';
import { Feature } from 'app/scripts/debug/constants';
import styles from './UpgradeSmartComponent.less';
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { dontUpsell } from '@trello/browser';
import { CollectionIcon } from '@trello/nachos/icons/collection';
import { CustomFieldIcon } from '@trello/nachos/icons/custom-field';
import { PowerUpIcon } from '@trello/nachos/icons/power-up';
import { ButlerBotIcon } from '@trello/nachos/icons/butler-bot';
import { BoardIcon } from '@trello/nachos/icons/board';
import { DownloadIcon } from '@trello/nachos/icons/download';
import { MemberIcon } from '@trello/nachos/icons/member';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { useProductData } from './useProductData';

// ===================================
// Please keep this list alphabetical!
// It helps a ton when merging
// ===================================
export type PromptId =
  | 'approachingBoardLimitTemplateUpgradePromptPill'
  | 'atBoardLimitTemplateUpgradePromptPill'
  | 'boardMenuDrawerPromptFull'
  | 'boardMenuMainCustomFieldsPromptPill'
  | 'boardMenuMainCustomFieldsPromptFull'
  | 'boardMenuMoreCollectionsPromptPill'
  | 'boardMenuMoreCollectionsPromptFull'
  | 'boardMenuMoreTemplatesPromptPill'
  | 'butlerUpsellPopoverPromptFull'
  | 'createBoardModalPromptFull'
  | 'customFieldsPromptPill'
  | 'inviteUpgradePromptFull'
  | 'memberHomeScreenPromptFull'
  | 'moreMenuShareInlineDialogPromptFull'
  | 'orgMemberRestrictedPromptFull'
  | 'pupLimitPopUpPromptFull'
  | 'pupUpgradeBannerButton'
  | 'pupUpgradePromptPill'
  | 'teamBoardsHeaderUpgradePromptButton'
  | 'teamBoardsScreenPromptFull'
  | 'teamMembersScreenPromptFull';

interface Props {
  orgId: string;
  promptId: PromptId;
  // This is an EMERGENCY escape hatch just in case of any
  // context-specific logic that this smart component can't handle.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  additionalProps?: any;
  allowUpsell?: boolean;
}

const formatUpgradePrompt = forNamespace('upgrade prompt');
const formatFreeTrial = forNamespace('free trial existing');
const formatCreateBoard = forTemplate('create_board');
const formatBusinessClassUpsell = forTemplate('business_class_upsell');
const formatCardDetail = forTemplate('card_detail');
const formatUpgradeUnlimitedBoards = forTemplate(
  'upgrade_unlimited_boards_modal',
);

export const UpgradeSmartComponentNoBoundary: React.FC<Props> = ({
  orgId,
  promptId,
  additionalProps,
  allowUpsell,
}) => {
  const DISMISS_MESSAGE = `${orgId}-${promptId}`;
  const isRepackagingGTM = useFeatureFlag(
    'nusku.repackaging-gtm.features',
    false,
  );

  const { isStandard, isFree, loading: productDataLoading } = useProductData(
    orgId,
  );

  const standardToPremiumPath =
    isStandard && isRepackagingGTM
      ? { from: Product.Standard, to: Product.BusinessClass }
      : undefined;

  const { isEligible, loading, isAdmin } = useFreeTrialEligibilityRules(orgId);
  const {
    boardLimit,
    org,
    dismissMessage,
    openPlanSelection,
    shouldDisplayUpgradePrompt,
    loading: promptRulesLoading,
  } = useUpgradePromptRules(
    orgId,
    DISMISS_MESSAGE,
    { allowUpsell },
    standardToPremiumPath,
  );

  const billingUrl = `/${org?.name}/billing`;
  const freeTrialUrl = `/${org?.name}/free-trial`;
  const isStandardAndNonAdmin = isStandard && !isAdmin;

  const adminOnlyPrompts = [
    'memberHomeScreenPromptFull',
    'boardMenuMoreCollectionsPromptPill',
  ];
  const shouldHidePromptForRole =
    isStandardAndNonAdmin && adminOnlyPrompts.includes(promptId);
  const isLoading = loading || promptRulesLoading || productDataLoading;

  if (isLoading || !shouldDisplayUpgradePrompt || shouldHidePromptForRole) {
    return null;
  }

  // ==================================
  // Please keep this list alphabetical!
  // It helps a ton when merging
  // ==================================
  const configs: Record<PromptId, React.ReactElement | null> = {
    approachingBoardLimitTemplateUpgradePromptPill: (
      <UpgradePromptButtonBase
        cta={formatCreateBoard('upgrade team')}
        // eslint-disable-next-line react/jsx-no-bind
        ctaOnClick={() => {
          Analytics.sendClickedButtonEvent({
            source: 'createFromTemplateInlineDialog',
            buttonName: 'bcUpgradePrompt',
            containers: {
              organization: {
                id: orgId,
              },
            },
            attributes: {
              isFreeTrial: !!isEligible,
              promptId: 'approachingBoardLimitTemplateUpgradePromptPill',
            },
          });

          openPlanSelection();
        }}
      />
    ),

    atBoardLimitTemplateUpgradePromptPill: (
      <UpgradePromptButtonBase
        cta={formatCreateBoard('upgrade team')}
        // eslint-disable-next-line react/jsx-no-bind
        ctaOnClick={() => {
          Analytics.sendClickedButtonEvent({
            source: 'createFromTemplateInlineDialog',
            buttonName: 'bcUpgradePrompt',
            containers: {
              organization: {
                id: orgId,
              },
            },
            attributes: {
              isFreeTrial: !!isEligible,
              promptId: 'atBoardLimitTemplateUpgradePromptPill',
            },
          });

          openPlanSelection();
        }}
      />
    ),

    boardMenuMainCustomFieldsPromptPill: (
      <UpgradePromptPillBase
        icon={<BusinessClassIcon />}
        cta={formatUpgradePrompt(['upgrade'])}
        // eslint-disable-next-line react/jsx-no-bind
        ctaOnClick={() => {
          Analytics.sendUIEvent({
            action: 'clicked',
            actionSubject: 'pill',
            actionSubjectId: 'bcUpgradePrompt',
            source: 'boardMenuDefaultScreen',
            containers: {
              organization: {
                id: orgId,
              },
            },
            attributes: {
              isFreeTrial: !!isEligible,
              promptId: 'boardMenuMainCustomFieldsPromptPill',
            },
          });

          openPlanSelection();
        }}
      />
    ),

    boardMenuMainCustomFieldsPromptFull: (
      <div className={styles.boardMenuPromptFullWrapper}>
        <UpgradePromptFullBase
          onDismiss={dismissMessage}
          loading={isLoading}
          icon={<CustomFieldIcon />}
          headline={formatUpgradePrompt([
            'board menu',
            'custom fields',
            'headline',
          ])}
          content={formatUpgradePrompt([
            'board menu',
            'custom fields',
            'content',
          ])}
          cta={
            <button
              className={classNames(styles.cta, styles.lightModeCta)}
              // eslint-disable-next-line react/jsx-no-bind
              onClick={() => {
                Analytics.sendUIEvent({
                  action: 'clicked',
                  actionSubject: 'prompt',
                  actionSubjectId: 'bcUpgradePrompt',
                  source: 'boardMenuDefaultScreen',
                  containers: {
                    organization: {
                      id: orgId,
                    },
                  },
                  attributes: {
                    isFreeTrial: !!isEligible,
                    promptId: 'boardMainMoreCustomFieldsPromptFull',
                  },
                });

                openPlanSelection();
              }}
            >
              {isEligible
                ? formatFreeTrial(['upgrade prompt', 'cta-ft-repackaging-gtm'])
                : formatUpgradePrompt('upgrade')}
            </button>
          }
        />
      </div>
    ),

    boardMenuMoreCollectionsPromptFull: (
      <div className={styles.margin}>
        <UpgradePromptFullBase
          onDismiss={dismissMessage}
          loading={isLoading}
          icon={<CollectionIcon />}
          headline={formatUpgradePrompt([
            'board menu',
            'collections',
            'headline-2',
          ])}
          content={formatUpgradePrompt([
            'board menu',
            'collections',
            'content-2',
          ])}
          cta={
            !isStandardAndNonAdmin ? (
              <button
                data-test-id={UpgradePromptTestIds.CollectionsUpgradePrompt}
                className={classNames(styles.cta, styles.lightModeCta)}
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() => {
                  Analytics.sendUIEvent({
                    action: 'clicked',
                    actionSubject: 'prompt',
                    actionSubjectId: 'bcUpgradePrompt',
                    source: 'boardMenuDrawerMoreScreen',
                    containers: {
                      organization: {
                        id: orgId,
                      },
                    },
                    attributes: {
                      isFreeTrial: !!isEligible,
                      promptId: 'boardMenuMoreCollectionsPromptFull',
                    },
                  });

                  openPlanSelection();
                }}
              >
                {isEligible
                  ? formatFreeTrial([
                      'upgrade prompt',
                      'cta-ft-repackaging-gtm',
                    ])
                  : formatUpgradePrompt('upgrade')}
              </button>
            ) : (
              <div
                className={classNames(
                  styles.cta,
                  styles.lightModeCta,
                  styles.disabledCta,
                )}
              >
                {formatUpgradePrompt([
                  'board menu',
                  'collections',
                  'to-upgrade-contact-admin',
                ])}
              </div>
            )
          }
        />
      </div>
    ),

    boardMenuMoreCollectionsPromptPill: (
      <UpgradePromptPillBase
        testId={UpgradePromptTestIds.CollectionsUpgradePill}
        icon={<BusinessClassIcon />}
        cta={formatUpgradePrompt(['upgrade'])}
        // eslint-disable-next-line react/jsx-no-bind
        ctaOnClick={() => {
          Analytics.sendUIEvent({
            action: 'clicked',
            actionSubject: 'pill',
            actionSubjectId: 'bcUpgradePrompt',
            source: 'boardMenuDrawerMoreScreen',
            containers: {
              organization: {
                id: orgId,
              },
            },
            attributes: {
              isFreeTrial: !!isEligible,
              promptId: 'boardMenuMoreCollectionsPromptPill',
            },
          });

          openPlanSelection();
        }}
      />
    ),

    boardMenuMoreTemplatesPromptPill: (
      <UpgradePromptPillBase
        cta={formatUpgradePrompt(['upgrade'])}
        icon={<BusinessClassIcon />}
        testId={UpgradePromptTestIds.TemplatesUpgradePill}
        // eslint-disable-next-line react/jsx-no-bind
        ctaOnClick={() => {
          Analytics.sendUIEvent({
            action: 'clicked',
            actionSubject: 'pill',
            actionSubjectId: 'bcUpgradePrompt',
            source: 'boardMenuDrawerMoreScreen',
            containers: {
              organization: {
                id: orgId,
              },
            },
            attributes: {
              isFreeTrial: !!isEligible,
              promptId: 'boardMenuMoreTemplatesPromptPill',
            },
          });
          openPlanSelection();
        }}
      />
    ),

    boardMenuDrawerPromptFull: (
      <UpgradePromptFullBase
        loading={isLoading}
        icon={<PowerUpIcon />}
        headline={formatUpgradePrompt(['board menu', 'power ups', 'headline'])}
        content={formatUpgradePrompt(['board menu', 'power ups', 'content'])}
        cta={
          <button
            data-test-id={UpgradePromptTestIds.PuPsUpgradePrompt}
            className={classNames(styles.cta, styles.lightModeCta)}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => {
              Analytics.sendUIEvent({
                action: 'clicked',
                actionSubject: 'prompt',
                actionSubjectId: 'bcUpgradePrompt',
                source: 'boardMenuDrawer',
                containers: {
                  organization: {
                    id: orgId,
                  },
                },
                attributes: {
                  isFreeTrial: !!isEligible,
                  promptId: 'boardMenuDrawerPromptFull',
                },
              });
              openPlanSelection();
            }}
          >
            {isEligible
              ? formatFreeTrial(['upgrade prompt', 'cta'])
              : formatUpgradePrompt('learn more')}
          </button>
        }
      />
    ),

    /**
     * interface AdditionalProps {
     *   popoverProps: PopoverProps;
     *   goToButler: () => void;
     *   ctaOnClick: () => void;
     * }
     */
    butlerUpsellPopoverPromptFull: (
      <Popover
        {...additionalProps?.popoverProps}
        title={formatUpgradePrompt([
          'butler upsell popover',
          'usage-quota-title',
        ])}
      >
        <div className={styles.butlerUpsellPopoverPromptFullWrapper}>
          <UpgradePromptFullBase
            loading={isLoading}
            content={formatUpgradePrompt([
              'butler upsell popover',
              'usage-quota-content',
            ])}
            headline={formatUpgradePrompt([
              'butler upsell popover',
              'usage-quota-headline',
            ])}
            icon={<ButlerBotIcon />}
            cta={
              <button
                className={classNames(styles.cta, styles.lightModeCta)}
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() => {
                  Analytics.sendUIEvent({
                    action: 'clicked',
                    actionSubject: 'prompt',
                    actionSubjectId: 'bcUpgradePrompt',
                    source: 'butlerUpsellInlineDialog',
                    containers: {
                      organization: {
                        id: orgId,
                      },
                    },
                    attributes: {
                      isFreeTrial: !!isEligible,
                      promptId: 'butlerUpsellPopoverPromptFull',
                    },
                  });

                  additionalProps?.ctaOnClick?.();

                  isEligible && !dontUpsell()
                    ? openPlanSelection()
                    : window.open('/business-class');
                }}
              >
                {isEligible && !dontUpsell()
                  ? formatFreeTrial(['upgrade prompt', 'cta'])
                  : formatUpgradePrompt('learn more')}
              </button>
            }
          />
        </div>
        <Button size="fullwidth" onClick={additionalProps?.goToButler}>
          {formatUpgradePrompt(['butler upsell popover', 'go to butler'])}
        </Button>
      </Popover>
    ),

    createBoardModalPromptFull: (
      <div className={styles.createBoardModalWrapper}>
        <UpgradePromptFullBase
          loading={isLoading}
          icon={<BoardIcon />}
          headline={formatUpgradeUnlimitedBoards('headline', {
            boardCount: boardLimit,
          })}
          content={formatUpgradeUnlimitedBoards('content')}
          cta={
            <RouterLink
              testId={UpgradePromptTestIds.CreateBoardUpgradePrompt}
              className={classNames(styles.cta, styles.darkModeCta)}
              href={
                isEligible
                  ? `/${org?.name}/free-trial`
                  : `/${org?.name}/billing`
              }
              // eslint-disable-next-line react/jsx-no-bind
              onClick={() => {
                additionalProps?.ctaOnClick?.();
                Analytics.sendUIEvent({
                  action: 'clicked',
                  actionSubject: 'prompt',
                  actionSubjectId: 'bcUpgradePrompt',
                  source: 'createBoardModal',
                  containers: {
                    organization: {
                      id: orgId,
                    },
                  },
                  attributes: {
                    isFreeTrial: !!isEligible,
                    promptId: 'createBoardModalPromptFull',
                  },
                });
              }}
            >
              {isEligible
                ? formatUpgradeUnlimitedBoards('start-free-trial')
                : formatUpgradeUnlimitedBoards('upgrade')}
            </RouterLink>
          }
          isDarkTheme
        />
      </div>
    ),

    customFieldsPromptPill: (
      <>
        <div className="card-back-card-back-upgrade-prompt-section">
          <div className="card-back-card-back-upgrade-prompt-opener">
            {formatCardDetail('upgrade-to-get-more-features')}
          </div>
          <div className="card-back-card-back-upgrade-prompt">
            <UpgradePromptPillBase
              icon={<BusinessClassIcon />}
              cta={
                isEligible
                  ? formatFreeTrial([
                      'upgrade prompt',
                      'cta-ft-repackaging-gtm',
                    ])
                  : formatUpgradePrompt('upgrade')
              }
              // eslint-disable-next-line react/jsx-no-bind
              ctaOnClick={() => {
                Analytics.sendUIEvent({
                  action: 'clicked',
                  actionSubject: 'pill',
                  actionSubjectId: 'bcUpgradePrompt',
                  source: 'upsellPromptCardViewsInlineDialog',
                  containers: {
                    organization: {
                      id: orgId,
                    },
                  },
                  attributes: {
                    isFreeTrial: !!isEligible,
                    promptId: 'customFieldsPromptPill',
                  },
                });
                openPlanSelection();
              }}
            />
          </div>
        </div>
      </>
    ),

    inviteUpgradePromptFull: (
      <UpgradePromptFullBase
        loading={isLoading}
        icon={<BusinessClassIcon />}
        headline={
          dontUpsell()
            ? formatUpgradePrompt([
                'team page',
                'invite-popover',
                'headline-auaa-desktop',
              ])
            : formatUpgradePrompt([
                'team page',
                'invite-popover',
                'headline-auaa-2',
              ])
        }
        content={
          dontUpsell()
            ? formatUpgradePrompt([
                'team page',
                'invite-popover',
                'content-auaa-desktop',
              ])
            : formatUpgradePrompt([
                'team page',
                'invite-popover',
                'content-auaa-2',
              ])
        }
        cta={
          <button
            data-test-id={UpgradePromptTestIds.InviteUpgradePrompt}
            className={classNames(styles.cta, styles.lightModeCta)}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => {
              Analytics.sendUIEvent({
                action: 'clicked',
                actionSubject: 'prompt',
                actionSubjectId: 'bcUpgradePrompt',
                source: 'inviteToTeamInlineDialog',
                containers: {
                  organization: {
                    id: orgId,
                  },
                },
                attributes: {
                  isFreeTrial: !!isEligible,
                  promptId: 'teamInvitePromptFull',
                },
              });

              isEligible && !dontUpsell()
                ? openPlanSelection()
                : window.open('/business-class');
            }}
          >
            {isEligible && !dontUpsell()
              ? formatFreeTrial(['upgrade prompt', 'cta'])
              : formatUpgradePrompt('learn more')}
          </button>
        }
      />
    ),

    memberHomeScreenPromptFull: (
      <UpgradePromptFullBase
        loading={isLoading}
        icon={<BusinessClassIcon />}
        onDismiss={dismissMessage}
        headline={
          isEligible
            ? formatFreeTrial([
                'upgrade prompt',
                isRepackagingGTM ? 'headline-repackaging-gtm' : 'headline',
              ])
            : formatUpgradePrompt([
                'home',
                'team tab',
                isRepackagingGTM ? 'headline-repackaging-gtm' : 'headline-2',
              ])
        }
        content={
          isEligible && isFree
            ? formatFreeTrial([
                'upgrade prompt',
                isRepackagingGTM ? 'content-repackaging-gtm' : 'content',
              ])
            : formatUpgradePrompt([
                'home',
                'team tab',
                isRepackagingGTM && isStandard
                  ? 'content-standard-repackaging-gtm'
                  : isRepackagingGTM
                  ? 'content-free-repackaging-gtm'
                  : 'content-2',
              ])
        }
        isDarkTheme={false}
        cta={
          <button
            data-test-id={UpgradePromptTestIds.TeamHomeSidebarUpgradePrompt}
            className={classNames(styles.cta, styles.lightModeCta)}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => {
              Analytics.sendUIEvent({
                action: 'clicked',
                actionSubject: 'prompt',
                actionSubjectId: 'bcUpgradePrompt',
                source: 'workspaceBoardsHomeScreen',
                containers: {
                  organization: {
                    id: orgId,
                  },
                },
                attributes: {
                  isFreeTrial: !!isEligible,
                  promptId: 'memberHomeScreenPromptFull',
                },
              });
              openPlanSelection();
            }}
          >
            {' '}
            {isEligible
              ? formatFreeTrial([
                  'upgrade prompt',
                  isRepackagingGTM ? 'cta-ft-repackaging-gtm' : 'cta',
                ])
              : formatUpgradePrompt('upgrade')}
          </button>
        }
      />
    ),

    moreMenuShareInlineDialogPromptFull: (
      <UpgradePromptFullBase
        onDismiss={dismissMessage}
        loading={isLoading}
        icon={<DownloadIcon />}
        headline={formatUpgradePrompt([
          'board menu',
          'print and export',
          'headline-2',
        ])}
        content={formatUpgradePrompt([
          'board menu',
          'print and export',
          'content-2',
        ])}
        cta={
          <button
            data-test-id={UpgradePromptTestIds.PrintAndExportUpgradePrompt}
            className={classNames(styles.cta, styles.lightModeCta)}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => {
              Analytics.sendUIEvent({
                action: 'clicked',
                actionSubject: 'prompt',
                actionSubjectId: 'bcUpgradePrompt',
                source: 'printAndExportBoardInlineDialog',
                containers: {
                  organization: {
                    id: orgId,
                  },
                },
                attributes: {
                  isFreeTrial: !!isEligible,
                  promptId: 'moreMenuShareInlineDialogPromptFull',
                },
              });

              openPlanSelection();
            }}
          >
            {isEligible
              ? formatFreeTrial(['upgrade prompt', 'cta'])
              : formatUpgradePrompt('learn more')}
          </button>
        }
      />
    ),

    orgMemberRestrictedPromptFull: (
      <UpgradePromptFullBase
        loading={isLoading}
        icon={<MemberIcon />}
        headline={
          dontUpsell()
            ? formatUpgradePrompt([
                'team page',
                'members',
                'headline-membership-tooltip-auaa-desktop',
              ])
            : formatUpgradePrompt([
                'team page',
                'members',
                'headline-membership-tooltip-auaa-2',
              ])
        }
        content={
          dontUpsell()
            ? formatUpgradePrompt([
                'team page',
                'members',
                'content-membership-tooltip-auaa-desktop',
              ])
            : formatUpgradePrompt([
                'team page',
                'members',
                'content-membership-tooltip-auaa-2',
              ])
        }
        cta={
          <button
            data-test-id={UpgradePromptTestIds.OrgMemberRestrictedPermission}
            className={classNames(styles.cta, styles.lightModeCta)}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => {
              Analytics.sendUIEvent({
                action: 'clicked',
                actionSubject: 'prompt',
                actionSubjectId: 'bcUpgradePrompt',
                source: 'auaaUpgradeInlineDialog',
                containers: {
                  organization: {
                    id: orgId,
                  },
                },
                attributes: {
                  isFreeTrial: !!isEligible,
                  promptId: 'auaaPromptFull',
                },
              });

              isEligible && !dontUpsell()
                ? openPlanSelection()
                : window.open('/business-class');
            }}
          >
            {isEligible && !dontUpsell()
              ? formatFreeTrial(['upgrade prompt', 'cta'])
              : formatUpgradePrompt('learn more')}
          </button>
        }
      />
    ),

    pupLimitPopUpPromptFull: (
      <UpgradePromptFullBase
        loading={isLoading}
        icon={<BoardIcon />}
        headline={formatBusinessClassUpsell('get-unlimited-power-ups')}
        content={formatBusinessClassUpsell(
          'need-more-than-one-power-up-per-board-go-unlimited-with-business-class',
        )}
        onDismiss={additionalProps?.onClose}
        cta={
          <button
            className={classNames(styles.cta)}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => {
              Analytics.sendUIEvent({
                action: 'clicked',
                actionSubject: 'prompt',
                actionSubjectId: 'bcUpgradePrompt',
                source: 'pupLimitBCUpsellInlineDialog',
                containers: {
                  organization: {
                    id: orgId,
                  },
                },
                attributes: {
                  isFreeTrial: !!isEligible,
                  promptId: 'pupLimitPopUpPromptFull',
                },
              });

              openPlanSelection();
            }}
          >
            {isEligible
              ? formatFreeTrial(['upgrade prompt', 'cta'])
              : formatUpgradePrompt('learn more')}
          </button>
        }
      />
    ),

    pupUpgradeBannerButton: (
      <UpgradePromptButtonBase
        cta={formatUpgradePrompt('upgrade')}
        // eslint-disable-next-line react/jsx-no-bind
        ctaOnClick={() => {
          Analytics.sendClickedButtonEvent({
            buttonName: 'bcUpgradePrompt',
            source: 'powerUpDirectoryUpgradeBanner',
            containers: {
              organization: {
                id: orgId,
              },
            },
            attributes: {
              isFreeTrial: !!isEligible,
              promptId: 'pupUpgradeBannerButton',
            },
          });

          openPlanSelection();
        }}
        shouldFitContainer
      />
    ),

    pupUpgradePromptPill: (
      <>
        <div className="card-back-pup-upgrade-prompt-section">
          <div className="card-back-pup-upgrade-prompt-opener">
            {formatCardDetail('upgrade-to-get-unlimited-power-ups-2')}
          </div>
          <div className="card-back-pup-upgrade-prompt">
            <UpgradePromptPillBase
              testId={UpgradePromptTestIds.PuPsUpgradePill}
              icon={<BusinessClassIcon />}
              cta={formatUpgradePrompt('upgrade team')}
              ctaLink={isEligible ? freeTrialUrl : billingUrl}
              // eslint-disable-next-line react/jsx-no-bind
              ctaOnClick={() => {
                Analytics.sendUIEvent({
                  action: 'clicked',
                  actionSubject: 'pill',
                  actionSubjectId: 'bcUpgradePrompt',
                  source: 'pupCardBackSectionInlineDialog',
                  containers: {
                    organization: {
                      id: orgId,
                    },
                  },
                  attributes: {
                    isFreeTrial: !!isEligible,
                    promptId: 'pupUpgradePromptPill',
                  },
                });
              }}
            />
          </div>
        </div>
      </>
    ),

    teamBoardsHeaderUpgradePromptButton: (
      <UpgradePromptButtonBase
        testId={UpgradePromptTestIds.TeamBoardsHeaderUpgradeButton}
        cta={formatUpgradePrompt('upgrade')}
        // eslint-disable-next-line react/jsx-no-bind
        ctaOnClick={() => {
          Analytics.sendClickedButtonEvent({
            buttonName: 'bcUpgradePrompt',
            source: 'memberBoardsHomeScreen',
            containers: {
              organization: {
                id: orgId,
              },
            },
            attributes: {
              isFreeTrial: !!isEligible,
              promptId: 'teamBoardsHeaderUpgradePromptButton',
            },
          });

          openPlanSelection();
        }}
        shouldFitContainer
      />
    ),

    teamMembersScreenPromptFull: (
      <UpgradePromptFullBase
        loading={isLoading}
        icon={<BoardIcon />}
        isDarkTheme
        headline={formatUpgradePrompt([
          'team page',
          'members',
          'headline-sidebar-auaa-2',
        ])}
        content={formatUpgradePrompt([
          'team page',
          'members',
          'content-sidebar-auaa-2',
        ])}
        cta={
          <button
            data-test-id={UpgradePromptTestIds.TeamMembersPageUpgradePrompt}
            className={classNames(styles.cta, styles.darkModeCta)}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => {
              Analytics.sendUIEvent({
                action: 'clicked',
                actionSubject: 'prompt',
                actionSubjectId: 'bcUpgradePrompt',
                source: 'workspaceMembersScreen',
                containers: {
                  organization: {
                    id: orgId,
                  },
                },
                attributes: {
                  isFreeTrial: !!isEligible,
                  promptId: 'teamMembersScreenPromptFull',
                },
              });

              openPlanSelection();
            }}
          >
            {isEligible
              ? formatFreeTrial(['upgrade prompt', 'cta'])
              : formatUpgradePrompt('learn more')}
          </button>
        }
      />
    ),

    teamBoardsScreenPromptFull: (
      <UpgradePromptFullBase
        loading={isLoading}
        icon={<BoardIcon />}
        isDarkTheme
        headline={formatUpgradePrompt([
          'team page',
          'members',
          'headline-sidebar-auaa-2',
        ])}
        content={formatUpgradePrompt([
          'team page',
          'members',
          'content-sidebar-auaa-2',
        ])}
        cta={
          <button
            data-test-id={UpgradePromptTestIds.TeamMembersPageUpgradePrompt}
            className={classNames(styles.cta, styles.darkModeCta)}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => {
              Analytics.sendUIEvent({
                action: 'clicked',
                actionSubject: 'prompt',
                actionSubjectId: 'bcUpgradePrompt',
                source: 'workspaceMembersScreen',
                containers: {
                  organization: {
                    id: orgId,
                  },
                },
                attributes: {
                  isFreeTrial: !!isEligible,
                  promptId: 'teamBoardsScreenPromptFull',
                },
              });

              openPlanSelection();
            }}
          >
            {isEligible
              ? formatFreeTrial(['upgrade prompt', 'cta'])
              : formatUpgradePrompt('learn more')}
          </button>
        }
      />
    ),
  };

  if (typeof configs[promptId] === 'undefined') {
    throw new Error(`UpgradeSmartComponent: promptId ${promptId} not found"`);
  }

  return configs[promptId];
};

export const UpgradeSmartComponent: React.FC<Props> = (props) => (
  <ErrorBoundary
    tags={{
      ownershipArea: 'trello-bizteam',
      feature: Feature.UpgradePrompt,
    }}
  >
    <UpgradeSmartComponentNoBoundary {...props} />
  </ErrorBoundary>
);

export const UpgradeSmartComponentConnected: React.FC<Props> = (props) => (
  <ComponentWrapper>
    <UpgradeSmartComponent {...props} />
  </ComponentWrapper>
);
