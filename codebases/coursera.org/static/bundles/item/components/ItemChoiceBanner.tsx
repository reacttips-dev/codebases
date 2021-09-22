import classnames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Icon from 'bundles/iconfont/Icon';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import ItemGroupMessage from 'bundles/ondemand/components/lessonMessages/ItemGroupMessage';
import { TrackedReactLink } from 'bundles/page/components/TrackedLink2';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import ItemGroupChoice from 'pages/open-course/common/models/itemGroupChoice';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';
import _t from 'i18n!nls/item';
import { FormattedMessage } from 'js/lib/coursera.react-intl';
import 'css!./__styles__/ItemChoiceBanner';

class ItemChoiceBanner extends React.Component {
  static propTypes = {
    choice: PropTypes.instanceOf(ItemGroupChoice).isRequired,
    isItemGroupPassed: PropTypes.bool.isRequired,
    passedChoicesCount: PropTypes.number.isRequired,
  };

  constructor(props: $TSFixMe, context: $TSFixMe) {
    super(props, context);

    this.state = {
      expanded: true,
    };
  }

  handleToggleExpanded = () => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'expanded' does not exist on type 'Readon... Remove this comment to see the full error message
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'choice' does not exist on type 'Readonly... Remove this comment to see the full error message
    const { choice, isItemGroupPassed, passedChoicesCount } = this.props;
    const className = classnames(
      'od-item-choice-header',
      'card-rich-interaction',
      'horizontal-box',
      'align-items-vertical-center',
      { 'item-choice-header-passed': isItemGroupPassed }
    );
    return (
      <div className="rc-ItemChoiceBanner">
        <div className={className}>
          <TrackedReactLink
            className="od-item-choice-header-main nostyle flex-1 horizontal-box align-items-vertical-center"
            href={choice.getItemGroup().getLink()}
            trackingName="item_choice_banner"
          >
            <ItemGroupMessage
              isItemGroupPassed={isItemGroupPassed}
              passedChoicesCount={passedChoicesCount}
              requiredPassedCount={choice.getItemGroup().getRequiredPassedCount()}
              choicesCount={choice.getItemGroup().getChoicesCount()}
              trackId={choice.getLesson().getTrackId()}
            />
          </TrackedReactLink>
          <button
            className="od-item-choice-header-button nostyle"
            // @ts-expect-error ts-migrate(2322) FIXME: Type '{ children: Element; className: string; aria... Remove this comment to see the full error message
            ariaLabel={this.state.expanded ? _t('Collapse description') : _t('Expand description')}
            onClick={this.handleToggleExpanded}
          >
            {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'expanded' does not exist on type 'Readon... Remove this comment to see the full error message */}
            {this.state.expanded ? <Icon name="chevron-up" /> : <Icon name="chevron-down" />}
          </button>
        </div>
        {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'expanded' does not exist on type 'Readon... Remove this comment to see the full error message */}
        {this.state.expanded && (
          <div className="od-item-choice-description-container">
            <div className="body-2-text od-item-choice-description-title">
              <FormattedMessage
                message={_t('{choiceIndex}. {choiceName}')}
                choiceIndex={choice.getIndexInGroup() + 1}
                choiceName={choice.getName()}
              />
            </div>
            <div className="od-item-choice-description">{choice.getDescription()}</div>
          </div>
        )}
      </div>
    );
  }
}

export default connectToStores(ItemChoiceBanner, ['CourseViewGradeStore'], ({ CourseViewGradeStore }, props) => {
  // @ts-expect-error ts-migrate(2339) FIXME: Property 'choice' does not exist on type '{}'.
  const { choice } = props;
  const isItemGroupPassed = choice && CourseViewGradeStore.isItemGroupPassed(choice.getItemGroup().getId());
  const passedChoicesCount =
    choice && CourseViewGradeStore.getItemGroupOverallPassedCount(choice.getItemGroup().getId());
  return {
    isItemGroupPassed,
    passedChoicesCount,
    ...props,
  };
});

export const BaseComponent = ItemChoiceBanner;
