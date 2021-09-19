import React from 'react';
import PropTypes from 'prop-types';

import Link from 'components/hf/HFLink';
import { stripSpecialCharsDashReplace } from 'helpers';
import { trackEvent, trackLegacyEvent } from 'helpers/analytics';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';

import css from 'styles/components/hf/zappos/footerNav.scss';

export const FooterNav = ({ data }, { testId }) => {
  const heading = data?.heading?.text;
  const { footerMenu } = data;
  return (
    <>
      {heading && <h3 className={css.heading}>{heading}</h3>}
      <ul className={css.list}>
        {footerMenu && footerMenu.map(({ text, link, gae }) =>
          <li key={text}>
            <Link
              data-test-id={testId(text)}
              to={link}
              onClick={() => {
                trackEvent('TE_FOOTER_NAV', `${heading}:${gae || text}`);
                trackLegacyEvent('Footer', stripSpecialCharsDashReplace(heading), stripSpecialCharsDashReplace(gae || text));
              }}>
              {text}
            </Link>
          </li>
        )}
      </ul>
    </>
  );
};

FooterNav.contextTypes = {
  testId: PropTypes.func
};

export default withErrorBoundary('FooterNav', FooterNav);
