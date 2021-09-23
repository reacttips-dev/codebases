import React, { useContext } from 'react';
import Button from 'react-bootstrap/lib/Button';
import styled from '@emotion/styled';
import Alert from 'react-bootstrap/lib/Alert';
import {
  useForm,
  UseFormSetError,
  FieldValues,
  UseFormRegister,
} from 'react-hook-form';
import { FieldError } from 'shared/FieldController';
import { FieldInput, FieldSelect } from 'components/Field';
import Spinner from 'components/Spinner';
import {
  PriceTierContext,
  REQUIRED_PROVINCE_TERRITORY_COUNTRIES,
} from 'components/ProfilePaywalls';
import { SM_SCREEN_MIN } from 'modules/Styleguide';
import {
  BILLING_CANADIAN_PROVINCES_TERRITORIES_LIST,
  BILLING_COUNTRIES_LIST,
  PROCESSOR_ERROR_MESSAGES,
} from 'components/PaymentForm/constants';
import { isValidEmail } from 'client/user';
import { CardInput } from '../FieldCardInput';

type CreditCardFormProps = {
  /** Determines if submit should be disabled. */
  isPaymentProcessing: boolean;
  /** Label on submit button. */
  buttonLabel: React.ReactNode;
  /** Determines if a user can select a billing country. */
  showUserSelectedBillingCountry: boolean;
  /** Runs when onSubmit is successful and react-hook-form has no errors  */
  onSubmitSuccess: (data: any, setError: UseFormSetError<FieldValues>) => void;
};

type FieldCountryProps = {
  /** function called onChange */
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  /** Error message on the select */
  error: FieldError;
  /** function used to register FieldCountry with react-hook-form. */
  register: UseFormRegister<FieldValues>;
};

const FieldCountry = (props: FieldCountryProps) => {
  const { onChange, error, register } = props;
  const countryRegistration = register('country', {
    required: true,
  });

  return (
    <FieldSelect
      id="country"
      name={countryRegistration.name}
      options={BILLING_COUNTRIES_LIST}
      placeholder="Choose one..."
      onChange={e => {
        countryRegistration.onChange(e);
        onChange(e);
      }}
      onBlur={countryRegistration.onBlur}
      ref={countryRegistration.ref}
      error={error}
    />
  );
};

export const CreditCardForm = (props: CreditCardFormProps) => {
  const {
    isPaymentProcessing,
    buttonLabel = 'Submit',
    showUserSelectedBillingCountry,
    onSubmitSuccess,
  } = props;

  const [showProvinces, setShowProvinces] = React.useState(false);
  const { refetchPriceTier } = useContext(PriceTierContext);

  const handleBillingCountryOnChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setShowProvinces(
      !!event.target &&
        REQUIRED_PROVINCE_TERRITORY_COUNTRIES.includes(event.target.value)
    );
    refetchPriceTier(event.target.value);
  };

  const {
    formState: { isDirty, isSubmitting, errors },
    handleSubmit,
    setError,
    register,
  } = useForm({
    mode: 'onSubmit',
  });

  const isError = Boolean(Object.keys(errors).length);

  return (
    <form
      method="POST"
      onSubmit={handleSubmit(data => onSubmitSuccess(data, setError))}
      noValidate={true}
    >
      <CreditCardFormContainer>
        <FieldInput placeholder="Name" type="text" {...register('name')} />
        <FieldInput
          placeholder="Email"
          type="email"
          {...register('email', {
            required: true,
            validate: email => isValidEmail(email),
          })}
          error={errors.email}
        />
        <CardInput {...register('token')} error={errors.token} />
        {showUserSelectedBillingCountry && (
          <FieldCountry
            onChange={handleBillingCountryOnChange}
            error={errors.country}
            register={register}
          />
        )}
        {showUserSelectedBillingCountry && showProvinces && (
          <FieldSelect
            id="province"
            {...register('province', { required: true })}
            options={BILLING_CANADIAN_PROVINCES_TERRITORIES_LIST}
            placeholder="Choose one..."
            error={errors.province}
          />
        )}
        <FormSubmitButton
          type="submit"
          bsStyle="primary"
          disabled={isSubmitting || isPaymentProcessing}
        >
          {isSubmitting || isPaymentProcessing ? (
            <Spinner size={24} />
          ) : (
            buttonLabel
          )}
        </FormSubmitButton>
        {isDirty && isError && (
          <Alert bsStyle="danger">
            {Object.values(errors)[0]?.message ||
              PROCESSOR_ERROR_MESSAGES.GENERAL_ERROR}
          </Alert>
        )}
      </CreditCardFormContainer>
    </form>
  );
};

const CreditCardFormContainer = styled.div`
  margin-top: 12px;

  .alert {
    margin: 0;
    margin-top: 16px;
  }

  .card-field .form-control,
  input[name='name'],
  input[name='email'] {
    height: 40px;
    font-size: 16px;
  }
  .card-field,
  input[name='name'],
  input[name='email'],
  select[name='country'],
  select[name='province'] {
    margin-bottom: 10px;
  }
  select[name='country'],
  select[name='province'] {
    background-color: #f2f2f3;
    border: 1px solid #dfe0e1;
    font-size: 16px;

    &[data-value=''] {
      color: #777777;
    }
    > option[value=''] {
      display: none;
    }
  }
  .btn {
    @media (max-width: 380px) {
      height: 40px;
      line-height: 28px;
      font-size: 14px;
    }
  }
`;

const FormSubmitButton = styled(Button)`
  width: 100%;

  @media (min-width: ${SM_SCREEN_MIN}px) {
    margin-top: 16px;
  }

  &:disabled,
  &:disabled:hover {
    color: white;
    background-color: #5000b9;
  }
`;
