import React from 'react';
import cx from 'classnames';
import { forTemplate } from '@trello/i18n';

// eslint-disable-next-line @trello/less-matches-component
import styles from './Error.less';

const format = forTemplate('error');

interface UnconfirmedModelErrorProps {
  messageKey: string;
  email: string;
}

export const UnconfirmedModelError: React.FunctionComponent<UnconfirmedModelErrorProps> = ({
  messageKey,
  email,
}) => (
  <div className={cx(styles.bigMessage, styles.withPicture, styles.quiet)}>
    <img
      src={require('resources/images/TacoBouncer.png')}
      width="459"
      height="238"
      alt=""
    />
    <h1>{format('roooooo-are-you')}</h1>
    <p>{format(messageKey)}</p>
    <div className="callout">
      <ol>
        <li
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: format('check-your-email-at-email', { email }),
          }}
        ></li>
        <li>
          {format(
            'look-for-an-email-with-the-subject-trello-account-confirmation',
          )}
        </li>
        <li>{format('click-on-the-confirmation-link-done')}</li>
      </ol>
    </div>
    <p>
      {`${format('dont-see-anything-from-us')} `}
      <a href="#" className={cx(styles.quiet, 'js-resend-confirmation-email')}>
        {format('resend-confirmation-link')}
      </a>
    </p>
  </div>
);
