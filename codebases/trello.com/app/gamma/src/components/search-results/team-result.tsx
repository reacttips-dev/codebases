/* eslint-disable import/no-default-export */
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { State } from 'app/gamma/src/modules/types';
import React from 'react';
import { connect } from 'react-redux';
import { getMyTeamById } from 'app/gamma/src/selectors/teams';
import { TeamModel } from 'app/gamma/src/types/models';
import styles from './search-results.less';
import { Analytics } from '@trello/atlassian-analytics';

interface OwnProps {
  id: string;
}

interface StateProps {
  team: TeamModel | null;
}

interface TeamResultProps extends OwnProps, StateProps {}

const mapStateToProps = (state: State, props: OwnProps): StateProps => ({
  team: getMyTeamById(state, props.id),
});

const TeamResult = ({ team }: TeamResultProps) => {
  return team ? (
    <RouterLink
      href={`/${team.name}`}
      className={styles.teamResult}
      // eslint-disable-next-line react/jsx-no-bind
      onClick={() => {
        Analytics.sendClickedLinkEvent({
          linkName: 'teamSearchResultLink',
          source: 'searchInlineDialog',
        });
      }}
    >
      {team.displayName}
    </RouterLink>
  ) : null;
};

export default connect(mapStateToProps)(TeamResult);
