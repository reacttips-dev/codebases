import React from 'react';

interface IProps {
  fillColor: string;
  className: string;
}

const defaultProps = {
  className: '',
  fillColor: '#53585E',
};

const RemoveMusicIcon = ({
  fillColor,
  className,
}: IProps): React.ReactElement<React.ReactNode> => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 23 18"
    className={className}
  >
    <g fill="none" fillRule="evenodd">
      <path
        fill={fillColor}
        d="M21.2 2.542v8.951a4.228 4.228 0 0 0-1.37-.222c-1.75 0-3.17 1.016-3.17 2.269 0 1.253 1.42 2.27 3.17 2.27 1.644 0 2.995-.896 3.154-2.043L23 1.627V0L10.085 2.497v11.038a4.228 4.228 0 0 0-1.37-.222c-1.75 0-3.17 1.016-3.17 2.27 0 1.252 1.42 2.268 3.17 2.268 1.644 0 2.996-.895 3.155-2.042l.015-11.466L21.2 2.542z"
      />
      <path
        fill={fillColor}
        fillRule="nonzero"
        d="M6.83 2.172A3.977 3.977 0 0 0 4 1a3.977 3.977 0 0 0-2.83 1.172 4.003 4.003 0 0 0 0 5.656A3.976 3.976 0 0 0 4 9a3.977 3.977 0 0 0 2.83-1.172 4.004 4.004 0 0 0 0-5.656z"
      />
      <path
        fill="#FFF"
        stroke="#FFF"
        strokeWidth=".5"
        d="M5.274 3.726a.202.202 0 0 0-.285 0L4 4.715l-.989-.99a.202.202 0 0 0-.285.285l.989.99-.99.989a.202.202 0 0 0 .285.285l.99-.989.989.99a.202.202 0 0 0 .285-.285l-.989-.99.99-.989a.202.202 0 0 0 0-.285z"
      />
    </g>
  </svg>
);

RemoveMusicIcon.defaultProps = defaultProps;

export { RemoveMusicIcon };
