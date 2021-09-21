import styled from '@emotion/styled';
import { adColor } from '..';
import { PlacementType } from '../../../../../../modules/AnchorAPI/v3/episodes/saveAdCuePoints';

const Wrapper = styled.div<{ hasRows: boolean }>`
  background-color: ${({ hasRows }) => (hasRows ? '#ffffff' : '#ebeced')};
  border-radius: 6px;
  height: 334px;
  margin-bottom: 115px;
  border: 1px solid #d9d9d9;
  overflow-y: auto;
  h3,
  p {
    font-size: 1.4rem;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Table = styled.table`
  table-layout: fixed;
  background-color: #ebeced;
  width: 100%;
  tbody {
    background-color: #ffffff;
    border-bottom: 1px solid #d9d9d9;
  }

  tr {
    height: 56px;
    border-bottom: 1px solid #d9d9d9;
  }
`;

const TableHeadRow = styled.tr`
  th {
    font-weight: normal;
    padding: 0 24px;
  }
`;

const TableBodyRow = styled.tr<{ isDisabled: boolean }>`
  &:last-of-type {
    border-bottom: none;
  }

  &:hover {
    cursor: pointer;
    background-color: #f9f9f9;
  }

  &:focus {
    outline: 1px dashed #8940fa;
  }

  td {
    padding: 13px 24px;

    &:last-of-type {
      display: flex;
      height: 100%;
      align-items: center;
      justify-content: flex-end;
    }
  }

  ${({ isDisabled }) =>
    isDisabled &&
    `
    background-color: #f9f9f9;
    
    td:not(:last-of-type) {
      opacity: 0.5; 
    }

    &:hover {
      cursor: unset;
    }
  `}
`;

const AdId = styled.div<{ placementType: PlacementType }>`
  background-color: ${({ placementType }) => adColor[placementType]};
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  border-radius: 5px;
  margin: 0;
`;

const EditLink = styled.a`
  color: #5f6368;
  margin-right: 10px;
  font-size: 1.4rem;
  cursor: pointer;

  &:hover {
    color: #5f6368;
  }

  &:focus {
    color: #8940fa;
  }
`;

const DisabledPill = styled.span`
  background: transparent;
  border-radius: 3px;
  border: 1px solid #5f6368;
  font-weight: bold;
  font-size: 1.4rem;
  padding: 4px 12px;
  margin-right: 20px;
`;

export {
  Wrapper,
  Container,
  Table,
  TableHeadRow,
  TableBodyRow,
  AdId,
  EditLink,
  DisabledPill,
};
