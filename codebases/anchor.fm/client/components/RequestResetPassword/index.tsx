import React, { useState } from 'react';
import { css } from 'emotion';
import styled from '@emotion/styled';
import { useForm } from 'react-hook-form';
import Alert from 'react-bootstrap/lib/Alert';
import { Button } from 'shared/Button/NewButton';
import { isValidEmail } from 'client/user';
import { FieldInput } from '../FieldInput';
import { ButtonWrapper, TextButton, FieldWrapper } from '../Login/styles';

type RequestResetPasswordProps = {
  clickLogIn: () => void;
  onSubmit: (data: RequestResetPasswordData) => Promise<void>;
};

type RequestResetPasswordData = { email: string };

export const RequestResetPassword = ({
  clickLogIn,
  onSubmit,
}: RequestResetPasswordProps) => {
  const {
    handleSubmit,
    register,
    formState: { isSubmitting, errors },
  } = useForm();
  const [formError, setFormError] = useState<null | string>(null);

  const onValid = (data: RequestResetPasswordData) => {
    onSubmit(data).catch(({ message }) => setFormError(message));
  };

  return (
    <div>
      <Text>
        Type your email below, and we’ll email you a link to reset your
        password.
      </Text>
      <form
        onSubmit={handleSubmit(onValid)}
        className={css`
          text-align: center;
        `}
        noValidate={true}
      >
        {formError && <Alert bsStyle="danger">{formError}</Alert>}
        <FieldWrapper>
          <FieldInput
            {...register('email', {
              required: 'Email is required',
              validate: email =>
                isValidEmail(email) || 'Must provide a valid email address',
            })}
            name="email"
            placeholder="Email"
            type="email"
            error={errors.email}
          />
        </FieldWrapper>
        <ButtonWrapper>
          <Button
            color="purple"
            type="submit"
            isDisabled={isSubmitting}
            className={css`
              width: 200px;
            `}
          >
            Reset Password
          </Button>
        </ButtonWrapper>
      </form>
      <LoginFooter>
        <TextButton onClick={clickLogIn}>Log in</TextButton>
      </LoginFooter>
    </div>
  );
};

const Text = styled.p`
  text-align: center;
  margin-bottom: 32px;
`;

const LoginFooter = styled.p`
  text-align: center;
`;
