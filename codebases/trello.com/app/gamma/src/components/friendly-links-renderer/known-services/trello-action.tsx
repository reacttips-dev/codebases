import React from 'react';
import { omit } from 'underscore';

import { truncate } from '@trello/strings';
import { EntityTransformers } from 'app/src/components/ActionEntities/EntityTransformers';
import RouterLink from 'app/src/components/RouterLink/RouterLink';
import { markdown } from 'app/src/components/TrelloMarkdown';
import { loadAction } from 'app/gamma/src/modules/loaders/load-actions';
import { State } from 'app/gamma/src/modules/types';
import { connect } from 'react-redux';
import { Dispatch } from 'app/gamma/src/types';
import { getActionById } from 'app/gamma/src/selectors/actions';
import { ActionModel } from 'app/gamma/src/types/models';
import { isCommentLike } from 'app/gamma/src/util/model-helpers/actions';

import { KnownService, KnownServiceComponentProps } from './known-service';

import styles from './styles.less';

interface OwnProps extends KnownServiceComponentProps {
  fullUrl: string;
  pathname: string;
  shortLink?: string;
  idAction: string;
}

interface StateProps {
  action?: ActionModel;
}

interface DispatchProps {
  loadAction: () => void;
}

export interface AllProps extends OwnProps, StateProps, DispatchProps {}

const mapStateToProps = (state: State, ownProps: OwnProps): StateProps => {
  return {
    action: getActionById(state, ownProps.idAction || ''),
  };
};

const mapDispatchToProps = (
  dispatch: Dispatch,
  ownProps: OwnProps,
): DispatchProps => {
  return {
    loadAction() {
      dispatch(loadAction(ownProps.idAction));
    },
  };
};

export class TrelloActionComponentUnconnected extends React.Component<AllProps> {
  componentDidMount() {
    if (!this.props.action) {
      this.props.loadAction();
    }
  }

  getIcon() {
    const { action } = this.props;
    const memberCreator = action ? action.memberCreator : null;

    if (
      !memberCreator ||
      !memberCreator.avatars ||
      !memberCreator.avatars[30]
    ) {
      return (
        <img
          className={styles.knownServiceIcon}
          alt="Trello Icon"
          src={require('resources/images/services/trello.png')}
        />
      );
    }

    return (
      <img
        className={styles.knownServiceIcon}
        alt="Trello Icon"
        src={memberCreator.avatars[30]}
      />
    );
  }

  getText() {
    const { action } = this.props;

    if (!action || !action.display) {
      return '';
    }

    const idContext =
      action.data && action.data.card ? action.data.card.id : '';

    const entityTransformer = new EntityTransformers(action.display)
      .fixTranslatebleLocaleGroup('actions')
      .addUrlContext()
      .makeEntitiesFriendly();

    let displayText = '';
    if (isCommentLike(action)) {
      const entities = entityTransformer.value().entities;

      if (entities) {
        const memberCreator =
          entities.memberCreator.type === 'member'
            ? entities.memberCreator
            : null;
        const comment =
          entities.comment.type === 'comment' ? entities.comment : null;

        if (comment && memberCreator) {
          displayText = `${memberCreator.text}: ${
            markdown ? markdown.comments.textInline(comment.text) : comment.text
          }`;
        }
      }
    } else {
      displayText = entityTransformer.getEntityStrings(idContext, 'actions');
    }

    return truncate(displayText, 64);
  }

  render() {
    const { action, fullUrl, pathname, shortLink, ...rest } = this.props;
    const anchorProps = omit(rest, ['loadAction', 'idAction']);

    return (
      <RouterLink
        {...anchorProps}
        href={pathname}
        className={styles.knownServiceLink}
        target=""
        rel=""
      >
        {this.getIcon()}
        {this.getText()}
      </RouterLink>
    );
  }
}

const TrelloActionComponent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrelloActionComponentUnconnected);

export const TrelloAction: KnownService<OwnProps> = {
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
    hash: new RegExp(`\
^\
\\#(?:comment|action)-([0-9a-f]{24})\
$\
`),
  },
  getMatchProps: ([fullUrl, pathname, shortLink, idAction]: string[]) => {
    return { fullUrl, pathname, shortLink, idAction };
  },
  Component: TrelloActionComponent,
};
