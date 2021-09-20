/* eslint-disable import/no-default-export */
import { MemberListItem } from 'app/src/components/MemberListItem';
import { State } from 'app/gamma/src/modules/types';
import React from 'react';
import { connect } from 'react-redux';
import { getMemberById } from 'app/gamma/src/selectors/members';
import { MemberModel } from 'app/gamma/src/types/models';
import { useRouteId, RouteId } from '@trello/routes';
import { Analytics } from '@trello/atlassian-analytics';

interface OwnProps {
  id: string;
}

interface StateProps {
  member: MemberModel;
}

const mapStateToProps = (state: State, props: OwnProps): StateProps => ({
  member: getMemberById(state, props.id)!,
});

const MemberResult: React.FunctionComponent<OwnProps & StateProps> = ({
  member,
}) => {
  const routeId = useRouteId();

  return (
    <MemberListItem
      hideUnconfirmed
      member={member}
      isSearchRoute={routeId === RouteId.SEARCH}
      // eslint-disable-next-line react/jsx-no-bind
      onClick={() => {
        Analytics.sendClickedLinkEvent({
          linkName: 'memberSearchResultLink',
          source: 'searchInlineDialog',
        });
      }}
    />
  );
};

export default connect(mapStateToProps)(MemberResult);
