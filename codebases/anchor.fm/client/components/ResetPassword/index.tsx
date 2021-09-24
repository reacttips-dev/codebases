import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useForm } from 'react-hook-form';
import Alert from 'react-bootstrap/lib/Alert';
import { Button } from 'shared/Button/NewButton';
import { Footer } from '../Footer';
import { FieldInput } from '../FieldInput';

type ResetPasswordData = {
  password: string;
  repeatPassword: string;
};

type ResetPasswordProps = {
  onSubmit: (data: ResetPasswordData) => Promise<void>;
  resetTokenIsValid: boolean;
  resetWasSuccessful: boolean;
};

export function ResetPassword({
  onSubmit,
  resetTokenIsValid,
  resetWasSuccessful,
}: ResetPasswordProps) {
  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm();

  const [formError, setFormError] = useState('');

  const onValid = (data: ResetPasswordData) => {
    setFormError('');
    onSubmit(data).catch(({ message }) => {
      setFormError(message);
    });
  };

  return (
    <>
      <Container>
        {!resetTokenIsValid && (
          <p>Sorry, but that reset password link is no longer valid.</p>
        )}
        {resetWasSuccessful && (
          <>
            <p>Your password has been saved!</p>
            <p>You can now log in with it.</p>
          </>
        )}
        {resetTokenIsValid && !resetWasSuccessful && (
          <Form
            onSubmit={handleSubmit(onValid)}
            method="POST"
            noValidate={true}
          >
            {formError && <Alert bsStyle="danger">{formError}</Alert>}
            <InputWrapper>
              <FieldInput
                {...register('password', {
                  validate: pw =>
                    pw.length >= 7 || 'Passwords must be 7 characters or more',
                })}
                placeholder="Password"
                type="password"
                error={errors.password}
              />
              <FieldInput
                {...register('repeatPassword', {
                  validate: pw =>
                    pw === getValues('password') ||
                    'The passwords do not match',
                })}
                placeholder="Type it again"
                type="password"
                error={errors.repeatPassword}
              />
            </InputWrapper>
            <Button type="submit" isDisabled={isSubmitting} color="purple">
              Reset Password
            </Button>
          </Form>
        )}
      </Container>
      <Footer />
    </>
  );
}

const Form = styled.form`
  max-width: 362px;
  width: 100%;
  padding: 0px 20px;

  button {
    width: 100%;
  }
`;

const InputWrapper = styled.div`
  > * {
    margin-bottom: 15px;
  }
`;

const Container = styled.div`
  background: white;
  display: flex;
  flex-direction: column;
  font-size: 2rem;
  height: 50vh;
  display: flex;
  align-items: center;
  justify-content: center;
  p {
    text-align: center;
    color: #292f36;
  }
`;
