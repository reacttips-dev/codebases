/* eslint-disable import/no-default-export */
import React from 'react';
import { connect } from 'react-redux';

import { loadHeader } from 'app/gamma/src/modules/loaders/load-header';
import { State } from 'app/gamma/src/modules/types';
import { getMe } from 'app/gamma/src/selectors/members';
import { getMyId, isLoggedIn } from 'app/gamma/src/selectors/session';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';

import { MemberModel } from 'app/gamma/src/types/models';
import { Dispatch } from 'app/gamma/src/types';
import Header from './header';

import { addSubscription } from 'app/scripts/init/subscriber';
interface StateProps {
  readonly myId: string;
  readonly isLoggedIn: boolean;
  readonly me: MemberModel | undefined;
}
interface DispatchProps {
  readonly loadHeaderData: (id: string) => void;
}
interface AllProps extends StateProps, DispatchProps {}

function mapStateToProps(state: State): StateProps {
  return {
    myId: getMyId(state),
    isLoggedIn: isLoggedIn(state),
    me: getMe(state),
  };
}

function mapDispatchToProps(dispatch: Dispatch): DispatchProps {
  return {
    loadHeaderData: (id) => dispatch(loadHeader(id)),
  };
}

class HeaderContainer extends React.Component<AllProps> {
  unsubscribeFromUpdates?: () => void;

  loader = (prevProps = { myId: '' }) => {
    const { loadHeaderData, myId } = this.props;
    if (myId && myId !== prevProps.myId) {
      this.unsubscribe();
      this.unsubscribeFromUpdates = addSubscription({
        modelType: 'Member',
        idModel: myId,
        tags: ['messages', 'updates'],
      });

      loadHeaderData(myId);
    }
  };

  constructor(props: AllProps) {
    super(props);
    this.loader();
  }

  componentDidUpdate(prevProps: AllProps) {
    this.loader(prevProps);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  unsubscribe() {
    if (this.unsubscribeFromUpdates) {
      this.unsubscribeFromUpdates();
      this.unsubscribeFromUpdates = undefined;
    }
  }

  render() {
    return <Header {...this.props} />;
  }
}

const Connected = connect(mapStateToProps, mapDispatchToProps)(HeaderContainer);

const WithProviders: React.FunctionComponent = () => {
  return (
    <ComponentWrapper>
      <Connected />
    </ComponentWrapper>
  );
};

export default WithProviders;
