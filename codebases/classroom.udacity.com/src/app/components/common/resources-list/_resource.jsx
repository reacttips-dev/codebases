import { IconDownload, IconLink } from '@udacity/veritas-icons';
import PropTypes from 'prop-types';
import TrackingLink from 'components/common/tracking-link';
import { __ } from 'services/localization-service';
import styles from './_resource.scss';

export const ResourceTypes = {
  LINK: 'link',
  FORUM: 'forum',
  FILE: 'file',
  SUPPORT: 'support',
};

const styleByType = {
  [ResourceTypes.LINK]: {
    style: 'resource',
    icon: <IconLink size="sm" title={__('Link')} />,
  },
  [ResourceTypes.FORUM]: {
    style: 'resource',
    icon: <IconLink size="sm" title={__('Forum')} />,
  },
  [ResourceTypes.FILE]: {
    style: 'resource',
    icon: <IconDownload size="sm" title={__('File')} />,
  },
  [ResourceTypes.SUPPORT]: { style: 'support', icon: null },
};

@cssModule(styles)
export default class Resource extends React.Component {
  static displayName = 'common/resources-list/_resource';
  static propTypes = {
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(_.values(ResourceTypes)).isRequired,
    url: PropTypes.string.isRequired,
  };

  render() {
    const { name, type, url } = this.props;
    return (
      <TrackingLink
        href={url}
        styleName={styleByType[type].style}
        target="_blank"
        title={name}
        trackingEventName="Resource Clicked"
        trackingOptions={{ resource_name: name }}
      >
        <span styleName="name">{name}</span>
        {styleByType[type].icon ? (
          <span styleName="icon">{styleByType[type].icon}</span>
        ) : null}
      </TrackingLink>
    );
  }
}
