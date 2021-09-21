import styled from '@emotion/styled';
import { css } from '@emotion/core';
import { Button } from '../../shared/Button/NewButton';
import { Modal } from '../../shared/Modal';
import { MD_SCREEN_MIN } from '../../modules/Styleguide';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  .labelWrapper {
    margin-bottom: 10px;
  }
`;

export const PseudoLabel = styled.span`
  color: #292f36;
  font-style: normal;
  font-weight: 500;
  font-size: 1.6rem;
  line-height: 2rem;
  margin-bottom: 10px;
`;

export const DropdownWrapper = styled.div`
  @media (max-width: ${MD_SCREEN_MIN}px) {
    width: 100%;
  }
`;

export const Dropdown = styled.div`
  height: 46px;
  width: 210px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 16px;
  padding-right: 16px;
  border-radius: 6px;
  @media (max-width: ${MD_SCREEN_MIN}px) {
    width: 100%;
  }
  background-color: #dfe0e1;
  &:hover {
    background-color: #d4d5d7;
  }
  &:active {
    background-color: #c9cbcd;
  }
`;

export const StyledModal = styled(Modal)`
  .modal-dialog {
    width: 500px;
    @media (max-width: ${MD_SCREEN_MIN}) {
      width: 100%;
      margin: 0 !important;
    }
  }
  .modal-content {
    margin: 0;
    @media (max-width: ${MD_SCREEN_MIN}) {
      border-radius: 0;
      height: 100%;
    }
  }
`;

export const ModalContentContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  max-width: 378px;
  margin: 0 auto;
`;

export const PublishDateDisplay = styled.p`
  color: #5f6369;
  font-size: 1.6rem;
  line-height: 2rem;
  font-weight: bold;
`;

export const CalendarLabel = styled.label`
  width: 100%;
  text-align: center;
  font-size: 22px;
  margin-bottom: 24px;
  @media (max-width: ${MD_SCREEN_MIN}px) {
    font-size: 16px;
    margin-bottom: 12px;
  }
`;

export const ButtonSectionContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 14px;
  @media (max-width: ${MD_SCREEN_MIN}px) {
    flex-direction: column-reverse;
  }
`;

export const StyledButton = styled(Button)`
  width: 174px;
  @media (max-width: ${MD_SCREEN_MIN}px) {
    width: 100%;
    margin-bottom: 14px;
  }
`;

export const LocalTimezoneMessage = styled.p`
  color: #7f8287;
  font-weight: 500;
  font-size: 1.2rem;
  line-height: 1.6rem;
`;

export const DatetimeGlobalStyles = css`
  .DatetimeContainer {
    .rdtCounters {
      display: inline-flex;
      align-items: center;
      height: 258px;
    }
    .rdtCount,
    .rdtCounterSeparator {
      font-weight: normal;
    }
    .rdtCount {
      height: 25%;
    }
    .rdtBtn {
      color: #c9cbcd;
    }
    .rdtPicker {
      border: 2px solid rgba(201, 203, 205, 0.2);
      margin: 0;
      border-radius: 6px;
      width: 100%;
      padding: 0;
    }
    tfoot {
      border-top: 2px solid rgba(201, 203, 205, 0.2);
    }
    .rdtSwitch {
      font-size: 18px;
      padding: 14px;
    }
    .rdtPrev,
    .rdtNext {
      vertical-align: middle !important;
    }
    .rdtPrev span,
    .rdtNext span {
      color: #c9cbcd;
      font-size: 32px;
    }
    .rdtTimeToggle {
      font-size: 18px;
      padding: 10px;
    }
    .dow {
      font-weight: normal;
      font-size: 14px;
      color: #5f6369;
    }
    .rdtDay {
      font-weight: normal;
      font-size: 16px;
      height: 32px;
    }
    .rdtDay:hover {
      background: transparent;
    }
    .rdtMonth,
    .rdtYear {
      height: 86px;
    }
    .rdtActive {
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      background: #5000b9 !important;
      border-radius: 100%;
      margin: auto;
      color: white;
      font-weight: bold;
    }
    .rdtDay.rdtActive {
      width: 30px;
      height: 30px;
    }
    .rdtMonth.rdtActive,
    .rdtYear.rdtActive {
      width: 60px;
      height: 60px;
      margin: 13px 0px 13px 17px;
    }
  }
`;
