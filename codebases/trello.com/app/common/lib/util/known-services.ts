/* eslint-disable @trello/disallow-filenames */

/**
 * NOTE: This utility has an unhealthy dependency on the FriendlyLinks Gamma code.
 * Refactoring Known Services was outside the scope of what was being built at
 * the time. At some point, it would make sense to rip the known services code out
 * of Gamma.
 */
import {
  KnownService as GammaKnownService,
  KnownServiceComponentProps,
  execMatch,
} from 'app/gamma/src/components/friendly-links-renderer/known-services/known-service';

import { FogBugzCase } from 'app/gamma/src/components/friendly-links-renderer/known-services/fogbugz-case';
import { KilnCase } from 'app/gamma/src/components/friendly-links-renderer/known-services/kiln-case';
import { TrelloAction } from 'app/gamma/src/components/friendly-links-renderer/known-services/trello-action';
import { TrelloBoard } from 'app/gamma/src/components/friendly-links-renderer/known-services/trello-board';
import { TrelloCard } from 'app/gamma/src/components/friendly-links-renderer/known-services/trello-card';

export enum KnownService {
  TrelloBoard = 'TrelloBoard',
  TrelloAction = 'TrelloAction',
  TrelloCard = 'TrelloCard',
  FogBugzCase = 'FogBugzCase',
  KilnCase = 'KilnCase',
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type KnownServiceProps = any;

const gammaKnownServices: Record<
  KnownService,
  GammaKnownService<KnownServiceComponentProps>
> = {
  [KnownService.TrelloBoard]: TrelloBoard,
  [KnownService.TrelloAction]: TrelloAction,
  [KnownService.TrelloCard]: TrelloCard,
  [KnownService.FogBugzCase]: FogBugzCase,
  [KnownService.KilnCase]: KilnCase,
};

export const getKnownService = (
  url: string,
): { knownService: KnownService | null; props: KnownServiceProps } => {
  const knownServices = Object.keys(gammaKnownServices) as KnownService[];

  for (const knownService of knownServices) {
    const gammaKnownService = gammaKnownServices[knownService];

    const matchedValues = execMatch(gammaKnownService, url);

    if (matchedValues !== null) {
      const { getMatchProps } = gammaKnownService;

      return {
        knownService,
        props: getMatchProps(matchedValues),
      };
    }
  }

  return {
    knownService: null,
    props: {},
  };
};
