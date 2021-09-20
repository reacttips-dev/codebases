import { sendErrorEvent } from '@trello/error-reporting';
// eslint-disable-next-line no-restricted-imports
import {
  Board_Prefs_PermissionLevel,
  Organization_Prefs_BoardVisibilityRestrict,
  PremiumFeatures,
} from '@trello/graphql/src/generated';
import { CheckIcon } from '@trello/nachos/icons/check';
import { DownIcon } from '@trello/nachos/icons/down';
import { EnterpriseIcon } from '@trello/nachos/icons/enterprise';
import { OrganizationIcon } from '@trello/nachos/icons/organization';
import { PrivateIcon } from '@trello/nachos/icons/private';
import { PublicIcon } from '@trello/nachos/icons/public';
import { Button } from '@trello/nachos/button';
import { Popover, usePopover } from '@trello/nachos/popover';
import { canSetVisibilityOnBoard } from '@trello/organizations';
import { Feature } from 'app/scripts/debug/constants';
import { useMigrationWizardBoardVisibilityChooserBoardVisibilityMutation } from './MigrationWizardBoardVisibilityChooserBoardVisibilityMutation.generated';
import classNames from 'classnames';
import React, { useState } from 'react';
import { ProductFeatures } from '@trello/product-features';
import { forNamespace } from '@trello/i18n';
import { PopoverMenu, PopoverMenuButton } from 'app/src/components/PopoverMenu';
import styles from './MigrationWizardBoardVisibilityChooser.less';

const format = forNamespace(['migration wizard', 'board_menu_vis']);
const formatBoardPerms = forNamespace(['migration wizard', 'board perms']);

const visibilityData = {
  private: {
    Icon: PrivateIcon,
    className: classNames(styles.iconVis, styles.iconPrivate),
  },
  public: {
    Icon: PublicIcon,
    className: classNames(styles.iconVis, styles.iconPublic),
  },
  org: {
    Icon: OrganizationIcon,
    className: styles.iconVis,
  },
  enterprise: {
    Icon: EnterpriseIcon,
    className: styles.iconVis,
  },
};

interface MigrationWizardBoardVisibilityChooserProps {
  org: {
    id?: string;
    idEnterprise?: string | null;
    products?: number[];
    premiumFeatures?: PremiumFeatures[];
    displayName?: string;
    prefs?: {
      boardVisibilityRestrict?: Organization_Prefs_BoardVisibilityRestrict | null;
    } | null;
  };
  idBoard: string;
  permissionLevel: Board_Prefs_PermissionLevel;
  onError?: () => void;
  onSuccess?: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLElement>) => void;
}

export const MigrationWizardBoardVisibilityChooser: React.FunctionComponent<MigrationWizardBoardVisibilityChooserProps> = ({
  org,
  idBoard,
  permissionLevel,
  onError = () => {},
  onSuccess = () => {},
}) => {
  const {
    popoverProps,
    toggle,
    hide,
    triggerRef,
  } = usePopover<HTMLButtonElement>();
  const [selectedOption, setSelectedOption] = useState(permissionLevel);
  const [
    updateBoardVisibility,
  ] = useMigrationWizardBoardVisibilityChooserBoardVisibilityMutation();

  const enterpriseVisible =
    org?.idEnterprise && ProductFeatures.isEnterpriseProduct(org.products?.[0]);
  const visibilityOptions: Board_Prefs_PermissionLevel[] = enterpriseVisible
    ? ['private', 'org', 'enterprise', 'public']
    : ['private', 'org', 'public'];
  const hasSuperAdmins = org?.premiumFeatures?.includes('superAdmins');
  const teamContext = hasSuperAdmins
    ? 'with super admins'
    : 'with organization';

  return (
    <>
      <Button
        iconAfter={<DownIcon dangerous_className={styles.buttonIcon} />}
        className={styles.visibilityButton}
        shouldFitContainer
        // eslint-disable-next-line react/jsx-no-bind
        onClick={() => toggle()}
        ref={triggerRef}
      >
        {selectedOption && formatBoardPerms([selectedOption, 'name'])}
      </Button>
      <Popover {...popoverProps}>
        <PopoverMenu className={styles.popoverMenu}>
          {visibilityOptions.map((option) => {
            const { Icon, className } = visibilityData[option];
            const isDisabled = !canSetVisibilityOnBoard({
              org: {
                idEnterprise: org.idEnterprise,
                prefs: {
                  boardVisibilityRestrict: org.prefs?.boardVisibilityRestrict,
                },
                products: org.products,
              },
              boardVisibility: option,
              isOrgAdmin: true,
            });

            return (
              <PopoverMenuButton
                key={option}
                // eslint-disable-next-line react/jsx-no-bind
                onClick={async () => {
                  try {
                    await updateBoardVisibility({
                      variables: {
                        boardId: idBoard,
                        visibility: option,
                      },
                    });
                    onSuccess();
                    setSelectedOption(option);
                    hide();
                  } catch (err) {
                    onError();
                    sendErrorEvent(err, {
                      tags: {
                        ownershipArea: 'trello-bizteam',
                        feature: Feature.MigrationWizard,
                      },
                      extraData: {
                        component: 'MigrationWizardBoardVisibilityChooser',
                        method: 'onClick',
                        errorCode:
                          err?.networkError?.extensions?.code ??
                          'UNKNOWN_ERROR',
                      },
                    });
                    hide();
                  }
                }}
                className={classNames(
                  styles.menuItem,
                  isDisabled && styles.disabled,
                )}
                disabled={isDisabled}
              >
                <Icon
                  size="small"
                  dangerous_className={classNames(
                    className,
                    isDisabled && styles.disabled,
                  )}
                />
                {format(option)}
                {option === selectedOption && (
                  <CheckIcon
                    size="small"
                    dangerous_className={styles.checkmark}
                    block
                  />
                )}
                <div className={styles.subName}>
                  <span key={option}>
                    {format(['permission subtext', teamContext, option], {
                      orgName: (
                        <React.Fragment key="permission-subtext">
                          {org?.displayName}
                        </React.Fragment>
                      ),
                    })}
                  </span>
                  {isDisabled && (
                    <span key="error" className={styles.error}>
                      {` ${format(['illegal visibility', 'create'])}`}
                    </span>
                  )}
                </div>
              </PopoverMenuButton>
            );
          })}
        </PopoverMenu>
      </Popover>
    </>
  );
};
