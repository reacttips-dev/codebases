/** @jsx jsx */
import styled from '@emotion/styled';

const Container = styled.div`
  padding: 45px;
  background-color: #f2f2f4;
  flex: 1;
  @media (max-width: 600px) {
    padding: 45px 0 0 0;
  }
`;

const LabelHeading = styled.h4`
  font-weight: normal;
  font-size: 1.6rem;
  margin: 0 0 8px 0;
  padding: 0;
`;

export { Container, LabelHeading };
