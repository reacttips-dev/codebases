import styled from '@emotion/styled';
import { css } from 'emotion';
import { FormErrorAlert as ErrorAlert } from 'components/FormErrorAlert';

const Container = styled.div`
  margin-top: 20px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const FormItem = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;

  textarea {
    max-height: 150px;
  }

  p {
    margin-bottom: 9px;
    font-size: 1.6rem;
    font-weight: normal;
    font-style: normal;
    font-stretch: normal;
    line-height: normal;
    letter-spacing: normal;
    color: #7f8287;
  }
`;

export const FormErrorAlert = styled(ErrorAlert)`
  margin-top: 0;
  margin-bottom: 10px;
`;

const buttonStyles = css`
  max-width: 300px;
  width: 100%;
  margin: auto;
  @media (max-width: 600px) {
    max-width: 100%;
  }
`;

export { Form, Container, FormItem, buttonStyles };
