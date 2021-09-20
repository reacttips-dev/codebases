import React, { AnchorHTMLAttributes } from 'react';

import {
  KnownService,
  KnownServiceComponentProps,
  execMatch,
} from './known-services/known-service';

import { FogBugzCase } from './known-services/fogbugz-case';
import { KilnCase } from './known-services/kiln-case';
import { TrelloAction } from './known-services/trello-action';
import { TrelloBoard } from './known-services/trello-board';
import { TrelloCard } from './known-services/trello-card';
import {
  SmartLink,
  SmartLinkAnalyticsContext,
} from 'app/src/components/SmartMedia';

export class FriendlyLink extends React.PureComponent<
  AnchorHTMLAttributes<HTMLAnchorElement>
> {
  static contextType = SmartLinkAnalyticsContext;

  knownServices: KnownService<KnownServiceComponentProps>[] = [
    TrelloBoard,
    TrelloAction,
    TrelloCard,
    FogBugzCase,
    KilnCase,
  ];

  render() {
    const { href, children, ...props } = this.props;
    const plainLink = () => <a {...this.props} />;

    // if href !== children then we want to show the link name that the user set
    if (href && href === children) {
      for (const knownService of this.knownServices) {
        const matchedValues = execMatch(knownService, href);
        if (matchedValues !== null) {
          const { Component, getMatchProps } = knownService;

          return <Component {...props} {...getMatchProps(matchedValues)} />;
        }
      }

      return (
        <SmartLink
          url={href}
          // eslint-disable-next-line react/jsx-no-bind
          plainLink={plainLink}
          analyticsContext={this.context}
        />
      );
    }

    return plainLink();
  }
}
