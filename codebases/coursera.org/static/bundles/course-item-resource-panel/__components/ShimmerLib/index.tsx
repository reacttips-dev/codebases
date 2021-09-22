import React from 'react';
import 'css!./__styles__';

export const shimmerColor = 'rgba(0,0,0,0.2)';

export function ShimmerBlock({ children }: { children?: JSX.Element }) {
  return (
    <div className="wrapper" style={{ backgroundColor: 'rgba(0,0,0,0.1)', width: 'auto', height: '18px' }}>
      {children}
    </div>
  );
}

export function ShimmerTextArea() {
  return (
    <span
      className="comment br animate"
      style={{ backgroundColor: shimmerColor, display: 'block', height: '20px', width: '340px' }}
    >
      {'        '}
    </span>
  );
}

export function ShimmerSentence({ width = '340px' }: { width: string }) {
  return (
    <span
      className="comment br animate "
      style={{ margin: '10px', backgroundColor: shimmerColor, display: 'block', width }}
    >
      {'        '}
    </span>
  );
}

export function ShimmerParagraph() {
  return (
    <div style={{ padding: '10px' }}>
      <ShimmerSentence width="80%" />
      <ShimmerSentence width="80%" />
      <ShimmerSentence width="66%" />
    </div>
  );
}
