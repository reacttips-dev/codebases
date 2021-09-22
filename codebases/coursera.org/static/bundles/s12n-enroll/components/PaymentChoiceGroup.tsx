import PropTypes from 'prop-types';
import React from 'react';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import Group from 'bundles/groups/models/Group';
import UserS12n from 'bundles/s12n-common/service/models/userS12n';
import PaymentChoice from 'bundles/s12n-enroll/components/PaymentChoice';
/* @ts-ignore ts-migrate(7016) FIXME: Untyped import */
import PartnerGroupMembershipAPIUtils from 'bundles/groups/utils/PartnerGroupMembershipAPIUtils';
import { FormattedHTMLMessage } from 'js/lib/coursera.react-intl';
import GroupEnrollUtils from 'bundles/group-enroll/utils/GroupEnrollUtils';
import _t from 'i18n!nls/s12n-enroll';

class PaymentChoiceGroup extends React.Component {
  static propTypes = {
    group: PropTypes.instanceOf(Group),
  };

  static contextTypes = {
    userS12n: PropTypes.instanceOf(UserS12n),
  };

  state = {
    orgName: null,
  };

  componentDidMount() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'group' does not exist on type 'Readonly<... Remove this comment to see the full error message
    const { group } = this.props;
    PartnerGroupMembershipAPIUtils.getPartnerGroupMembership(group.id)
      .then((response: $TSFixMe) => {
        this.setState({
          orgName: GroupEnrollUtils.getPayerName(group, response),
        });
      })
      .catch((error: $TSFixMe) => {
        this.setState({ orgName: group.name });
      });
  }

  getBodyMessage() {
    const { userS12n } = this.context;
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'group' does not exist on type 'Readonly<... Remove this comment to see the full error message
    const { group } = this.props;
    const { orgName } = this.state;

    if (orgName) {
      return (
        <div>
          <FormattedHTMLMessage
            tagName="p"
            message={_t(
              `As part of <span class="body-2-text">{groupName}</span>, you're able to
              join the Specialization for free!  You'll have access to all {numOfCourses} courses,
            the Capstone project, and the Specialization Certificate.`
            )}
            groupName={group.name}
            numOfCourses={userS12n.getNumCourses()}
          />
          <p />
          <FormattedHTMLMessage
            tagName="p"
            message={_t(
              `If you decide you don't want to complete the course, you can un-enroll from the course 
              within 2 weeks of joining and {orgName} will not be charged.`
            )}
            orgName={orgName}
          />
        </div>
      );
    }
    return null;
  }

  render() {
    return (
      <PaymentChoice title={_t('Join now for free')} type="group" currentType="group">
        {this.getBodyMessage()}
      </PaymentChoice>
    );
  }
}

export default PaymentChoiceGroup;
