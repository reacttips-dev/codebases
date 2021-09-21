import styled from '@emotion/styled';

const Container = styled.div<{ opacity?: number }>`
  display: flex;
  background: #ffffff;
  opacity: ${({ opacity = 0.5 }) => opacity};
  padding: 30px 32px;
  border-radius: 6px;
  border: 0.5px solid #c9cbcd;
  align-items: center;
`;

const IconWrapper = styled.div<{ fillColor: string }>`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: ${({ fillColor }) => fillColor};
  margin-right: 20px;
  display: flex;
  align-items: center;

  div {
    svg {
      width: 46px;
      height: 46px;
    }
  }
`;

const Info = styled.div<{ hasError: boolean }>`
  font-size: 1.6rem;
  flex: 1;
  h3,
  p {
    color: ${({ hasError }) => (hasError ? '#E54751' : '#7f8287')};
  }
  h3 {
    margin: 0 0 3px;
    font-size: 1.6rem;
  }
`;

const ModuleHeader = styled.h3`
  font-weight: normal;
  font-size: 1.6rem;
  line-height: 20px;
`;

export { Container, IconWrapper, Info, ModuleHeader };
