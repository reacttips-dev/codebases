/** @jsx jsx */
import { jsx } from '@emotion/core';
import styled from '@emotion/styled';
import { useEffect, useState, forwardRef } from 'react';
import fieldStyles from 'components/Field/styles.sass';
import { FieldController } from 'shared/FieldController';
import { FieldHexProps, HexInputProps } from './types';

const Container = styled.div`
  display: flex;
  position: relative;
`;

const Pound = styled.span`
  position: absolute;
  font-size: 1.6rem;
  top: 13px;
  left: 16px;
`;

const Input = styled.input`
  height: 46px;
  font-size: 1.6rem;
  padding: 0 43px 0 24px;
  text-transform: uppercase;
`;

const ColorPreview = styled.div<{
  backgroundColor: string;
}>`
  width: 24px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid #dfe0e1;
  background-color: ${({ backgroundColor }) => backgroundColor};
  position: absolute;
  right: 11px;
  top: 11px;
`;

const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

const isValidHexValue = (value: string): boolean => hexRegex.test(value);

export const FieldHex = forwardRef(
  (
    { name, value, cssProp, ...rest }: HexInputProps,
    ref: React.Ref<HTMLInputElement>
  ) => {
    const [isValidHex, setIsValidHex] = useState(false);
    const [hexValue, setHexValue] = useState(`#${value}`);
    useEffect(() => {
      setIsValidHex(isValidHexValue(hexValue));
    }, [hexValue]);
    useEffect(() => {
      setHexValue(`#${value}`);
    }, [value]);
    return (
      <Container css={cssProp}>
        <Pound>#</Pound>
        <Input
          ref={ref}
          {...rest}
          type="text"
          value={value}
          className={fieldStyles.input}
          data-cy={name}
        />
        <ColorPreview backgroundColor={isValidHex ? hexValue : 'transparent'} />
      </Container>
    );
  }
);

export const ControlledFieldHex = (props: FieldHexProps) => (
  <FieldController<HexInputProps, HTMLInputElement> as={FieldHex} {...props} />
);
