import { useEffect, useState } from 'react';
import { ButtonCommandType } from '@atlassian/butler-command-parser';
// eslint-disable-next-line no-restricted-imports
import { ButlerButton, ButlerButtonOverrides } from '@trello/graphql/generated';
import { useSocketSubscription } from 'app/scripts/init/useSocketSubscription';
import {
  ButlerButtonsQuery,
  useButlerButtonsQuery,
} from './ButlerButtonsQuery.generated';

export interface FormattedButlerButton extends ButlerButton {
  scope: 'boards' | 'organizations';
}
interface OverrideProps {
  scope: 'boards' | 'organizations';
  buttons?: ButlerButton[];
  buttonOverrides?: Partial<ButlerButtonOverrides>[] | null | undefined;
}

const withOverrides = ({
  scope,
  buttons,
  buttonOverrides,
}: OverrideProps): FormattedButlerButton[] => {
  if (!buttons || !buttonOverrides) {
    return buttons?.map((button) => ({ ...button, scope })) ?? [];
  }
  const copy = buttons.map((button) => ({ ...button, scope }));
  buttonOverrides?.forEach(({ idButton, overrides }) => {
    const button = copy.find(({ id }) => id === idButton);
    if (button && typeof overrides?.enabled === 'boolean') {
      button.enabled = overrides.enabled;
    }
  });
  return copy;
};

const formatButlerButtons = (
  type: ButtonCommandType,
  { member, board, organization }: ButlerButtonsQuery,
): FormattedButlerButton[] => {
  if (!board) {
    return [];
  }
  const combinedSections: Array<FormattedButlerButton[]> = [
    withOverrides({
      scope: 'organizations',
      buttons: organization?.sharedButlerButtons ?? [],
      buttonOverrides: board.butlerButtonOverrides,
    }),
    withOverrides({
      scope: 'organizations',
      buttons: organization?.privateButlerButtons ?? [],
      buttonOverrides: board.butlerButtonOverrides,
    }),
    withOverrides({
      scope: 'boards',
      buttons: board.sharedButlerButtons,
      buttonOverrides: board.butlerButtonOverrides,
    }),
    withOverrides({
      scope: 'boards',
      buttons: board.privateButlerButtons,
      buttonOverrides: board.butlerButtonOverrides,
    }),
  ];
  const allButtons = combinedSections.flatMap((buttons) =>
    buttons
      .filter((button) => button.enabled && button.type === type)
      .sort((a, b) => a.pos - b.pos)
      // Stable sort to move all current member owned buttons to the front.
      .sort((a, b) => {
        if (a.idMemberOwner === member?.id && b.idMemberOwner !== member?.id) {
          return -1;
        }
        if (a.idMemberOwner !== member?.id && b.idMemberOwner === member?.id) {
          return 1;
        }
        return 0;
      }),
  );
  const limitedButtons = allButtons.slice(0, board.butlerButtonLimit);
  return limitedButtons.sort((a, b) => a.label.localeCompare(b.label));
};

interface Props {
  type: ButtonCommandType;
  idBoard: string;
  idOrganization: string;
}

export const useButlerButtons = ({
  type,
  idBoard,
  idOrganization,
}: Props): {
  buttons: FormattedButlerButton[];
  limit: number;
} => {
  const skipOrganization = !idOrganization;
  useSocketSubscription('Board', idBoard);
  useSocketSubscription('Organization', idOrganization, skipOrganization);

  const [buttons, setButtons] = useState<FormattedButlerButton[]>([]);
  const { data } = useButlerButtonsQuery({
    variables: {
      idBoard,
      idOrganization,
      skipOrganization,
    },
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
  });

  useEffect(() => {
    if (!data) {
      return;
    }
    setButtons(formatButlerButtons(type, data));
  }, [type, data]);

  return {
    buttons,
    // Leave board.butlerButtonLimit as source of truth if we decide to
    // increase past 20 buttons in the future.
    limit: Math.max(data?.board?.butlerButtonLimit ?? 20, 20),
  };
};
