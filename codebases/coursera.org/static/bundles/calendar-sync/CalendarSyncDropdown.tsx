import React, { PureComponent } from 'react';
import { compose, withProps } from 'recompose';
import { graphql } from 'react-apollo';

import user from 'js/lib/user';

import withSingleTracked from 'bundles/common/components/withSingleTracked';

import { SvgButton, DropDown, color } from '@coursera/coursera-ui';
import { SvgChevronDown } from '@coursera/coursera-ui/svg';
import { naptime } from '@coursera/graphql-utils';

import _t from 'i18n!nls/degree-home';

import withCalendarData from './withCalendarData';

type Props = {
  style: any;
  toggleCalendarEnabled: ({}) => Promise<any>;
  userId: number | string;
  calendar?: { google: string; webcal: string; ics: string };
};

type State = {
  closed: boolean;
};

const DropDownItem = (props: $TSFixMe) =>
  ((TrackedItem) => <TrackedItem {...props} style={{ padding: '0.25rem 0.75rem' }} />)(
    withSingleTracked({ type: 'BUTTON' })(DropDown.Item)
  );

const withMutation = graphql(
  naptime`
      mutation($userId: String, $shouldDisplayContent: Boolean) {
        LearnerCalendarsV1Resource {
          action(action: "toggleShouldDisplayContent", userId: $userId, shouldDisplayContent: $shouldDisplayContent)
        }
      }
    `,
  { name: 'toggleCalendarEnabled' }
);

export class CalendarSyncDropdownComponent extends PureComponent<Props, State> {
  makeDownloadOption = (label: string, link: string, trackingName: string) => ({
    label,
    trackingName,
    key: trackingName,
    onClick: this.selectDropdownItem(link),
  });

  selectDropdownItem = (link: string) => () => {
    const { userId, toggleCalendarEnabled } = this.props;

    toggleCalendarEnabled({
      variables: {
        userId: Number.parseInt(userId.toString(), 10),
        shouldDisplayContent: true,
      },
    }).then(() => {
      window.open(link, '_blank');
    });
  };

  renderCalendarCardButton = ({ getDropDownButtonProps }: { getDropDownButtonProps: () => { [key: string]: any } }) => {
    const { 'aria-expanded': ariaExpanded, 'aria-haspopup': ariaHasPopUp, ...buttonProps } = getDropDownButtonProps();
    return (
      <SvgButton
        isChildrenOnRight={true}
        svgElement={
          <SvgChevronDown
            color={color.primary}
            hoverColor={color.white}
            isThemeDark={false}
            style={{ transform: 'translateY(-1px)' }}
            suppressTitle={true}
          />
        }
        type="secondary"
        size="zero"
        label={_t('Add to calendar')}
        style={{
          padding: '0.3rem 2rem',
          width: '100%',
          fontWeight: 700,
          margin: `0.25rem 0 0 0`,
        }}
        htmlAttributes={{
          'aria-expanded': ariaExpanded,
          'aria-haspopup': ariaHasPopUp,
        }}
        {...buttonProps}
      />
    );
  };

  render() {
    const { calendar } = this.props;
    const { google, webcal } = calendar || {};

    const options = [
      // @ts-expect-error TSMIGRATION
      this.makeDownloadOption(_t('Google Calendar'), google, 'download_cal_opt_google'),
      // @ts-expect-error TSMIGRATION
      this.makeDownloadOption(_t('Apple Calendar'), webcal, 'download_cal_opt_apple'),
      // @ts-expect-error TSMIGRATION
      this.makeDownloadOption(_t('Other Calendar'), webcal, 'download_cal_opt_other'),
    ];

    return (
      <DropDown.ButtonMenu renderButton={this.renderCalendarCardButton}>
        {options.map((props) => (
          <DropDownItem {...props} />
        ))}
      </DropDown.ButtonMenu>
    );
  }
}

export default compose(
  withProps(() =>
    ((userId) => ({
      userId,
      userIdString: userId.toString(),
    }))(user.get().id)
  ),
  withMutation,
  withCalendarData
  // @ts-expect-error TSMIGRATION
)(CalendarSyncDropdownComponent);
