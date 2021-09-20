import React from 'react';
import classNames from 'classnames';
import { Select } from '@trello/nachos/select';
import { forTemplate, forNamespace } from '@trello/i18n';
import { ProductFeatures } from '@trello/product-features';
import {
  ENTERPRISE_VIS_OPTIONS,
  ORG_VIS_OPTIONS,
  PERSONAL_VIS_OPTIONS,
} from 'app/gamma/src/modules/state/ui/create-menu';
import {
  AccessLevel,
  BoardPermissionLevel,
  TeamModel,
} from 'app/gamma/src/types/models';
import { EnterpriseIcon } from '@trello/nachos/icons/enterprise';
import { OrganizationIcon } from '@trello/nachos/icons/organization';
import { PrivateIcon } from '@trello/nachos/icons/private';
import { PublicIcon } from '@trello/nachos/icons/public';
import { EnterpriseWithPermissions } from 'app/gamma/src/selectors/enterprises';
import { OrgWithPermissions } from 'app/gamma/src/selectors/teams';
import { usePopover, Popover, PopoverScreen } from '@trello/nachos/popover';
import { PopoverConfirm } from 'app/src/components/PopoverConfirm';

import styles from './VisibilitySelector.less';

const formatBoardMenuVis = forTemplate('board_menu_vis', {
  shouldEscapeStrings: false,
});
const formatTemplates = forTemplate('templates');
const formatRootString = forNamespace();

interface VisData {
  [key: string]: {
    visibility: BoardPermissionLevel;
    icon: JSX.Element;
  };
}

const VIS_DATA: VisData = {
  [AccessLevel.Private]: {
    visibility: AccessLevel.Private,
    icon: <PrivateIcon />,
  },
  [AccessLevel.Public]: {
    visibility: AccessLevel.Public,
    icon: <PublicIcon />,
  },
  [AccessLevel.Org]: {
    visibility: AccessLevel.Org,
    icon: <OrganizationIcon />,
  },
  [AccessLevel.Enterprise]: {
    visibility: AccessLevel.Enterprise,
    icon: <EnterpriseIcon />,
  },
};

const getSubtext = (
  visibility: BoardPermissionLevel,
  team: TeamModel | undefined,
  isDisabled: boolean,
) => {
  const hasSuperAdmins = team && team?.premiumFeatures?.includes('superAdmins');
  const teamContext = hasSuperAdmins
    ? 'with super admins'
    : team
    ? 'with organization'
    : 'without organization';

  const content = [];

  if (team) {
    content.push(
      <span key={visibility} className={styles.subText}>
        {formatBoardMenuVis(['permission subtext', teamContext, visibility], {
          orgName: team.displayName,
        })}
      </span>,
    );
  } else {
    content.push(
      <span key={visibility} className={styles.subText}>
        {formatBoardMenuVis(['permission subtext', teamContext, visibility])}
      </span>,
    );
  }

  if (isDisabled) {
    content.push(
      <span key="error" className={classNames(styles.subText, styles.error)}>
        {` ${formatBoardMenuVis([
          'illegal visibility',
          team ? 'create' : 'create teamless',
        ])}`}
      </span>,
    );
  }

  return content;
};

const idPrefix = `${Date.now()}-`; // for id specificity

export interface VisibilitySelectorProps {
  selectedVisibility: BoardPermissionLevel | null;
  selectedTeam: OrgWithPermissions | null;
  enterpriseWithPermissions?: EnterpriseWithPermissions;
  onSelectVisibility: (visibility: BoardPermissionLevel) => void;
}

export const VisibilitySelector: React.FunctionComponent<VisibilitySelectorProps> = ({
  onSelectVisibility,
  selectedTeam,
  enterpriseWithPermissions,
  selectedVisibility,
}) => {
  const enterpriseVisible =
    selectedTeam &&
    selectedTeam.model &&
    !!selectedTeam.model.idEnterprise &&
    ProductFeatures.isEnterpriseProduct(selectedTeam.model.products?.[0]);

  const visibilityOptions = enterpriseVisible
    ? ENTERPRISE_VIS_OPTIONS
    : selectedTeam
    ? ORG_VIS_OPTIONS
    : PERSONAL_VIS_OPTIONS;

  const visibilityOptionsData = visibilityOptions.map(
    (option) => VIS_DATA[option],
  );

  const options = visibilityOptionsData.map(({ visibility, icon }) => {
    const isDisabled = selectedTeam
      ? !selectedTeam.allowedVis.includes(visibility)
      : enterpriseWithPermissions
      ? !enterpriseWithPermissions.allowedVis.includes(visibility)
      : false;
    const isSelected = selectedVisibility === visibility;

    return {
      label: formatBoardMenuVis(visibility),
      value: visibility,
      isDisabled,
      image: (
        <div className={styles.iconContainer}>
          {React.cloneElement(icon, {
            size: 'medium',
            block: true,
            dangerous_className: classNames(
              styles.iconVis,
              isSelected && styles.selected,
              isDisabled && styles.disabled,
            ),
          })}
        </div>
      ),
      meta: (
        <div>{getSubtext(visibility, selectedTeam?.model, isDisabled)}</div>
      ),
    };
  });

  const selectedVisibilityValue = options.find(
    (option) => option.value === selectedVisibility,
  );

  enum VisibilityChooserScreen {
    ConfirmPublic,
  }

  const {
    popoverProps: confirmPublicPopoverProps,
    triggerRef: confirmPublicTriggerRef,
    toggle: confirmPublicToggle,
    hide: confirmPublicHide,
  } = usePopover<HTMLDivElement>({
    initialScreen: VisibilityChooserScreen.ConfirmPublic,
  });

  return (
    <>
      <label htmlFor={`${idPrefix}create-board-select-visibility`}>
        {formatTemplates('visibility')}
      </label>
      <div ref={confirmPublicTriggerRef}>
        <Select
          id={`${idPrefix}create-board-select-visibility`}
          value={selectedVisibilityValue}
          options={options}
          // eslint-disable-next-line react/jsx-no-bind
          onChange={(option: { value: string }) => {
            const newOption = visibilityOptionsData.find(
              ({ visibility }) => visibility === option.value,
            );
            if (newOption?.visibility === 'public') {
              confirmPublicToggle();
            } else if (newOption) {
              onSelectVisibility(newOption.visibility);
            }
          }}
        />
      </div>
      <Popover {...confirmPublicPopoverProps} size="large">
        <PopoverScreen
          id={VisibilityChooserScreen.ConfirmPublic}
          title={formatRootString([
            'confirm',
            'public board confirmation',
            'title',
          ])}
          noHorizontalPadding
        >
          <PopoverConfirm
            confirmKey="public board confirmation"
            // eslint-disable-next-line react/jsx-no-bind
            confirmCallback={() => {
              onSelectVisibility(AccessLevel.Public);
              confirmPublicHide();
            }}
          />
        </PopoverScreen>
      </Popover>
    </>
  );
};
