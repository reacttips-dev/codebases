import React from 'react';
import styled from '@emotion/styled';
import classNames from 'classnames';
import { CardElement } from 'react-stripe-elements';
import { FieldError } from 'shared/FieldController';

export type CardInputProps = {
  error?: FieldError;
};

export const CardInput = React.forwardRef((props: CardInputProps, ref) => {
  const { error } = props;

  const config = {
    style: {
      base: {
        color: '#292F36',
        fontFamily: "'Maax', sans-serif",
        fontSize: '16px',
        '::placeholder': {
          color: 'rgba(41, 47, 54, 0.5)',
        },
      },
    },
  };

  return (
    <CardInputContainer>
      <div className={classNames('card-field', { 'has-error': error })}>
        <div className="form-control">
          <CardElement {...config} elementRef={ref as (ref: any) => void} />
        </div>
      </div>
    </CardInputContainer>
  );
});

const CardInputContainer = styled.div`
  .form-control {
    padding: 10px 16px;
    border-radius: 6px;
    > div {
      display: inline-block;
      width: 100%;
    }
  }
  .has-error .form-control {
    border: solid 2px #d0021b;
  }
`;
