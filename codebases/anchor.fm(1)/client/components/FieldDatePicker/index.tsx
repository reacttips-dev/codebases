import React, { useState } from 'react';
import Datetime from 'react-datetime';
import { Global } from '@emotion/core';
import { css } from 'emotion';
import {
  Control,
  FieldPath,
  FieldValues,
  useController,
  Path,
} from 'react-hook-form';
import { Caret } from 'shared/Caret';
import {
  ButtonSectionContainer,
  CalendarLabel,
  Container,
  Dropdown,
  DropdownWrapper,
  LocalTimezoneMessage,
  ModalContentContainer,
  PseudoLabel,
  PublishDateDisplay,
  StyledButton,
  StyledModal,
  DatetimeGlobalStyles,
} from './styles';
import {
  getDisplayValue,
  roundToNextHour,
  getCurrentDateAtUpcomingHour,
} from './utils';

export const ControlledFieldDatePicker = <T extends FieldValues>({
  label,
  name = 'publishOn' as Path<T>,
  className,
  control,
}: {
  label: string;
  name: FieldPath<T>;
  className?: any;
  control?: Control<T>;
}) => {
  const [isShowingSchedulerModal, setIsShowingSchedulerModal] = useState(false);
  const {
    field: { value, onChange },
  } = useController<T, FieldPath<T>>({ control, name });
  const [valueOnOpen, setValueOnOpen] = useState(value);

  const dateTimeValue =
    !value || value === '' ? getCurrentDateAtUpcomingHour() : value;

  return (
    <Container className={className}>
      <PseudoLabel aria-label={name}>{label}</PseudoLabel>
      <DropdownWrapper>
        <button
          onClick={() => {
            setIsShowingSchedulerModal(true);
            setValueOnOpen(value);
          }}
          type="button"
          aria-label="Open date selector"
        >
          <Dropdown>
            <PublishDateDisplay>
              {getDisplayValue(value, null, 'Now')}
            </PublishDateDisplay>
            <Caret color="#5f6369" />
          </Dropdown>
        </button>
      </DropdownWrapper>
      <StyledModal
        isShowing={isShowingSchedulerModal}
        onClickClose={() => {
          onChange(valueOnOpen);
          setIsShowingSchedulerModal(false);
        }}
        isShowingCloseButton
        renderContent={() => (
          <ModalContentContainer>
            <CalendarLabel htmlFor={name}>
              {getDisplayValue(value, 'Schedule for', 'Publish now')}
              <Global styles={DatetimeGlobalStyles} />
              <Datetime
                className="DatetimeContainer"
                input={false}
                timeConstraints={{
                  minutes: { min: 0, max: 0, step: 60 },
                  seconds: { min: 0, max: 0, step: 60 },
                  milliseconds: { min: 0, max: 0, step: 1000 },
                }}
                onChange={date => {
                  onChange(roundToNextHour(date));
                }}
                value={dateTimeValue}
              />
            </CalendarLabel>
            <LocalTimezoneMessage>All times are local</LocalTimezoneMessage>
            <ButtonSectionContainer>
              <StyledButton
                kind="button"
                onClick={() => {
                  onChange(null);
                  setIsShowingSchedulerModal(false);
                }}
                className={css`
                  color: #5000b9;
                `}
              >
                Reset to now
              </StyledButton>
              <StyledButton
                kind="button"
                color="purple"
                onClick={() => setIsShowingSchedulerModal(false)}
              >
                Confirm
              </StyledButton>
            </ButtonSectionContainer>
          </ModalContentContainer>
        )}
      />
    </Container>
  );
};
