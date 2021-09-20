import React, { useCallback, useEffect, useState } from 'react';
import cx from 'classnames';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import { forNamespace } from '@trello/i18n';
import { Tooltip, TooltipPrimitiveLight } from '@trello/nachos/tooltip';
import { Auth } from 'app/scripts/db/auth';
import Dialog from 'app/scripts/views/lib/dialog';
import { localizeButlerCommand } from '../CommandLocalization/localizeButlerCommand';
import { ButlerAlert } from '../showButlerAlert';
import { runButlerButton } from './runButlerButton';
import { FormattedButlerButton } from './useButlerButtons';
import styles from './ButlerCardButton.less';

const format = forNamespace('butler');

interface Props {
  button: FormattedButlerButton;
  cardButtonCallback: ({
    idButton,
    alert,
  }: {
    idButton?: string;
    alert?: ButlerAlert;
  }) => void;
  idCard: string;
  idBoard: string;
  idOrganization: string;
  isTooltipEnabled: boolean;
  isDisabled?: boolean;
  runButton?: boolean;
}

export const ButlerCardButton: React.FunctionComponent<Props> = ({
  button,
  idCard,
  idBoard,
  idOrganization,
  cardButtonCallback,
  isTooltipEnabled,
  isDisabled,
  runButton = true,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [tooltipContent, setTooltipContent] = useState<string | null>();

  // If the button is disabled, we show a version of the disabled tooltip,
  // even if the isTooltipEnabled flag is disabled.
  const hasTooltip = isTooltipEnabled || isDisabled;

  const onClick = async (viaKeypress = false) => {
    if (!runButton) {
      cardButtonCallback({ idButton: button.id });
      return;
    }
    if (isRunning || isDisabled) {
      return;
    }
    Analytics.sendClickedButtonEvent({
      buttonName: 'butlerCardButton',
      source: 'cardDetailScreen',
      containers: formatContainers({ idCard, idBoard, idOrganization }),
      attributes: {
        close: !!button.close,
        section: 'butlerCardButtons',
        isOwner: Auth.isMe(button.idMemberOwner),
        viaKeypress,
      },
    });
    setIsRunning(true);
    if (button.close) {
      Dialog.hide(false, true);
    }
    const runMessage = await runButlerButton({
      idButton: button.id,
      idBoard,
      idCard,
    });
    setIsRunning(false);
    cardButtonCallback({ idButton: button.id, alert: runMessage });
  };

  const renderButton = () => (
    <a
      key={button.id}
      className={cx('button-link', { disabled: isDisabled || isRunning })}
      // eslint-disable-next-line react/jsx-no-bind
      onClick={() => onClick()}
      role="button"
      tabIndex={0}
      title={hasTooltip ? undefined : button.label}
    >
      <span
        className={cx('icon-sm', 'plugin-icon', styles.icon, {
          spinner: isRunning,
        })}
        style={{ backgroundImage: isRunning ? '' : `url(${button.image})` }}
      />
      {button.label}
    </a>
  );

  // Lazily localize the button command; this operation can be expensive,
  // especially since button commands need to be parsed first.
  const onShowTooltip = useCallback(() => {
    // If tooltipContent is null, it means we've already tried and failed.
    if (typeof tooltipContent !== 'undefined') {
      return;
    }
    const localizedCommand = localizeButlerCommand(button.cmd as string);
    setTooltipContent(localizedCommand);
    Analytics.sendTrackEvent({
      actionSubject: 'tooltip',
      actionSubjectId: 'butlerButtonTooltip',
      action: 'displayed',
      source: 'cardDetailScreen',
      attributes: {
        isLocalized: !!localizedCommand,
        isOwner: Auth.isMe(button.idMemberOwner),
      },
    });
  }, [button, tooltipContent, setTooltipContent]);

  // If the command associated with the button changes, unset its localization.
  useEffect(() => {
    if (isDisabled) {
      setTooltipContent(format('only members can execute'));
      return;
    }
    if (typeof tooltipContent !== 'undefined') {
      setTooltipContent(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [button.cmd, isDisabled]);

  if (!hasTooltip) {
    return renderButton();
  }

  return (
    <Tooltip
      component={TooltipPrimitiveLight}
      content={
        <div className={styles.tooltip}>
          <div className={styles.tooltipLabel}>{button.label}</div>
          {tooltipContent && (
            <div className={styles.tooltipContent}>{tooltipContent}</div>
          )}
        </div>
      }
      onShow={onShowTooltip}
      position="right-start"
    >
      {renderButton()}
    </Tooltip>
  );
};
