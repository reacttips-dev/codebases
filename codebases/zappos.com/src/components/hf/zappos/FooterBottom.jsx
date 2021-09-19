import React from 'react';

import Link from 'components/hf/HFLink';
import useMartyContext from 'hooks/useMartyContext';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { trackEvent, trackLegacyEvent } from 'helpers/analytics';
import HtmlToReact from 'components/common/HtmlToReact';
import { stripSpecialCharsDashReplace as strip } from 'helpers';

import css from 'styles/components/hf/zappos/footerBottom.scss';
const CURRENT_YEAR = new Date().getFullYear();

export const FooterBottom = ({ isVip, copyright, bottomLinks }) => {

  const { marketplace: { phoneNumber, phoneNumberVip }, testId } = useMartyContext();
  const number = isVip ? phoneNumberVip : phoneNumber;
  return (
    <div className={css.container}>
      {bottomLinks?.componentName === 'footerMenu' && <ul className={css.links}>
        {bottomLinks.footerMenu.map(({ link, text, gae }) =>
          <li key={text}>
            <Link
              data-test-id={testId(text)}
              to={link}
              onClick={() => {
                trackEvent('TE_FOOTER_POLICIES', strip(gae || text));
                trackLegacyEvent('Footer', 'Legal-Policies', strip(gae || text));
              }}>
              {text.replace(/{{phoneNumber}}/g, number)}
            </Link>
          </li>
        )}
      </ul>}
      <HtmlToReact className={css.botCopy} data-test-id={testId('footerLegalCopy')}>
        {copyright?.pageContent?.body.replace(/{{currentYear}}/g, CURRENT_YEAR)}
      </HtmlToReact>
    </div>
  );
};

export default withErrorBoundary('FooterBottom', FooterBottom);
