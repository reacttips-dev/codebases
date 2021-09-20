/* eslint-disable import/no-default-export */
import React from 'react';

interface InlineLinkProps {
  text: string;
  href?: string;
  onClick?: (e: React.FormEvent) => void;
}

export class InlineLink extends React.Component<InlineLinkProps> {
  render() {
    const { text, href = '#', onClick = () => {} } = this.props;

    return (
      <a
        onClick={onClick}
        href={href}
        rel="noopener noreferrer"
        target="_blank"
      >
        {text}
      </a>
    );
  }
}
