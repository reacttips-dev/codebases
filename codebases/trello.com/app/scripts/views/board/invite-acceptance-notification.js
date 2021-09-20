/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Auth } = require('app/scripts/db/auth');
const React = require('react');
const t = require('app/scripts/views/internal/recup-with-helpers')(
  'invite_acceptance_notification',
);
const _ = require('underscore');
const { Analytics } = require('@trello/atlassian-analytics');

class InviteAcceptanceNotification extends React.Component {
  static initClass() {
    this.prototype.render = t.renderable(function () {
      return t.div('.invite-acceptance-notification', () => {
        t.div('.invite-acceptance-notification-close', () => {
          return t.a({ onClick: this.props.onClose, href: '#' }, () =>
            t.span('.icon-lg.icon-close'),
          );
        });
        t.h6(() => {
          return this.getTitle();
        });
        t.p(() => {
          return this.getBody();
        });
        return t.div('.invite-acceptance-notification-dont-show-again', () => {
          return t.a({ onClick: this.clickDontShowAgain, href: '#' }, () =>
            t.format('Do not show this again'),
          );
        });
      });
    });
  }
  constructor(props) {
    super(props);
    this.state = {
      members: props.members,
    };
    this.clickDontShowAgain = this.clickDontShowAgain.bind(this);
  }

  getTitle() {
    if (this.state.members.length === 1) {
      t.text(`${this.state.members[0].get('fullName')} `);
      return t.format('joined your board');
    } else {
      return t.format('new members joined your board');
    }
  }

  getBody() {
    const numberOfMembers = this.state.members.length;
    let memberNames = [];
    if (numberOfMembers === 1) {
      memberNames = _.map(this.state.members, function (member) {
        if (member.get('fullName') != null) {
          const tokens = member.get('fullName').split(' ');
          if (tokens.length > 0) {
            return tokens[0];
          }
        }
      });
    } else {
      memberNames = _.map(this.state.members, (member) =>
        member.get('fullName'),
      );
    }

    // First sentence
    if (numberOfMembers === 1) {
      t.text(memberNames[0] + ' ');
      t.format('is new to trello');
    } else if (numberOfMembers === 2) {
      t.text(memberNames[0] + ' ');
      t.format('and');
      t.text(` ${memberNames[1]} `);
      t.format('are new to trello');
    } else if (numberOfMembers === 3) {
      t.text(memberNames[0] + ', ');
      t.text(memberNames[1] + ', ');
      t.format('and');
      t.text(' ');
      t.text(memberNames[2] + ' ');
      t.format('are new to trello');
    } else {
      let names = '';
      memberNames
        .slice(0, 3)
        .forEach((memberName) => (names += memberName + ', '));
      t.text(names);
      t.format('and');
      t.text(' ');
      t.text(numberOfMembers - 3 + ' ');
      if (numberOfMembers === 4) {
        t.format('other are new to trello');
      } else {
        t.format('others are new to trello');
      }
    }

    t.text(' ');

    // Second sentence
    if (numberOfMembers === 1) {
      t.a(
        {
          href: 'https://trello.com/guide/feature-deep-dive',
          target: '_blank',
          onClick: this.clickAddCardLink,
        },
        () => t.format('help them get started by adding them to a card'),
      );
    } else {
      t.a(
        {
          href: 'https://trello.com/guide/feature-deep-dive',
          target: '_blank',
          onClick: this.clickAddCardLink,
        },
        () =>
          t.format(
            'help your board members get started by adding them to a card',
          ),
      );
    }

    t.text(' ');

    // Third sentence
    return t.a(
      {
        href: 'https://trello.com/guide/collaboration',
        target: '_blank',
        onClick: this.clickMentionLink,
      },
      function () {
        if (numberOfMembers === 1) {
          return t.format('you can mention them sg in a comment too');
        } else {
          return t.format('you can mention them pl in a comment too');
        }
      },
    );
  }

  clickAddCardLink() {
    return Analytics.sendClickedLinkEvent({
      linkName: 'aboutAddingACardLink',
      source: 'inviteAcceptanceInlineDialog',
      containers: {
        board: {
          id: this.props.boardId,
        },
        workspace: {
          id: this.props.organizationId,
        },
        enterprise: {
          id: this.props.enterpriseId,
        },
      },
    });
  }

  clickMentionLink() {
    return Analytics.sendClickedLinkEvent({
      linkName: 'aboutMentionsLink',
      source: 'inviteAcceptanceInlineDialog',
      containers: {
        board: {
          id: this.props.boardId,
        },
        workspace: {
          id: this.props.organizationId,
        },
        enterprise: {
          id: this.props.enterpriseId,
        },
      },
    });
  }

  clickDontShowAgain() {
    Auth.me().dismiss('notify-invite-acceptance');
    Analytics.sendDismissedComponentEvent({
      componentType: 'notification',
      componentName: 'inviteAcceptanceNotification',
      source: 'inviteAcceptanceInlineDialog',
      containers: {
        board: {
          id: this.props.boardId,
        },
        workspace: {
          id: this.props.organizationId,
        },
        enterprise: {
          id: this.props.enterpriseId,
        },
      },
    });
    return this.props.onClose();
  }
}

InviteAcceptanceNotification.initClass();
module.exports = InviteAcceptanceNotification;
