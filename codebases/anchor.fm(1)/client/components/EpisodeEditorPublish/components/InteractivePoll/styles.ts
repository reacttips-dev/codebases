import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { FocusButton } from 'client/components/FocusButton';
import { ControlledFieldDatePicker } from 'client/components/FieldDatePicker';
import { FieldLabel } from 'components/FieldLabel';
import { SM_SCREEN_MAX } from 'modules/Styleguide';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import { Button } from 'shared/Button/NewButton';

export const DatesContainer = styled.div`
  display: flex;
  margin: 16px 0 50px;
  width: 100%;
  align-items: center;
  p {
    margin-bottom: 0;
    color: #5f6369;
  }
  button {
    padding: 0;
  }
  @media (max-width: ${SM_SCREEN_MAX}px) {
    display: block;
  }
`;

export const StyledDatePicker = styled(ControlledFieldDatePicker)`
  &:first-of-type {
    padding: 0 16px 0 0;
  }
  button {
    padding: 0;
    &:focus > div {
      border: 1px solid #702cd5;
    }
    > div {
      border: 1px solid transparent;
      &:focus {
        outline: 0;
      }
    }
  }
  @media (max-width: ${SM_SCREEN_MAX}px) {
    &:first-of-type {
      padding: 0;
    }
    button {
      width: 100%;
    }
  }
`;

export const InteractivePollContainer = styled.div`
  margin: 36px 40px 40px 40px;
  border-bottom: 2px solid #dfe0e1;
  padding-bottom: 40px;
`;

export const Title = styled.h3`
  font-weight: bold;
  font-size: 2rem;
  margin: 0 0 20px;
  line-height: 23px;
  padding: 0;
  display: inline-block;
`;

export const Optional = styled.span`
  font-size: 1.4rem;
  font-weight: normal;
  color: #7f8287;
`;

export const PollTypeStyles = css`
  margin: 16px 0;
  width: 360px;
  font-size: 1.8rem;
  font-weight: bold;
  color: #292f36;
`;

export const OpenModalButton = styled(Button)`
  margin-top: 4px; // adding up to 20px with the CopyContainer margin-bottom
  width: 200px;
`;

export const TopBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ThreeDotMenuContainer = styled(DropdownButton)`
  background: transparent;
  height: 24px;
  border: none;
  padding: 0;
  &:hover,
  &:active,
  &:focus,
  &:active:focus {
    background: transparent !important;
    box-shadow: none !important;
  }
  svg > g > g {
    fill: #c9cbcd;
  }
  &:hover {
    svg > g > g {
      fill: #999;
    }
  }
`;

export const ThreeDotMenuItem = styled(MenuItem)<{ isWarning?: boolean }>`
  // react-bootstrap applies base styling to anchor tags :(
  a {
    font-size: 1.8rem;
    font-weight: 700;
    line-height: 2.25;
    padding: 3px 20px;
    width: 240px;
    ${({ isWarning }) => (isWarning ? `color: #e54751;` : 'color: #333;')};
    align-items: center;
    display: flex;
    text-decoration: none;
  }
`;

export const CircularIconContainer = styled.div`
  background-color: #cccdcf;
  width: 18px;
  height: 18px;
  border-radius: 100%;
  padding: 4px;
`;

export const StatusText = styled.p`
  margin-bottom: 16px;
  font-weight: bold;
  color: #7f8287;
`;

export const FormContainer = styled.div`
  padding: 35px;
  @media (max-width: ${SM_SCREEN_MAX}px) {
    padding: 0;
  }
`;

export const RoundedCard = styled.div`
  background-color: white;
  padding: 36px;
  border-radius: 6px;
`;

export const BannerTitle = styled.h3`
  margin: 0 0 8px;
  color: #292f36;
`;

export const CopyContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 0;
  flex-direction: column;
`;

export const OptionsContainer = styled.div`
  margin-bottom: 36px;
`;

export const OptionsInputsGridContainer = styled.div`
  margin-bottom: 1.6rem;
  display: grid;
  grid-template-columns: 1fr 30px;
`;

export const ModalTitle = styled.h3`
  text-align: center;
  margin: 0 0 40px;
  line-height: 2.8rem;
`;

export const ConfirmationButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
`;

export const SubmitButton = styled(Button)`
  display: flex;
  width: 220px;
  margin-left: 0;
`;

export const QuestionTitle = styled.p`
  margin: 22px 0 20px;
  font-size: 1.6rem;
  font-weight: bold;
`;

export const SaveDraftButton = styled.button`
  font-weight: bold;
  color: #5000b9;
  margin-left: auto;
  font-size: 1.6rem;
  display: flex;
  line-height: 24px;
  margin-right: 44px;
  &:hover {
    color: #702cd5;
  }
  &:active {
    color: #3e0d88;
  }
  &[disabled] {
    color: #7f8287;
  }
  padding: 20px;
`;

// using !important to override bootstrap modal styling
export const ErrorMessage = styled.p`
  color: #9a201c !important;
`;

export const PlusIcon = styled.span`
  border: 1px solid #000;
  width: 20px;
  height: 20px;
  border-radius: 100%;
  position: relative;
  margin: 4px 8px 4px 0;
  display: inline-block;
  vertical-align: middle;
  background: #5000b9;
  color: #fff;

  &:before,
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
  }
  &:before {
    width: 2px;
    margin: 3px auto;
  }
  &:after {
    margin: auto 2px;
    height: 2px;
  }
`;

export const AddOptionButton = styled(FocusButton)`
  font-weight: bold;
  color: #5000b9;
  display: flex;
  align-items: center;
  font-size: 1.6rem;
  &:hover {
    color: #702cd5;
  }
  &:active {
    color: #3e0d88;
  }
`;

export const RemoveOptionButton = styled(FocusButton)`
  display: block;
  height: 46px;
  margin-bottom: 1.6rem;
  padding: 1px 6px;
`;

export const StyledFieldLabel = styled(FieldLabel)`
  font-weight: bold;
  font-size: 1.8rem;
  margin-bottom: 8px;
  color: #292f36;
`;

export const DeleteModalContainer = styled.div`
  max-width: 575px;
  width: 100%;
  margin: auto;
`;

export const DeleteModalCopy = styled.div`
  max-width: 485px;
  margin: 0 auto 32px auto;
`;

export const BootstrapModifiers = css`
  .btn-group.open .dropdown-toggle {
    box-shadow: none;
    background: transparent;
  }
  .modal.fade .modal-dialog {
    @media (max-width: ${SM_SCREEN_MAX}px) {
      width: 100%;
      margin: auto 32px;
    }
  }
  .modal-content p,
  .modal-content li {
    margin-bottom: 16px;
  }
  .modal-content,
  .modal-content p,
  .modal-content li {
    color: #7f8287;
  }
  .modal-content h3,
  legend {
    color: #292f36;
  }
`;

export const BootstrapModalMargin = css`
  .modal.fade .modal-dialog {
    width: 800px;
    margin: 5vh auto 0 auto;
  }
`;
