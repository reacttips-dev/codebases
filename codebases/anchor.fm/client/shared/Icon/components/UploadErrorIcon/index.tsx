import React from 'react';

interface IProps {
  fillColor?: string;
  className?: string;
  size?: {
    width: number;
    height: number;
  };
}

function UploadErrorIcon({
  size = { width: 54, height: 54 },
  fillColor = '#C9CBCD',
  className = '',
}: IProps) {
  return (
    <svg
      width={size.width}
      height={size.height}
      viewBox="0 0 54 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M24.333 34.9997H29.6663V40.333H24.333V34.9997ZM24.333 13.6663H29.6663V29.6663H24.333V13.6663ZM26.973 0.333008C12.253 0.333008 0.333008 12.2797 0.333008 26.9997C0.333008 41.7197 12.253 53.6663 26.973 53.6663C41.7197 53.6663 53.6663 41.7197 53.6663 26.9997C53.6663 12.2797 41.7197 0.333008 26.973 0.333008ZM26.9997 48.333C15.213 48.333 5.66634 38.7863 5.66634 26.9997C5.66634 15.213 15.213 5.66634 26.9997 5.66634C38.7863 5.66634 48.333 15.213 48.333 26.9997C48.333 38.7863 38.7863 48.333 26.9997 48.333Z"
        fill={fillColor}
      />
    </svg>
  );
}

export { UploadErrorIcon };
