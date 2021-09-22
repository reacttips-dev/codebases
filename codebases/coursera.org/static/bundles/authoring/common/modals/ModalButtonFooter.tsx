import React from 'react';
import type { ApiButtonProps } from '@coursera/coursera-ui';
import { Button, Box, ApiButton } from '@coursera/coursera-ui';
import TooltipWrapper from 'bundles/authoring/common/components/TooltipWrapper';
import _t from 'i18n!nls/authoring';
import 'css!./__styles__/ModalButtonFooter';

type Props = {
  buttonSize?: 'zero' | 'sm' | 'md' | 'lg';
  onCancelButtonClick?: () => void;
  onPrimaryButtonClick?: () => void;
  onSecondaryButtonClick?: () => void;
  isCancelButtonDisabled?: boolean;
  isPrimaryButtonDisabled?: boolean;
  isSecondaryButtonDisabled?: boolean;
  cancelButtonContents?: React.ReactNode;
  primaryButtonContents?: React.ReactNode;
  secondaryButtonContents?: React.ReactNode;
  disabledPrimaryExplanation?: string;
  explanationClassName?: string;
  /**
   * This prop allows you to pass additional props required by ApiButton documented in
   * https://building.coursera.org/coursera-ui/?selectedKind=basic.Button&selectedStory=ApiButton&full=0&addons=0&stories=1&panelRight=0&addonPanel=storybook%2Factions%2Factions-panel
   * If this prop is present, this component would render ApiButton instead of Button
   */
  primaryApiButtonProps?: ApiButtonProps;
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
}: Props) => {
  return (
    <Box rootClassName="rc-ModalButtonFooter" justifyContent="end" alignItems="end">
      {!!onCancelButtonClick && (
        <Button type="default" size={buttonSize} onClick={onCancelButtonClick} disabled={isCancelButtonDisabled}>
          {cancelButtonContents}
        </Button>
      )}
      {!!secondaryButtonContents && (
        <Button
          rootClassName="modal-button-footer-secondary"
          type="secondary"
          size={buttonSize}
          onClick={onSecondaryButtonClick}
          disabled={isSecondaryButtonDisabled}
        >
          {secondaryButtonContents}
        </Button>
      )}
      {!!primaryButtonContents && !primaryApiButtonProps && (
        <TooltipWrapper
          show={isPrimaryButtonDisabled && disabledPrimaryExplanation}
          message={disabledPrimaryExplanation}
          tooltipClassName={explanationClassName}
        >
          <Button
            rootClassName="modal-button-footer-primary"
            type="primary"
            size={buttonSize}
            onClick={onPrimaryButtonClick}
            disabled={isPrimaryButtonDisabled}
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
          <ApiButton
            rootClassName="modal-button-footer-primary"
            type="primary"
            size={buttonSize}
            onClick={onPrimaryButtonClick}
            disabled={isPrimaryButtonDisabled}
            {...primaryApiButtonProps}
          />
        </TooltipWrapper>
      )}
    </Box>
  );
};

export default ModalButtonFooter;
