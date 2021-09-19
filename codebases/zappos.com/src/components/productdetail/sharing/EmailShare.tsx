import React, { useEffect, useState } from 'react';
import cn from 'classnames';

import { Email } from 'components/icons';
import TellAFriend from 'components/productdetail/sharing/TellAFriend';
import { openPopup } from 'helpers/index.js';
import useMartyContext from 'hooks/useMartyContext';

import css from 'styles/components/productdetail/emailShare.scss';

interface Props {
  colorId: string;
  firstName: string | boolean;
  product: {
    link: string;
    name: string;
    style: string;
    image: string;
  };
  productId: string;
  shouldOpenTellAFriendModal: boolean;
  hash: string;
}

const EmailShare = ({
  colorId,
  firstName,
  product,
  productId,
  shouldOpenTellAFriendModal,
  hash
}: Props
) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { marketplace, testId } = useMartyContext();

  useEffect(() => {
    if (shouldOpenTellAFriendModal) {
      setIsModalOpen(true);
    }
  }, [shouldOpenTellAFriendModal]);

  const onModalClose = () => {
    setIsModalOpen(false);
  };

  const openModal = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const lineBreak = '%0D%0A';
  const { tellAFriendAction, useTellAFriendModal } = marketplace.pdp;
  const marketplaceName = marketplace.name[0].toUpperCase() + marketplace.name.slice(1);
  const signature = firstName ? `${lineBreak}${firstName}` : '';
  const subject = `I saw this on ${marketplaceName}`;
  const body = `Hey! I was shopping on ${marketplaceName} and stumbled across this:${lineBreak}${product.name} ${product.link}${lineBreak}Thoughts?${signature}`;
  const emailLink = `mailto:?subject=${subject}&body=${body}`;

  return (
    <span>
      <a
        href={`${tellAFriendAction}?productId=${productId}${colorId ? `&colorId=${colorId}` : ''}`}
        className={cn(css.desktop, css.email, { [css.hidden]: !tellAFriendAction })}
        onClick={useTellAFriendModal ? openModal : openPopup}
        data-popup-options="width=463,height=475"
        data-test-id={testId('tellAFriendShareIcon')}>
        <Email size={22} title="Share by email"/>
      </a>
      {useTellAFriendModal && <TellAFriend
        isOpen={isModalOpen}
        onClose={onModalClose}
        productId={productId}
        colorId={colorId}
        hash={hash}/>}
      <a
        href={emailLink}
        className={cn(css.mobile, css.email, { [css.visible]: !tellAFriendAction })}
        onClick={useTellAFriendModal ? openModal : undefined}
        data-test-id={testId('tellAFriendMobileShareIcon')}>
        <Email title="Share by email" size={22}/>
      </a>
    </span>
  );
};

export default EmailShare;

