/* eslint-disable import/no-default-export */
import { isDesktop } from '@trello/browser';
import { BoardIcon } from '@trello/nachos/icons/board';
import { TemplateBoardIcon } from '@trello/nachos/icons/template-board';
import { OrganizationIcon } from '@trello/nachos/icons/organization';
import { BusinessClassIcon } from '@trello/nachos/icons/business-class';
import { EnterpriseIcon } from '@trello/nachos/icons/enterprise';
import { PopoverMenu, PopoverMenuButton } from 'app/src/components/PopoverMenu';
import { preloadCreateBoardData } from 'app/gamma/src/modules/state/ui/create-menu';
import { State } from 'app/gamma/src/modules/types';
import { TeamType } from 'app/gamma/src/modules/state/models/teams';
import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import {
  hasEnterprises,
  isPaidManagedEnterpriseMember,
} from 'app/gamma/src/selectors/enterprises';
import { preloadData } from 'app/src/components/InviteTeamMembers/TeamIllustrationAnimation';
import { HeaderTestIds } from '@trello/test-ids';
import { forTemplate } from '@trello/i18n';
import { Analytics } from '@trello/atlassian-analytics';
import { Auth } from 'app/scripts/db/auth';
import styles from './HeaderCreateMenu.less';

const format = forTemplate('header_add_menu');

interface StateProps {
  enableEnterpriseAdd?: boolean;
  isEnterpriseManaged?: boolean;
  isDesktop?: boolean;
}

interface OwnProps {
  onClickCreateEnterpriseTeam: () => void;
  onClickCreateBoardFromTemplate: () => void;
  onCreateBoardOverlayShown: () => void;
  onCreateTeamOverlayShown(teamType: TeamType): void;
}

interface HeaderCreateMenuProps extends OwnProps, StateProps {}

const mapStateToProps = (state: State): StateProps => ({
  enableEnterpriseAdd: hasEnterprises(state),
  isEnterpriseManaged: isPaidManagedEnterpriseMember(state),
  isDesktop: isDesktop(),
});

export const HeaderCreateMenu: React.FC<HeaderCreateMenuProps> = ({
  enableEnterpriseAdd,
  isEnterpriseManaged,
  onCreateBoardOverlayShown,
  onCreateTeamOverlayShown,
  onClickCreateEnterpriseTeam,
  onClickCreateBoardFromTemplate,
  isDesktop,
}) => {
  const dispatch = useDispatch();
  const showCreateTeam = !isEnterpriseManaged;
  const showCreateBCTeam = !isDesktop && !isEnterpriseManaged;
  const showCreateEnterpriseTeam = !!enableEnterpriseAdd;
  const shouldShowStartWithATemplateNewPill = !Auth.me().isDismissed(
    'start-with-a-template',
  );

  useEffect(() => {
    dispatch(preloadCreateBoardData());
    preloadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startWithATemplateTitle = shouldShowStartWithATemplateNewPill ? (
    <span className={styles.newPillContainer}>
      {format('start-with-a-template')}
      <span className={styles.newPill}>{format('new')}</span>
    </span>
  ) : (
    format('start-with-a-template')
  );

  return (
    <PopoverMenu>
      <PopoverMenuButton
        description={format('a-board-is-made-up-of-cards-ordered-on-lists')}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={() => {
          onCreateBoardOverlayShown();
        }}
        title={format('create-board')}
        testId={HeaderTestIds.CreateBoardButton}
        icon={<BoardIcon dangerous_className={styles.headerCreateIcon} />}
      />
      <PopoverMenuButton
        description={format('get-started-faster')}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={() => {
          Analytics.sendUIEvent({
            action: 'clicked',
            actionSubject: 'menuItem',
            actionSubjectId: 'startWithTemplateMenuItem',
            source: 'createMenuInlineDialog',
          });

          onClickCreateBoardFromTemplate();
        }}
        title={startWithATemplateTitle}
        testId={HeaderTestIds.CreateBoardFromTemplateButton}
        icon={
          <TemplateBoardIcon dangerous_className={styles.headerCreateIcon} />
        }
      />
      {showCreateTeam && (
        <PopoverMenuButton
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => {
            onCreateTeamOverlayShown(TeamType.Default);
          }}
          description={format('a-team-is-a-group-of-boards-and-people')}
          title={format('create-team')}
          testId={HeaderTestIds.CreateTeamButton}
          icon={
            <OrganizationIcon dangerous_className={styles.headerCreateIcon} />
          }
        />
      )}
      {showCreateBCTeam && (
        <PopoverMenuButton
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => {
            onCreateTeamOverlayShown(TeamType.Business);
          }}
          description={format('with-business-class-your-team-has-more')}
          title={format('create-business-team')}
          testId={HeaderTestIds.CreateBusinessTeamButton}
          icon={
            <BusinessClassIcon dangerous_className={styles.headerCreateIcon} />
          }
        />
      )}
      {showCreateEnterpriseTeam && (
        <PopoverMenuButton
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => {
            Analytics.sendUIEvent({
              action: 'clicked',
              actionSubject: 'menuItem',
              actionSubjectId: 'createEnterpriseTeamMenuItem',
              source: 'createMenuInlineDialog',
            });
            onClickCreateEnterpriseTeam();
          }}
          description={format('your-team-will-be-owned-by-an-enterprise')}
          title={format('create-enterprise-team')}
          testId={HeaderTestIds.CreateEnterpriseTeamButton}
          icon={
            <EnterpriseIcon dangerous_className={styles.headerCreateIcon} />
          }
        />
      )}
    </PopoverMenu>
  );
};

export default connect(mapStateToProps)(HeaderCreateMenu);
