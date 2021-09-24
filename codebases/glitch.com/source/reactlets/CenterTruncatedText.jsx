import React from 'react';

export default function CenterTruncatedText({ text }) {
  const firstSegmentLength = 1;
  const endSegmentLength = 1;

  const start = text.slice(0, firstSegmentLength);
  const center = text.slice(firstSegmentLength, -endSegmentLength);
  const end = text.slice(-endSegmentLength);

  if (!text.length) {
    return null;
  }

  if (text.length < 3) {
    return <>{text}</>;
  }

  return (
    <span className="truncated-text" aria-label={text}>
      <span aria-hidden="true">{start}</span>
      <span aria-hidden="true" className="truncated-text-center-segment">
        {center}
      </span>
      <span aria-hidden="true">{end}</span>
    </span>
  );
}
