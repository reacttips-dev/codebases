import styled from '@emotion/styled';

const Input = styled.input<{ isError?: boolean; hasValue: boolean }>`
  width: 100%;
  height: 46px;
  padding: 0 16px;
  border: 2px solid #dedfe0;
  border-radius: 6px;
  color: ${({ hasValue }) => (hasValue ? '#292f36' : '#C9CBCD')};
  font-weight: normal;
  -webkit-appearance: none;
  line-height: 2rem;
  border-color: ${({ isError }) => (isError ? '#d0021b' : '#dedfe0')};
  &:focus,
  &:active {
    outline: 0;
    border-color: #5000b9;
    color: #292f36;
  }
  &::placeholder {
    color: #7f8287;
    font-weight: normal;
  }
`;

export { Input };
