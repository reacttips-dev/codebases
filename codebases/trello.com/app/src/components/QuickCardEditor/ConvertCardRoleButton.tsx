import React, { useCallback, useEffect } from 'react';

import { LeaveBoardIcon } from '@trello/nachos/icons/leave-board';
import { forTemplate } from '@trello/i18n';

import { QuickCardEditorButton } from './QuickCardEditorButton';
import { useChangeCardRoleMutation } from './ChangeCardRoleMutation.generated';
// eslint-disable-next-line no-restricted-imports
import { CardRole } from '@trello/graphql/generated';
import { useConvertCardRoleButtonQuery } from './ConvertCardRoleButtonQuery.generated';

import { useRefetchConvertCardRoleButtonQuery } from './useRefetchConvertCardRoleButtonQuery';
import { featureFlagClient } from '@trello/feature-flag-client';
import { Analytics } from '@trello/atlassian-analytics';
import { EventContainer } from '@atlassiansox/analytics-web-client';

const format = forTemplate('quick_card_editor');

interface ConvertCardRoleButtonProps {
  idCard: string;
  onLoad: () => void;
  analyticsContainers: EventContainer;
}

export const ConvertCardRoleButton = ({
  idCard,
  onLoad,
  analyticsContainers,
}: ConvertCardRoleButtonProps) => {
  const [changeCardRole] = useChangeCardRoleMutation();
  const { data, loading } = useConvertCardRoleButtonQuery({
    variables: {
      idCard,
    },
  });

  // This is used to recalculate the height of the quick edit
  // menu after the button gets rendered. This will likely
  // need to be here until the quick edit menu gets rewritten
  // in the new stack, since as of now, this button gets rendered
  // *after* the menu is opened. Without this code, there is
  // a chance that the ConvertCardRoleButton will be off screen
  // and unable to be seen or clicked on
  useEffect(onLoad, [onLoad, data]);

  // Because fetching possibleCardRole is done on a separate
  // endpoint from other fields on the card, we must refetch
  // the value whenever the card model is changed in order to
  // ensure that we don't have stale data.
  useRefetchConvertCardRoleButtonQuery(idCard);

  let cardRole = data?.card?.cardRole;
  let possibleCardRole = data?.card?.possibleCardRole;

  const canBeSeparatorCard = possibleCardRole === 'separator';
  const isSeparatorEnabled = featureFlagClient.get(
    'wildcard.card-types-separator',
    false,
  );

  if (!isSeparatorEnabled && canBeSeparatorCard) {
    possibleCardRole = null;
    cardRole = null;
  }

  const canBeBoardCard = possibleCardRole === 'board';
  const isBoardCardEnabled = featureFlagClient.get(
    'wildcard.board-cards',
    false,
  );

  if (!isBoardCardEnabled && canBeBoardCard) {
    possibleCardRole = null;
    cardRole = null;
  }

  const canBeLinkCard = possibleCardRole === 'link';
  const isLinkCardEnabled = featureFlagClient.get('wildcard.link-cards', false);

  if (!isLinkCardEnabled && canBeLinkCard) {
    possibleCardRole = null;
    cardRole = null;
  }

  const canBeMirrorCard = possibleCardRole === 'mirror';
  const isMirrorCardEnabled = featureFlagClient.get(
    'wildcard.mirror-cards',
    false,
  );

  if (!isMirrorCardEnabled && canBeMirrorCard) {
    possibleCardRole = null;
    cardRole = null;
  }

  const trackClick = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'convertCardButton',
      source: 'quickCardEditorInlineDialog',
      attributes: {
        fromCardRole: cardRole,
        toCardRole: cardRole ? null : possibleCardRole,
      },
      containers: analyticsContainers,
    });
  }, [analyticsContainers, cardRole, possibleCardRole]);

  const trackConversion = useCallback(
    (fromCardRole, toCardRole) => {
      Analytics.sendTrackEvent({
        action: 'converted',
        actionSubject: 'card',
        source: 'quickCardEditorInlineDialog',
        attributes: {
          fromCardRole,
          toCardRole,
        },
        containers: analyticsContainers,
      });
    },
    [analyticsContainers],
  );

  const convertCard = useCallback(() => {
    trackClick();

    if (cardRole) {
      changeCardRole({
        variables: {
          idCard,
          cardRole: null,
        },
      }).then(() => trackConversion(cardRole, null));
    } else if (canBeBoardCard) {
      changeCardRole({
        variables: {
          idCard,
          cardRole: CardRole.Board,
        },
      }).then(() => trackConversion(null, CardRole.Board));
    } else if (canBeMirrorCard) {
      changeCardRole({
        variables: {
          idCard,
          cardRole: CardRole.Mirror,
        },
      }).then(() => trackConversion(null, CardRole.Mirror));
    } else if (canBeSeparatorCard) {
      changeCardRole({
        variables: {
          idCard,
          cardRole: CardRole.Separator,
        },
      }).then(() => trackConversion(null, CardRole.Separator));
    } else if (canBeLinkCard) {
      changeCardRole({
        variables: {
          idCard,
          cardRole: CardRole.Link,
        },
      }).then(() => trackConversion(null, CardRole.Link));
    }
  }, [
    trackClick,
    cardRole,
    canBeBoardCard,
    canBeMirrorCard,
    canBeSeparatorCard,
    canBeLinkCard,
    changeCardRole,
    idCard,
    trackConversion,
  ]);

  if (loading || (!cardRole && !possibleCardRole)) {
    return null;
  }

  return (
    <QuickCardEditorButton
      icon={<LeaveBoardIcon color="light" size="small" />}
      onClick={convertCard}
    >
      {!!cardRole && format('convert-to-regular-card')}
      {!cardRole && canBeBoardCard && format('convert-to-board-card')}
      {!cardRole && canBeMirrorCard && format('convert-to-mirror-card')}
      {!cardRole && canBeSeparatorCard && format('convert-to-separator-card')}
      {!cardRole && canBeLinkCard && format('convert-to-link-card')}
    </QuickCardEditorButton>
  );
};
