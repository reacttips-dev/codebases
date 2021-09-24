import React, { useState } from 'react';
import { COLOR_GREEN } from 'client/components/MarketingPagesShared/styles';
import { Details, Container } from './styles';
import { FAQS } from './constants';

export function FAQ() {
  return (
    <Container>
      <h2>FAQ</h2>
      {FAQS.map(({ question, answer }) => {
        return (
          <Question
            question={question}
            answer={answer}
            key={`glossary-${question}`}
          />
        );
      })}
    </Container>
  );
}

function Question({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Details
      key={`glossary-${question}`}
      // @ts-ignore - `onToggle` seems to be missing from the types
      onToggle={e => {
        setIsOpen(e.target.open);
      }}
    >
      <summary>
        <svg
          viewBox="0 0 16 16"
          width="16"
          height="16"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden={true}
        >
          <circle cx="8" cy="8" r="8" fill={COLOR_GREEN} />
          <rect x="3" y="7" width="10" height="2" rx="1" fill="#fff" />
          {isOpen ? null : (
            <rect x="7" y="3" width="2" height="10" rx="1" fill="#fff" />
          )}
        </svg>
        {question}
      </summary>
      {answer}
    </Details>
  );
}
