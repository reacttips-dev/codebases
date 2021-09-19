import React from 'react';

import { CheckMark } from 'components/icons';

import css from 'styles/components/productdetail/linkCopiedToast.scss';

interface Props {
  notificationMessage: String;
}

const LinkCopiedToast = ({ notificationMessage }: Props) => (
  <div
    className={css.notificationBox}>
    <p className={css.textFrame}>
      <CheckMark className={css.checkMark}/>
      {notificationMessage}
    </p>
  </div>
);

export default LinkCopiedToast;
