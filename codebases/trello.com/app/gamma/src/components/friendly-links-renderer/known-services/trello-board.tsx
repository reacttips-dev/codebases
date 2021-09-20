import React from 'react';
import { omit } from 'underscore';

import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { loadBoard } from 'app/gamma/src/modules/loaders/load-board';
import { State } from 'app/gamma/src/modules/types';
import { connect } from 'react-redux';
import { Dispatch } from 'app/gamma/src/types';
import { getBoardByShortLink } from 'app/gamma/src/selectors/boards';
import { BoardModel } from 'app/gamma/src/types/models';

import { KnownService, KnownServiceComponentProps } from './known-service';

import styles from './styles.less';

interface OwnProps extends KnownServiceComponentProps {
  fullUrl: string;
  pathname: string;
  shortLink?: string;
}

interface StateProps {
  board?: BoardModel;
}

interface DispatchProps {
  loadBoard: () => void;
}

interface AllProps extends OwnProps, StateProps, DispatchProps {}

const mapStateToProps = (state: State, ownProps: OwnProps): StateProps => {
  return {
    board: getBoardByShortLink(state, ownProps.shortLink || ownProps.fullUrl),
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: OwnProps,
): DispatchProps => {
  return {
    loadBoard() {
      dispatch(loadBoard(ownProps.shortLink || ownProps.fullUrl));
    },
  };
};

export class TrelloBoardComponentUnconnected extends React.Component<AllProps> {
  componentDidMount() {
    if (!this.props.board) {
      this.props.loadBoard();
    }
  }

  render() {
    const { board, fullUrl, pathname, shortLink, ...rest } = this.props;
    const anchorProps = omit(rest, 'loadBoard');

    const fallbackUrl = shortLink ? `/b/${shortLink}` : pathname;
    const url = board && board.url && board.url ? board.url : fallbackUrl;
    const name = board && board.name ? board.name : fullUrl;

    return (
      <RouterLink
        {...anchorProps}
        href={url}
        className={styles.knownServiceLink}
        target=""
        rel=""
      >
        <img
          className={styles.knownServiceIcon}
          alt="Trello Icon"
          src={require('resources/images/services/trello.png')}
        />
        {name}
      </RouterLink>
    );
  }
}

const TrelloBoardComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrelloBoardComponentUnconnected);

export const TrelloBoard: KnownService<OwnProps> = {
  match: {
    protocol: location.protocol,
    host: location.host,
    pathname: new RegExp(`\
^\
/b/\
(\
[a-zA-Z0-9]{8}|\
[a-fA-F0-9]{24}\
)\
(?:$|/.*)\
`),
  },
  getMatchProps: ([fullUrl, pathname, shortLink]: string[]) => {
    return { fullUrl, pathname, shortLink };
  },
  Component: TrelloBoardComponent,
};
