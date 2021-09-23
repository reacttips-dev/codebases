import React from 'react';

type FillColor = string;
type ClassName = string;

interface IProps {
  fillColor: FillColor;
  className: ClassName;
}
const defaultProps = {
  className: '',
  fillColor: '#53585E',
};

const GlobeIcon = ({
  fillColor,
  className,
}: IProps): React.ReactElement<React.ReactNode> => (
  <svg viewBox="0 0 33 40" className={className}>
    <title>Globe</title>
    <path
      fill={fillColor}
      fillRule="nonzero"
      d="M13.72 27.76c7.56 0 13.73-6.24 13.73-13.88C27.45 6.24 21.28 0 13.72 0A13.83 13.83 0 0 0 0 13.88c0 7.64 6.17 13.88 13.72 13.88zM28.62 1.3c-1.1-1.38-1.4-1.54-2.3-.17l-.07.1c-.8 1.2-1.03 1.01-.1 2.22 5.11 6.56 4.92 16.03-1 21.98-5.9 5.94-15.14 6.07-21.7 1-1.22-.94-1.22-.94-2.22.1-1.23 1.28-1.26 1.25.06 2.4C4.84 32 9.3 33.5 13.72 33.46v3.26H7.27c-1.62 0-1.62 0-1.62 1.64 0 1.63 0 1.63 1.62 1.63H23.4c1.62 0 1.62 0 1.62-1.63 0-1.64 0-1.64-1.62-1.64h-6.46v-3.55a19.43 19.43 0 0 0 10.47-5.46c6.97-6.99 7.46-18.61 1.2-26.41zM12.52 9.44l2.68-1.86c.42-.27.55-.76.36-1.21l-1.3-3.07a10.51 10.51 0 0 1 9.85 12.08c-.1-.07-.22-.13-.35-.16l-4.23-1.11c-.2-.07-.39.03-.55.1l-3.55 1.53c-.71.3-1.42-.1-1.59-.85l-.58-2.55c-.06-.23-.13-.42-.32-.52l-.8-.62c-.52-.4-.4-1.2.38-1.76zm-9.07 2.18l5.74 3.56 1.94.6c.3.09.55.29.61.55l.94 2.48c.03.03.03.2.03.3v5.31a10.56 10.56 0 0 1-9.26-12.8z"
    />
  </svg>
);

GlobeIcon.defaultProps = defaultProps;

export { GlobeIcon };
