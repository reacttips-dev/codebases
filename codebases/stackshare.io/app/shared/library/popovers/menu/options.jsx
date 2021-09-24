import React, {Component} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {ASH, CHARCOAL} from '../../../style/colors';
import {BASE_TEXT} from '../../../style/typography';
import {
  ADD_ICON,
  EDIT_ICON,
  DELETE_ICON,
  SETTINGS_ICON,
  EMBED_ICON,
  GITHUB_ICON,
  CHECK_MARK_ICON,
  COMPANY_ICON,
  TEAM_ICON,
  MEMBERS_ICON,
  MEMBERS_LEAVE_ICON,
  APPLICATIONS_ICON,
  PAYMENT_OPTIONS_ICON
} from '../../../constants/icons';

import AddIcon from '../../icons/add.svg';
import EditIcon from '../../icons/edit.svg';
import DeleteIcon from '../../icons/delete.svg';
import SettingsIcon from '../../icons/settings.svg';
import EmbedIcon from '../../icons/embed.svg';
import GithubIcon from '../../icons/github.svg';
import CheckMarkIcon from '../../icons/check-mark.svg';
import CompanyIcon from '../../icons/join-company.svg';
import TeamIcon from '../../icons/team-icon.svg';
import MembersIcon from '../../icons/nav/members.svg';
import MembersLeaveIcon from '../../icons/nav/admin-menu-icon-leave-team.svg';
import ApplicationIcon from '../../icons/dropdown-icon-apps.svg';
import PaymentIcon from '../../icons/payment-icon.svg';
import {ALPHA} from '../../../style/color-utils';

const Option = glamorous.div({
  ...BASE_TEXT,
  fontSize: 13,
  color: CHARCOAL,
  display: 'flex',
  alignItems: 'center',
  height: 38,
  width: '100%',
  boxSizing: 'border-box',
  cursor: 'pointer',
  ':hover': {
    background: ALPHA(ASH, 0.5)
  },
  paddingLeft: 12,
  '>svg': {
    marginRight: 12,
    width: 20
  }
});

export default class Options extends Component {
  static propTypes = {
    options: PropTypes.arrayOf(
      PropTypes.shape({
        icon: PropTypes.any,
        label: PropTypes.string.isRequired,
        id: PropTypes.any.isRequired
      })
    ),
    onClick: PropTypes.func.isRequired
  };

  renderIcon(icon) {
    switch (icon) {
      case ADD_ICON:
        return <AddIcon />;
      case EDIT_ICON:
        return <EditIcon />;
      case DELETE_ICON:
        return <DeleteIcon />;
      case SETTINGS_ICON:
        return <SettingsIcon />;
      case EMBED_ICON:
        return <EmbedIcon />;
      case GITHUB_ICON:
        return <GithubIcon />;
      case CHECK_MARK_ICON:
        return <CheckMarkIcon />;
      case COMPANY_ICON:
        return <CompanyIcon />;
      case TEAM_ICON:
        return <TeamIcon />;
      case MEMBERS_ICON:
        return <MembersIcon />;
      case MEMBERS_LEAVE_ICON:
        return <MembersLeaveIcon />;
      case APPLICATIONS_ICON:
        return <ApplicationIcon />;
      case PAYMENT_OPTIONS_ICON:
        return <PaymentIcon />;
      default:
        return icon;
    }
  }

  render() {
    const {options, onClick} = this.props;
    return (
      <React.Fragment>
        {options.map(o => (
          <Option key={o.id} onClick={() => onClick(o.id)}>
            {this.renderIcon(o.icon)}
            {o.label}
          </Option>
        ))}
      </React.Fragment>
    );
  }
}
