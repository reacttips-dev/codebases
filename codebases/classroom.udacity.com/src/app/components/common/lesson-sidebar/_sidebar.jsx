import { IconCaretLeft, IconSearch } from '@udacity/veritas-icons';
import Actions from 'actions';
import ClassroomPropTypes from 'components/prop-types';
import CloudResources from 'components/common/cloud-resources';
import PropTypes from 'prop-types';
import { SINGLE_EXPANDED_SECTION_HEIGHT_THRESHOLD_PX } from 'constants/sidebar';
import Section from './_section';
import ServiceLinks from './_service-links';
import ServiceLinksContainer from 'components/common/service-links-container';
import TrackingLink from 'components/common/tracking-link';
import _ from 'lodash';
import { __ } from 'services/localization-service';
import { connect } from 'react-redux';
import styles from './_sidebar.scss';

@cssModule(styles)
export class Sidebar extends React.Component {
  static displayName = 'common/lesson-sidebar/_sidebar';

  static contextTypes = {
    root: ClassroomPropTypes.node,
  };

  static propTypes = {
    headerPath: PropTypes.string,
    onStartSearch: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        icon: PropTypes.string,
        content: PropTypes.node.isRequired,
      })
    ),
    titleParts: PropTypes.shape({
      prefix: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
    }).isRequired,
    // For test injection:
    getViewportHeight: PropTypes.func,
  };

  static defaultProps = {
    getViewportHeight: () => document.documentElement.clientHeight,
  };

  state = {
    isSectionExpanded: {
      [_.last(this.props.items).title]: true,
    },
  };

  onStartSearchNoDefault() {
    const { onStartSearch } = this.props;

    onStartSearch();
  }

  handleSectionExpandedChange = (isExpanded, sectionTitle) => {
    const { getViewportHeight } = this.props;
    const viewportHeight = getViewportHeight();
    this.setState(({ isSectionExpanded }) => ({
      isSectionExpanded:
        viewportHeight < SINGLE_EXPANDED_SECTION_HEIGHT_THRESHOLD_PX
          ? { [sectionTitle]: isExpanded }
          : {
              ...isSectionExpanded,
              [sectionTitle]: isExpanded,
            },
    }));
  };

  _renderItems() {
    const { items } = this.props;
    const { isSectionExpanded } = this.state;

    const expandableItems = items.map((i) => ({
      ...i,
      isExpanded: !!isSectionExpanded[i.title],
      expandSection: (isExpanded) => {
        this.handleSectionExpandedChange(isExpanded, i.title);
      },
    }));
    return _.map(expandableItems, (itemProps) => (
      <Section key={itemProps.title} {...itemProps} />
    ));
  }

  render() {
    const {
      titleParts: { prefix, text },
      headerPath,
    } = this.props;
    const { root } = this.context;

    const searchSection = {
      icon: <IconSearch title={__('Search')} size="sm" color="silver" />,
      title: __('Search'),
      content: null,
      onClick: () => this.onStartSearchNoDefault(),
    };
    return (
      <div styleName="sidebar">
        <h3 styleName="header">
          <TrackingLink
            to={headerPath}
            trackingEventName="Learning Nav Clicked"
          >
            <span styleName="title-content">
              <span styleName="arrow">
                <IconCaretLeft size="lg" />
              </span>
              <span styleName="title">
                <span>{prefix}</span>
                <span styleName="title-text"> {text}</span>
              </span>
            </span>
          </TrackingLink>
        </h3>
        <div styleName="sections">
          <Section key={searchSection.title} {...searchSection} />
          <CloudResources nanodegree={root} resourceService="aws" />
          {this._renderItems()}
        </div>
        <div styleName="footer">
          <ServiceLinksContainer DisplayComponent={ServiceLinks} />
        </div>
      </div>
    );
  }
}

export default connect(null, {
  onStartSearch: Actions.showSearch,
})(Sidebar);
