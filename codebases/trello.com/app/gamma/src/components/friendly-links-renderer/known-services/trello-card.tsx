import React from 'react';
import { omit } from 'underscore';

import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { loadCard } from 'app/gamma/src/modules/loaders/load-card';
import { State } from 'app/gamma/src/modules/types';
import { connect } from 'react-redux';
import { Dispatch } from 'app/gamma/src/types';
import { getCardByShortLink } from 'app/gamma/src/selectors/cards';
import { CardModel } from 'app/gamma/src/types/models';

import { KnownService, KnownServiceComponentProps } from './known-service';

import styles from './styles.less';

interface OwnProps extends KnownServiceComponentProps {
  fullUrl: string;
  pathname: string;
  shortLink?: string;
}

interface StateProps {
  card?: CardModel;
}

interface DispatchProps {
  loadCard: () => void;
}

interface AllProps extends OwnProps, StateProps, DispatchProps {}

const mapStateToProps = (state: State, ownProps: OwnProps): StateProps => {
  return {
    card: getCardByShortLink(state, ownProps.shortLink || ownProps.fullUrl),
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: OwnProps,
): DispatchProps => {
  return {
    loadCard() {
      dispatch(loadCard(ownProps.shortLink || ownProps.fullUrl, false));
    },
  };
};

export class TrelloCardComponentUnconnected extends React.Component<AllProps> {
  componentDidMount() {
    if (!this.props.card) {
      this.props.loadCard();
    }
  }

  render() {
    const { card, fullUrl, pathname, shortLink, ...rest } = this.props;
    const anchorProps = omit(rest, 'loadCard');

    const fallbackUrl = shortLink ? `/c/${shortLink}` : pathname;
    const url = card && card.url ? card.url : fallbackUrl;
    const name = card && card.name ? card.name : fullUrl;

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

const TrelloCardComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrelloCardComponentUnconnected);

export const TrelloCard: KnownService<OwnProps> = {
  match: {
    protocol: location.protocol,
    host: location.host,
    pathname: new RegExp(`\
^\
/c/\
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
  Component: TrelloCardComponent,
};
