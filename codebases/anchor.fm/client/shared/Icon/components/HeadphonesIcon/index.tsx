import React from 'react';

type FillColor = string;
type ClassName = string;

interface Props {
  fillColor: FillColor;
  className: ClassName;
}
const defaultProps = {
  className: '',
  fillColor: '#53585E',
};

const HeadphonesIcon = ({
  fillColor,
  className,
}: Props): React.ReactElement<React.ReactNode> => (
  <svg viewBox="0 0 20 20" className={className}>
    <title>Listeners</title>
    <path
      fill={fillColor}
      fillRule="nonzero"
      d="M9.7 0A9.85 9.85 0 0 0 0 9.92v3.78c0 .3.1.6.2.89l.58 1.19c.29.7.97 1.1 1.74 1.1h.4v.98c0 .6.38 1 .96 1v.6c0 .2.2.39.4.39h1.54c.59 0 .98-.4.98-1V12.9c0-.6-.4-.99-.98-.99H4.27c-.2 0-.39.2-.39.4v.6c-.58 0-.97.39-.97.98v1h-.39l-.58-1.2V9.93c0-4.36 3.5-7.94 7.77-7.94a7.88 7.88 0 0 1 7.76 7.94v3.78l-.58 1.19h-.39v-1c0-.6-.39-.99-.97-.99v-.6c0-.2-.2-.39-.39-.39H13.6c-.58 0-.97.4-.97 1v5.95c0 .6.39.99.97.99h1.55c.2 0 .4-.2.4-.4v-.6c.57 0 .96-.39.96-.99v-.99h.4c.77 0 1.35-.4 1.74-1.09l.58-1.2c.1-.29.2-.59.2-.88V9.92A9.85 9.85 0 0 0 9.7 0z"
    />
  </svg>
);

HeadphonesIcon.defaultProps = defaultProps;

export { HeadphonesIcon };
