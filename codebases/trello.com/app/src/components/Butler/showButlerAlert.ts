import {
  showFlag,
  AppearanceTypes,
  ActionType,
} from '@trello/nachos/experimental-flags';
import { forNamespace } from '@trello/i18n';
import { navigate } from 'app/scripts/controller/navigate';

const format = forNamespace(['butler', 'alert']);

export enum ButlerAlert {
  Success = 'Success',
  InvalidCommand = 'InvalidCommand',
  PowerupUsageExceeded = 'PowerupUsageExceeded',
  RunButtonError = 'RunButtonError',
  NetworkError = 'NetworkError',
  ButtonLimitMet = 'ButtonLimitMet',
  GatewayTimeout = 'GatewayTimeout',
  CommandTooLong = 'CommandTooLong',
  CommandStorageExceeded = 'CommandStorageExceeded',
  SomethingWentWrong = 'SomethingWentWrong',
  Unauthorized = 'Unauthorized',
}

const AlertProps: Record<
  ButlerAlert,
  { appearance: AppearanceTypes; title: string; learnMoreHref?: string }
> = {
  [ButlerAlert.Success]: { appearance: 'success', title: format('success') },
  [ButlerAlert.InvalidCommand]: {
    appearance: 'error',
    title: format('invalid command'),
  },
  [ButlerAlert.PowerupUsageExceeded]: {
    appearance: 'error',
    title: format('usage exceeded'),
    learnMoreHref:
      'https://help.trello.com/article/1181-butler-features-and-quotas',
  },
  [ButlerAlert.RunButtonError]: {
    appearance: 'error',
    title: format('button error'),
    learnMoreHref:
      'https://help.trello.com/article/1150-opening-the-butler-usage-log',
  },
  [ButlerAlert.NetworkError]: {
    appearance: 'error',
    title: format('network error'),
  },
  [ButlerAlert.ButtonLimitMet]: {
    appearance: 'error',
    title: format('button limit met'),
    learnMoreHref:
      'https://help.trello.com/article/1181-butler-features-and-quotas',
  },
  [ButlerAlert.GatewayTimeout]: {
    appearance: 'error',
    title: format('gateway timeout'),
  },
  [ButlerAlert.CommandTooLong]: {
    appearance: 'error',
    title: format('command too long'),
  },
  [ButlerAlert.CommandStorageExceeded]: {
    appearance: 'error',
    title: format('command storage exceeded'),
  },
  [ButlerAlert.SomethingWentWrong]: {
    appearance: 'error',
    title: format('something went wrong'),
  },
  [ButlerAlert.Unauthorized]: {
    appearance: 'error',
    title: format('unauthorized'),
  },
};

export function showButlerAlert(
  alert: ButlerAlert,
  { actionUrl }: { actionUrl?: string } = {},
) {
  const { appearance, title, learnMoreHref } = AlertProps[alert];
  let actions: ActionType[] | undefined;
  if (!appearance || !title) {
    return;
  }
  if (alert === ButlerAlert.RunButtonError && actionUrl) {
    actions = [
      {
        content: format('go to usage log'),
        href: actionUrl,
        type: 'link',
        onClick: (e) => {
          e.preventDefault();
          navigate(actionUrl, { trigger: true });
        },
      },
    ];
  } else if (learnMoreHref) {
    actions = [
      {
        content: format('learn more'),
        href: learnMoreHref,
        target: '_blank',
        type: 'link',
      },
    ];
  }
  showFlag({
    id: 'Butler',
    title,
    appearance,
    actions,
    isAutoDismiss: true,
    msTimeout: 5000,
  });
}
