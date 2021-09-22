import React from 'react';
import path from 'js/lib/path';
import classNames from 'classnames';

import Icon from 'bundles/iconfont/Icon';
import { TrackedA } from 'bundles/page/components/TrackedLink2';

import _t from 'i18n!nls/course-v2';

import 'css!./__styles__/AdminButton';

type Props = {
  courseSlug: string;
};

const AdminButton = (props: Props) => {
  const { courseSlug } = props;
  const classes = classNames('link-button', 'primary', 'fullbleed', 'horizontal-box', 'align-items-absolute-center');

  return (
    <div className="rc-AdminButton menu-item horizontal-box align-items-absolute-center">
      <TrackedA href={path.join('/teach', courseSlug)} className={classes} trackingName="course_admin_button">
        <Icon name="settings" />
        &nbsp;&nbsp;
        {_t('Admin')}
      </TrackedA>
    </div>
  );
};

export default AdminButton;
