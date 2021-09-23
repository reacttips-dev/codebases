import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import Text from 'shared/Text';

type Props = {
  title: string;
  renderMessage?: ReactNode;
  className?: string;
};

const Container = styled.div`
  background-color: rgba(208, 2, 27, 0.1);
  margin-top: 10px;
  padding: 16px;
  border-radius: 6px;
`;

export const FormErrorAlert = ({ title, renderMessage, className }: Props) => (
  <Container className={className}>
    <Text isBold={true} color="#e54751" align="center">
      {title}
    </Text>
    <Text color="#e54751" align="center">
      {renderMessage}
    </Text>
  </Container>
);
