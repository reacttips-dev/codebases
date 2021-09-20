import React, { useState } from 'react';
import { Button } from '@trello/nachos/button';
import { CheckIcon } from '@trello/nachos/icons/check';
import { DownIcon } from '@trello/nachos/icons/down';
import { sendErrorEvent } from '@trello/error-reporting';
import styles from './MigrationWizardMembershipDropdown.less';
import { Popover, usePopover } from '@trello/nachos/popover';
import { PopoverMenu, PopoverMenuButton } from 'app/src/components/PopoverMenu';
import { forNamespace } from '@trello/i18n';
import { Feature } from 'app/scripts/debug/constants';
import { useMigrationWizardMembershipDropdownMutation } from './MigrationWizardMembershipDropdownMutation.generated';
import { useMigrationWizardRemoveMembersFromWorkspaceMutation } from './MigrationWizardRemoveMembersFromWorkspaceMutation.generated';

const viewTitle = forNamespace('view title');
const format = forNamespace(['migration wizard']);

const membershipNameMap = {
  guest: 'guest-membership',
  normal: 'normal-membership',
  admin: 'admin-membership',
};

type memberships = 'guest' | 'normal' | 'admin';

interface MigrationWizardTeamDropdownProps {
  orgId: string;
  isPaidProduct: boolean;
  memberId: string;
  onError?: () => void;
  onSuccess?: () => void;
}

export const MigrationWizardMembershipDropdown: React.FC<MigrationWizardTeamDropdownProps> = ({
  orgId,
  isPaidProduct,
  memberId,
  onError = () => {},
  onSuccess = () => {},
}) => {
  const {
    popoverProps,
    toggle,
    hide,
    triggerRef,
  } = usePopover<HTMLButtonElement>();

  const [selectedOption, setSelectedOption] = useState<memberships>('guest');
  const [addMembersToOrg] = useMigrationWizardMembershipDropdownMutation();
  const [
    removeMembersFromWorkspace,
  ] = useMigrationWizardRemoveMembersFromWorkspaceMutation();

  const onChangeMembership = async (option: memberships) => {
    let errorMessage;

    if (option === 'guest') {
      const { data } = await removeMembersFromWorkspace({
        variables: {
          orgId,
          users: [{ id: memberId }] ?? [],
          type: 'guest',
        },
      });

      errorMessage = data?.removeMembersFromWorkspace?.error;
    } else {
      const { data } = await addMembersToOrg({
        variables: {
          orgId,
          users: [{ id: memberId }] ?? [],
          type: option,
        },
      });

      errorMessage = data?.addMembersToOrg?.error;
    }
    if (errorMessage) {
      onError();
      sendErrorEvent(new Error(errorMessage), {
        tags: {
          ownershipArea: 'trello-bizteam',
          feature: Feature.MigrationWizard,
        },
        extraData: {
          component: 'MigrationWizardMembershipDropdown',
          errorCode: 'UNKNOWN_ERROR',
        },
      });
    } else {
      onSuccess();
      setSelectedOption(option);
    }
    hide();
  };

  return (
    <>
      <Button
        iconAfter={
          <DownIcon size="small" dangerous_className={styles.downIcon} />
        }
        className={styles.permissionButton}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={() => toggle()}
        ref={triggerRef}
      >
        {format(membershipNameMap[selectedOption])}
      </Button>
      <Popover {...popoverProps} title={viewTitle('change permissions')}>
        <PopoverMenu className={styles.dropdownPopover}>
          <PopoverMenuButton
            className={styles.popoverMenubuttonOptions}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => onChangeMembership('guest')}
          >
            <span className={styles.membershipTitle}>
              {format('guest-membership')}
            </span>
            {selectedOption === 'guest' && (
              <CheckIcon
                size="small"
                dangerous_className={styles.checkmark}
                block
              />
            )}
            <div>
              <span className={styles.membershipSubText}>
                {format('guest-membership-description')}
              </span>
            </div>
          </PopoverMenuButton>
          <PopoverMenuButton
            className={styles.popoverMenubuttonOptions}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => onChangeMembership('normal')}
          >
            <span className={styles.membershipTitle}>
              {format('normal-membership')}
            </span>
            {selectedOption === 'normal' && (
              <CheckIcon
                size="small"
                dangerous_className={styles.checkmark}
                block
              />
            )}
            <div>
              <span className={styles.membershipSubText}>
                {isPaidProduct
                  ? format('normal-membership-description-paid')
                  : format('normal-membership-description-free')}
              </span>
            </div>
          </PopoverMenuButton>
          {isPaidProduct && (
            <PopoverMenuButton
              className={styles.popoverMenubuttonOptions}
              // eslint-disable-next-line react/jsx-no-bind
              onClick={() => onChangeMembership('admin')}
            >
              <span className={styles.membershipTitle}>
                {format('admin-membership')}
              </span>
              {selectedOption === 'admin' && (
                <CheckIcon
                  size="small"
                  dangerous_className={styles.checkmark}
                  block
                />
              )}
              <div>
                <span className={styles.membershipSubText}>
                  {format('admin-membership-description')}
                </span>
              </div>
            </PopoverMenuButton>
          )}
        </PopoverMenu>
      </Popover>
    </>
  );
};
