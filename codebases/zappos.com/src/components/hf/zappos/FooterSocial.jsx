import PropTypes from 'prop-types';

import { stripSpecialCharsDashReplace as strip } from 'helpers';
import { trackEvent, trackLegacyEvent } from 'helpers/analytics';
import useMartyContext from 'hooks/useMartyContext';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';

import css from 'styles/components/hf/zappos/footerSocial.scss';

export const FooterSocial = props => {
  const { testId } = useMartyContext();
  const { socialLinks: { componentName, heading, footerMenu } = {} } = props;

  return (
    <div className={css.social}>
      {componentName === 'footerMenu' &&
      <>
        <h3>{heading.text}</h3>
        <ul className={css.social}>
          {footerMenu?.map(({ link, text, gae }) =>
            <li key={text}>
              <a
                data-test-id={testId(text)}
                href={link}
                rel="noopener noreferrer"
                target="_blank"
                onClick={() => {
                  trackEvent('TE_FOOTER_SOCIAL', strip(gae || text));
                  trackLegacyEvent('Footer', 'Connect-with-us', strip(gae || text));
                }}>
                {text}
              </a>
            </li>
          )}
        </ul>
      </>
      }
    </div>
  );
};

FooterSocial.contextTypes = {
  testId: PropTypes.func
};

export default withErrorBoundary('FooterSocial', FooterSocial);
