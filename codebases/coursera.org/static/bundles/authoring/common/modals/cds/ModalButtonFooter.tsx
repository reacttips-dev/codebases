/** @jsx jsx */
import React from 'react';
import { css, jsx } from '@emotion/react';

import { Button } from '@coursera/cds-core';
import { SpinnerIcon } from '@coursera/cds-icons';
import TooltipWrapper from 'bundles/authoring/common/components/TooltipWrapper';

import { API_BEFORE_SEND, API_IN_PROGRESS } from '@coursera/coursera-ui/lib/constants/sharedConstants';

import type { ApiButtonProps } from '@coursera/coursera-ui';
import type { Theme, ButtonProps } from '@coursera/cds-core';

import _t from 'i18n!nls/authoring';

type Props = {
  buttonSize?: 'small' | 'medium';
  onCancelButtonClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onPrimaryButtonClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  onSecondaryButtonClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isCancelButtonDisabled?: boolean;
  isPrimaryButtonDisabled?: boolean;
  isSecondaryButtonDisabled?: boolean;
  cancelButtonContents?: string;
  primaryButtonContents?: string;
  secondaryButtonContents?: string;
  secondaryButtonVariant?: ButtonProps['variant'];
  disabledPrimaryExplanation?: string;
  explanationClassName?: string;
  /**
   * This prop allows you to pass additional props required by ApiButton documented in
   * https://building.coursera.org/coursera-ui/?selectedKind=basic.Button&selectedStory=ApiButton&full=0&addons=0&stories=1&panelRight=0&addonPanel=storybook%2Factions%2Factions-panel
   */
  primaryApiButtonProps?: ApiButtonProps;
  alignButtonsRight?: boolean;
};

const styles = {
  root: (theme: Theme) =>
    css({
      display: 'flex',
      justifyContent: 'flex-start',
      marginTop: theme.spacing(48),
    }),
  footerButton: (theme: Theme) =>
    css({
      marginRight: theme.spacing(24),
    }),
};

const stylesInverted = {
  root: (theme: Theme) =>
    css({
      display: 'flex',
      justifyContent: 'flex-end',
      marginTop: theme.spacing(48),
    }),
  footerButton: (theme: Theme) =>
    css({
      marginLeft: theme.spacing(24),
    }),
};

const ModalButtonFooter = ({
  buttonSize,
  onCancelButtonClick,
  onPrimaryButtonClick,
  onSecondaryButtonClick,
  isCancelButtonDisabled = false,
  isPrimaryButtonDisabled = false,
  isSecondaryButtonDisabled = false,
  cancelButtonContents = _t('Cancel'),
  primaryButtonContents,
  secondaryButtonContents,
  disabledPrimaryExplanation,
  explanationClassName,
  primaryApiButtonProps,
  secondaryButtonVariant,
  alignButtonsRight = false,
}: Props) => {
  const style = alignButtonsRight ? stylesInverted : styles;

  const primary = (
    <div>
      {!!primaryButtonContents && !primaryApiButtonProps && (
        <TooltipWrapper
          show={isPrimaryButtonDisabled && disabledPrimaryExplanation}
          message={disabledPrimaryExplanation}
          tooltipClassName={explanationClassName}
        >
          <Button
            variant="primary"
            size={buttonSize}
            onClick={onPrimaryButtonClick}
            disabled={isPrimaryButtonDisabled}
            data-test="primary-button"
            css={style.footerButton}
          >
            {primaryButtonContents}
          </Button>
        </TooltipWrapper>
      )}
      {!!primaryApiButtonProps && (
        <TooltipWrapper
          show={isPrimaryButtonDisabled && disabledPrimaryExplanation}
          message={disabledPrimaryExplanation}
          tooltipClassName={explanationClassName}
        >
          <Button
            iconPosition="before"
            icon={primaryApiButtonProps?.apiStatus === API_IN_PROGRESS ? <SpinnerIcon /> : undefined}
            onClick={onPrimaryButtonClick}
            disabled={isPrimaryButtonDisabled}
            data-test="primary-api-button"
            size={buttonSize}
            variant="primary"
            css={styles.footerButton}
          >
            {
              (primaryApiButtonProps?.apiStatus === API_IN_PROGRESS
                ? primaryApiButtonProps?.apiStatusAttributesConfig?.label?.[API_IN_PROGRESS]
                : primaryApiButtonProps?.apiStatusAttributesConfig?.label?.[API_BEFORE_SEND]) as string
            }
          </Button>
        </TooltipWrapper>
      )}
    </div>
  );

  const secondary = !!secondaryButtonContents && (
    <Button
      variant={secondaryButtonVariant || 'secondary'}
      size={buttonSize}
      css={style.footerButton}
      onClick={onSecondaryButtonClick}
      data-test="secondary-button"
      disabled={isSecondaryButtonDisabled}
    >
      {secondaryButtonContents}
    </Button>
  );

  const cancel = !!onCancelButtonClick && (
    <Button
      variant="secondary"
      data-test="cancel-button"
      css={style.footerButton}
      size={buttonSize}
      onClick={onCancelButtonClick}
      disabled={isCancelButtonDisabled}
    >
      {cancelButtonContents}
    </Button>
  );

  return (
    <div data-e2e="modal-button-footer" css={style.root}>
      {!alignButtonsRight ? primary : cancel}
      {!alignButtonsRight ? cancel : secondary}
      {!alignButtonsRight ? secondary : primary}
    </div>
  );
};

export default ModalButtonFooter;
