import styled from '@emotion/styled';

const RemoveButton = styled.button`
  border-radius: 100%;
  border: 1px dashed transparent;
  padding: 2px;
  &:focus {
    border: 1px dashed rgba(0, 0, 0, 0.25);
  }
`;

const IconWrapper = styled.div`
  display: inline-grid;
  place-content: center;
  width: 24px;
  height: 24px;
  border-radius: 100%;
  background-color: rgba(0, 0, 0, 0.05);
  padding: 7px;
`;

const InputContainer = styled.div`
  margin-right: 16px;
  @media (max-width: 600px) {
    max-width: 100%;
    width: 100%;
    margin: 0 0 8px;
  }
`;

export { RemoveButton, InputContainer, IconWrapper };
