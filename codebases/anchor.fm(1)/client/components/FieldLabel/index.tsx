/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { SerializedStyles } from '@emotion/serialize';

type Props = {
  htmlFor: string; // this must match the id of the associated input/field
  children: string | JSX.Element;
  cssProp?: SerializedStyles;
  className?: string;
};
export function FieldLabel({ htmlFor, cssProp, className, children }: Props) {
  return (
    <label
      htmlFor={htmlFor}
      css={css`
        margin: 0;
        font-weight: normal;
        ${cssProp}
      `}
      className={className}
    >
      {children}
    </label>
  );
}
