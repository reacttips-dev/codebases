import styled from '@emotion/styled';

interface WarningProps {
  color?: string;
}

const WarningMessage = styled.p<WarningProps>`
  padding: 16px;
  border-radius: 10px;
  background-color: ${({ color }) =>
    color === 'black' ? '#292f36' : 'rgba(41, 47, 54, 0.8)'};
  border-color: #2effd9;
  display: flex;
  justify-content: center;
  color: white;
  align-items: baseline;
  @media (max-width: 768px) {
    display: block;
  }
  a {
    color: white;
    &:hover,
    &:active {
      color: white;
    }
  }
`;

const WarningIcon = styled.span`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #e54751;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  margin-right: 8px;
  @media (max-width: 768px) {
    display: inline-flex;
  }
`;

const ResendTrigger = styled.a`
  cursor: pointer;
  margin-left: 4px;
  text-decoration: none;
  color: white;
  &:hover {
    color: white;
    text-decoration: none;
  }
`;

export { WarningMessage, WarningIcon, ResendTrigger };
