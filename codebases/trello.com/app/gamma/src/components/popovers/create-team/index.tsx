import { State } from 'app/gamma/src/modules/types';
import {
  submitCreateTeam,
  TeamType,
} from 'app/gamma/src/modules/state/models/teams';
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'app/gamma/src/types';
import { getMyEnterprises } from 'app/gamma/src/selectors/enterprises';
import { EnterpriseModel } from 'app/gamma/src/types/models';
import { default as CreateTeamComponent } from './create-team';

interface StateProps {
  readonly enterprises?: EnterpriseModel[];
}

interface OwnProps {
  readonly teamType: TeamType;
}

interface DispatchProps {
  readonly submitCreateTeam: (action: {
    type: TeamType;
    displayName: string;
    teamType?: string;
    desc?: string;
    enterprise?: string;
    redirectAfterCreate?: boolean;
  }) => void;
}

interface AllProps extends StateProps, OwnProps, DispatchProps {}

const mapStateToProps = (state: State): StateProps => {
  const enterprises = getMyEnterprises(state);

  return { enterprises };
};

function mapDispatchToProps(
  dispatch: Dispatch,
  ownProps: OwnProps,
): DispatchProps {
  return {
    submitCreateTeam: ({
      type,
      displayName,
      teamType,
      desc,
      enterprise,
      redirectAfterCreate,
    }) => {
      dispatch(
        submitCreateTeam({
          type,
          displayName,
          teamType,
          desc,
          enterprise,
          redirectAfterCreate,
        }),
      );
    },
  };
}

const CreateTeamContainer = (props: AllProps) => {
  return <CreateTeamComponent {...props} />;
};

export const CreateTeamPopover = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateTeamContainer);
