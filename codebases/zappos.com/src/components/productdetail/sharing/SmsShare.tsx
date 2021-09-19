import React, { useEffect, useState } from 'react';

import { userAgentStringToPlatform } from 'helpers/UserAgentUtils';
import { SMS } from 'components/icons';
import useMartyContext from 'hooks/useMartyContext';

interface Props {
  className?: string;
  product: {
    link: string;
    name: string;
    style: string;
    image: string;
  };
}

const SmsShare = ({ product: { name, link }, className }: Props) => {
  const [separator, setSeparator] = useState('?');
  const { testId } = useMartyContext();

  useEffect(() => {
    const platform = userAgentStringToPlatform();
    setSeparator((platform === 'iphone' || platform === 'ipad') ? '&' : '?');
  }, []);

  const smsLink = `sms:${separator}body=${name} ${link}`;

  return (
    <a
      href={smsLink}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label="Share via SMS"
      data-test-id={testId('smsShareIcon')}>
      <SMS size={22}/>
    </a>
  );

};

export default SmsShare;
