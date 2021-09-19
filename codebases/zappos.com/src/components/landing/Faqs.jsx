import React from 'react';
import PropTypes from 'prop-types';

import FaqSingle from './FaqSingle';

import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { stripSpecialChars } from 'helpers';

import css from 'styles/components/landing/faqs.scss';

export const Faqs = (props, { testId }) => {

  const { slotDetails } = props;
  const { faqs, faqSections, monetateId } = slotDetails;

  const makeFaqList = faqs => faqs.map(
    faq => <FaqSingle key={faq.id} faq={faq} />
  );

  const makeFaqQuestionLinks = faqSections =>
    // loop through faq sections and make individual question links
    faqSections.map(faqSection => {
      const { faqs, heading, question, id } = faqSection;

      if (faqs && heading) {
        // nested faqSections array ex: general-questions
        return (
          <div key={heading}>
            <h4 className={css.sectionHeading}>{heading}</h4>
            <ol>
              {faqs.map(faq => {
                const { question, id } = faq;
                return (
                  <li key={id}>
                    <a href={`#${id}`}>{question}</a>
                  </li>
                );
              })}
            </ol>
          </div>
        );
      } else if (question && id) {
        return (
          <li key={id}>
            <a href={`#${id}`}>{question}</a>
          </li>
        );
      }
    })
  ;

  if (faqs && faqs.length > 0) {
    // simple faq array
    return (
      <div
        className={css.contents}
        data-test-id={testId('faq')}
        id={'faq-list'}
        data-monetate-id={monetateId}
      >
        <ol>{makeFaqQuestionLinks(faqs)}</ol>
        {makeFaqList(faqs)}
      </div>
    );
  } else if (faqSections && faqSections.length > 0) {
    // faq array divided into sections (eg. www.zappos.com/c/general-questions)
    return (
      <div
        className={css.contents}
        data-test-id={testId('faq')}
        id={'faq-list'}
        data-monetate-id={monetateId}
      >

        {makeFaqQuestionLinks(faqSections)}

        {/* makes the questions and answers */}
        {faqSections.map((faqSection, index) => {
          const { heading, faqs } = faqSection;
          return (
            <div key={`${stripSpecialChars(heading)}_${index}`}>
              <h3 className={css.sectionHeading}>{heading}</h3>
              {makeFaqList(faqs)}
            </div>
          );
        })}
      </div>
    );
  } else {
    return false;
  }
};

Faqs.contextTypes = {
  testId: PropTypes.func
};

export default withErrorBoundary('Faqs', Faqs);
