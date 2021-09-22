import PropTypes from 'prop-types';

import React from 'react';

// TODO update these strings to be part of bundles/page
import _t from 'i18n!pages/error/nls/error404';

import CourseraMetatags from 'bundles/seo/components/CourseraMetatags';

// TODO move this to bundles/page
class NotFound extends React.Component<{
  resourceKind?: string;
}> {
  // TODO customize the message to the kind of resource that wasn't found
  static propTypes = {
    resourceKind: PropTypes.string,
  };

  static defaultProps = {
    resourceKind: 'page',
  };

  render() {
    return (
      <div className="rc-NotFound">
        <CourseraMetatags disableCrawlerIndexing={true} />
        <h2>{_t('Sorry')}</h2>
        <p>{_t('Looks like you found a page that does not exist or the URL was mistyped by accident.')}</p>
      </div>
    );
  }
}

export default NotFound;
